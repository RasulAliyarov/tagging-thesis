'use client'

import { useState } from 'react'
import { Server, Sliders, Bell } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    apiEndpoint: 'https://api.textanalysis.ai/v1',
    apiKey: 'sk_test_1234567890abcdef',
    autoDetectLanguage: true,
    realTimeAnalysis: false,
    saveHistory: true,
    highPriorityAlerts: true,
    batchComplete: true,
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold mb-2">Settings</h2>
        <p className="text-slate-400">Configure your analysis preferences</p>
      </motion.div>

      <div className="space-y-6">
        {/* API Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Server className="w-5 h-5 mr-2" />
            API Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-2 block">API Endpoint</label>
              <input
                type="text"
                value={settings.apiEndpoint}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, apiEndpoint: e.target.value }))
                }
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500 font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-2 block">API Key</label>
              <input
                type="password"
                value={settings.apiKey}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, apiKey: e.target.value }))
                }
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500 font-mono text-sm"
              />
            </div>
          </div>
        </motion.div>

        {/* Analysis Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Sliders className="w-5 h-5 mr-2" />
            Analysis Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-detect Language</p>
                <p className="text-sm text-slate-400">Automatically detect input language</p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={settings.autoDetectLanguage}
                  onChange={() => handleToggle('autoDetectLanguage')}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Real-time Analysis</p>
                <p className="text-sm text-slate-400">Process text as you type</p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={settings.realTimeAnalysis}
                  onChange={() => handleToggle('realTimeAnalysis')}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Save History</p>
                <p className="text-sm text-slate-400">Store analysis results locally</p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={settings.saveHistory}
                  onChange={() => handleToggle('saveHistory')}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">High Priority Alerts</p>
                <p className="text-sm text-slate-400">Get notified of urgent issues</p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={settings.highPriorityAlerts}
                  onChange={() => handleToggle('highPriorityAlerts')}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Batch Complete</p>
                <p className="text-sm text-slate-400">Notify when batch processing finishes</p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={settings.batchComplete}
                  onChange={() => handleToggle('batchComplete')}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}