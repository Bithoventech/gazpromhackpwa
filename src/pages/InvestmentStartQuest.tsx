import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { useGame } from '@/contexts/GameContext';
import { ArrowLeft, TrendingUp, Shield, Wallet, Award } from 'lucide-react';
import { toast } from 'sonner';

const InvestmentStartQuest = () => {
  const navigate = useNavigate();
  const { completeQuest } = useGame();
  const [currentScreen, setCurrentScreen] = useState(1);
  
  // User choices
  const [capital, setCapital] = useState('100000');
  const [riskLevel, setRiskLevel] = useState('medium');
  const [depositPercent, setDepositPercent] = useState(50);
  const [isjPercent, setIsjPercent] = useState(30);
  const [etfPercent, setEtfPercent] = useState(20);
  const [quizAnswers, setQuizAnswers] = useState({ q1: '', q2: '', q3: '' });

  const handleComplete = () => {
    completeQuest('investment-start');
    toast.success('Квест завершен! +100 монет, +60 XP');
    navigate('/quests');
  };

  const nextScreen = () => setCurrentScreen(prev => prev + 1);
  const prevScreen = () => setCurrentScreen(prev => prev - 1);

  const totalPercent = depositPercent + isjPercent + etfPercent;

  const calculateProjection = () => {
    const amount = parseFloat(capital) || 100000;
    const depositReturn = (depositPercent / 100) * amount * 0.08;
    const isjReturn = (isjPercent / 100) * amount * 0.05;
    const etfReturn = (etfPercent / 100) * amount * 0.15;
    return {
      oneYear: depositReturn + isjReturn + etfReturn,
      threeYears: (depositReturn + isjReturn + etfReturn) * 3.2
    };
  };

  const projection = calculateProjection();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/quests')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад к квестам
        </Button>

        {/* Screen 1: Introduction */}
        {currentScreen === 1 && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl">📈 Инвестиционный старт</CardTitle>
              <CardDescription className="text-lg">
                Управляй будущим сегодня!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Твоя цель — накопить на мечту! Испытай себя в роли начинающего инвестора. 
                Сможешь ли ты приумножить капитал без риска для будущего?
              </p>
              <Button onClick={nextScreen} className="w-full">
                Начать квест
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Screen 2: Initial Survey */}
        {currentScreen === 2 && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Хочешь ли ты получать пассивный доход?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="capital">Какая сумма свободных средств у тебя есть?</Label>
                <Input
                  id="capital"
                  type="number"
                  value={capital}
                  onChange={(e) => setCapital(e.target.value)}
                  placeholder="100000"
                  min="10000"
                  max="1000000"
                />
                <p className="text-sm text-muted-foreground">От 10 000 ₽ до 1 000 000 ₽</p>
              </div>

              <div className="space-y-3">
                <Label>Готов ли ты рисковать ради высокой доходности?</Label>
                <RadioGroup value={riskLevel} onValueChange={setRiskLevel}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high" className="font-normal cursor-pointer">
                      Максимум — хочу расти быстро
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium" className="font-normal cursor-pointer">
                      Средний риск — предпочитаю баланс
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low" className="font-normal cursor-pointer">
                      Минимально — главное стабильность
                    </Label>
                  </div>
                </RadioGroup>
                {riskLevel === 'medium' && (
                  <p className="text-sm text-primary">💡 Для новичков баланс — оптимальный выбор!</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={prevScreen}>Назад</Button>
                <Button onClick={nextScreen} className="flex-1">Продолжить</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Screen 3: Educational - Investment Tools */}
        {currentScreen === 3 && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Что такое ИСЖ, ETF, депозит?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-card">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">ИСЖ (Инвестиционное страхование жизни)</h3>
                      <p className="text-sm text-muted-foreground">
                        Страховая программа + инвестиции. Доход — не гарантирован, но есть защита жизни.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-card">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">ETF (Биржевой фонд)</h3>
                      <p className="text-sm text-muted-foreground">
                        Фондовый инструмент, покупаешь долю индексов. Можно быстро купить/продать, простая диверсификация.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-card">
                  <div className="flex items-start gap-3">
                    <Wallet className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Депозит</h3>
                      <p className="text-sm text-muted-foreground">
                        Классический счет, гарантированный %, быстрая ликвидность.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">📊 Средний рост за 3 года:</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Депозит: ~24% (8% годовых)</li>
                  <li>• ИСЖ: ~15% (5% годовых с риском)</li>
                  <li>• ETF: ~45% (15% годовых с волатильностью)</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={prevScreen}>Назад</Button>
                <Button onClick={nextScreen} className="flex-1">Продолжить</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Screen 4: Portfolio Builder */}
        {currentScreen === 4 && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Собери портфель мечты</CardTitle>
              <CardDescription>
                Ты получил бонус — {parseInt(capital).toLocaleString('ru-RU')} ₽. Размести их между инструментами:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Депозит</Label>
                    <span className="text-sm font-medium">{depositPercent}%</span>
                  </div>
                  <Slider
                    value={[depositPercent]}
                    onValueChange={(val) => setDepositPercent(val[0])}
                    max={100}
                    step={5}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>ИСЖ</Label>
                    <span className="text-sm font-medium">{isjPercent}%</span>
                  </div>
                  <Slider
                    value={[isjPercent]}
                    onValueChange={(val) => setIsjPercent(val[0])}
                    max={100}
                    step={5}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>ETF</Label>
                    <span className="text-sm font-medium">{etfPercent}%</span>
                  </div>
                  <Slider
                    value={[etfPercent]}
                    onValueChange={(val) => setEtfPercent(val[0])}
                    max={100}
                    step={5}
                  />
                </div>

                <div className={`p-3 rounded-lg ${totalPercent === 100 ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                  <p className="text-sm font-medium">
                    Итого: {totalPercent}% {totalPercent !== 100 && '(должно быть 100%)'}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg space-y-2">
                <p className="font-medium">Прогноз роста:</p>
                <p className="text-sm">Через 1 год: +{projection.oneYear.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽</p>
                <p className="text-sm">Через 3 года: +{projection.threeYears.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽</p>
              </div>

              {etfPercent <= 30 && depositPercent >= 40 && (
                <p className="text-sm text-primary p-3 bg-primary/10 rounded-lg">
                  💡 Идеальный портфель начинающего — до 30% в риске, остальное — в стабильных инструментах.
                </p>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={prevScreen}>Назад</Button>
                <Button onClick={nextScreen} className="flex-1" disabled={totalPercent !== 100}>
                  Продолжить
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Screen 5: Quiz */}
        {currentScreen === 5 && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Три ошибки инвестора</CardTitle>
              <CardDescription>Проверь свои знания!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base">Что делать, если рынок падает?</Label>
                <RadioGroup value={quizAnswers.q1} onValueChange={(val) => setQuizAnswers({...quizAnswers, q1: val})}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="a" id="q1a" />
                    <Label htmlFor="q1a" className="font-normal cursor-pointer">А) Срочно продавать</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="b" id="q1b" />
                    <Label htmlFor="q1b" className="font-normal cursor-pointer">Б) Дождаться восстановления</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="c" id="q1c" />
                    <Label htmlFor="q1c" className="font-normal cursor-pointer">В) Инвестировать еще больше</Label>
                  </div>
                </RadioGroup>
                {quizAnswers.q1 === 'b' && (
                  <p className="text-sm text-primary">✅ Верно! Профессионалы держат активы и ждут восстановления.</p>
                )}
                {quizAnswers.q1 && quizAnswers.q1 !== 'b' && (
                  <p className="text-sm text-destructive">❌ Паника — враг инвестора. Лучше дождаться восстановления.</p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-base">Стоит ли вкладывать весь капитал в одну компанию?</Label>
                <RadioGroup value={quizAnswers.q2} onValueChange={(val) => setQuizAnswers({...quizAnswers, q2: val})}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="a" id="q2a" />
                    <Label htmlFor="q2a" className="font-normal cursor-pointer">А) Да — так быстрее вырастет</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="b" id="q2b" />
                    <Label htmlFor="q2b" className="font-normal cursor-pointer">Б) Нет — нужен баланс и диверсификация</Label>
                  </div>
                </RadioGroup>
                {quizAnswers.q2 === 'b' && (
                  <p className="text-sm text-primary">✅ Верно! Диверсификация снижает риски.</p>
                )}
                {quizAnswers.q2 && quizAnswers.q2 !== 'b' && (
                  <p className="text-sm text-destructive">❌ Вася вложил все в одну акцию — через месяц потерял половину...</p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-base">Где узнать реальный рейтинг фонда?</Label>
                <RadioGroup value={quizAnswers.q3} onValueChange={(val) => setQuizAnswers({...quizAnswers, q3: val})}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="a" id="q3a" />
                    <Label htmlFor="q3a" className="font-normal cursor-pointer">А) На сайте банка</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="b" id="q3b" />
                    <Label htmlFor="q3b" className="font-normal cursor-pointer">Б) В независимых рейтингах ЦБ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="c" id="q3c" />
                    <Label htmlFor="q3c" className="font-normal cursor-pointer">В) Среди отзывов в соцсетях</Label>
                  </div>
                </RadioGroup>
                {quizAnswers.q3 === 'b' && (
                  <p className="text-sm text-primary">✅ Верно! Независимые источники дают объективную информацию.</p>
                )}
                {quizAnswers.q3 && quizAnswers.q3 !== 'b' && (
                  <p className="text-sm text-destructive">❌ Всегда проверяй информацию в независимых источниках.</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={prevScreen}>Назад</Button>
                <Button 
                  onClick={nextScreen} 
                  className="flex-1"
                  disabled={!quizAnswers.q1 || !quizAnswers.q2 || !quizAnswers.q3}
                >
                  Продолжить
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Screen 6: Summary */}
        {currentScreen === 6 && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Симуляция завершена!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg text-center">
                <p className="text-lg font-semibold text-primary mb-2">
                  Поздравляем! 🎉
                </p>
                <p className="text-muted-foreground">
                  Твой инвестиционный портфель показывает рост +12% за год!
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Краткое summary ошибок:</p>
                <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                  <li>Инвестировать лучше регулярно, а не разово</li>
                  <li>Не гнаться за хайпом и модными трендами</li>
                  <li>Всегда проверяй лицензии и рейтинги</li>
                  <li>Диверсификация — твой лучший друг</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={prevScreen}>Назад</Button>
                <Button onClick={nextScreen} className="flex-1">Продолжить</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Screen 7: Rewards */}
        {currentScreen === 7 && (
          <Card className="animate-fade-in">
            <CardHeader className="text-center">
              <Award className="h-16 w-16 mx-auto text-primary mb-4" />
              <CardTitle className="text-2xl">Квест завершен!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="p-6 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg">
                  <p className="text-4xl mb-2">🏆</p>
                  <p className="font-semibold text-lg">Бейдж "Инвестор-Новичок"</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-primary">+100</p>
                    <p className="text-sm text-muted-foreground">FinCoins</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-primary">+60</p>
                    <p className="text-sm text-muted-foreground">XP</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-center">
                  💡 Твой первый инвестиционный портфель успешно собран! Следи за рынком и возвращайся за новыми знаниями!
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/quests')} className="flex-1">
                  Вернуться в меню
                </Button>
                <Button onClick={handleComplete} className="flex-1">
                  Завершить квест
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress indicator */}
        <div className="mt-6 flex justify-center gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map((screen) => (
            <div
              key={screen}
              className={`h-2 w-2 rounded-full transition-colors ${
                currentScreen === screen ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestmentStartQuest;
