import { convex } from '@/utils/convex'
import { api } from '../../convex/_generated/api'

// Thin wrapper around Convex so the rest of the app (JourneyFlow, the
// auto-save hook) doesn't need to know it's Convex underneath — same
// {success, data} / {success, error} shape as the old Supabase version.
// The user is no longer passed in: Convex derives it from the authenticated
// request (see convex/journey.ts), so these calls only work once the Convex
// client has a signed-in Clerk session attached.

export const saveJourneyToDatabase = async (journeyData, currentSection, currentStepInSection) => {
  try {
    await convex.mutation(api.journey.save, {
      journeyData,
      currentSection,
      currentStep: currentStepInSection,
    })
    return { success: true }
  } catch (error) {
    console.error('Error saving journey:', error)
    return { success: false, error }
  }
}

export const loadJourneyFromDatabase = async () => {
  try {
    const doc = await convex.query(api.journey.get, {})
    if (!doc) return { success: true, data: null }
    return {
      success: true,
      data: {
        journey_data: doc.journeyData,
        current_section: doc.currentSection,
        current_step: doc.currentStep,
        last_updated: doc.lastUpdated,
      },
    }
  } catch (error) {
    console.error('Error loading journey:', error)
    return { success: false, error }
  }
}

export const deleteJourneyFromDatabase = async () => {
  try {
    await convex.mutation(api.journey.remove, {})
    return { success: true }
  } catch (error) {
    console.error('Error deleting journey:', error)
    return { success: false, error }
  }
}
