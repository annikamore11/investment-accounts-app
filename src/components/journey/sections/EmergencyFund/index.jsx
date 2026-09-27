import EmergencyFundIntro from './EmergencyFundIntro'
import EmergencyFundAmount from './EmergencyFundAmount'
import SelectEmergencyAmount from './SelectEmergencyAmount'
import FidelitySetupGuide from './FidelitySetupGuide'
import EmergencyFundSummary from './EmergencyFundSummary'

export const emergencyFundConfig = {
  id: 'emergencyFund',
  title: 'Emergency Fund',
  multipleSteps: true,

  getSteps: (journeyData) => {
    const base = [
      { name: 'Introduction', Component: EmergencyFundIntro },
      // Goal comes before "do you have one" so we capture what they're
      // aiming for either way — the account/summary step needs it to show
      // progress whether they're building a fund from scratch or already
      // have one started.
      { name: 'Your Goal', Component: SelectEmergencyAmount },
      // EmergencyFundAmount now carries both the "what a high-yield account
      // is" explanation and the yes/no question on one page — the
      // explanation exists purely to make the question easier to answer, so
      // they belong together rather than as two separate steps.
      { name: 'Current Status', Component: EmergencyFundAmount },
    ]

    if (journeyData.hasEmergencyFund === true) {
      // Existing-fund path: institution, account type, and the option to
      // move it to Fidelity are all captured on "Your Account" — it's not a
      // summary yet at this point, it's still deciding things. Setup Guide,
      // if they opt to move, follows right after since that's where the
      // decision actually gets made (after they've seen the rate/guidance
      // callouts that make the case for switching).
      return [
        ...base,
        { name: 'Your Account', Component: EmergencyFundSummary },
        ...(journeyData.moveToFidelity === true
          ? [{ name: 'Setup Guide', Component: FidelitySetupGuide }]
          : []),
      ]
    }

    // Starting from scratch: Setup Guide walks them through opening the
    // account, then Summary is an actual recap of what they just set up.
    return [
      ...base,
      ...(journeyData.hasEmergencyFund === false
        ? [{ name: 'Setup Guide', Component: FidelitySetupGuide }]
        : []),
      { name: 'Summary', Component: EmergencyFundSummary },
    ]
  },
}
