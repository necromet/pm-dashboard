import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Avatar from '../components/ui/Avatar';
import { teamMembers } from '../data/mockData';
import { User, Bell, Link2, MessageSquare, HardDrive, Save } from 'lucide-react';

const sections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'team', label: 'Team', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'integrations', label: 'Integrations', icon: Link2 },
];

function Toggle({ enabled, onToggle, label }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-indigo-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

function IntegrationCard({ name, description, icon: Icon, connected, onToggle }) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <Icon size={20} className="text-gray-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          connected
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        {connected ? 'Connected' : 'Connect'}
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [profile, setProfile] = useState({
    name: 'Alex Morgan',
    email: 'alex@agencyops.com',
    role: 'Agency Leader',
  });

  const [notifPrefs, setNotifPrefs] = useState({
    approvals: true,
    deadlines: true,
    bottlenecks: true,
    assignments: true,
    published: false,
    emailDigest: true,
    slackAlerts: false,
  });

  const [integrations, setIntegrations] = useState({
    whatsapp: true,
    slack: false,
    googleDrive: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="flex gap-6">
        {/* Sidebar */}
        <nav className="w-48 flex-shrink-0">
          <div className="space-y-1">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === s.id
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={16} />
                  {s.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1">
          {activeSection === 'profile' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    value={profile.role}
                    readOnly
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500"
                  />
                </div>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  <Save size={16} />
                  Save Changes
                </button>
                {saved && (
                  <span className="text-sm text-green-600 ml-2">Saved!</span>
                )}
              </div>
            </div>
          )}

          {activeSection === 'team' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h2>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar initials={member.avatar} size="md" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {member.role}
                      </span>
                      <span className="text-xs text-gray-400">
                        Capacity: {member.capacity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
              <div className="max-w-md">
                <Toggle
                  label="Approval requests"
                  enabled={notifPrefs.approvals}
                  onToggle={() => setNotifPrefs((p) => ({ ...p, approvals: !p.approvals }))}
                />
                <Toggle
                  label="Deadline warnings"
                  enabled={notifPrefs.deadlines}
                  onToggle={() => setNotifPrefs((p) => ({ ...p, deadlines: !p.deadlines }))}
                />
                <Toggle
                  label="Bottleneck alerts"
                  enabled={notifPrefs.bottlenecks}
                  onToggle={() => setNotifPrefs((p) => ({ ...p, bottlenecks: !p.bottlenecks }))}
                />
                <Toggle
                  label="Task assignments"
                  enabled={notifPrefs.assignments}
                  onToggle={() => setNotifPrefs((p) => ({ ...p, assignments: !p.assignments }))}
                />
                <Toggle
                  label="Content published"
                  enabled={notifPrefs.published}
                  onToggle={() => setNotifPrefs((p) => ({ ...p, published: !p.published }))}
                />

                <div className="border-t border-gray-100 mt-4 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery Channels</h3>
                  <Toggle
                    label="Daily email digest"
                    enabled={notifPrefs.emailDigest}
                    onToggle={() => setNotifPrefs((p) => ({ ...p, emailDigest: !p.emailDigest }))}
                  />
                  <Toggle
                    label="Slack notifications"
                    enabled={notifPrefs.slackAlerts}
                    onToggle={() => setNotifPrefs((p) => ({ ...p, slackAlerts: !p.slackAlerts }))}
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'integrations' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Integrations</h2>
              <div className="space-y-3 max-w-lg">
                <IntegrationCard
                  name="WhatsApp"
                  description="Receive brief approvals and client messages"
                  icon={MessageSquare}
                  connected={integrations.whatsapp}
                  onToggle={() => setIntegrations((p) => ({ ...p, whatsapp: !p.whatsapp }))}
                />
                <IntegrationCard
                  name="Slack"
                  description="Post notifications and task updates to Slack channels"
                  icon={MessageSquare}
                  connected={integrations.slack}
                  onToggle={() => setIntegrations((p) => ({ ...p, slack: !p.slack }))}
                />
                <IntegrationCard
                  name="Google Drive"
                  description="Store design assets and client deliverables"
                  icon={HardDrive}
                  connected={integrations.googleDrive}
                  onToggle={() => setIntegrations((p) => ({ ...p, googleDrive: !p.googleDrive }))}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
