import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  variant?: 'primary' | 'success' | 'gold';
  showLabel?: boolean;
}

export function ProgressBar({ value, max = 100, className, variant = 'primary', showLabel = false }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const variantClasses = {
    primary: 'gradient-primary',
    success: 'gradient-success',
    gold: 'gradient-gold',
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <div
          className={cn('h-full transition-all duration-500 ease-out', variantClasses[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-xs text-muted-foreground mt-1 text-right">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}
