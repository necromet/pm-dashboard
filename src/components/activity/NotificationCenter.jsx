import React, { useState } from 'react';
import { formatRelativeTime } from '../../utils/helpers';
import {
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  UserPlus,
  Send,
  Bell,
} from 'lucide-react';

const typeConfig = {
  approval_needed: {
    icon: AlertCircle,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
  },
  deadline_warning: {
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
  bottleneck: {
    icon: AlertTriangle,
    color: 'text-red-500',
    bg: 'bg-red-50',
  },
  task_assigned: {
    icon: UserPlus,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  published: {
    icon: CheckCircle,
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
};

export default function NotificationCenter({ notifications, onMarkRead, onMarkAllRead, unreadCount }) {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'unread'
    ? notifications.filter((n) => !n.read)
    : notifications;

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 px-4 py-2 border-b border-gray-50">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            filter === 'unread'
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Unread ({notifications.filter((n) => !n.read).length})
        </button>
      </div>

      {/* Notification List */}
      <div className="max-h-[500px] overflow-y-auto">
        {filtered.length === 0 && (
          <div className="p-6 text-center text-gray-400 text-sm">
            {filter === 'unread' ? 'No unread notifications.' : 'No notifications.'}
          </div>
        )}
        {filtered.map((notification) => {
          const config = typeConfig[notification.type] || typeConfig.approval_needed;
          const Icon = config.icon;

          return (
            <button
              key={notification.id}
              onClick={() => onMarkRead(notification.id)}
              className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-gray-50 transition-colors hover:bg-gray-50 ${
                notification.read ? 'opacity-60' : ''
              }`}
            >
              <div className={`mt-0.5 p-1.5 rounded-full ${config.bg}`}>
                <Icon size={14} className={config.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(notification.timestamp)}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
