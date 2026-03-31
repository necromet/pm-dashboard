import React from 'react';
import ProgressBar from '../ui/ProgressBar';

export default function QuotaTracker({ client, progress }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold mb-3">{client.name} — Quota</h3>
      {['feeds', 'stories', 'reels', 'carousels'].map((type) => (
        <div key={type} className="mb-2">
          <div className="flex justify-between text-sm">
            <span className="capitalize">{type}</span>
            <span>{progress[type]?.actual}/{progress[type]?.target}</span>
          </div>
          <ProgressBar value={progress[type]?.percentage || 0} />
        </div>
      ))}
    </div>
  );
}
