import { motion } from 'framer-motion';
import { MessageSquare, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface TranscriptionBoxProps {
  transcript: string;
}

export const TranscriptionBox = ({ transcript }: TranscriptionBoxProps) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      toast({
        title: "Copied to clipboard",
        description: "Transcript has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy transcript to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-accent" />
          <h4 className="font-medium">Speech Transcription</h4>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 w-8 p-0"
        >
          <Copy className="w-3 h-3" />
        </Button>
      </div>
      
      <div className="bg-muted/30 rounded-lg p-3">
        <p className="text-sm leading-relaxed">{transcript}</p>
      </div>
    </motion.div>
  );
};