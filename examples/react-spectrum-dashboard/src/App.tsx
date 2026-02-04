import React, { useState } from 'react';
import { Header } from './components/Header';
import { OverviewTab } from './tabs/OverviewTab';
import { ServicesTab } from './tabs/ServicesTab';
import { AlertsTab } from './tabs/AlertsTab';
import { TeamTab } from './tabs/TeamTab';

type Tab = 'overview' | 'services' | 'alerts' | 'team';

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [darkMode, setDarkMode] = useState(false);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'services', label: 'Services' },
    { key: 'alerts', label: 'Alerts' },
    { key: 'team', label: 'Team' },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'services' && <ServicesTab />}
          {activeTab === 'alerts' && <AlertsTab />}
          {activeTab === 'team' && <TeamTab />}
        </div>
      </main>
    </div>
  );
}
