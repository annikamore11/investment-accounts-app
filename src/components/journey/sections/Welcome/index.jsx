import Welcome from './Welcome'

export const welcomeConfig = {
  id: 'welcome',
  title: 'Welcome',
  multipleSteps: false,
  getSteps: () => [{ name: 'Welcome', Component: Welcome }],
}
