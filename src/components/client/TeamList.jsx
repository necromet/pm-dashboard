import React from 'react';
import Avatar from '../ui/Avatar';

export default function TeamList({ members }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold mb-3">Team</h3>
      {members.map((m) => (
        <div key={m.id} className="flex items-center gap-3 py-2">
          <Avatar initials={m.avatar} />
          <div>
            <p className="font-medium text-sm">{m.name}</p>
            <p className="text-xs text-gray-500">{m.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
