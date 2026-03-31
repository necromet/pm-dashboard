import React from 'react';
import Layout from '../components/layout/Layout';
import KanbanBoard from '../components/kanban/KanbanBoard';
import { tasks, pipelineStages } from '../data/mockData';

export default function PipelineView() {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Content Pipeline</h1>
        <p className="text-sm text-gray-500 mt-1">Drag and drop tasks to move them between stages</p>
      </div>
      <div className="flex-1 min-h-0">
        <KanbanBoard tasks={tasks} stages={pipelineStages} />
      </div>
    </Layout>
  );
}
