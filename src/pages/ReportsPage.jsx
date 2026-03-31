import React from 'react';
import Layout from '../components/layout/Layout';
import ProgressBar from '../components/ui/ProgressBar';
import { clients, teamMembers, tasks, quotaProgress } from '../data/mockData';
import { calculateQuotaProgress } from '../utils/helpers';
import { Download } from 'lucide-react';

const contentTypes = ['feeds', 'stories', 'reels', 'carousels'];
const contentTypeLabels = { feeds: 'Feed Posts', stories: 'Stories', reels: 'Reels', carousels: 'Carousels' };
const contentTypeColors = { feeds: 'bg-blue-500', stories: 'bg-purple-500', reels: 'bg-pink-500', carousels: 'bg-amber-500' };

export default function ReportsPage() {
  const totalTasks = tasks.length;
  const publishedTasks = tasks.filter((t) => t.stage === 'Published').length;
  const inProgressTasks = tasks.filter((t) => ['Design In Progress', 'Design Review', 'Client Approval', 'Scheduled'].includes(t.stage)).length;
  const totalRetainer = clients.reduce((sum, c) => sum + c.monthlyRetainer, 0);

  const onTimeTasks = tasks.filter((t) => {
    if (!t.completedAt) return false;
    return new Date(t.completedAt) <= new Date(t.dueDate);
  }).length;
  const completedWithDue = tasks.filter((t) => t.completedAt).length;
  const onTimeRate = completedWithDue > 0 ? Math.round((onTimeTasks / completedWithDue) * 100) : 0;

  const teamPerformance = teamMembers.map((m) => {
    const memberTasks = tasks.filter((t) => t.assignee === m.id);
    const completed = memberTasks.filter((t) => t.completedAt);
    let avgTurnaround = 0;
    if (completed.length > 0) {
      const totalDays = completed.reduce((sum, t) => {
        const created = new Date(t.createdAt);
        const done = new Date(t.completedAt);
        return sum + Math.max(1, Math.round((done - created) / 86400000));
      }, 0);
      avgTurnaround = Math.round(totalDays / completed.length);
    }
    return { ...m, totalTasks: memberTasks.length, completed: completed.length, avgTurnaround };
  });

  const maxTasks = Math.max(...teamPerformance.map((m) => m.totalTasks), 1);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Total Content</p>
          <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Published</p>
          <p className="text-2xl font-bold text-green-600">{publishedTasks}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">In Progress</p>
          <p className="text-2xl font-bold text-yellow-600">{inProgressTasks}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Monthly Retainer</p>
          <p className="text-2xl font-bold text-indigo-600">${totalRetainer.toLocaleString()}</p>
        </div>
      </div>

      {/* Per-Client Quota Progress */}
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Quota Progress — March 2026</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {clients.map((client) => {
          const quota = quotaProgress.find((q) => q.clientId === client.id);
          const progress = quota ? calculateQuotaProgress(quota.actual, quota.target) : {};

          return (
            <div key={client.id} className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  {client.logo} {client.name}
                </h3>
                <span className="text-sm font-medium text-gray-500">
                  {progress.total?.actual || 0}/{progress.total?.target || 0} total
                </span>
              </div>
              <ProgressBar value={progress.total?.percentage || 0} className="mb-4" />

              <div className="space-y-3">
                {contentTypes.map((type) => (
                  <div key={type}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">{contentTypeLabels[type]}</span>
                      <span className="text-gray-500">
                        {progress[type]?.actual || 0}/{progress[type]?.target || 0}
                        <span className="ml-2 text-xs text-gray-400">
                          ({progress[type]?.percentage || 0}%)
                        </span>
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${contentTypeColors[type]}`}
                        style={{ width: `${progress[type]?.percentage || 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Distribution Table */}
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Weekly Distribution — March 2026</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 font-medium text-gray-600">Client</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Week</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Feed</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Story</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Reel</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Carousel</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Total</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) =>
              client.weeklyDistribution.map((week, idx) => (
                <tr key={`${client.id}-${week.week}`} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-2.5 text-gray-800">
                    {idx === 0 && (
                      <span>
                        {client.logo} {client.name}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-center text-gray-500">Week {week.week}</td>
                  <td className="px-4 py-2.5 text-center text-gray-700">{week.feeds}</td>
                  <td className="px-4 py-2.5 text-center text-gray-700">{week.stories}</td>
                  <td className="px-4 py-2.5 text-center text-gray-700">{week.reels}</td>
                  <td className="px-4 py-2.5 text-center text-gray-700">{week.carousels}</td>
                  <td className="px-4 py-2.5 text-center font-medium text-gray-900">
                    {week.feeds + week.stories + week.reels + week.carousels}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Team Performance */}
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Team Performance</h2>
      <div className="bg-white rounded-lg shadow p-5 mb-8">
        <div className="space-y-4">
          {teamPerformance.map((member) => (
            <div key={member.id} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {member.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{member.name}</span>
                    <span className="text-xs text-gray-400 ml-2">{member.role}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{member.totalTasks} tasks</span>
                    <span>{member.completed} completed</span>
                    <span>{member.avgTurnaround}d avg turnaround</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-indigo-500 h-3 rounded-full transition-all"
                    style={{ width: `${(member.totalTasks / maxTasks) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* On-Time Delivery by Client */}
      <h2 className="text-lg font-semibold text-gray-900 mb-3">On-Time Delivery Rate</h2>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {clients.map((client) => {
          const clientTasks = tasks.filter((t) => t.clientId === client.id && t.completedAt);
          const onTime = clientTasks.filter(
            (t) => new Date(t.completedAt) <= new Date(t.dueDate)
          ).length;
          const rate = clientTasks.length > 0 ? Math.round((onTime / clientTasks.length) * 100) : 0;

          return (
            <div key={client.id} className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600 mb-2">
                {client.logo} {client.name}
              </p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-gray-900">{rate}%</span>
                <span className="text-xs text-gray-400 mb-1">
                  {onTime}/{clientTasks.length} tasks
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full ${
                    rate >= 80 ? 'bg-green-500' : rate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${rate}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall On-Time */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Overall On-Time Delivery</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{onTimeRate}%</p>
          </div>
          <div className="w-48">
            <div className="w-full bg-gray-100 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${
                  onTimeRate >= 80 ? 'bg-green-500' : onTimeRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${onTimeRate}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1 text-right">
              {onTimeTasks} of {completedWithDue} completed tasks
            </p>
          </div>
        </div>
      </div>

      {/* Simple Bar Chart: Tasks by Content Type */}
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Tasks by Content Type</h2>
      <div className="bg-white rounded-lg shadow p-5">
        {contentTypes.map((type) => {
          const count = tasks.filter((t) => t.contentType === type).length;
          const pct = Math.round((count / totalTasks) * 100);
          return (
            <div key={type} className="flex items-center gap-3 mb-3 last:mb-0">
              <span className="text-sm text-gray-600 w-20 capitalize">{type}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                <div
                  className={`h-6 rounded-full ${contentTypeColors[type]} flex items-center justify-end pr-2`}
                  style={{ width: `${Math.max(pct, 8)}%` }}
                >
                  <span className="text-xs font-medium text-white">{count}</span>
                </div>
              </div>
              <span className="text-xs text-gray-400 w-10 text-right">{pct}%</span>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
