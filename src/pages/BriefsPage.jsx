import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import BriefForm from '../components/briefs/BriefForm';
import BriefList from '../components/briefs/BriefList';
import ContentCalendar from '../components/briefs/ContentCalendar';
import { tasks } from '../data/mockData';

const tabs = [
  { id: 'list', label: 'Briefs List' },
  { id: 'submit', label: 'Submit Brief' },
  { id: 'calendar', label: 'Calendar View' },
];

export default function BriefsPage() {
  const [activeTab, setActiveTab] = useState('list');

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Briefs</h1>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'list' && (
        <div className="max-w-4xl">
          <BriefList tasks={tasks} />
        </div>
      )}

      {activeTab === 'submit' && (
        <div className="max-w-2xl">
          <BriefForm />
        </div>
      )}

      {activeTab === 'calendar' && (
        <ContentCalendar tasks={tasks} />
      )}
    </Layout>
  );
}
