import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';

export default function Splash() {
  const navigate = useNavigate();
  const { hasCompletedOnboarding } = useGame();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasCompletedOnboarding) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [hasCompletedOnboarding, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero">
      <div className="text-center animate-fade-in">
        <div className="text-6xl mb-6 animate-bounce-soft">💰</div>
        <h1 className="text-4xl font-bold text-primary-foreground mb-4">FinQuest</h1>
        <p className="text-lg text-primary-foreground/90 mb-8">Твоё финансовое приключение</p>
        <div className="flex gap-2 justify-center">
          <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse-soft" />
          <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse-soft delay-100" />
          <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse-soft delay-200" />
        </div>
      </div>
    </div>
  );
}
