import { motion } from 'framer-motion';
import { FileAudio, RotateCcw, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AudioAnalysisResult } from '@/pages/Index';
import { ClassificationResults } from './ClassificationResults';
import { TranscriptionBox } from './TranscriptionBox';

interface ResultsPanelProps {
  results: AudioAnalysisResult | null;
  isLoading: boolean;
  onReset: () => void;
}

export const ResultsPanel = ({ results, isLoading, onReset }: ResultsPanelProps) => {
  if (isLoading) {
    return (
      <div className="glass-panel rounded-2xl p-6 h-full">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full glass-panel flex items-center justify-center">
              <Volume2 className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Processing Audio</h3>
            <p className="text-sm text-muted-foreground">
              Analyzing sound patterns and spatial information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="glass-panel rounded-2xl p-6 h-full">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full glass-panel flex items-center justify-center">
              <FileAudio className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Audio Uploaded</h3>
            <p className="text-sm text-muted-foreground">
              Upload an audio file to see analysis results
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-panel rounded-2xl p-6 h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Analysis Results</h2>
          <p className="text-sm text-muted-foreground">{results.filename}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="glass-panel border-0"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Classification Results */}
      <div className="mb-6">
        <ClassificationResults classifications={results.classification} />
      </div>

      {/* Spatial Information */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Spatial Location</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-panel rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-accent">{results.azimuth.toFixed(1)}°</div>
            <div className="text-sm text-muted-foreground">Azimuth</div>
            <div className="text-xs text-muted-foreground mt-1">Horizontal angle</div>
          </div>
          <div className="glass-panel rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-accent">{results.elevation.toFixed(1)}°</div>
            <div className="text-sm text-muted-foreground">Elevation</div>
            <div className="text-xs text-muted-foreground mt-1">Vertical angle</div>
          </div>
        </div>
      </div>

      {/* Transcription */}
      {results.transcript && (
        <div className="mt-auto">
          <TranscriptionBox transcript={results.transcript} />
        </div>
      )}

      {/* Help text */}
      <div className="mt-auto pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          💡 Use mouse to rotate the 3D view. Scroll to zoom in/out.
        </p>
      </div>
    </motion.div>
  );
};