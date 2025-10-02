import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Flag, Trophy, Clock } from "lucide-react";

const screens = [
  {
    icon: Zap,
    title: "Разоблачи нейроафериста!",
    description: "Мошенник пишет вам и пытается вас обмануть! Будьте внимательны к каждой детали разговора."
  },
  {
    icon: Flag,
    title: "Флагайте подозрительные моменты",
    description: "Чем острее вопросы — тем быстрее мошенник начинает \"защищаться\", выдаёт дефенс-скрипты. Отмечайте подозрительные сообщения флагами!"
  },
  {
    icon: Trophy,
    title: "Победа и награда!",
    description: "Если нейроаферист признался – вы побеждаете и получаете награду! Но даже после вы можете с ним побеседовать и узнать, как он пришел к такой жизни."
  },
  {
    icon: Clock,
    title: "Новый день — новый вызов!",
    description: "После каждого успешного разоблачения — мошенники обновляют паттерны и становятся умнее. В 00:00 появляется новый нейроаферист и новый шанс на награду! Чем быстрее вы выводите афериста на чистую воду - тем больше награда и выше ваш рейтинг!"
  }
];

export const DailyQuestOnboarding = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(0);

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      localStorage.setItem('daily_quest_onboarding_completed', 'true');
      // Don't navigate, just close the onboarding
      window.location.reload();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('daily_quest_onboarding_completed', 'true');
    window.location.reload();
  };

  const screen = screens[currentScreen];
  const Icon = screen.icon;

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 space-y-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="w-10 h-10 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{screen.title}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {screen.description}
            </p>
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          {screens.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentScreen
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {currentScreen < screens.length - 1 && (
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="flex-1"
            >
              Пропустить
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1"
          >
            {currentScreen < screens.length - 1 ? "Далее" : "Начать"}
          </Button>
        </div>
      </Card>
    </div>
  );
};
