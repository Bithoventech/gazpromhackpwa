import { useState } from 'react';
import { Mic, Square, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AudioRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  disabled?: boolean;
}

export const AudioRecorder = ({ onTranscriptionComplete, disabled }: AudioRecorderProps) => {
  const { isRecording, audioBlob, startRecording, stopRecording, resetRecording } = useAudioRecorder();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartRecording = async () => {
    try {
      await startRecording();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось получить доступ к микрофону',
        variant: 'destructive',
      });
    }
  };

  const handleSendAudio = async () => {
    if (!audioBlob) return;

    setIsProcessing(true);
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];

        // Call edge function for transcription
        const { data, error } = await supabase.functions.invoke('process-audio', {
          body: { audio: base64Audio },
        });

        if (error) throw error;

        if (data?.text) {
          onTranscriptionComplete(data.text);
          resetRecording();
          toast({
            title: 'Успешно',
            description: 'Аудио распознано',
          });
        }
      };
    } catch (error) {
      console.error('Audio processing error:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось распознать аудио',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {!isRecording && !audioBlob && (
        <Button
          size="icon"
          variant="outline"
          onClick={handleStartRecording}
          disabled={disabled || isProcessing}
        >
          <Mic className="w-5 h-5" />
        </Button>
      )}

      {isRecording && (
        <Button
          size="icon"
          variant="destructive"
          onClick={stopRecording}
          className="animate-pulse"
        >
          <Square className="w-5 h-5" />
        </Button>
      )}

      {audioBlob && !isRecording && (
        <>
          <Button
            size="icon"
            variant="outline"
            onClick={resetRecording}
            disabled={isProcessing}
          >
            <X className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            onClick={handleSendAudio}
            disabled={isProcessing}
          >
            <Send className="w-5 h-5" />
          </Button>
        </>
      )}
    </div>
  );
};