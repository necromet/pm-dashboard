import { cn } from '../../utils/helpers';

const colorVariants = {
  default: 'bg-slate-100 text-slate-700',
  gray: 'bg-gray-100 text-gray-700',
  blue: 'bg-blue-100 text-blue-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  purple: 'bg-purple-100 text-purple-700',
  orange: 'bg-orange-100 text-orange-700',
  cyan: 'bg-cyan-100 text-cyan-700',
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-700',
};

const sizeVariants = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs px-2 py-0.5',
  lg: 'text-sm px-2.5 py-1',
};

export default function Badge({
  children,
  color = 'default',
  size = 'md',
  className,
  ...props
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium whitespace-nowrap',
        colorVariants[color] || colorVariants.default,
        sizeVariants[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
