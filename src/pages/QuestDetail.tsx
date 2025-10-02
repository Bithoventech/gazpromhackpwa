import { useNavigate, useParams } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ProgressBar';
import { CoinDisplay } from '@/components/CoinDisplay';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

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

export default function QuestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quests, updateQuest, completeQuest } = useGame();
  const quest = quests.find(q => q.id === id);
  const [localProgress, setLocalProgress] = useState(quest?.progress || 0);

  if (!quest) {
    return (
      <div className="min-h-screen bg-game-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Квест не найден</p>
          <Button onClick={() => navigate('/quests')}>
            Вернуться к квестам
          </Button>
        </div>
      </div>
    );
  }

  const handleUpdateProgress = () => {
    updateQuest(quest.id, localProgress);
    if (localProgress === 100) {
      completeQuest(quest.id);
      setTimeout(() => navigate('/dashboard'), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-game-bg pb-20">
      <div className="sticky top-0 bg-card border-b border-border z-10 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            ←
          </Button>
          <h1 className="text-xl font-bold">Детали квеста</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Card className="p-6 shadow-card bg-quest-card">
          <div className="text-center mb-6">
            <div className="text-7xl mb-4">{quest.icon}</div>
            <h2 className="text-2xl font-bold mb-2">{quest.title}</h2>
            <p className="text-muted-foreground">{quest.description}</p>
          </div>

          <div className="flex gap-2 justify-center mb-6">
            <Badge className={difficultyColors[quest.difficulty]}>
              {quest.difficulty === 'easy' ? 'Легко' : quest.difficulty === 'medium' ? 'Средне' : 'Сложно'}
            </Badge>
            <Badge variant="secondary">
              {categoryLabels[quest.category]}
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="text-sm font-medium">Награда</span>
              <CoinDisplay amount={quest.reward} size="md" />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="text-sm font-medium">Опыт</span>
              <span className="font-semibold">+{quest.xpReward} XP</span>
            </div>
          </div>
        </Card>

        {!quest.completed && (
          <Card className="p-6 shadow-card bg-quest-card">
            <h3 className="font-bold mb-4">Прогресс выполнения</h3>
            <ProgressBar value={quest.progress} variant="primary" showLabel className="mb-6" />
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Обновить прогресс: {localProgress}%
                </label>
                <Slider
                  value={[localProgress]}
                  onValueChange={(value) => setLocalProgress(value[0])}
                  max={100}
                  step={10}
                  className="mb-4"
                />
              </div>
              
              <Button
                onClick={handleUpdateProgress}
                className="w-full gradient-primary"
                size="lg"
              >
                {localProgress === 100 ? 'Завершить квест' : 'Сохранить прогресс'}
              </Button>
            </div>
          </Card>
        )}

        {quest.completed && (
          <Card className="p-6 shadow-card bg-success/10 border-success">
            <div className="text-center">
              <div className="text-5xl mb-3">✓</div>
              <h3 className="font-bold text-lg mb-2 text-success">Квест завершён!</h3>
              <p className="text-sm text-muted-foreground">
                Поздравляем! Вы получили награду.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
