'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { User, BarChart3, Sparkles, Settings } from 'lucide-react'

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'membership', label: 'Membership', icon: Sparkles },
  { id: 'preferences', label: 'Preferences', icon: Settings },
]

const Dashboard = () => {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')

  // Wait for the session check before deciding the user isn't logged in,
  // otherwise a page refresh bounces signed-in users to /login.
  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [loading, user, router])

  if (!user) return null

  // Clerk's user object, not Supabase's — derive the fields the sections
  // below need once, here, instead of each re-deriving from `user`.
  const email = user.primaryEmailAddress?.emailAddress || ''
  const emailVerified = user.primaryEmailAddress?.verification?.status === 'verified'
  const createdAt = user.createdAt // already a Date

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, {email.split('@')[0]}!</p>
            </div>
            <button onClick={() => signOut()} className="btn-secondary">
              Sign Out
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md mb-8">
          <nav className="flex -mb-px overflow-x-auto border-b border-gray-200">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center space-x-2 ${
                  activeTab === id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mb-8">
          {activeTab === 'profile' && <ProfileSection email={email} emailVerified={emailVerified} createdAt={createdAt} />}
          {activeTab === 'analytics' && <AnalyticsSection createdAt={createdAt} />}
          {activeTab === 'membership' && <MembershipSection />}
          {activeTab === 'preferences' && <PreferencesSection />}
        </div>
      </div>
    </div>
  )
}

// TODO: everything below is placeholder UI — the analytics numbers, learning
// progress, password form and preferences are not wired to real data.

