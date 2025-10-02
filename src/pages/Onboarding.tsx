import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';

const screens = [
  {
    icon: '🎯',
    title: 'Добро пожаловать в FinQuest!',
    description: 'Изучай финансовую грамотность через увлекательные квесты и задания',
  },
  {
    icon: '💎',
    title: 'Зарабатывай награды',
    description: 'Выполняй задания, получай монеты и открывай достижения',
  },
  {
    icon: '📈',
    title: 'Развивайся и расти',
    description: 'Повышай свой уровень и становись мастером финансов',
  },
];

export default function Onboarding() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const navigate = useNavigate();
  const { completeOnboarding } = useGame();

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      completeOnboarding();
      navigate('/dashboard');
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    navigate('/dashboard');
  };

  const screen = screens[currentScreen];

  return (
    <div className="min-h-screen flex flex-col bg-game-bg">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center animate-fade-in">
          <div className="text-7xl mb-8 animate-bounce-soft">{screen.icon}</div>
          <h1 className="text-3xl font-bold mb-4">{screen.title}</h1>
          <p className="text-lg text-muted-foreground mb-12">{screen.description}</p>

          <div className="flex gap-3 justify-center mb-8">
            {screens.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentScreen
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-3">
        <Button
          onClick={handleNext}
          className="w-full h-12 text-lg gradient-primary"
          size="lg"
        >
          {currentScreen < screens.length - 1 ? 'Далее' : 'Начать'}
        </Button>
        {currentScreen < screens.length - 1 && (
          <Button
            onClick={handleSkip}
            variant="ghost"
            className="w-full"
          >
            Пропустить
          </Button>
        )}
      </div>
    </div>
  );
}
