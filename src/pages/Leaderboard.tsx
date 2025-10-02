import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Clock, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface LeaderboardEntry {
  user_id: string;
  total_exposures: number;
  fastest_time: number | null;
  streak_days: number;
  profiles: {
    name: string;
  };
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select(`
          user_id,
          total_exposures,
          fastest_time,
          streak_days,
          profiles (name)
        `)
        .order('total_exposures', { ascending: false })
        .limit(50);

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${rank + 1}`;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold">Таблица лидеров</h1>
        </div>
        <p className="text-white/90 text-sm">
          Лучшие детективы по разоблачению мошенников
        </p>
      </div>

      <div className="p-4 space-y-3">
        {loading ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">Загрузка...</p>
          </Card>
        ) : entries.length === 0 ? (
          <Card className="p-6 text-center">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">Пока никто не разоблачил мошенников</p>
          </Card>
        ) : (
          entries.map((entry, index) => (
            <Card 
              key={entry.user_id}
              className={`p-4 ${index < 3 ? 'border-2 border-yellow-500' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold w-12 text-center">
                  {getMedalEmoji(index)}
                </div>

                <Avatar>
                  <AvatarFallback>
                    {entry.profiles?.name?.[0] || '?'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h3 className="font-bold">{entry.profiles?.name || 'Пользователь'}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      {entry.total_exposures}
                    </span>
                    {entry.fastest_time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {Math.floor(entry.fastest_time / 60)}м
                      </span>
                    )}
                    {entry.streak_days > 0 && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {entry.streak_days}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}