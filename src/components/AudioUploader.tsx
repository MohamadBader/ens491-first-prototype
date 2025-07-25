import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, Music, FileAudio } from 'lucide-react';

interface AudioUploaderProps {
  onFileUpload: (file: File) => void;
}

export const AudioUploader = ({ onFileUpload }: AudioUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/wav': ['.wav'],
      'audio/mp3': ['.mp3'],
      'audio/mpeg': ['.mp3'],
    },
    multiple: false,
  });

  return (
    <div
      className="glass-panel rounded-2xl p-12 text-center cursor-pointer transition-all duration-300"
      {...getRootProps()}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="transition-transform"
      >
      <input {...getInputProps()} />
      
      <motion.div
        animate={{
          scale: isDragActive ? 1.1 : 1,
          rotate: isDragActive ? 5 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="mb-6"
      >
        {isDragActive ? (
          <FileAudio className="w-20 h-20 mx-auto text-accent" />
        ) : (
          <Upload className="w-20 h-20 mx-auto text-muted-foreground" />
        )}
      </motion.div>

      <h3 className="text-2xl font-semibold mb-4">
        {isDragActive ? 'Drop your audio file here' : 'Upload Audio File'}
      </h3>
      
      <p className="text-muted-foreground mb-6">
        Drag and drop your audio file here, or click to browse
      </p>
      
      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4" />
          <span>Supports .wav and .mp3 files</span>
        </div>
      </div>

        <motion.div 
          className="mt-8 inline-block px-6 py-3 bg-primary/20 rounded-full text-primary font-medium"
          whileHover={{ backgroundColor: 'hsl(var(--primary) / 0.3)' }}
        >
          Choose File
        </motion.div>
      </motion.div>
    </div>
  );
};