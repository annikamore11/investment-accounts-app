import EmploymentStatus from './Employment'
import Employer401k from './Employer401k'
import AgeRange from './AgeRange'
import BankType from './BankType'
import AboutSummary from './AboutSummary'

export const aboutConfig = {
  id: 'aboutYou',
  title: 'About You',
  multipleSteps: true,

  getSteps: (journeyData) => [
    { name: 'Employment Status', Component: EmploymentStatus },
    // Only ask about a 401(k) if they work for a company
    ...(journeyData.employment === 'employed-company'
      ? [{ name: 'Employer 401(k)', Component: Employer401k }]
      : []),
    { name: 'Age Range', Component: AgeRange },
    { name: 'Bank Type', Component: BankType },
    { name: 'Summary', Component: AboutSummary },
  ],
}
