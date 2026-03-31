import { cn } from '../../utils/helpers';

const sizeVariants = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-slate-300',
  busy: 'bg-red-500',
  away: 'bg-yellow-500',
};

const statusDotSizes = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-3.5 h-3.5',
};

const avatarColors = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
  'bg-cyan-100 text-cyan-700',
  'bg-indigo-100 text-indigo-700',
];

function getColorForName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export default function Avatar({
  initials = '',
  name = '',
  size = 'md',
  status,
  className,
  ...props
}) {
  const displayInitials =
    initials ||
    (name
      ? name
          .split(' ')
          .map((w) => w[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : '?');
  const colorClass = name ? getColorForName(name) : 'bg-slate-100 text-slate-700';

  return (
    <div className={cn('relative inline-flex shrink-0', className)} {...props}>
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-semibold',
          sizeVariants[size],
          colorClass
        )}
      >
        {displayInitials}
      </div>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-white',
            statusColors[status] || statusColors.offline,
            statusDotSizes[size]
          )}
        />
      )}
    </div>
  );
}
