// Mastercard Open Banking (Finicity) API client. Server-only: relies on
// secrets from .env.local. See MASTERCARD_SETUP.md.
// Docs: https://developer.mastercard.com/open-banking-us/documentation/

const MASTERCARD_API_URL = process.env.MASTERCARD_API_URL || 'https://api.finicity.com'

const isXml = (contentType, text) => contentType?.includes('xml') || text.trim().startsWith('<?xml')

/**
 * Finicity returns XML for some error responses even when JSON was requested,
 * so parse defensively.
 */
async function parseResponse(response) {
  const contentType = response.headers.get('content-type')
  const text = await response.text()

  if (isXml(contentType, text)) {
    console.error('Mastercard API error response:', text)
    throw new Error(`API returned an error: ${text.substring(0, 200)}`)
  }

  try {
    return JSON.parse(text)
  } catch {
    console.error('Unparseable Mastercard API response:', text)
    throw new Error('Invalid response from API. Please verify your credentials.')
  }
}

function getCredentials() {
  const partnerId = process.env.MASTERCARD_PARTNER_ID
  const partnerSecret = process.env.MASTERCARD_PARTNER_SECRET
  const appKey = process.env.MASTERCARD_APP_KEY

  if (!partnerId || !partnerSecret || !appKey) {
    throw new Error('Mastercard credentials not configured. Please add credentials to .env.local')
  }
  if ([partnerId, partnerSecret, appKey].some(v => v.includes('your_'))) {
    throw new Error('Please replace placeholder values in .env.local with your actual Mastercard API credentials')
  }
  return { partnerId, partnerSecret, appKey }
}

/** Exchange partner credentials for a short-lived app token */
async function getAccessToken() {
  const { partnerId, partnerSecret, appKey } = getCredentials()

  const response = await fetch(`${MASTERCARD_API_URL}/aggregation/v2/partners/authentication`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Finicity-App-Key': appKey,
    },
    body: JSON.stringify({ partnerId, partnerSecret }),
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication failed: Invalid Partner ID or Partner Secret')
    }
    throw new Error(`Authentication failed (${response.status}): Check your API credentials`)
  }

  const text = await response.text()
  if (isXml(response.headers.get('content-type'), text)) {
    const token = text.match(/<token>([^<]+)<\/token>/)?.[1]
    if (!token) throw new Error('Could not parse token from XML response')
    return token
  }

  try {
    return JSON.parse(text).token
  } catch {
    throw new Error('Invalid response format from API')
  }
}

/**
 * Search institutions by name. Each result includes `oauthEnabled`, which
 * tells us whether the bank supports instant (OAuth) account verification.
 */
export async function searchInstitutions(search, limit = 25) {
  if (!search || search.trim().length < 2) return []

  const token = await getAccessToken()
  const params = new URLSearchParams({ search: search.trim(), limit: String(limit) })

  const response = await fetch(`${MASTERCARD_API_URL}/institution/v2/institutions?${params}`, {
    headers: {
      'Content-Type': 'application/json',
      'Finicity-App-Key': process.env.MASTERCARD_APP_KEY,
      'Finicity-App-Token': token,
    },
  })

  if (!response.ok) {
    if (response.status === 401) throw new Error('Authentication failed: Invalid API token')
    throw new Error(`Institution search failed (${response.status}): Check your API credentials`)
  }

  const data = await parseResponse(response)
  return data.institutions || []
}
