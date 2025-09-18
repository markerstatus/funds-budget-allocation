import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store'
import { setTheme } from '@/store/slices/uiSlice'
import { setAPIKey as setAIApiKey, setAIEnabled, updateSettings as updateAISettings } from '@/store/slices/aiSlice'
import { Key, Brain, Settings as SettingsIcon, Moon, Sun } from 'lucide-react'
import toast from 'react-hot-toast'

const Settings = () => {
  const dispatch = useDispatch()
  const { theme } = useSelector((state: RootState) => state.ui)
  const { aiEnabled, apiKey, settings } = useSelector((state: RootState) => state.ai)
  
  const [localApiKey, setLocalApiKey] = useState(apiKey || '')
  const [localSettings, setLocalSettings] = useState(settings)

  const handleSaveAPIKey = () => {
    if (!localApiKey.trim()) {
      toast.error('Please enter a valid API key')
      return
    }
    
    dispatch(setAIApiKey(localApiKey))
    dispatch(setAIEnabled(true))
    toast.success('API key saved successfully!')
  }

  const handleSaveSettings = () => {
    dispatch(updateAISettings(localSettings))
    toast.success('Settings saved successfully!')
  }

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    dispatch(setTheme(newTheme))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Configure your AI-powered budget management system
        </p>
      </div>

      {/* Theme Settings */}
      <div className="card p-6">
        <div className="flex items-center mb-4">
          <SettingsIcon className="h-6 w-6 text-primary-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Appearance
          </h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="label">Theme</label>
            <div className="flex space-x-4">
              <button
                onClick={() => handleThemeChange('light')}
                className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${
                  theme === 'light'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Sun className="h-5 w-5 mr-2" />
                Light
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${
                  theme === 'dark'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Moon className="h-5 w-5 mr-2" />
                Dark
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Settings */}
      <div className="card p-6">
        <div className="flex items-center mb-4">
          <Brain className="h-6 w-6 text-primary-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            AI Configuration
          </h2>
        </div>
        
        <div className="space-y-6">
          {/* API Key */}
          <div>
            <label className="label">OpenAI API Key</label>
            <div className="flex space-x-3">
              <input
                type="password"
                className="input flex-1"
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                placeholder="Enter your OpenAI API key"
              />
              <button
                onClick={handleSaveAPIKey}
                className="btn btn-primary"
              >
                Save
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Your API key is stored locally and never shared. Get your key from{' '}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700"
              >
                OpenAI Platform
              </a>
            </p>
          </div>

          {/* AI Features */}
          <div>
            <label className="label">AI Features</label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localSettings.autoAnalysis}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    autoAnalysis: e.target.checked
                  })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Automatic budget analysis
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localSettings.contentGeneration}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    contentGeneration: e.target.checked
                  })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  AI content generation
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localSettings.personalizedRecommendations}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    personalizedRecommendations: e.target.checked
                  })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Personalized recommendations
                </span>
              </label>
            </div>
          </div>

          {/* Insight Frequency */}
          <div>
            <label className="label">Insight Generation Frequency</label>
            <select
              className="input"
              value={localSettings.insightFrequency}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                insightFrequency: e.target.value as 'daily' | 'weekly' | 'monthly'
              })}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <button
            onClick={handleSaveSettings}
            className="btn btn-primary"
          >
            Save AI Settings
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="card p-6">
        <div className="flex items-center mb-4">
          <Key className="h-6 w-6 text-primary-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Data Management
          </h2>
        </div>
        
        <div className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              Export Data
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
              Download your budget data as a JSON file for backup or migration.
            </p>
            <button className="btn btn-secondary text-sm">
              Export Data
            </button>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">
              Clear All Data
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 mb-3">
              This will permanently delete all your budget data, AI insights, and generated content.
            </p>
            <button className="btn btn-danger text-sm">
              Clear All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
