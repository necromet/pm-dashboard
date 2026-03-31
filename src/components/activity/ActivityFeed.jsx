import React, { useState, useMemo } from 'react';
import { clients, teamMembers } from '../../data/mockData';
import { formatRelativeTime } from '../../utils/helpers';
import Avatar from '../ui/Avatar';
import { Filter } from 'lucide-react';

const actionLabels = {
  created: 'created a brief',
  copy_submitted: 'submitted copy',
  design_started: 'started design',
  design_completed: 'completed design',
  client_approved: 'got client approval',
  moved_to_review: 'moved to review',
  published: 'published content',
  scheduled: 'scheduled content',
};

const actionColors = {
  created: 'bg-gray-100 text-gray-600',
  copy_submitted: 'bg-blue-100 text-blue-600',
  design_started: 'bg-yellow-100 text-yellow-600',
  design_completed: 'bg-purple-100 text-purple-600',
  client_approved: 'bg-green-100 text-green-600',
  moved_to_review: 'bg-orange-100 text-orange-600',
  published: 'bg-emerald-100 text-emerald-600',
  scheduled: 'bg-cyan-100 text-cyan-600',
};

function getTimeGroup(timestamp) {
  const now = new Date('2026-03-31T10:00:00');
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays < 1) return 'Today';
  if (diffDays < 7) return 'This Week';
  return 'Earlier';
}

export default function ActivityFeed({ tasks }) {
  const [clientFilter, setClientFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');

  const activities = useMemo(() => {
    const all = [];
    tasks.forEach((task) => {
      (task.activityLog || []).forEach((entry) => {
        all.push({ ...entry, taskId: task.id, taskTitle: task.title, clientId: task.clientId });
      });
    });

    let filtered = all;
    if (clientFilter !== 'all') {
      filtered = filtered.filter((a) => a.clientId === clientFilter);
    }
    if (userFilter !== 'all') {
      filtered = filtered.filter((a) => a.userId === userFilter);
    }

    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return filtered;
  }, [tasks, clientFilter, userFilter]);

  const grouped = useMemo(() => {
    const groups = {};
    activities.forEach((a) => {
      const group = getTimeGroup(a.timestamp);
      if (!groups[group]) groups[group] = [];
      groups[group].push(a);
    });
    return groups;
  }, [activities]);

  const groupOrder = ['Today', 'This Week', 'Earlier'];

  const getMember = (id) => teamMembers.find((m) => m.id === id);
  const getClient = (id) => clients.find((c) => c.id === id);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <Filter size={16} className="text-gray-400" />
        <select
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Clients</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.logo} {c.name}</option>
          ))}
        </select>
        <select
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Users</option>
          {teamMembers.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      {/* Grouped Activity List */}
      {groupOrder.map((group) => {
        const items = grouped[group];
        if (!items || items.length === 0) return null;
        return (
          <div key={group}>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">
              {group}
            </h4>
            <div className="space-y-1.5">
              {items.map((activity) => {
                const member = getMember(activity.userId);
                const client = getClient(activity.clientId);
                const actionColor = actionColors[activity.action] || 'bg-gray-100 text-gray-600';

                return (
                  <div
                    key={activity.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 py-3 flex items-start gap-3"
                  >
                    <Avatar initials={member?.avatar || '??'} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800">
                        <span className="font-medium">{member?.name || 'Unknown'}</span>
                        {' '}
                        <span className={`text-xs px-1.5 py-0.5 rounded ${actionColor}`}>
                          {actionLabels[activity.action] || activity.action}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {activity.taskTitle}
                        {client && <span className="ml-1">· {client.name}</span>}
                      </p>
                      {activity.note && (
                        <p className="text-xs text-gray-400 mt-1 italic">"{activity.note}"</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {activities.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-400 text-sm">
          No activities match the current filters.
        </div>
      )}
    </div>
  );
}
