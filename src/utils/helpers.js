// Utility functions for Agency Ops Dashboard

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelativeTime(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(dateString);
}

export function getStageColor(stage) {
  const colors = {
    'Brief Pending': 'bg-gray-100 text-gray-700',
    'Brief Received': 'bg-blue-100 text-blue-700',
    'Design In Progress': 'bg-yellow-100 text-yellow-700',
    'Design Review': 'bg-purple-100 text-purple-700',
    'Client Approval': 'bg-orange-100 text-orange-700',
    'Scheduled': 'bg-cyan-100 text-cyan-700',
    'Published': 'bg-green-100 text-green-700',
  };
  return colors[stage] || 'bg-gray-100 text-gray-700';
}

export function getPriorityColor(priority) {
  const colors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
  };
  return colors[priority] || 'bg-gray-100 text-gray-700';
}

export function calculateQuotaProgress(actual, target) {
  const types = ['feeds', 'stories', 'reels', 'carousels'];
  const progress = {};

  types.forEach((type) => {
    const a = actual[type] || 0;
    const t = target[type] || 1;
    progress[type] = {
      actual: a,
      target: t,
      percentage: Math.min(Math.round((a / t) * 100), 100),
      remaining: Math.max(t - a, 0),
    };
  });

  const totalActual = types.reduce((sum, t) => sum + (actual[t] || 0), 0);
  const totalTarget = types.reduce((sum, t) => sum + (target[t] || 0), 0);

  progress.total = {
    actual: totalActual,
    target: totalTarget,
    percentage: totalTarget > 0 ? Math.min(Math.round((totalActual / totalTarget) * 100), 100) : 0,
    remaining: Math.max(totalTarget - totalActual, 0),
  };

  return progress;
}
