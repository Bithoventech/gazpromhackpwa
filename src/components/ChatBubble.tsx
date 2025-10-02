import { cn } from '@/lib/utils';
import { Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const parseMarkdown = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
  onFlag?: () => void;
  isFlagged?: boolean;
}

export const ChatBubble = ({ message, isUser, timestamp, onFlag, isFlagged }: ChatBubbleProps) => {
  return (
    <div className={cn('flex gap-2 mb-4', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn('max-w-[80%] rounded-2xl px-4 py-2 relative group', 
        isUser 
          ? 'bg-primary text-primary-foreground rounded-br-sm' 
          : 'bg-muted text-foreground rounded-bl-sm'
      )}>
        <div className="text-sm whitespace-pre-wrap">
          {parseMarkdown(message)}
        </div>
        {timestamp && (
          <p className="text-xs opacity-70 mt-1">
            {new Date(timestamp).toLocaleTimeString('ru-RU', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        )}
        
        {!isUser && onFlag && (
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              'absolute -right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity',
              isFlagged && 'opacity-100 text-destructive'
            )}
            onClick={onFlag}
          >
            <Flag className="w-4 h-4" fill={isFlagged ? 'currentColor' : 'none'} />
          </Button>
        )}
      </div>
    </div>
  );
};