import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function Achievements() {
  const navigate = useNavigate();
  const { achievements } = useGame();

  return (
    <div className="min-h-screen bg-game-bg pb-20">
      <div className="sticky top-0 bg-card border-b border-border z-10 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            ←
          </Button>
          <h1 className="text-2xl font-bold">Достижения</h1>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={cn(
                'p-6 text-center transition-all duration-300',
                achievement.unlocked
                  ? 'shadow-achievement bg-gold/10 border-gold'
                  : 'bg-achievement-locked border-border opacity-60'
              )}
            >
              <div className={cn(
                'text-5xl mb-3',
                !achievement.unlocked && 'grayscale'
              )}>
                {achievement.icon}
              </div>
              <h3 className={cn(
                'font-bold text-sm mb-1',
                achievement.unlocked && 'text-gold-foreground'
              )}>
                {achievement.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-2">
                {achievement.description}
              </p>
              {achievement.unlocked && achievement.unlockedAt && (
                <p className="text-xs text-success">
                  ✓ Открыто
                </p>
              )}
              {!achievement.unlocked && (
                <p className="text-xs text-muted-foreground">
                  🔒 Заблокировано
                </p>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-card">
            <span className="text-sm text-muted-foreground">Открыто:</span>
            <span className="font-bold">
              {achievements.filter(a => a.unlocked).length}/{achievements.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
