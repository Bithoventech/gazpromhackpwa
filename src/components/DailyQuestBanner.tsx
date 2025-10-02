import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const DailyQuestBanner = () => {
  const navigate = useNavigate();
  const [scammerName, setScammerName] = useState<string>("");
  const [scammerRole, setScammerRole] = useState<string>("");
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDailyQuest();
  }, []);

  const loadDailyQuest = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get active quest
      const { data: activeQuest } = await supabase
        .from('active_daily_quest')
        .select('scammer_id')
        .eq('quest_date', today)
        .single();

      if (activeQuest) {
        // Get scammer details
        const { data: scammer } = await supabase
          .from('daily_scammers')
          .select('name, role')
          .eq('id', activeQuest.scammer_id)
          .single();

        if (scammer) {
          setScammerName(scammer.name);
          setScammerRole(scammer.role);
        }

        // Check if user completed today's quest
        const deviceId = localStorage.getItem('device_id');
        if (deviceId) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('device_id', deviceId)
            .single();

          if (profile) {
            const { data: progress } = await supabase
              .from('user_daily_progress')
              .select('completed')
              .eq('user_id', profile.id)
              .eq('quest_date', today)
              .single();

            setCompleted(progress?.completed || false);
          }
        }
      }
    } catch (error) {
      console.error('Error loading daily quest:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}ч ${minutes}м`;
  };

  if (loading || !scammerName) {
    return null;
  }

  return (
    <Card 
      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 cursor-pointer hover:scale-[1.02] transition-transform animate-pulse-soft"
      onClick={() => navigate('/daily-quest')}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="w-8 h-8 animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">Квест дня</h3>
              {!completed && (
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  Новый!
                </Badge>
              )}
            </div>
            <p className="text-sm opacity-90">
              Разоблачи {scammerName} - {scammerRole}
            </p>
          </div>
        </div>
        {completed ? (
          <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{getTimeUntilMidnight()}</span>
          </div>
        ) : (
          <div className="text-2xl font-bold">→</div>
        )}
      </div>
    </Card>
  );
};