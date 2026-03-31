import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import StatsGrid from '../components/dashboard/StatsGrid';
import ClientCard from '../components/dashboard/ClientCard';
import BottleneckAlert from '../components/dashboard/BottleneckAlert';
import { clients, tasks, teamMembers, quotaProgress } from '../data/mockData';
import { calculateQuotaProgress } from '../utils/helpers';

const BOTTLENECK_THRESHOLD_MS = 24 * 60 * 60 * 1000;

export default function GlobalDashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Active Clients', value: clients.length },
    { label: 'Total Tasks', value: tasks.length },
    { label: 'Published', value: tasks.filter((t) => t.stage === 'Published').length },
    { label: 'Pending Approval', value: tasks.filter((t) => t.stage === 'Client Approval').length },
  ];

  const bottlenecks = useMemo(() => {
    const now = Date.now();
    return tasks.filter((task) => {
      if (task.stage === 'Published' || task.stage === 'Scheduled') return false;
      const lastActivity = task.activityLog?.[task.activityLog.length - 1];
      const lastTimestamp = lastActivity?.timestamp || task.createdAt;
      return now - new Date(lastTimestamp).getTime() > BOTTLENECK_THRESHOLD_MS;
    });
  }, []);

  const getQuotaData = (clientId) => {
    const quota = quotaProgress.find((q) => q.clientId === clientId);
    if (!quota) return undefined;
    return calculateQuotaProgress(quota.actual, quota.target);
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <StatsGrid stats={stats} />
      {bottlenecks.length > 0 && (
        <div className="mt-6">
          <BottleneckAlert bottlenecks={bottlenecks} clients={clients} />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {clients.map((c) => (
          <div key={c.id} onClick={() => navigate(`/clients/${c.id}`)} className="cursor-pointer">
            <ClientCard
              client={c}
              tasks={tasks}
              teamMembers={teamMembers}
              quotaData={getQuotaData(c.id)}
            />
          </div>
        ))}
      </div>
    </Layout>
  );
}
