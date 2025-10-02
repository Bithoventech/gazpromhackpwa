import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coins, TrendingUp, Trophy } from 'lucide-react';

interface ExposureAnimationProps {
  scammerName: string;
  scammerRole: string;
  scammerAvatar?: string;
  coinsEarned: number;
  xpEarned: number;
  onContinue: () => void;
}

export const ExposureAnimation = ({
  scammerName,
  scammerRole,
  scammerAvatar,
  coinsEarned,
  xpEarned,
  onContinue,
}: ExposureAnimationProps) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      <Card className="max-w-md w-full p-6 space-y-6 animate-scale-in">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">🎉</div>
          
          <div>
            <h2 className="text-2xl font-bold mb-2">Мошенник разоблачён!</h2>
            <p className="text-muted-foreground">
              Вы успешно раскрыли схему {scammerName}
            </p>
          </div>

          {scammerAvatar && (
            <div className="flex justify-center">
              <div className="relative">
                <img 
                  src={scammerAvatar} 
                  alt={scammerName}
                  className="w-32 h-32 rounded-full border-4 border-destructive object-cover"
                />
                <Badge 
                  variant="destructive" 
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2"
                >
                  РАЗОБЛАЧЕН
                </Badge>
              </div>
            </div>
          )}

          <Card className="p-4 bg-muted">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium">FinCoins</span>
                </div>
                <span className="text-xl font-bold text-yellow-500">+{coinsEarned}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Опыт</span>
                </div>
                <span className="text-xl font-bold text-blue-500">+{xpEarned} XP</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-purple-500" />
                  <span className="font-medium">Бейдж</span>
                </div>
                <Badge variant="secondary">Детектив дня</Badge>
              </div>
            </div>
          </Card>
        </div>

        <Button 
          size="lg" 
          className="w-full"
          onClick={onContinue}
        >
          Продолжить
        </Button>
      </Card>
    </div>
  );
};