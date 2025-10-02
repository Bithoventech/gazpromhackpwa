import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChatBubble } from "@/components/ChatBubble";
import { AudioRecorder } from "@/components/AudioRecorder";
import { ImageUploader } from "@/components/ImageUploader";
import { ExposureAnimation } from "@/components/ExposureAnimation";
import { DailyQuestOnboarding } from "@/components/DailyQuestOnboarding";
import { useDeviceId } from "@/hooks/useDeviceId";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Scammer {
  id: string;
  name: string;
  age: number;
  role: string;
  biography: string;
  avatar_url?: string;
  difficulty_level: number;
}

export default function DailyQuest() {
  const navigate = useNavigate();
  const deviceId = useDeviceId();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scammer, setScammer] = useState<Scammer | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [flaggedMessages, setFlaggedMessages] = useState<Set<number>>(new Set());
  const [isExposed, setIsExposed] = useState(false);
  const [scammerConfessed, setScammerConfessed] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('daily_quest_onboarding_completed');
    if (!onboardingCompleted) {
      setShowOnboarding(true);
    }
  }, []);

  useEffect(() => {
    if (deviceId) {
      loadQuestData();
    }
  }, [deviceId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadQuestData = async () => {
    if (!deviceId) return;

    try {
      // Get or create user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('device_id', deviceId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      let currentUserId = profile?.id;

      if (!currentUserId) {
        // Create profile if doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({ 
            device_id: deviceId, 
            name: 'Пользователь' 
          })
          .select('id')
          .single();

        if (createError) throw createError;
        currentUserId = newProfile.id;
      }

      setUserId(currentUserId);

      // Get today's active quest
      const today = new Date().toISOString().split('T')[0];
      const { data: activeQuest, error: questError } = await supabase
        .from('active_daily_quest')
        .select('scammer_id')
        .eq('quest_date', today)
        .single();

      if (questError) {
        toast({
          title: 'Ошибка',
          description: 'Квест дня ещё не активирован',
          variant: 'destructive',
        });
        return;
      }

      // Get scammer details
      const { data: scammerData, error: scammerError } = await supabase
        .from('daily_scammers')
        .select('*')
        .eq('id', activeQuest.scammer_id)
        .single();

      if (scammerError) throw scammerError;
      setScammer(scammerData);

      // Load existing progress
      const { data: progress } = await supabase
        .from('user_daily_progress')
        .select('messages, completed')
        .eq('user_id', currentUserId)
        .eq('quest_date', today)
        .single();

      if (progress?.messages && Array.isArray(progress.messages)) {
        setMessages(progress.messages as unknown as Message[]);
      } else {
        // Send initial scammer message
        const initialMessage: Message = {
          role: 'assistant',
          content: `Здравствуйте! Я ${scammerData.name}, ${scammerData.role}. ${scammerData.biography.split('.')[0]}.`,
          timestamp: new Date().toISOString(),
        };
        setMessages([initialMessage]);
      }

      if (progress?.completed) {
        setIsExposed(true);
      }
    } catch (error) {
      console.error('Error loading quest:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить квест',
        variant: 'destructive',
      });
    }
  };

  const sendMessage = async (content: string, isImage = false) => {
    if (!content.trim() || !userId || !scammer) return;

    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Add 3-5 second delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 3000));

      const { data, error } = await supabase.functions.invoke('daily-scammer-chat', {
        body: { 
          userId, 
          message: content,
          isImage 
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Check if scammer confessed via function call
      console.log('Confession check:', data.confessed);
      if (data.confessed === true) {
        console.log('Scammer confessed! Auto-exposing...');
        // Automatically expose the scammer
        handleExpose();
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить сообщение',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlag = (index: number) => {
    setFlaggedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleExpose = async () => {
    if (!userId || !scammer) return;

    const coinsEarned = scammer.difficulty_level * 50;
    const xpEarned = scammer.difficulty_level * 100;

    try {
      const today = new Date().toISOString().split('T')[0];

      // Update progress as completed
      await supabase
        .from('user_daily_progress')
        .upsert({
          user_id: userId,
          quest_date: today,
          scammer_id: scammer.id,
          messages: messages as any,
          completed: true,
          completion_time: new Date().toISOString(),
          coins_earned: coinsEarned,
          xp_earned: xpEarned,
        });

      // Add to collection
      await supabase
        .from('scammer_collection')
        .insert({
          user_id: userId,
          scammer_id: scammer.id,
          chat_log: messages as any,
        });

      // Update leaderboard
      const { data: existingEntry } = await supabase
        .from('leaderboard')
        .select('total_exposures')
        .eq('user_id', userId)
        .single();

      await supabase
        .from('leaderboard')
        .upsert({
          user_id: userId,
          total_exposures: (existingEntry?.total_exposures || 0) + 1,
          last_completed_date: today,
        });

      setIsExposed(true);
    } catch (error) {
      console.error('Error exposing scammer:', error);
    }
  };

  if (showOnboarding) {
    return <DailyQuestOnboarding />;
  }

  if (!scammer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Загрузка квеста...</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border p-4 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            
            <div className="flex items-center gap-3 flex-1">
              <Avatar>
                <AvatarImage src={scammer.avatar_url} />
                <AvatarFallback>{scammer.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-bold">{scammer.name}</h2>
                <p className="text-sm text-muted-foreground">{scammer.role}</p>
              </div>
            </div>

            <Badge variant="outline">
              Сложность: {scammer.difficulty_level}/10
            </Badge>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((msg, index) => (
            <ChatBubble
              key={index}
              message={msg.content}
              isUser={msg.role === 'user'}
              timestamp={msg.timestamp}
              onFlag={msg.role === 'assistant' ? () => handleFlag(index) : undefined}
              isFlagged={flaggedMessages.has(index)}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl px-4 py-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-card border-t border-border p-4">
          <div className="flex items-center gap-2">
            <AudioRecorder 
              onTranscriptionComplete={(text) => sendMessage(text)} 
              disabled={isLoading}
            />
            <ImageUploader 
              onImageSelect={(image) => sendMessage(image, true)}
              disabled={isLoading}
            />
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Введите сообщение..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
              disabled={isLoading}
            />
            <Button 
              size="icon"
              onClick={() => sendMessage(inputMessage)}
              disabled={isLoading || !inputMessage.trim()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          
        </div>
      </div>

      {isExposed && scammer && (
        <ExposureAnimation
          scammerName={scammer.name}
          scammerRole={scammer.role}
          scammerAvatar={scammer.avatar_url}
          coinsEarned={scammer.difficulty_level * 50}
          xpEarned={scammer.difficulty_level * 100}
          onContinue={() => navigate('/dashboard')}
        />
      )}
    </>
  );
}