import React, { useState, useMemo } from 'react';
import { clients, teamMembers } from '../../data/mockData';
import { formatDate, getStageColor, getPriorityColor } from '../../utils/helpers';
import { ChevronDown, ChevronUp, Calendar, User } from 'lucide-react';

const filterTabs = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'submitted', label: 'Submitted' },
  { id: 'in-design', label: 'In Design' },
];

const sortOptions = [
  { id: 'date', label: 'Due Date' },
  { id: 'priority', label: 'Priority' },
  { id: 'client', label: 'Client' },
];

const priorityOrder = { high: 0, medium: 1, low: 2 };

function matchesFilter(task, filter) {
  switch (filter) {
    case 'pending':
      return task.stage === 'Brief Pending';
    case 'submitted':
      return task.stage === 'Brief Received' || task.stage === 'Client Approval';
    case 'in-design':
      return task.stage === 'Design In Progress' || task.stage === 'Design Review';
    default:
      return true;
  }
}

export default function BriefList({ tasks }) {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('date');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = useMemo(() => {
    const list = tasks.filter((t) => matchesFilter(t, filter));
    list.sort((a, b) => {
      if (sort === 'date') return new Date(a.dueDate) - new Date(b.dueDate);
      if (sort === 'priority') return priorityOrder[a.priority] - priorityOrder[b.priority];
      if (sort === 'client') {
        const ca = clients.find((c) => c.id === a.clientId)?.name || '';
        const cb = clients.find((c) => c.id === b.clientId)?.name || '';
        return ca.localeCompare(cb);
      }
      return 0;
    });
    return list;
  }, [tasks, filter, sort]);

  const getClient = (id) => clients.find((c) => c.id === id);
  const getMember = (id) => teamMembers.find((m) => m.id === id);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sortOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              Sort: {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-400 text-sm">
            No briefs match the current filter.
          </div>
        )}
        {filtered.map((task) => {
          const client = getClient(task.clientId);
          const assignee = getMember(task.assignee);
          const isExpanded = expandedId === task.id;

          return (
            <div
              key={task.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : task.id)}
                className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-gray-900 truncate">{task.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStageColor(task.stage)}`}>
                      {task.stage}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{client?.logo} {client?.name}</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(task.dueDate)}
                    </span>
                    {assignee && (
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {assignee.name}
                      </span>
                    )}
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
                  {task.brief.context && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Context</p>
                      <p className="text-sm text-gray-700">{task.brief.context}</p>
                    </div>
                  )}
                  {task.brief.copy && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Copy</p>
                      <p className="text-sm text-gray-700">{task.brief.copy}</p>
                    </div>
                  )}
                  {task.brief.visualDirection && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Visual Direction</p>
                      <p className="text-sm text-gray-700">{task.brief.visualDirection}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-4 pt-2 text-xs text-gray-400">
                    <span>Created: {formatDate(task.createdAt)}</span>
                    <span>Content: {task.contentType}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
