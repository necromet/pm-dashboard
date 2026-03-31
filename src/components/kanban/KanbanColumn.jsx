import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { getStageColor, cn } from '../../utils/helpers';

const stageBorderColors = {
  'Brief Pending': 'border-gray-400',
  'Brief Received': 'border-blue-400',
  'Design In Progress': 'border-yellow-400',
  'Design Review': 'border-purple-400',
  'Client Approval': 'border-orange-400',
  'Scheduled': 'border-cyan-400',
  'Published': 'border-green-400',
};

const stageStripeColors = {
  'Brief Pending': 'bg-gray-400',
  'Brief Received': 'bg-blue-400',
  'Design In Progress': 'bg-yellow-400',
  'Design Review': 'bg-purple-400',
  'Client Approval': 'bg-orange-400',
  'Scheduled': 'bg-cyan-400',
  'Published': 'bg-green-400',
};

export default function KanbanColumn({ stage, tasks }) {
  const stripeColor = stageStripeColors[stage.label] || 'bg-gray-400';

  return (
    <div className="flex-shrink-0 w-72 flex flex-col">
      <div className="rounded-t-lg overflow-hidden">
        <div className={cn('h-1', stripeColor)} />
        <div className="bg-white px-3 py-2.5 border-x border-t border-gray-200 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-gray-800">{stage.label}</h3>
            <span className={cn(
              'text-xs font-medium px-2 py-0.5 rounded-full',
              getStageColor(stage.label)
            )}>
              {tasks.length}
            </span>
          </div>
        </div>
      </div>

      <Droppable droppableId={stage.label}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex-1 bg-gray-50 border-x border-b border-gray-200 rounded-b-lg p-2 space-y-2 min-h-[200px] overflow-y-auto transition-colors duration-150',
              snapshot.isDraggingOver && 'bg-indigo-50 border-indigo-200'
            )}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center h-24 text-xs text-gray-400">
                No tasks
              </div>
            )}
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
