import { cn } from '@/lib/utils';

interface CoinDisplayProps {
  amount: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CoinDisplay({ amount, className, size = 'md' }: CoinDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl font-bold',
  };

  return (
    <div className={cn('flex items-center gap-1.5', sizeClasses[size], className)}>
      <span className="text-gold">🪙</span>
      <span className="font-semibold">{amount.toLocaleString()}</span>
    </div>
  );
}
