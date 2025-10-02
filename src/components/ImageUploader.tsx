import { useRef, useState } from 'react';
import { Camera, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageSelect: (base64Image: string) => void;
  disabled?: boolean;
}

export const ImageUploader = ({ onImageSelect, disabled }: ImageUploaderProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Ошибка',
        description: 'Файл слишком большой. Максимум 5MB',
        variant: 'destructive',
      });
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setSelectedImage(base64String);
    };
  };

  const handleSendImage = () => {
    if (selectedImage) {
      onImageSelect(selectedImage);
      setSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCancel = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
        disabled={disabled}
      />

      {!selectedImage && (
        <Button
          size="icon"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        >
          <Camera className="w-5 h-5" />
        </Button>
      )}

      {selectedImage && (
        <>
          <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-primary">
            <img src={selectedImage} alt="Selected" className="w-full h-full object-cover" />
          </div>
          <Button size="icon" variant="outline" onClick={handleCancel}>
            <X className="w-5 h-5" />
          </Button>
          <Button size="icon" onClick={handleSendImage}>
            <Send className="w-5 h-5" />
          </Button>
        </>
      )}
    </div>
  );
};