import { useState } from 'react';
import { motion } from 'framer-motion';
import { AudioUploader } from '@/components/AudioUploader';
import { SphereViewer } from '@/components/SphereViewer';
import { ResultsPanel } from '@/components/ResultsPanel';

export interface ClassificationResult {
  label: string;
  score: number;
}

export interface AudioAnalysisResult {
  azimuth: number;
  elevation: number;
  classification: ClassificationResult[];
  transcript: string | null;
  filename?: string;
}

const Index = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AudioAnalysisResult | null>(null);

  const handleFileUpload = async (file: File) => {
    setAudioFile(file);
    setIsLoading(true);
    
    // Multiple dummy scenarios for testing
    const dummyScenarios: AudioAnalysisResult[] = [
      {
        azimuth: 269.65,
        elevation: 4.18,
        classification: [
          { label: "Chicken, rooster", score: 0.691 },
          { label: "Fowl", score: 0.145 },
          { label: "Cluck", score: 0.111 },
        ],
        transcript: null,
        filename: file.name
      },
      {
        azimuth: 45.2,
        elevation: -12.5,
        classification: [
          { label: "Dog", score: 0.823 },
          { label: "Animal", score: 0.156 },
          { label: "Bark", score: 0.124 },
        ],
        transcript: null,
        filename: file.name
      },
      {
        azimuth: 180.0,
        elevation: 30.0,
        classification: [
          { label: "Speech", score: 0.892 },
          { label: "Male speech", score: 0.234 },
          { label: "Conversation", score: 0.187 },
        ],
        transcript: "Hello, this is a test speech transcription to demonstrate how the UI handles longer text content.",
        filename: file.name
      },
      {
        azimuth: 90.0,
        elevation: -45.0,
        classification: [
          { label: "Car", score: 0.756 },
          { label: "Vehicle", score: 0.198 },
          { label: "Motor", score: 0.134 },
        ],
        transcript: null,
        filename: file.name
      }
    ];
    
    // Simulate API call - randomly select a scenario for testing
    setTimeout(() => {
      const randomScenario = dummyScenarios[Math.floor(Math.random() * dummyScenarios.length)];
      setResults(randomScenario);
      setIsLoading(false);
    }, 2000);
  };

  const handleReset = () => {
    setAudioFile(null);
    setResults(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Audio Analysis & 3D Localization
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload audio files to visualize sound classification and spatial localization
          </p>
        </motion.div>

        {!audioFile && !isLoading && !results && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <AudioUploader onFileUpload={handleFileUpload} />
          </motion.div>
        )}

        {(audioFile || isLoading || results) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]"
          >
            {/* 3D Sphere Viewer */}
            <div className="lg:col-span-2">
              <SphereViewer 
                results={results} 
                isLoading={isLoading}
              />
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-1">
              <ResultsPanel 
                results={results}
                isLoading={isLoading}
                onReset={handleReset}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Index;