import React from 'react';

export default function ClientOverview({ client }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{client.logo}</span>
        <div>
          <h2 className="text-xl font-bold">{client.name}</h2>
          <p className="text-gray-500">{client.industry}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600">{client.brandVoice}</p>
    </div>
  );
}
