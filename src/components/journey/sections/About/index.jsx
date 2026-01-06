// src/components/sections/About/index.js

import EmploymentStatus from './Employment'
import Employer401k from './Employer401k'
import AgeRange from './AgeRange'
import BankType from './BankType'
import BankInstitution from './BankInstitution'
import AboutSummary from './AboutSummary'

export const aboutConfig = {
  id: 'aboutYou',
  title: 'About You',
  multipleSteps: true,

  // Custom step names for the sidebar dropdown
  getStepNames: (journeyData) => {
    const names = ['Employment Status']

    if (journeyData.employment === 'employed-company') {
      names.push('Employer 401(k)')
    }

    names.push('Age Range')
    // names.push('Bank Account')

    names.push('Bank Type')
    names.push('Bank Institution')
    

    names.push('Summary')

    return names
  },

  // Dynamic steps based on user's journey data
  getSteps: (journeyData) => {
    const steps = [EmploymentStatus] // AboutIntro first!

    // Only show 401k question if employed at company
    if (journeyData.employment === 'employed-company') {
      steps.push(Employer401k)
    }

    steps.push(AgeRange)
    // steps.push(BankAccount)

    steps.push(BankType)
    steps.push(BankInstitution)
    

    steps.push(AboutSummary)

    return steps
  },

  // Validation before section can be marked complete
  canComplete: (journeyData) => {
    // Must have employment and age
    if (!journeyData.employment || !journeyData.age) {
      return false
    }

    // If employed at company, must answer 401k question
    if (journeyData.employment === 'employed-company' && journeyData.hasEmployer401k === null) {
      return false
    }

    // Must answer bank account question
    // if (journeyData.hasBankAccount === null) {
    //   return false
    // }

    // If has bank account, must select type and institution
    if (!journeyData.bankType) {
      return false
    }

    if (!journeyData.bankInstitution) {
      return false
    }

    return true
  },

  // No onComplete logic needed - just move to next section
  onComplete: null
}