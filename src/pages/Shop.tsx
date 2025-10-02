import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CoinDisplay } from '@/components/CoinDisplay';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Shop() {
  const navigate = useNavigate();
  const { shopItems, userProfile, purchaseItem } = useGame();

  const handlePurchase = (itemId: string, price: number, name: string) => {
    if (userProfile.coins < price) {
      toast.error('Недостаточно монет', {
        description: 'Выполняйте квесты, чтобы заработать больше монет',
      });
      return;
    }

    purchaseItem(itemId);
    toast.success('Покупка совершена!', {
      description: `Вы приобрели: ${name}`,
    });
  };

  return (
    <div className="min-h-screen bg-game-bg pb-20">
      <div className="sticky top-0 bg-card border-b border-border z-10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              ←
            </Button>
            <h1 className="text-2xl font-bold">Магазин</h1>
          </div>
          <CoinDisplay amount={userProfile.coins} size="md" />
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {shopItems.map((item) => (
            <Card
              key={item.id}
              className={cn(
                'p-6 shadow-card transition-all duration-300',
                item.purchased && 'opacity-60 bg-muted'
              )}
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl flex-shrink-0">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between gap-4">
                    <CoinDisplay amount={item.price} size="lg" />
                    {item.purchased ? (
                      <Button disabled variant="secondary">
                        Куплено ✓
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handlePurchase(item.id, item.price, item.name)}
                        className="gradient-primary"
                      >
                        Купить
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {shopItems.every(item => item.purchased) && (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-4xl mb-4">🎉</div>
            <p className="font-semibold">Все предметы куплены!</p>
            <p className="text-sm mt-2">Скоро появятся новые товары</p>
          </div>
        )}
      </div>
    </div>
  );
}
