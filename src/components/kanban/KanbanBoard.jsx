import React, { useState, useMemo } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Filter, X } from 'lucide-react';
import KanbanColumn from './KanbanColumn';
import { clients, contentTypes } from '../../data/mockData';
import { cn } from '../../utils/helpers';

export default function KanbanBoard({ tasks: initialTasks, stages, clientFilter: externalClientFilter }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');

  const isControlled = externalClientFilter && externalClientFilter !== 'all';
  const [internalClientFilter, setInternalClientFilter] = useState('all');
  const clientFilter = isControlled ? externalClientFilter : internalClientFilter;
  const setClientFilter = isControlled ? () => {} : setInternalClientFilter;

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (clientFilter !== 'all' && task.clientId !== clientFilter) return false;
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
      if (contentTypeFilter !== 'all' && task.contentType !== contentTypeFilter) return false;
      return true;
    });
  }, [tasks, clientFilter, priorityFilter, contentTypeFilter]);

  const hasActiveFilters = (!isControlled && clientFilter !== 'all') || priorityFilter !== 'all' || contentTypeFilter !== 'all';

  function clearFilters() {
    if (!isControlled) setInternalClientFilter('all');
    setPriorityFilter('all');
    setContentTypeFilter('all');
  }

  function handleDragEnd(result) {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const destStage = destination.droppableId;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === draggableId ? { ...task, stage: destStage } : task
      )
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <Filter className="w-4 h-4" />
          <span className="font-medium">Filters</span>
        </div>

        {!isControlled && (
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
          >
            <option value="all">All Clients</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.logo} {c.name}</option>
            ))}
          </select>
        )}

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={contentTypeFilter}
          onChange={(e) => setContentTypeFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
        >
          <option value="all">All Types</option>
          {contentTypes.map((ct) => (
            <option key={ct.id} value={ct.id}>{ct.icon} {ct.label}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
          >
            <X className="w-3 h-3" />
            Clear filters
          </button>
        )}

        <div className="ml-auto text-sm text-gray-500">
          <span className="font-semibold text-gray-700">{filteredTasks.length}</span> tasks
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
          {stages.map((stage) => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              tasks={filteredTasks.filter((t) => t.stage === stage.label)}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