const ProfileSection = ({ email, emailVerified, createdAt }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-2xl font-bold mb-6">Profile Information</h3>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="bg-primary-100 rounded-full p-4">
            <svg className="w-16 h-16 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900">{email.split('@')[0]}</h4>
            <p className="text-gray-600">{email}</p>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
              <input
                type="text"
                value={createdAt.toLocaleDateString()}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
              <div className="flex items-center">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  Active
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Verified</label>
              <div className="flex items-center">
                <span className={`px-3 py-1 ${emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} rounded-full text-sm font-semibold`}>
                  {emailVerified ? 'Verified ✓' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <h4 className="font-bold text-gray-900 mb-4">Update Password</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input 
                type="password" 
                placeholder="Enter new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input 
                type="password" 
                placeholder="Confirm new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button className="btn-primary">Update Password</button>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const AnalyticsSection = ({ createdAt }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 border-2 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-blue-900">Calculations Made</h3>
          <div className="bg-blue-600 rounded-full p-2">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <p className="text-4xl font-bold text-blue-900">0</p>
        <p className="text-sm text-blue-700 mt-2">Use our calculators to plan your future</p>
      </div>

      <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 border-2 border-green-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-green-900">Pages Viewed</h3>
          <div className="bg-green-600 rounded-full p-2">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
        <p className="text-4xl font-bold text-green-900">5+</p>
        <p className="text-sm text-green-700 mt-2">Keep learning and exploring</p>
      </div>

      <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl shadow-md p-6 border-2 border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-purple-900">Days Active</h3>
          <div className="bg-purple-600 rounded-full p-2">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <p className="text-4xl font-bold text-purple-900">1</p>
        <p className="text-sm text-purple-700 mt-2">Build your streak!</p>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-2xl font-bold mb-6">Your Learning Progress</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-gray-700">Retirement Basics</span>
            <span className="text-primary-600 font-bold">100%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-primary-600 h-3 rounded-full" style={{width: '100%'}}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-gray-700">Account Types</span>
            <span className="text-primary-600 font-bold">50%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-primary-600 h-3 rounded-full" style={{width: '50%'}}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-gray-700">Investment Options</span>
            <span className="text-gray-500 font-bold">0%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gray-400 h-3 rounded-full" style={{width: '0%'}}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-gray-700">Investment Strategies</span>
            <span className="text-gray-500 font-bold">0%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gray-400 h-3 rounded-full" style={{width: '0%'}}></div>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
      <div className="space-y-4">
        <div className="flex items-start space-x-4 pb-4 border-b">
          <div className="bg-green-100 rounded-full p-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Account Created</p>
            <p className="text-sm text-gray-600">Welcome to InvestEd!</p>
            <p className="text-xs text-gray-500 mt-1">{createdAt.toLocaleString()}</p>
          </div>
        </div>

        <div className="text-center py-8 text-gray-500">
          <p>More activity will appear here as you use the platform</p>
        </div>
      </div>
    </div>
  </div>
)

const MembershipSection = () => (
  <div className="space-y-6">
    <div className="bg-linear-to-r from-primary-600 to-primary-800 rounded-xl shadow-lg p-8 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-bold mb-2">Free Member</h3>
          <p className="text-primary-100">Access to all basic features</p>
        </div>
        <div className="bg-white rounded-full p-4">
          <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-2xl font-bold mb-6">Current Plan Features</h3>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="font-semibold text-gray-900">All Educational Content</p>
            <p className="text-sm text-gray-600">Access to retirement basics, account types, and investment strategies</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="font-semibold text-gray-900">Basic Calculators</p>
            <p className="text-sm text-gray-600">Compound interest and retirement planning calculators</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="font-semibold text-gray-900">Progress Tracking</p>
            <p className="text-sm text-gray-600">Track your learning journey and calculations</p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-md p-6 border-2 border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">Premium Features</h3>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-bold">Coming Soon</span>
      </div>
      
      <p className="text-gray-600 mb-6">Unlock advanced features to supercharge your investment journey</p>

      <div className="space-y-4 mb-6">
        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-purple-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="font-semibold text-gray-900">Plaid Bank Integration</p>
            <p className="text-sm text-gray-600">Connect your accounts for automatic tracking</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-purple-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="font-semibold text-gray-900">Advanced Analytics</p>
            <p className="text-sm text-gray-600">Detailed charts and projections</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-purple-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="font-semibold text-gray-900">Personalized Recommendations</p>
            <p className="text-sm text-gray-600">AI-powered investment suggestions</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-purple-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="font-semibold text-gray-900">Priority Support</p>
            <p className="text-sm text-gray-600">Get help from financial experts</p>
          </div>
        </div>
      </div>

      <button disabled className="w-full btn-primary bg-purple-600 hover:bg-purple-700 opacity-50 cursor-not-allowed">
        Notify Me When Available
      </button>
    </div>
  </div>
)

const PreferencesSection = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-2xl font-bold mb-6">Notification Preferences</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-semibold text-gray-900">Email Notifications</p>
            <p className="text-sm text-gray-600">Receive updates about new features and content</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-semibold text-gray-900">Weekly Summary</p>
            <p className="text-sm text-gray-600">Get a weekly roundup of your progress</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-semibold text-gray-900">Educational Tips</p>
            <p className="text-sm text-gray-600">Receive helpful investment tips and reminders</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-2xl font-bold mb-6">Display Preferences</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
            <option>Light Mode</option>
            <option>Dark Mode (Coming Soon)</option>
            <option>Auto (System Default)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency Display</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
            <option>USD ($)</option>
            <option>EUR (€)</option>
            <option>GBP (£)</option>
            <option>CAD ($)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
            <option>MM/DD/YYYY</option>
            <option>DD/MM/YYYY</option>
            <option>YYYY-MM-DD</option>
          </select>
        </div>
      </div>

      <button className="mt-6 btn-primary">Save Preferences</button>
    </div>

    <div className="bg-red-50 rounded-xl shadow-md p-6 border-2 border-red-200">
      <h3 className="text-2xl font-bold mb-4 text-red-900">Danger Zone</h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-white rounded-lg border border-red-200">
          <p className="font-semibold text-gray-900 mb-2">Delete Account</p>
          <p className="text-sm text-gray-600 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">
            Delete Account
          </button>
        </div>

        <div className="p-4 bg-white rounded-lg border border-red-200">
          <p className="font-semibold text-gray-900 mb-2">Export Data</p>
          <p className="text-sm text-gray-600 mb-4">
            Download a copy of all your data and calculations
          </p>
          <button className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700">
            Export My Data
          </button>
        </div>
      </div>
    </div>
  </div>
)

export default Dashboard
