import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function SafetyCushionQuest() {
  const navigate = useNavigate();
  const { completeQuest, unlockAchievement } = useGame();
  const [currentScreen, setCurrentScreen] = useState(1);
  const [userChoices, setUserChoices] = useState<Record<string, string>>({});
  const [monthlyExpense, setMonthlyExpense] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('100000');

  const totalScreens = 9;
  const progress = (currentScreen / totalScreens) * 100;

  const handleChoice = (screen: string, choice: string) => {
    setUserChoices({ ...userChoices, [screen]: choice });
  };

  const handleNext = () => {
    if (currentScreen < totalScreens) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const handleComplete = () => {
    completeQuest('safety-cushion');
    unlockAchievement('1');
    toast.success('Квест завершён! Получено: Бейдж «Накопитель», +75 FinCoins, +50 XP');
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  const calculateCushion = () => {
    const expense = parseFloat(monthlyExpense) || 0;
    return {
      min: expense * 1.5,
      optimal: expense * 3,
    };
  };

  const calculateInvestmentReturn = (amount: number, rate: number, months: number) => {
    return amount * (1 + rate / 100 / 12) ** months;
  };

  return (
    <div className="min-h-screen bg-game-bg pb-20">
      <div className="sticky top-0 bg-card border-b border-border z-10 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/quests')}>
            ←
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Финансовая подушка безопасности</h1>
            <Progress value={progress} className="mt-2 h-2" />
          </div>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto">
        {/* Screen 1: Interactive Story */}
        {currentScreen === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>🎭 Сценарий: Неожиданная ситуация</CardTitle>
              <CardDescription>Выбери свои действия</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">
                Ты студент/молодой профессионал. Зарплата задерживается на месяц. Что делать?
              </p>
              <div className="space-y-2">
                {[
                  { id: 'savings', text: '💰 Открыть накопления', tip: 'Лучший вариант! Именно для этого нужна подушка безопасности.' },
                  { id: 'friends', text: '🤝 Занять у друзей', tip: 'Можно, но создаёт долговые обязательства перед близкими.' },
                  { id: 'sell', text: '📱 Продать технику', tip: 'Крайняя мера, потеря имущества и стоимости.' },
                  { id: 'loan', text: '💳 Оформить кредит/микрозайм', tip: 'Худший вариант - высокие проценты и долговая яма!' },
                ].map((option) => (
                  <div key={option.id}>
                    <Button
                      variant={userChoices.screen1 === option.id ? 'default' : 'outline'}
                      className="w-full text-left justify-start"
                      onClick={() => handleChoice('screen1', option.id)}
                    >
                      {option.text}
                    </Button>
                    {userChoices.screen1 === option.id && (
                      <p className="text-sm text-muted-foreground mt-2 p-3 bg-muted rounded-md">
                        💡 {option.tip}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              {userChoices.screen1 && (
                <Button onClick={handleNext} className="w-full">
                  Далее →
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Screen 2: Educational Lesson */}
        {currentScreen === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>📚 Что такое финансовая подушка?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="font-semibold">🛡️ Финансовая подушка безопасности</p>
                  <p className="text-sm text-muted-foreground">
                    Запас денег, который помогает прожить без дохода 2–3 месяца
                  </p>
                </div>
                <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                  <p className="font-semibold">📊 Оптимальная сумма</p>
                  <p className="text-sm text-muted-foreground">
                    От 1,5x до 3x ежемесячных расходов
                  </p>
                </div>
                <div className="p-4 bg-gold/10 rounded-lg border border-gold/20">
                  <p className="font-semibold">🏦 Где держать?</p>
                  <p className="text-sm text-muted-foreground">
                    Лучше на отдельном банковском счёте или депозите с возможностью досрочного снятия
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <label className="text-sm font-medium">Твои ежемесячные расходы (₽):</label>
                <Input
                  type="number"
                  placeholder="Например: 30000"
                  value={monthlyExpense}
                  onChange={(e) => setMonthlyExpense(e.target.value)}
                  className="mt-2"
                />
                {monthlyExpense && (
                  <div className="mt-4 p-4 bg-card border rounded-lg">
                    <p className="text-sm font-semibold">Твоя подушка безопасности:</p>
                    <p className="text-lg">
                      Минимум: <span className="text-success font-bold">{calculateCushion().min.toLocaleString()} ₽</span>
                    </p>
                    <p className="text-lg">
                      Оптимально: <span className="text-primary font-bold">{calculateCushion().optimal.toLocaleString()} ₽</span>
                    </p>
                  </div>
                )}
              </div>
              <Button onClick={handleNext} className="w-full">
                Далее →
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Screen 3: Strategy Choice */}
        {currentScreen === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>💼 Выбери стратегию создания подушки</CardTitle>
              <CardDescription>У тебя 100 000 ₽ свободных средств</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { id: 'deposit', name: 'Депозит с пополнением', rate: '6-8%', risk: 'Низкий', access: 'Ограничен' },
                { id: 'auto', name: 'Копилка с автоотчислением', rate: '4-6%', risk: 'Минимальный', access: 'Средний' },
                { id: 'saving', name: 'Сберегательный счёт', rate: '3-5%', risk: 'Минимальный', access: 'Быстрый' },
                { id: 'invest', name: 'Инвестиционный портфель', rate: '10-15%', risk: 'Высокий', access: 'Возможны убытки' },
              ].map((option) => (
                <Button
                  key={option.id}
                  variant={userChoices.screen3 === option.id ? 'default' : 'outline'}
                  className="w-full justify-start h-auto p-4"
                  onClick={() => handleChoice('screen3', option.id)}
                >
                  <div className="text-left w-full">
                    <p className="font-semibold">{option.name}</p>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <Badge variant="secondary">{option.rate}</Badge>
                      <Badge variant={option.risk === 'Высокий' ? 'destructive' : 'outline'}>
                        Риск: {option.risk}
                      </Badge>
                      <Badge variant="outline">Доступ: {option.access}</Badge>
                    </div>
                  </div>
                </Button>
              ))}
              {userChoices.screen3 && (
                <div className="p-4 bg-muted rounded-md mt-4">
                  <p className="text-sm">
                    💡 Для подушки безопасности важна <strong>надёжность и доступность</strong>, а не максимальный доход!
                    Лучший выбор - сберегательный счёт с быстрым доступом.
                  </p>
                </div>
              )}
              {userChoices.screen3 && (
                <Button onClick={handleNext} className="w-full">
                  Далее →
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Screen 4: Calculator */}
        {currentScreen === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>🧮 Калькулятор накоплений</CardTitle>
              <CardDescription>Посмотри, как растут твои деньги</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Сумма (₽):</label>
                <Input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Депозит 7%', rate: 7 },
                  { name: 'Счёт 5%', rate: 5 },
                  { name: 'Инвестиции 12%', rate: 12 },
                  { name: 'Под матрасом 0%', rate: 0 },
                ].map((variant) => {
                  const result = calculateInvestmentReturn(parseFloat(investmentAmount) || 0, variant.rate, 12);
                  const profit = result - parseFloat(investmentAmount);
                  return (
                    <div key={variant.name} className="p-3 bg-card border rounded-lg">
                      <p className="text-sm font-semibold">{variant.name}</p>
                      <p className="text-lg font-bold text-primary">{result.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽</p>
                      <p className="text-xs text-success">+{profit.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽</p>
                    </div>
                  );
                })}
              </div>
              <div className="p-4 bg-primary/10 rounded-md">
                <p className="text-sm font-semibold">💡 Совет эксперта:</p>
                <p className="text-sm">Для подушки важна надежность, а не максимальный доход! Инфляция съест деньги под матрасом.</p>
              </div>
              <Button onClick={handleNext} className="w-full">
                Далее →
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Screen 5: Emergency Simulator */}
        {currentScreen === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>⚡ Срочно нужны деньги!</CardTitle>
              <CardDescription>Как быстро ты можешь их снять?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { id: 'deposit', text: 'Депозит', consequence: '❌ Потеряешь все накопленные проценты' },
                { id: 'saving', text: 'Сберегательный счёт', consequence: '✅ Снятие без потерь в любой момент' },
                { id: 'invest', text: 'Инвестиции', consequence: '⚠️ Можешь потерять до 20% из-за падения рынка' },
              ].map((option) => (
                <div key={option.id}>
                  <Button
                    variant={userChoices.screen5 === option.id ? 'default' : 'outline'}
                    className="w-full text-left justify-start"
                    onClick={() => handleChoice('screen5', option.id)}
                  >
                    {option.text}
                  </Button>
                  {userChoices.screen5 === option.id && (
                    <p className="text-sm text-muted-foreground mt-2 p-3 bg-muted rounded-md">
                      {option.consequence}
                    </p>
                  )}
                </div>
              ))}
              {userChoices.screen5 && (
                <Button onClick={handleNext} className="w-full">
                  Далее →
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Screen 6: Common Mistakes */}
        {currentScreen === 6 && (
          <Card>
            <CardHeader>
              <CardTitle>🚫 Ошибки новичков</CardTitle>
              <CardDescription>Где чаще всего теряют деньги?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { error: 'Держат всё в наличных', reason: 'Инфляция съедает покупательную способность (~5-7% в год)' },
                { error: 'Хранят подушку в инвестициях', reason: 'Рынок может упасть именно тогда, когда нужны деньги' },
                { error: 'Не разделяют подушку и личные финансы', reason: 'Легко потратить на спонтанные покупки' },
              ].map((item, index) => (
                <div key={index} className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="font-semibold text-destructive">❌ {item.error}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.reason}</p>
                </div>
              ))}
              <Button onClick={handleNext} className="w-full">
                Далее →
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Screen 7: Life Hacks */}
        {currentScreen === 7 && (
          <Card>
            <CardHeader>
              <CardTitle>💡 Лайфхаки от финансового тренера</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: '🤖', text: 'Делай накопления автоматическими', desc: 'Настрой автоперевод 10% зарплаты на отдельный счёт' },
                { icon: '💰', text: 'Пополняй резерв при любой дополнительной прибыли', desc: 'Премия, кэшбэк, подарок - всё в подушку!' },
                { icon: '🐢', text: 'Лучше медленно, но стабильно!', desc: 'Даже 1000₽ в месяц = 12000₽ в год + проценты' },
              ].map((tip, index) => (
                <div key={index} className="p-4 bg-success/10 border border-success/20 rounded-lg">
                  <p className="font-semibold">
                    {tip.icon} {tip.text}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{tip.desc}</p>
                </div>
              ))}
              <Button onClick={handleNext} className="w-full">
                Далее →
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Screen 8: Summary and Reward */}
        {currentScreen === 8 && (
          <Card>
            <CardHeader>
              <CardTitle>🎉 Поздравляем!</CardTitle>
              <CardDescription>Ты создал свою первую подушку безопасности</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-6">
                <div className="text-6xl mb-4">🛡️</div>
                <h3 className="text-xl font-bold mb-2">Квест завершён!</h3>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-gold/10 border border-gold/20 rounded-lg flex items-center gap-3">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <p className="font-semibold">Бейдж «Накопитель»</p>
                    <p className="text-sm text-muted-foreground">Разблокировано достижение</p>
                  </div>
                </div>
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-3">
                  <span className="text-2xl">💰</span>
                  <div>
                    <p className="font-semibold">+75 FinCoins</p>
                    <p className="text-sm text-muted-foreground">Награда за квест</p>
                  </div>
                </div>
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg flex items-center gap-3">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="font-semibold">+50 XP</p>
                    <p className="text-sm text-muted-foreground">Опыт получен</p>
                  </div>
                </div>
              </div>
              <Button onClick={handleNext} className="w-full">
                Далее →
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Screen 9: Final Push */}
        {currentScreen === 9 && (
          <Card>
            <CardHeader>
              <CardTitle>🚀 Твоя суперспособность</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-primary/20 to-success/20 rounded-lg text-center">
                <p className="text-lg font-semibold mb-2">
                  Не забывай: пополнить подушку — твоя суперспособность!
                </p>
                <p className="text-muted-foreground">
                  В следующий раз это тебя спасёт. 💪
                </p>
              </div>
              <div className="space-y-2">
                <Button onClick={handleComplete} className="w-full" size="lg">
                  Вернуться в главное меню
                </Button>
                <Button onClick={() => navigate('/quests')} variant="outline" className="w-full">
                  Смотреть другие квесты
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
