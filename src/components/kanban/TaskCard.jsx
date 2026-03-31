import React, { useState, useRef } from 'react';
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={task.title} size="xl">
        <TaskDetailModal task={task} client={client} assignee={assignee} contentType={contentType} />
      </Modal>
    </>
  );
}

function InlineTag({ name, onRemove }) {
  return (
    <span className="inline-flex items-center bg-indigo-50 text-indigo-700 text-xs font-semibold px-1.5 py-0.5 rounded-md border border-indigo-200 align-middle">
      @{name}
      {onRemove && (
        <button onClick={onRemove} className="ml-0.5 text-indigo-400 hover:text-indigo-600 leading-none">
          &times;
        </button>
      )}
    </span>
  );
}

function renderComment(comment) {
  if (!comment) return null;
  const segments = [];
  let remaining = comment;
  let key = 0;
  const regex = /@\[([^\]]+)\]/;
  let match;
  while ((match = remaining.match(regex))) {
    if (match.index > 0) {
      segments.push(<span key={key++}>{remaining.slice(0, match.index)}</span>);
    }
    segments.push(
      <span key={key++} className="inline-block">
        <InlineTag name={match[1]} />
      </span>
    );
    remaining = remaining.slice(match.index + match[0].length);
  }
  if (remaining) segments.push(<span key={key++}>{remaining}</span>);
  return segments;
}

function CommentInput({ onSend }) {
  const [value, setValue] = useState('');
  const [showMention, setShowMention] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const inputRef = useRef(null);
  const displayRef = useRef(null);
  const styleId = 'comment-input-selection-style';

  const atIdx = value.lastIndexOf('@');
  const mentionActive = showMention && atIdx !== -1;
  const filteredMembers = mentionActive
    ? teamMembers.filter((m) => m.name.toLowerCase().includes(mentionQuery.toLowerCase()))
    : [];

  const syncScroll = () => {
    if (inputRef.current && displayRef.current) {
      displayRef.current.scrollTop = inputRef.current.scrollTop;
      displayRef.current.scrollLeft = inputRef.current.scrollLeft;
    }
  };

  const handleInput = (e) => {
    const val = e.target.value;
    setValue(val);
    syncScroll();

    const idx = val.lastIndexOf('@');
    if (idx !== -1 && (idx === 0 || val[idx - 1] === ' ')) {
      const query = val.slice(idx + 1);
      if (!query.includes(' ') || query.length <= 20) {
        setShowMention(true);
        setMentionQuery(query);
        return;
      }
    }
    setShowMention(false);
  };

  const selectMention = (member) => {
    const before = value.slice(0, atIdx);
    const newVal = before + '@[' + member.name + '] ';
    setValue(newVal);
    setShowMention(false);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.selectionStart = inputRef.current.selectionEnd = newVal.length;
      }
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (mentionActive && filteredMembers.length > 0) {
        selectMention(filteredMembers[0]);
      } else if (value.trim()) {
        onSend(value.trim());
        setValue('');
        setShowMention(false);
      }
    } else if (e.key === 'Escape') {
      setShowMention(false);
    } else if (e.key === 'Backspace') {
      const cursorPos = inputRef.current?.selectionStart ?? 0;
      const mentionPattern = /@\[([^\]]+)\]/g;
      let m;
      while ((m = mentionPattern.exec(value)) !== null) {
        const mentionEnd = m.index + m[0].length;
        if (cursorPos === mentionEnd) {
          e.preventDefault();
          const before = value.slice(0, m.index);
          const after = value.slice(mentionEnd);
          const newVal = before + after;
          setValue(newVal);
          setShowMention(false);
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
              inputRef.current.selectionStart = inputRef.current.selectionEnd = m.index;
            }
          }, 0);
          break;
        }
      }
    }
  };

  const handleSelect = () => {
    syncScroll();
  };

  if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = '.comment-input-transparent::selection { background: rgba(99, 102, 241, 0.2); color: transparent; } .comment-input-transparent::-moz-selection { background: rgba(99, 102, 241, 0.2); color: transparent; }';
    document.head.appendChild(style);
  }

  return (
    <div className="relative">
      {mentionActive && filteredMembers.length > 0 && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
          {filteredMembers.map((member) => (
            <button
              key={member.id}
              onClick={() => selectMention(member)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-indigo-50 transition-colors text-left"
            >
              <Avatar initials={member.avatar} size="sm" />
              <div>
                <p className="font-medium text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
            </button>
          ))}
        </div>
      )}
      <div className="flex gap-2 items-end">
        <div
          className="relative flex-1 border border-gray-300 rounded-lg text-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent cursor-text min-h-[38px]"
          onClick={() => inputRef.current?.focus()}
        >
          <div
            ref={displayRef}
            className="px-3 py-2 min-h-[20px] whitespace-pre-wrap break-words pointer-events-none overflow-hidden"
            aria-hidden="true"
            style={{ font: 'inherit' }}
          >
            {value ? renderComment(value) : <span className="text-gray-400">Add a comment... @ to mention</span>}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onSelect={handleSelect}
            onScroll={syncScroll}
            className="absolute inset-0 w-full h-full px-3 py-2 text-sm outline-none bg-transparent caret-indigo-600 comment-input-transparent"
            style={{ color: 'transparent', WebkitTextFillColor: 'transparent', caretColor: '#4f46e5' }}
            spellCheck={false}
          />
        </div>
        <button
          onClick={() => {
            if (value.trim()) {
              onSend(value.trim());
              setValue('');
              setShowMention(false);
            }
          }}
          className="px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}

function TaskDetailModal({ task, client, assignee, contentType }) {
  const [activityLog, setActivityLog] = useState(task.activityLog || []);
  const priorityVariant = task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'success';

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      <div className="md:col-span-3 space-y-4">
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
      </div>

      <div className="md:col-span-2 flex flex-col">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Activity</h4>
        <div className="space-y-2 flex-1 overflow-y-auto min-h-0">
          {activityLog.length > 0 ? (
            activityLog.slice().reverse().map((entry) => {
              const member = teamMembers.find((m) => m.id === entry.userId);
              return (
                <div key={entry.id} className="flex items-start gap-2 text-xs">
                  <ChevronRight className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">{member?.name || entry.userId}</span>
                    <span className="text-gray-500"> {entry.action.replace(/_/g, ' ')}</span>
                    <span className="text-gray-400 ml-1">{formatRelativeTime(entry.timestamp)}</span>
                    {entry.note && (
                      <p className="text-gray-500 mt-0.5">{renderComment(entry.note)}</p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-gray-400">No activity yet.</p>
          )}
        </div>

        <div className="border-t border-gray-200 pt-3 mt-3">
          <CommentInput
            onSend={(note) => {
              const newEntry = {
                id: 'a' + Date.now(),
                userId: 'u1',
                action: 'commented',
                note,
                timestamp: new Date().toISOString(),
              };
              const updated = [...activityLog, newEntry];
              setActivityLog(updated);
              task.activityLog = updated;
            }}
          />
        </div>
      </div>
    </div>
  );
}
