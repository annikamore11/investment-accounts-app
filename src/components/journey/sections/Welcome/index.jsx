// sections/AboutYou/index.js
import Welcome from './Welcome'

export const welcomeConfig = {
  id: 'welcome',
  title: 'Welcome',
  multipleSteps: false,
  
  getSteps: () => [Welcome],
  
  canComplete: () => true, // Always can proceed
}