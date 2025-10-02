import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from './ProgressBar';
import { CoinDisplay } from './CoinDisplay';
import { cn } from '@/lib/utils';
import type { Quest } from '@/contexts/GameContext';

interface QuestCardProps {
  quest: Quest;
  onClick?: () => void;
}

const difficultyColors = {
  easy: 'bg-success text-success-foreground',
  medium: 'bg-primary text-primary-foreground',
  hard: 'bg-destructive text-destructive-foreground',
};

const categoryLabels = {
  budgeting: 'Бюджет',
  saving: 'Накопления',
  investing: 'Инвестиции',
  debt: 'Кредиты',
};

export function QuestCard({ quest, onClick }: QuestCardProps) {
  return (
    <Card className={cn(
      'p-4 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer',
      'bg-quest-card border-border',
      quest.completed && 'opacity-60'
    )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="text-4xl flex-shrink-0">{quest.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-base leading-tight">{quest.title}</h3>
            {quest.completed && (
              <span className="text-success text-xl flex-shrink-0">✓</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-3">{quest.description}</p>
          
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="outline" className={difficultyColors[quest.difficulty]}>
              {quest.difficulty === 'easy' ? 'Легко' : quest.difficulty === 'medium' ? 'Средне' : 'Сложно'}
            </Badge>
            <Badge variant="secondary">
              {categoryLabels[quest.category]}
            </Badge>
          </div>

          {!quest.completed && (
            <ProgressBar value={quest.progress} variant="primary" showLabel className="mb-3" />
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm">
              <CoinDisplay amount={quest.reward} size="sm" />
              <span className="text-muted-foreground">+{quest.xpReward} XP</span>
            </div>
            {!quest.completed && (
              <Button size="sm" variant="default">
                Начать
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
