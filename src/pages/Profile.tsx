import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CoinDisplay } from '@/components/CoinDisplay';
import { ProgressBar } from '@/components/ProgressBar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';

const avatars = ['👤', '👨', '👩', '🧑', '👦', '👧', '🧔', '👱', '🦸', '🧙', '🤓', '😎'];

export default function Profile() {
  const navigate = useNavigate();
  const { userProfile, updateProfile } = useGame();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [selectedAvatar, setSelectedAvatar] = useState(userProfile.avatar);

  const handleSave = () => {
    updateProfile({ name, avatar: selectedAvatar });
    setIsEditing(false);
    toast.success('Профиль обновлён');
  };

  return (
    <div className="min-h-screen bg-game-bg pb-20">
      <div className="sticky top-0 bg-card border-b border-border z-10 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            ←
          </Button>
          <h1 className="text-2xl font-bold">Профиль</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Card */}
        <Card className="p-6 shadow-card gradient-hero text-primary-foreground">
          <div className="text-center mb-6">
            <div className="text-7xl mb-4">{userProfile.avatar}</div>
            <h2 className="text-2xl font-bold mb-1">{userProfile.name}</h2>
            <p className="text-primary-foreground/80">Уровень {userProfile.level}</p>
          </div>

          <div className="space-y-2 mb-6">
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

          <div className="flex justify-center">
            <CoinDisplay amount={userProfile.coins} size="lg" className="text-gold-foreground" />
          </div>
        </Card>

        {/* Stats */}
        <Card className="p-6 shadow-card">
          <h3 className="font-bold mb-4">Статистика</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">Завершено квестов</span>
              <span className="font-bold">{userProfile.completedQuests}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">Открыто достижений</span>
              <span className="font-bold">{userProfile.unlockedAchievements}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">Уровень</span>
              <span className="font-bold">{userProfile.level}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">Общий опыт</span>
              <span className="font-bold">{userProfile.xp} XP</span>
            </div>
          </div>
        </Card>

        {/* Edit Profile */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Редактировать профиль</h3>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Изменить
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Аватар</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {avatars.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => setSelectedAvatar(avatar)}
                      className={cn(
                        'text-3xl p-2 rounded-lg border-2 transition-all',
                        selectedAvatar === avatar
                          ? 'border-primary bg-primary/10'
                          : 'border-transparent hover:border-muted'
                      )}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1 gradient-primary">
                  Сохранить
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setName(userProfile.name);
                    setSelectedAvatar(userProfile.avatar);
                  }}
                >
                  Отмена
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              <p className="text-sm">Нажмите "Изменить" чтобы обновить профиль</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
