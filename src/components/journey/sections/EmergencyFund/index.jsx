import EmergencyFundIntro from './EmergencyFundIntro'
import EmergencyFundAmount from './EmergencyFundAmount'
import SelectEmergencyAmount from './SelectEmergencyAmount'
import EmergencyFundOptions from './EmergencyFundOptions'
import FidelitySetupGuide from './FidelitySetupGuide'
import EmergencyFundSummary from './EmergencyFundSummary'

export const emergencyFundConfig = {
  id: 'emergencyFund',
  title: 'Emergency Fund',
  multipleSteps: true,

  getSteps: (journeyData) => [
    { name: 'Introduction', Component: EmergencyFundIntro },
    { name: 'Common Guideline', Component: EmergencyFundAmount },
    // Goal + account setup only for people who don't have a fund yet
    ...(journeyData.hasEmergencyFund === false
      ? [
          { name: 'Goal', Component: SelectEmergencyAmount },
          { name: 'Account Options', Component: EmergencyFundOptions },
          { name: 'Setup Guide', Component: FidelitySetupGuide },
        ]
      : []),
    { name: 'Summary', Component: EmergencyFundSummary },
  ],
}
