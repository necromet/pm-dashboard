import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Mail, Calendar, Palette, Globe } from 'lucide-react';
import Layout from '../components/layout/Layout';
import KanbanBoard from '../components/kanban/KanbanBoard';
import Avatar from '../components/ui/Avatar';
import ProgressBar from '../components/ui/ProgressBar';
import Card from '../components/ui/Card';
import {
  clients,
  teamMembers,
  tasks,
  pipelineStages,
  quotaProgress,
} from '../data/mockData';
import { calculateQuotaProgress, formatDate } from '../utils/helpers';

const contentTypeMeta = [
  { key: 'feeds', label: 'Feeds', icon: '📷', color: 'bg-indigo-500' },
  { key: 'stories', label: 'Stories', icon: '📱', color: 'bg-pink-500' },
  { key: 'reels', label: 'Reels', icon: '🎬', color: 'bg-orange-500' },
  { key: 'carousels', label: 'Carousels', icon: '🎠', color: 'bg-purple-500' },
];

export default function ClientDashboard() {
  const { clientId: paramClientId } = useParams();
  const clientId = paramClientId || 'c1';

  const client = clients.find((c) => c.id === clientId);
  const quota = quotaProgress.find((q) => q.clientId === clientId);
  const progress = quota ? calculateQuotaProgress(quota.actual, quota.target) : {};

  const clientTasks = useMemo(() => tasks.filter((t) => t.clientId === clientId), [clientId]);

  const assignedMembers = useMemo(
    () => teamMembers.filter((m) => m.assignedClients.includes(clientId)),
    [clientId]
  );

  const activityEntries = useMemo(() => {
    const all = [];
    clientTasks.forEach((t) => {
      if (t.activityLog) {
        t.activityLog.forEach((entry) => {
          all.push({ ...entry, taskTitle: t.title, taskId: t.id });
        });
      }
    });
    return all.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
  }, [clientTasks]);

  if (!client) {
    return (
      <Layout>
        <p className="text-gray-500">Client not found</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <span className="text-5xl">{client.logo}</span>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{client.industry}</p>

              <div className="flex items-center gap-4 mt-3 flex-wrap text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{client.contactName} &middot; {client.contactEmail}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Since {formatDate(client.startDate)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span>{client.platforms.join(', ')}</span>
                </div>
              </div>

              {client.brandColors && (
                <div className="flex items-center gap-1.5 mt-3">
                  <Palette className="w-4 h-4 text-gray-400" />
                  {client.brandColors.map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border border-gray-200"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              )}

              <p className="text-sm text-gray-600 mt-3 italic">{client.brandVoice}</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quota Progress</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {contentTypeMeta.map(({ key, label, icon, color }) => (
                  <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-1">{icon}</div>
                    <div className="text-xs text-gray-500 mb-1">{label}</div>
                    <div className="text-lg font-bold text-gray-900">
                      {progress[key]?.actual || 0}
                      <span className="text-sm text-gray-400">/{progress[key]?.target || 0}</span>
                    </div>
                    <ProgressBar value={progress[key]?.percentage || 0} color={color} showPercentage={false} size="sm" className="mt-2" />
                  </div>
                ))}
              </div>

              {client.weeklyDistribution && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Weekly Distribution</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-gray-500 font-medium">Week</th>
                          <th className="text-center py-2 text-gray-500 font-medium">📷 Feeds</th>
                          <th className="text-center py-2 text-gray-500 font-medium">📱 Stories</th>
                          <th className="text-center py-2 text-gray-500 font-medium">🎬 Reels</th>
                          <th className="text-center py-2 text-gray-500 font-medium">🎠 Carousels</th>
                          <th className="text-center py-2 text-gray-500 font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {client.weeklyDistribution.map((w) => (
                          <tr key={w.week} className="border-b border-gray-100">
                            <td className="py-2 font-medium">Week {w.week}</td>
                            <td className="text-center py-2">{w.feeds}</td>
                            <td className="text-center py-2">{w.stories}</td>
                            <td className="text-center py-2">{w.reels}</td>
                            <td className="text-center py-2">{w.carousels}</td>
                            <td className="text-center py-2 font-semibold">
                              {w.feeds + w.stories + w.reels + w.carousels}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Team</h2>
              <div className="space-y-3">
                {assignedMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <Avatar initials={member.avatar} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Feed</h2>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {activityEntries.map((entry) => {
                  const member = teamMembers.find((m) => m.id === entry.userId);
                  return (
                    <div key={entry.id} className="text-xs border-l-2 border-gray-200 pl-3 py-1">
                      <p className="font-medium text-gray-700">
                        {member?.name || entry.userId}
                        <span className="font-normal text-gray-500"> {entry.action.replace(/_/g, ' ')}</span>
                      </p>
                      <p className="text-gray-500 truncate">{entry.taskTitle}</p>
                      {entry.note && <p className="text-gray-400 mt-0.5">{entry.note}</p>}
                    </div>
                  );
                })}
                {activityEntries.length === 0 && (
                  <p className="text-sm text-gray-400">No activity yet</p>
                )}
              </div>
            </Card>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Tasks ({clientTasks.length})
          </h2>
          <KanbanBoard
            tasks={clientTasks}
            stages={pipelineStages}
            clientFilter={clientId}
          />
        </div>
      </div>
    </Layout>
  );
}
