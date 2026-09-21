// A signed-out visitor's in-progress journey lives in this one localStorage
// key. Shared here so the landing page, AuthContext (signup migration) and
// JourneyFlow all read/parse it the same way instead of three copies of the
// same try/catch.
const GUEST_KEY = 'journey_guest'

export function readGuestJourney() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(GUEST_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (err) {
    console.error('Could not read guest journey from localStorage:', err)
    return null
  }
}

// Internal navigation bookkeeping, not answers — always present with
// "empty" defaults (0s, []s) that are never === false/null/'', so they'd
// otherwise always look "answered" to the check below.
const PROGRESS_META_FIELDS = new Set(['lastStepInSection', 'sectionCompletion', 'completedSteps'])

// True once the user has actually answered something, not just opened the app
export function hasAnswers(data) {
  return Object.entries(data || {}).some(([key, value]) => {
    if (PROGRESS_META_FIELDS.has(key)) return false
    return value && typeof value === 'object'
      ? Object.values(value).some(v => v !== false && v !== null && v !== '')
      : value !== '' && value !== null && value !== false
  })
}
