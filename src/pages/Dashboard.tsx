import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { QuestCard } from '@/components/QuestCard';
import { CoinDisplay } from '@/components/CoinDisplay';
import { ProgressBar } from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DailyQuestBanner } from '@/components/DailyQuestBanner';

export default function Dashboard() {
  const navigate = useNavigate();
  const { userProfile, quests } = useGame();
  const [showCompleted, setShowCompleted] = useState(false);

  // Скрываем пустые квесты
  const hiddenQuestIds = ['2', '3', '4']; // Сбереги 1000 рублей, Изучи основы инвестиций, Закрой свой первый кредит
  const visibleQuests = quests.filter(q => !hiddenQuestIds.includes(q.id));
  
  const displayedQuests = showCompleted 
    ? visibleQuests.filter(q => q.completed)
    : visibleQuests.filter(q => !q.completed);
  
  const xpToNextLevel = (userProfile.level * 200) - userProfile.xp;

  return (
    <div className="min-h-screen bg-game-bg pb-20">
      {/* Header */}
      <div className="gradient-hero text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{userProfile.avatar}</div>
            <div>
              <h2 className="font-bold text-lg">{userProfile.name}</h2>
              <p className="text-sm text-primary-foreground/80">Уровень {userProfile.level}</p>
            </div>
          </div>
          <CoinDisplay amount={userProfile.coins} size="lg" className="text-gold-foreground" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Прогресс до уровня {userProfile.level + 1}</span>
            <span>{userProfile.xp % 200}/{userProfile.level * 200} XP</span>
          </div>
          <ProgressBar
            value={userProfile.xp % 200}
            max={userProfile.level * 200}
            variant="gold"
          />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Daily Quest Banner */}
        <DailyQuestBanner />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center bg-card shadow-card">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-xl font-bold">{userProfile.completedQuests}</div>
            <div className="text-xs text-muted-foreground">Квестов</div>
          </Card>
          <Card className="p-4 text-center bg-card shadow-card">
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-xl font-bold">{userProfile.unlockedAchievements}</div>
            <div className="text-xs text-muted-foreground">Достижений</div>
          </Card>
          <Card className="p-4 text-center bg-card shadow-card">
            <div className="text-2xl mb-1">⭐</div>
            <div className="text-xl font-bold">{userProfile.level}</div>
            <div className="text-xs text-muted-foreground">Уровень</div>
          </Card>
        </div>

        {/* Quests with Filter */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Квесты</h3>
            <div className="flex gap-2">
              <Button 
                variant={!showCompleted ? "default" : "outline"} 
                size="sm" 
                onClick={() => setShowCompleted(false)}
              >
                Активные
              </Button>
              <Button 
                variant={showCompleted ? "default" : "outline"} 
                size="sm" 
                onClick={() => setShowCompleted(true)}
              >
                Завершенные
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            {displayedQuests.length > 0 ? (
              displayedQuests.map(quest => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onClick={() => navigate(`/quest/${quest.id}`)}
                />
              ))
            ) : (
              <Card className="p-6 text-center text-muted-foreground">
                {showCompleted ? 'Нет завершенных квестов' : 'Нет активных квестов'}
              </Card>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-20 flex-col gap-2"
            onClick={() => navigate('/achievements')}
          >
            <span className="text-2xl">🏆</span>
            <span className="text-sm">Достижения</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2"
            onClick={() => navigate('/shop')}
          >
            <span className="text-2xl">🏪</span>
            <span className="text-sm">Магазин</span>
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around h-16 max-w-2xl mx-auto">
          <Button variant="ghost" className="flex-col gap-1 h-full" onClick={() => navigate('/dashboard')}>
            <span className="text-xl">🏠</span>
            <span className="text-xs">Главная</span>
          </Button>
          <Button variant="ghost" className="flex-col gap-1 h-full" onClick={() => navigate('/quests')}>
            <span className="text-xl">🎯</span>
            <span className="text-xs">Квесты</span>
          </Button>
          <Button variant="ghost" className="flex-col gap-1 h-full" onClick={() => navigate('/achievements')}>
            <span className="text-xl">🏆</span>
            <span className="text-xs">Награды</span>
          </Button>
          <Button variant="ghost" className="flex-col gap-1 h-full" onClick={() => navigate('/profile')}>
            <span className="text-xl">👤</span>
            <span className="text-xs">Профиль</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
