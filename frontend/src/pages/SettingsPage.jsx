import React, { useState } from 'react';
import { User, Bell, Shield, Key, Moon, Sun, Monitor, Save } from 'lucide-react';

export default function SettingsPage() {
  const [theme, setTheme] = useState('system');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    // Simulate save
    alert('Settings saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
          Manage your account preferences and application configurations.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <User className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Profile Information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input type="text" defaultValue="John Doe" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input type="email" defaultValue="you@example.com" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <Moon className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Appearance</h2>
          </div>
          <div className="p-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Theme</label>
            <div className="flex gap-4">
              <button type="button" onClick={() => setTheme('light')} className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${theme === 'light' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400' : 'bg-white border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}`}>
                <Sun className="w-4 h-4" /> Light
              </button>
              <button type="button" onClick={() => setTheme('dark')} className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${theme === 'dark' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400' : 'bg-white border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}`}>
                <Moon className="w-4 h-4" /> Dark
              </button>
              <button type="button" onClick={() => setTheme('system')} className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${theme === 'system' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400' : 'bg-white border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}`}>
                <Monitor className="w-4 h-4" /> System
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <Bell className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Notifications</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Email Notifications</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Receive alerts about system updates and datasets.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Weekly AI Summary</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Get a weekly email summarizing AI insights and dataset activities.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={weeklyReports} onChange={() => setWeeklyReports(!weeklyReports)} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* API Key */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <Key className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">API Configuration</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Custom LLM API Key (Optional)</label>
              <div className="flex gap-2">
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..." 
                  className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                />
                <button type="button" className="px-4 py-2 border border-indigo-200 text-indigo-600 dark:border-indigo-800 dark:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors font-medium">Verify</button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                If left blank, the application will use the default system environment key.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm">
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}