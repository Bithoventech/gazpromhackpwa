import { useState } from 'react';
import { Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChatBubble } from '@/components/ChatBubble';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PostGameInterviewProps {
  scammerId: string;
  scammerName: string;
  onClose: () => void;
}

interface QAMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const PostGameInterview = ({ scammerId, scammerName, onClose }: PostGameInterviewProps) => {
  const [messages, setMessages] = useState<QAMessage[]>([
    {
      role: 'assistant',
      content: `Ну что, вы меня поймали. Задавайте вопросы, раз уж так вышло. Я ${scammerName}, и да, я мошенник.`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendQuestion = async () => {
    if (!input.trim()) return;

    const userMessage: QAMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get scammer details for context
      const { data: scammer } = await supabase
        .from('daily_scammers')
        .select('*')
        .eq('id', scammerId)
        .single();

      if (!scammer) throw new Error('Scammer not found');

      // Create interview prompt
      const interviewPrompt = `Ты - ${scammer.name}, ${scammer.role}. Тебя только что разоблачили как мошенника.
      
Биография: ${scammer.biography}

Теперь пользователь задаёт тебе личные вопросы. Отвечай честно, как настоящий человек, объясняя:
- Почему ты стал мошенником
- Твою реальную жизнь и мотивацию  
- Какие схемы используешь
- Что чувствуешь когда обманываешь людей
- Свои страхи и сожаления

Говори от первого лица, будь человечным, показывай эмоции. Ты уже пойман, нет смысла врать дальше.`;

      const conversationHistory = [
        { role: 'system', content: interviewPrompt },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: 'user', content: input },
      ];

      // Call edge function with interview mode
      const { data, error } = await supabase.functions.invoke('daily-scammer-chat', {
        body: {
          messages: conversationHistory,
          useInterviewMode: true,
        },
      });

      if (error) throw error;

      const assistantMessage: QAMessage = {
        role: 'assistant',
        content: data.response || 'Извините, не могу ответить на этот вопрос.',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Interview error:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось получить ответ',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-h-[600px] flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-bold text-lg">Разговор с мошенником</h3>
        <p className="text-sm text-muted-foreground">
          Задайте любые вопросы о его жизни и мотивации
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <ChatBubble
            key={index}
            message={msg.content}
            isUser={msg.role === 'user'}
            timestamp={msg.timestamp}
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
      </div>

      <div className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Задайте вопрос..."
          onKeyPress={(e) => e.key === 'Enter' && sendQuestion()}
          disabled={isLoading}
        />
        <Button 
          size="icon"
          onClick={sendQuestion}
          disabled={isLoading || !input.trim()}
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>

      <div className="p-4 border-t">
        <Button variant="outline" className="w-full" onClick={onClose}>
          Закрыть
        </Button>
      </div>
    </Card>
  );
};