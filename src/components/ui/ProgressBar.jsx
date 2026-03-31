import { cn } from '../../utils/helpers';

function getBarColor(percentage) {
  if (percentage >= 80) return 'bg-green-500';
  if (percentage >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
}

function getTextColor(percentage) {
  if (percentage >= 80) return 'text-green-700';
  if (percentage >= 50) return 'text-yellow-700';
  return 'text-red-700';
}

const sizeVariants = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

export default function ProgressBar({
  value = 0,
  label,
  showPercentage = true,
  size = 'md',
  color,
  className,
}) {
  const percentage = Math.min(Math.max(value, 0), 100);
  const barColor = color || getBarColor(percentage);
  const textColor = getTextColor(percentage);

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-xs font-medium text-slate-600">{label}</span>
          )}
          {showPercentage && (
            <span className={cn('text-xs font-semibold', textColor)}>
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full bg-slate-200 rounded-full overflow-hidden',
          sizeVariants[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-in-out',
            barColor
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
