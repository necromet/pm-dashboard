import { AlertTriangle, Clock, X } from 'lucide-react';
import { useState } from 'react';
import { formatRelativeTime } from '../../utils/helpers';

export default function BottleneckAlert({ bottlenecks = [], clients = [] }) {
  const [dismissed, setDismissed] = useState(false);

  if (!bottlenecks.length || dismissed) return null;

  const getClientName = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    return client?.name || 'Unknown Client';
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-red-800">
              {bottlenecks.length} Bottleneck{bottlenecks.length > 1 ? 's' : ''}{' '}
              Detected
            </h3>
            <p className="text-xs text-red-600 mt-0.5">
              Tasks stalled for more than 24 hours
            </p>
            <ul className="mt-3 space-y-2">
              {bottlenecks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center gap-2 text-sm text-red-700"
                >
                  <Clock className="h-3.5 w-3.5 shrink-0 text-red-500" />
                  <span className="font-medium">{task.title}</span>
                  <span className="text-red-400">—</span>
                  <span className="text-red-600">
                    {getClientName(task.clientId)}
                  </span>
                  <span className="text-red-400 text-xs">
                    {formatRelativeTime(
                      task.activityLog?.[task.activityLog.length - 1]?.timestamp ||
                        task.createdAt
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-red-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-100"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
