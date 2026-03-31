import { cn } from '../../utils/helpers';

export default function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-slate-200 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-6 py-4 border-b border-slate-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({ children, className, ...props }) {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'flex items-center px-6 py-4 border-t border-slate-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
