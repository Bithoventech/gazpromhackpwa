import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const AntiFraudQuest = () => {
  const navigate = useNavigate();
  const { completeQuest, updateQuest } = useGame();
  const [currentScreen, setCurrentScreen] = useState(1);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [selectedFlags, setSelectedFlags] = useState<string[]>([]);
  const totalScreens = 6;

  const handleAnswer = (isCorrect: boolean, feedback: string, answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    if (isCorrect) {
      setScore(prev => prev + 1);
      toast.success('Правильно! ' + feedback);
    } else {
      toast.error('Ошибка! ' + feedback);
    }
    
    setTimeout(() => {
      const nextScreen = currentScreen + 1;
      setCurrentScreen(nextScreen);
      setSelectedAnswer(null);
      updateQuest('antifraud', (nextScreen / totalScreens) * 100);
    }, 2000);
  };

  const toggleFlag = (flag: string) => {
    setSelectedFlags(prev => 
      prev.includes(flag) 
        ? prev.filter(f => f !== flag)
        : [...prev, flag]
    );
  };

  const handleComplete = () => {
    completeQuest('antifraud');
    toast.success('Квест завершён! +75 монет, +60 XP', {
      description: 'Ты теперь на шаг впереди мошенников!',
    });
    navigate('/quests');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 1:
        return (
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-8 h-8 text-primary" />
                <Badge variant="outline">Введение</Badge>
              </div>
              <CardTitle className="text-2xl">Ты — финансовый детектив!</CardTitle>
              <CardDescription className="text-base">
                Сегодня тебе предстоит разоблачить настоящих мошенников, которые атакуют клиентов банка разными способами.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-primary/10 p-6 rounded-lg">
                <p className="text-lg font-medium mb-4">Твоя миссия:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Распознать фишинговые атаки</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Раскрыть звонки лже-сотрудников</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Найти признаки мошенничества</span>
                  </li>
                </ul>
              </div>
              <Button onClick={() => setCurrentScreen(2)} size="lg" className="w-full">
                Начать расследование
              </Button>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="border-destructive/20">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-8 h-8 text-destructive" />
                <Badge variant="destructive">Ситуация №1</Badge>
              </div>
              <CardTitle>Фишинговое SMS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-4 rounded-lg border-l-4 border-destructive">
                <p className="font-mono text-sm">
                  📱 "Ваш счёт заблокирован! Срочно подтвердите данные: gazpromo-банк.ru/secure"
                </p>
              </div>
              
              <p className="text-lg font-medium">Что будешь делать?</p>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className={`w-full justify-start h-auto p-4 text-left transition-all ${
                    selectedAnswer === 0 ? 'border-destructive bg-destructive/10' : ''
                  }`}
                  onClick={() => handleAnswer(false, 'Никогда не переходи по ссылкам из подозрительных сообщений!', 0)}
                  disabled={selectedAnswer !== null}
                >
                  Перейти по ссылке и ввести данные
                </Button>
                <Button
                  variant="outline"
                  className={`w-full justify-start h-auto p-4 text-left transition-all ${
                    selectedAnswer === 1 ? 'border-destructive bg-destructive/10' : ''
                  }`}
                  onClick={() => handleAnswer(false, 'Номер из SMS может быть поддельным. Используй официальные контакты!', 1)}
                  disabled={selectedAnswer !== null}
                >
                  Позвонить в банк по номеру из SMS
                </Button>
                <Button
                  variant="outline"
                  className={`w-full justify-start h-auto p-4 text-left transition-all ${
                    selectedAnswer === 2 ? 'border-green-500 bg-green-500/10 animate-pulse' : ''
                  }`}
                  onClick={() => handleAnswer(true, 'Никогда не переходи по ссылкам из подозрительных сообщений.', 2)}
                  disabled={selectedAnswer !== null}
                >
                  {selectedAnswer === 2 && <CheckCircle className="w-5 h-5 text-green-500 mr-2" />}
                  Игнорировать сообщение и проверить счёт в приложении
                </Button>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">💡 Как выглядит настоящий адрес банка?</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Нет опечаток в названии домена</li>
                  <li>✓ Используется HTTPS протокол</li>
                  <li>✓ Адрес совпадает с официальным сайтом</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="border-destructive/20">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-8 h-8 text-destructive" />
                <Badge variant="destructive">Ситуация №2</Badge>
              </div>
              <CardTitle>Звонок "от службы безопасности"</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-4 rounded-lg border-l-4 border-destructive">
                <p className="font-mono text-sm">
                  📞 "Мы из службы безопасности банка. Требуется срочно подтвердить SMS-код для разблокировки!"
                </p>
              </div>
              
              <p className="text-lg font-medium">Твои действия:</p>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className={`w-full justify-start h-auto p-4 text-left transition-all ${
                    selectedAnswer === 0 ? 'border-destructive bg-destructive/10' : ''
                  }`}
                  onClick={() => handleAnswer(false, 'Никогда не сообщай коды сотрудникам, даже если звонок кажется реальным!', 0)}
                  disabled={selectedAnswer !== null}
                >
                  Назвать код по телефону
                </Button>
                <Button
                  variant="outline"
                  className={`w-full justify-start h-auto p-4 text-left transition-all ${
                    selectedAnswer === 1 ? 'border-green-500 bg-green-500/10 animate-pulse' : ''
                  }`}
                  onClick={() => handleAnswer(true, 'Ты действуешь по протоколу безопасности!', 1)}
                  disabled={selectedAnswer !== null}
                >
                  {selectedAnswer === 1 && <CheckCircle className="w-5 h-5 text-green-500 mr-2" />}
                  Вежливо завершить разговор и позвонить на горячую линию банка самостоятельно
                </Button>
                <Button
                  variant="outline"
                  className={`w-full justify-start h-auto p-4 text-left transition-all ${
                    selectedAnswer === 2 ? 'border-destructive bg-destructive/10' : ''
                  }`}
                  onClick={() => handleAnswer(false, 'Лучше завершить разговор и перезвонить в банк самому!', 2)}
                  disabled={selectedAnswer !== null}
                >
                  Не отвечать / отложить
                </Button>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">🛡️ Что НЕ будет спрашивать настоящий сотрудник:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✗ SMS-коды и пароли</li>
                  <li>✗ ПИН-код карты</li>
                  <li>✗ CVV-код с обратной стороны карты</li>
                  <li>✓ Единственный верный способ — перезвонить в банк сам</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="border-destructive/20">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-8 h-8 text-destructive" />
                <Badge variant="destructive">Ситуация №3</Badge>
              </div>
              <CardTitle>Письмо с обещанием сверхдохода</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-4 rounded-lg border-l-4 border-destructive">
                <p className="font-mono text-sm">
                  📧 "Вложи сегодня и получи 20% в месяц! Ссылка на Платформу: bank-secure-invest.xyz"
                </p>
              </div>
              
              <p className="text-lg font-medium">Как поступишь?</p>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className={`w-full justify-start h-auto p-4 text-left transition-all ${
                    selectedAnswer === 0 ? 'border-green-500 bg-green-500/10 animate-pulse' : ''
                  }`}
                  onClick={() => handleAnswer(true, 'Ты раскрыл ложную платформу — это классическая схема отъёма денег.', 0)}
                  disabled={selectedAnswer !== null}
                >
                  {selectedAnswer === 0 && <CheckCircle className="w-5 h-5 text-green-500 mr-2" />}
                  Проверить компанию через поисковик и реестр ЦБ
                </Button>
                <Button
                  variant="outline"
                  className={`w-full justify-start h-auto p-4 text-left transition-all ${
                    selectedAnswer === 1 ? 'border-destructive bg-destructive/10' : ''
                  }`}
                  onClick={() => handleAnswer(false, 'Высокий доход — почти всегда обман!', 1)}
                  disabled={selectedAnswer !== null}
                >
                  Перевести деньги по инструкции
                </Button>
                <Button
                  variant="outline"
                  className={`w-full justify-start h-auto p-4 text-left transition-all ${
                    selectedAnswer === 2 ? 'border-green-500 bg-green-500/10 animate-pulse' : ''
                  }`}
                  onClick={() => handleAnswer(true, 'Отличное решение! Помоги банку защитить других клиентов.', 2)}
                  disabled={selectedAnswer !== null}
                >
                  {selectedAnswer === 2 && <CheckCircle className="w-5 h-5 text-green-500 mr-2" />}
                  Игнорировать и пожаловаться на письмо банку
                </Button>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">⚠️ Как не стать жертвой псевдо-инвестиций:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Проверяй лицензии компаний в реестре ЦБ</li>
                  <li>✓ Читай независимые отзывы</li>
                  <li>✓ Не торопись переводить деньги</li>
                  <li>✗ Обещания высокой доходности = красный флаг</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-8 h-8 text-primary" />
                <Badge>Интерактив</Badge>
              </div>
              <CardTitle>Найди признаки мошенничества</CardTitle>
              <CardDescription>Отметь все красные флаги в сообщениях</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium mb-3">Сообщение 1:</p>
                  <p className="font-mono text-sm mb-3">
                    "Уважаемый клиент! Ваша карта заблокированна. Для розблокировки пройдите по сылке: 
                    htt://sber-bank-online.xyz/unlock?id=12345"
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant={selectedFlags.includes('orth1') ? 'destructive' : 'outline'}
                      className="cursor-pointer transition-all"
                      onClick={() => toggleFlag('orth1')}
                    >
                      Орфографические ошибки
                    </Badge>
                    <Badge 
                      variant={selectedFlags.includes('url1') ? 'destructive' : 'outline'}
                      className="cursor-pointer transition-all"
                      onClick={() => toggleFlag('url1')}
                    >
                      Странный адрес сайта
                    </Badge>
                    <Badge 
                      variant={selectedFlags.includes('https1') ? 'destructive' : 'outline'}
                      className="cursor-pointer transition-all"
                      onClick={() => toggleFlag('https1')}
                    >
                      Отсутствие HTTPS
                    </Badge>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium mb-3">Сообщение 2:</p>
                  <p className="font-mono text-sm mb-3">
                    "Переведите 5000₽ на счет 1234567890 для активации премиум-статуса. 
                    Успейте до конца дня!"
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant={selectedFlags.includes('money2') ? 'destructive' : 'outline'}
                      className="cursor-pointer transition-all"
                      onClick={() => toggleFlag('money2')}
                    >
                      Требование денег
                    </Badge>
                    <Badge 
                      variant={selectedFlags.includes('urgent2') ? 'destructive' : 'outline'}
                      className="cursor-pointer transition-all"
                      onClick={() => toggleFlag('urgent2')}
                    >
                      Искусственная срочность
                    </Badge>
                    <Badge 
                      variant={selectedFlags.includes('transfer2') ? 'destructive' : 'outline'}
                      className="cursor-pointer transition-all"
                      onClick={() => toggleFlag('transfer2')}
                    >
                      Неофициальный перевод
                    </Badge>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium mb-3">Сообщение 3:</p>
                  <p className="font-mono text-sm mb-3">
                    "Здравствуйте! Напоминаем о необходимости обновить данные в личном кабинете. 
                    Войдите через официальное приложение банка."
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant={selectedFlags.includes('nolinks3') ? 'outline' : 'outline'}
                      className={`cursor-pointer transition-all ${
                        selectedFlags.includes('nolinks3') ? 'border-green-500 text-green-600' : ''
                      }`}
                      onClick={() => toggleFlag('nolinks3')}
                    >
                      Нет ссылок
                    </Badge>
                    <Badge 
                      variant={selectedFlags.includes('official3') ? 'outline' : 'outline'}
                      className={`cursor-pointer transition-all ${
                        selectedFlags.includes('official3') ? 'border-green-500 text-green-600' : ''
                      }`}
                      onClick={() => toggleFlag('official3')}
                    >
                      Официальный канал
                    </Badge>
                  </div>
                </div>
              </div>

              <Button onClick={() => setCurrentScreen(6)} size="lg" className="w-full">
                Продолжить
              </Button>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <Badge className="bg-green-500">Миссия выполнена!</Badge>
              </div>
              <CardTitle className="text-2xl">Поздравляем, детектив!</CardTitle>
              <CardDescription className="text-base">
                Ты раскрыл мошеннические схемы — теперь действуешь как профи!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-primary/10 p-6 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Правильных ответов:</span>
                  <span className="text-2xl font-bold text-primary">{score} / 3</span>
                </div>
                <Progress value={(score / 3) * 100} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-muted p-4 rounded-lg">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Бейдж «Антифрод-Новичок»</p>
                    <p className="text-sm text-muted-foreground">Разблокирован!</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-muted p-4 rounded-lg">
                  <div className="text-2xl">🪙</div>
                  <div>
                    <p className="font-medium">+75 FinCoins</p>
                    <p className="text-sm text-muted-foreground">Награда получена</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-muted p-4 rounded-lg">
                  <div className="text-2xl">⭐</div>
                  <div>
                    <p className="font-medium">+60 XP</p>
                    <p className="text-sm text-muted-foreground">Опыт начислен</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  💡 Запомни главное правило: банк никогда не попросит тебя сообщить SMS-коды, ПИН или CVV. 
                  При малейшем сомнении — звони в банк сам!
                </p>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleComplete} size="lg" className="flex-1">
                  Завершить квест
                </Button>
                <Button onClick={() => navigate('/quests')} variant="outline" size="lg" className="flex-1">
                  К квестам
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/quests')}>
            ← Назад
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Экран {currentScreen} из {totalScreens}
            </span>
          </div>
        </div>

        <Progress value={(currentScreen / totalScreens) * 100} className="h-2" />

        {renderScreen()}
      </div>
    </div>
  );
};

export default AntiFraudQuest;
