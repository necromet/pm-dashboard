import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import Modal from '../ui/Modal';
import { clients, teamMembers, contentTypes } from '../../data/mockData';
import { cn, formatDate, formatRelativeTime } from '../../utils/helpers';

const contentTypeIcons = {
  feed: '📷',
  story: '📱',
  reel: '🎬',
  carousel: '🎠',
};

function getDueDateColor(dueDate) {
  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due - now;
  const diffDays = diffMs / 86400000;

  if (diffDays < 0) return 'text-red-600 bg-red-50';
  if (diffDays < 3) return 'text-yellow-700 bg-yellow-50';
  return 'text-gray-500 bg-gray-50';
}

function getDueDateLabel(dueDate) {
  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due - now;
  const diffDays = Math.ceil(diffMs / 86400000);

  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  return `Due in ${diffDays}d`;
}

function isStalled(task) {
  if (task.stage === 'Published') return false;
  if (!task.activityLog || task.activityLog.length === 0) return false;
  const lastActivity = new Date(task.activityLog[task.activityLog.length - 1].timestamp);
  const now = new Date();
  const diffHrs = (now - lastActivity) / 3600000;
  return diffHrs > 24;
}

export default function TaskCard({ task, index }) {
  const [showModal, setShowModal] = useState(false);

  const client = clients.find((c) => c.id === task.clientId);
  const assignee = teamMembers.find((m) => m.id === task.assignee);
  const contentType = contentTypes.find((c) => c.id === task.contentType);
  const stalled = isStalled(task);
  const priorityVariant = task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'success';

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={cn(
              'bg-white rounded-lg shadow-sm border border-gray-100 p-3 cursor-pointer transition-all duration-150',
              'hover:shadow-md hover:border-gray-200',
              snapshot.isDragging && 'shadow-lg ring-2 ring-indigo-200 rotate-2',
              stalled && 'border-l-4 border-l-amber-400'
            )}
            onClick={() => setShowModal(true)}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-medium text-sm text-gray-900 leading-tight line-clamp-2">
                {task.title}
              </h4>
              {stalled && (
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              )}
            </div>

            {client && (
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-sm">{client.logo}</span>
                <span className="text-xs text-gray-500 truncate">{client.name}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
              <Badge variant={priorityVariant}>{task.priority}</Badge>
              {contentType && (
                <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded flex items-center gap-1">
                  {contentTypeIcons[task.contentType]} {contentType.label}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className={cn('flex items-center gap-1 text-xs px-1.5 py-0.5 rounded', getDueDateColor(task.dueDate))}>
                <Clock className="w-3 h-3" />
                <span>{getDueDateLabel(task.dueDate)}</span>
              </div>
              {assignee && (
                <div className="flex items-center gap-1">
                  <Avatar initials={assignee.avatar} size="sm" />
                </div>
              )}
            </div>
          </div>
        )}
      </Draggable>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={task.title}>
        <TaskDetailModal task={task} client={client} assignee={assignee} contentType={contentType} />
      </Modal>
    </>
  );
}

function TaskDetailModal({ task, client, assignee, contentType }) {
  const priorityVariant = task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'success';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Badge variant={priorityVariant}>{task.priority} priority</Badge>
        {contentType && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded flex items-center gap-1">
            {contentTypeIcons[task.contentType]} {contentType.label}
          </span>
        )}
        <span className={cn('text-xs px-2 py-1 rounded', getDueDateColor(task.dueDate))}>
          Due: {formatDate(task.dueDate)}
        </span>
      </div>

      {client && (
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <span className="text-2xl">{client.logo}</span>
          <div>
            <p className="font-medium text-sm">{client.name}</p>
            <p className="text-xs text-gray-500">{client.industry}</p>
          </div>
        </div>
      )}

      {assignee && (
        <div className="flex items-center gap-2">
          <Avatar initials={assignee.avatar} size="sm" />
          <div>
            <p className="text-sm font-medium">{assignee.name}</p>
            <p className="text-xs text-gray-500">{assignee.role}</p>
          </div>
        </div>
      )}

      {task.brief?.context && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Brief</h4>
          <p className="text-sm text-gray-600">{task.brief.context}</p>
        </div>
      )}

      {task.brief?.copy && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Copy</h4>
          <p className="text-sm text-gray-600 italic">&ldquo;{task.brief.copy}&rdquo;</p>
        </div>
      )}

      {task.brief?.visualDirection && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Visual Direction</h4>
          <p className="text-sm text-gray-600">{task.brief.visualDirection}</p>
        </div>
      )}

      {task.activityLog && task.activityLog.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Activity</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {task.activityLog.slice().reverse().map((entry) => {
              const member = teamMembers.find((m) => m.id === entry.userId);
              return (
                <div key={entry.id} className="flex items-start gap-2 text-xs">
                  <ChevronRight className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">{member?.name || entry.userId}</span>
                    <span className="text-gray-500"> {entry.action.replace(/_/g, ' ')}</span>
                    <span className="text-gray-400 ml-1">{formatRelativeTime(entry.timestamp)}</span>
                    {entry.note && <p className="text-gray-500 mt-0.5">{entry.note}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
