import { supabase } from './supabase'

/**
 * Save user's journey progress to database
 */
export const saveJourneyToDatabase = async (userId, journeyData, currentSection, currentStepInSection) => {
  try {
    const { data, error } = await supabase
      .from('user_journey')
      .upsert({
        user_id: userId,
        
        // Full JSON (for flexibility)
        journey_data: journeyData,
        current_section: currentSection,
        current_step: currentStepInSection,
        
        // Extract key fields for easy querying
        employment: journeyData.employment || null,
        age: journeyData.age || null,
        has_employer_401k: journeyData.hasEmployer401k,
        has_bank_account: journeyData.hasBankAccount,
        bank_type: journeyData.bankType || null,
        completed: journeyData.completed || false,
        
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error saving journey:', error)
    return { success: false, error }
  }
}

/**
 * Load user's journey progress from database
 */
export const loadJourneyFromDatabase = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_journey')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      // No data found is not an error
      if (error.code === 'PGRST116') {
        return { success: true, data: null }
      }
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error loading journey:', error)
    return { success: false, error }
  }
}

/**
 * Delete user's journey progress from database
 */
export const deleteJourneyFromDatabase = async (userId) => {
  try {
    const { error } = await supabase
      .from('user_journey')
      .delete()
      .eq('user_id', userId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error deleting journey:', error)
    return { success: false, error }
  }
}