import { Users } from 'lucide-react';
import Card, { CardHeader, CardBody } from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';


export default function ClientCard({ client, tasks = [], teamMembers = [], quotaData }) {
  const clientTasks = tasks.filter((t) => t.clientId === client.id);

  const tasksByStage = clientTasks.reduce((acc, task) => {
    acc[task.stage] = (acc[task.stage] || 0) + 1;
    return acc;
  }, {});

  const assignedMembers = teamMembers.filter((m) =>
    m.assignedClients.includes(client.id)
  );

  const stageColors = {
    'Brief Pending': 'gray',
    'Brief Received': 'blue',
    'Design In Progress': 'yellow',
    'Design Review': 'purple',
    'Client Approval': 'orange',
    Scheduled: 'cyan',
    Published: 'green',
  };

  const totalPercentage = quotaData?.total?.percentage ?? 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{client.logo}</span>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">
              {client.name}
            </h3>
            <p className="text-xs text-slate-500">{client.industry}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <Users className="h-4 w-4" />
          <span className="text-xs font-medium">{assignedMembers.length}</span>
        </div>
      </CardHeader>

      <CardBody className="space-y-4">
        <div>
          <p className="text-xs font-medium text-slate-500 mb-2">Tasks by Stage</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(tasksByStage).map(([stage, count]) => (
              <Badge
                key={stage}
                color={stageColors[stage] || 'gray'}
                size="sm"
              >
                {stage} ({count})
              </Badge>
            ))}
            {Object.keys(tasksByStage).length === 0 && (
              <span className="text-xs text-slate-400">No tasks</span>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-500 mb-2">Quota Progress</p>
          <ProgressBar value={totalPercentage} size="sm" />
        </div>

        <div>
          <p className="text-xs font-medium text-slate-500 mb-2">Team</p>
          <div className="flex items-center -space-x-2">
            {assignedMembers.slice(0, 5).map((member) => (
              <Avatar
                key={member.id}
                name={member.name}
                size="sm"
                className="ring-2 ring-white"
              />
            ))}
            {assignedMembers.length > 5 && (
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-xs font-medium flex items-center justify-center ring-2 ring-white">
                +{assignedMembers.length - 5}
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
