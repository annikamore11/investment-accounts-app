// Mastercard Open Banking API Utility
// Documentation: https://developer.mastercard.com/open-banking-us/documentation/

const MASTERCARD_API_URL = process.env.MASTERCARD_API_URL || 'https://api.finicity.com';

/**
 * Parse API response and handle different content types
 */
async function parseResponse(response) {
  const contentType = response.headers.get('content-type');
  const text = await response.text();

  // Check if response is XML (error response)
  if (contentType?.includes('xml') || text.trim().startsWith('<?xml')) {
    throw new Error('API returned an error. Please check your credentials in .env.local');
  }

  // Try to parse as JSON
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error('Invalid response from API. Please verify your credentials.');
  }
}

/**
 * Get access token from Mastercard API
 * Uses Partner ID and Partner Secret to authenticate
 */
async function getAccessToken() {
  const partnerId = process.env.MASTERCARD_PARTNER_ID;
  const partnerSecret = process.env.MASTERCARD_PARTNER_SECRET;
  const appKey = process.env.MASTERCARD_APP_KEY;

  if (!partnerId || !partnerSecret || !appKey) {
    throw new Error('Mastercard credentials not configured. Please add credentials to .env.local');
  }

  // Check for placeholder values
  if (partnerId.includes('your_') || partnerSecret.includes('your_') || appKey.includes('your_')) {
    throw new Error('Please replace placeholder values in .env.local with your actual Mastercard API credentials');
  }

  try {
    const response = await fetch(`${MASTERCARD_API_URL}/aggregation/v2/partners/authentication`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Finicity-App-Key': appKey,
      },
      body: JSON.stringify({
        partnerId,
        partnerSecret,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 401) {
        throw new Error('Authentication failed: Invalid Partner ID or Partner Secret');
      }
      throw new Error(`Authentication failed (${response.status}): Check your API credentials`);
    }

    const data = await parseResponse(response);
    return data.token;
  } catch (error) {
    console.error('Mastercard authentication error:', error);
    throw error;
  }
}

/**
 * Search for financial institutions by name
 * @param {string} search - Search term (e.g., "Chase", "Bank of America")
 * @param {number} limit - Maximum number of results to return
 * @returns {Promise<Array>} List of matching institutions
 */
export async function searchInstitutions(search, limit = 25) {
  if (!search || search.trim().length < 2) {
    return [];
  }

  try {
    const token = await getAccessToken();
    const params = new URLSearchParams({
      search: search.trim(),
      limit: limit.toString(),
    });

    const response = await fetch(
      `${MASTERCARD_API_URL}/institution/v2/institutions?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Finicity-App-Key': process.env.MASTERCARD_APP_KEY,
          'Finicity-App-Token': token,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed: Invalid API token');
      }
      throw new Error(`Institution search failed (${response.status}): Check your API credentials`);
    }

    const data = await parseResponse(response);
    return data.institutions || [];
  } catch (error) {
    console.error('Institution search error:', error);
    throw error;
  }
}

/**
 * Get a specific institution by ID
 * @param {string} institutionId - The institution ID
 * @returns {Promise<Object>} Institution details
 */
export async function getInstitutionById(institutionId) {
  try {
    const token = await getAccessToken();

    const response = await fetch(
      `${MASTERCARD_API_URL}/institution/v2/institutions/${institutionId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Finicity-App-Key': process.env.MASTERCARD_APP_KEY,
          'Finicity-App-Token': token,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed: Invalid API token');
      }
      throw new Error(`Get institution failed (${response.status}): Check your API credentials`);
    }

    const data = await parseResponse(response);
    return data;
  } catch (error) {
    console.error('Get institution error:', error);
    throw error;
  }
}

/**
 * Check if an institution is supported
 * @param {string} institutionName - Name of the institution to check
 * @returns {Promise<Object>} { supported: boolean, institution: Object|null }
 */
export async function checkInstitutionSupport(institutionName) {
  try {
    const institutions = await searchInstitutions(institutionName, 10);

    if (institutions.length === 0) {
      return { supported: false, institution: null, suggestions: [] };
    }

    // Look for exact or very close match
    const exactMatch = institutions.find(
      inst => inst.name.toLowerCase() === institutionName.toLowerCase()
    );

    if (exactMatch) {
      return {
        supported: true,
        institution: exactMatch,
        suggestions: institutions.slice(0, 5),
      };
    }

    // Return first result as best match with other suggestions
    return {
      supported: true,
      institution: institutions[0],
      suggestions: institutions.slice(0, 5),
    };
  } catch (error) {
    console.error('Check institution support error:', error);
    throw error;
  }
}
