import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { QuestCard } from '@/components/QuestCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Quests() {
  const navigate = useNavigate();
  const { quests } = useGame();

  const activeQuests = quests.filter(q => !q.completed);
  const completedQuests = quests.filter(q => q.completed);

  return (
    <div className="min-h-screen bg-game-bg pb-20">
      <div className="sticky top-0 bg-card border-b border-border z-10 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            ←
          </Button>
          <h1 className="text-2xl font-bold">Квесты</h1>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="active">
              Активные ({activeQuests.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Завершённые ({completedQuests.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-3">
            {activeQuests.length > 0 ? (
              activeQuests.map(quest => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onClick={() => navigate(`/quest/${quest.id}`)}
                />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <div className="text-4xl mb-4">🎯</div>
                <p>Нет активных квестов</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-3">
            {completedQuests.length > 0 ? (
              completedQuests.map(quest => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onClick={() => navigate(`/quest/${quest.id}`)}
                />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <div className="text-4xl mb-4">✓</div>
                <p>Ещё нет завершённых квестов</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
