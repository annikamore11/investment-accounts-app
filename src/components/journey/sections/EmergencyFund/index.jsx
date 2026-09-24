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
    // Goal comes before "do you have one" so we capture what they're aiming
    // for either way — the Summary step needs it to show progress whether
    // they're building a fund from scratch or already have one started.
    { name: 'Your Goal', Component: SelectEmergencyAmount },
    { name: 'Current Status', Component: EmergencyFundAmount },
    // Account setup only for people who don't have a fund yet
    ...(journeyData.hasEmergencyFund === false
      ? [
          { name: 'Account Options', Component: EmergencyFundOptions },
          { name: 'Setup Guide', Component: FidelitySetupGuide },
        ]
      : []),
    { name: 'Summary', Component: EmergencyFundSummary },
  ],
}
