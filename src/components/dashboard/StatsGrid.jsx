import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card, { CardBody } from '../ui/Card';
import { cn } from '../../utils/helpers';

const iconColors = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  red: 'bg-red-100 text-red-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600',
};

function TrendIndicator({ trend, trendValue }) {
  if (trend === 'up') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
        <TrendingUp className="h-3 w-3" />
        {trendValue}
      </span>
    );
  }
  if (trend === 'down') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
        <TrendingDown className="h-3 w-3" />
        {trendValue}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
      <Minus className="h-3 w-3" />
      {trendValue || '—'}
    </span>
  );
}

export default function StatsGrid({ stats = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardBody className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <TrendIndicator trend={stat.trend} trendValue={stat.trendValue} />
            </div>
            {stat.icon && (
              <div
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                  iconColors[stat.iconColor || 'blue']
                )}
              >
                <stat.icon className="h-5 w-5" />
              </div>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
