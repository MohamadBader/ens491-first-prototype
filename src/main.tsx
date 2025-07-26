import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);

// filepath: e:\user\Documents\Sabanci University Courses\ens491-first-prototype\src\services\audioAnalysisApi.ts
const mapResponseToResult = (response: AudioAnalysisResponse, filename: string): AudioAnalysisResult => {
  return {
    azimuth: response.azimuth,
    elevation: response.elevation,
    classification: response.classification.map(item => ({
      label: item.label,
      score: item.score
    })),
    transcript: response.transcription,
    filename,
    warning: response.warning // <-- Add this line
  };
};

// filepath: e:\user\Documents\Sabanci University Courses\ens491-first-prototype\src\pages\Index.tsx
export interface AudioAnalysisResult {
  azimuth: number;
  elevation: number;
  classification: ClassificationResult[];
  transcript: string | null;
  filename?: string;
  warning?: string; // <-- Add this line
}

// filepath: e:\user\Documents\Sabanci University Courses\ens491-first-prototype\src\components\ResultsPanel.tsx
export const ResultsPanel = ({ results, isLoading, onReset }: ResultsPanelProps) => {
  // ...existing code...

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-panel rounded-2xl p-6 h-full flex flex-col"
    >
      {/* Header */}
      {/* ...existing code... */}

      {/* Show warning if present */}
      {results.warning && (
        <div className="mb-4 p-3 rounded bg-yellow-100 text-yellow-800 border border-yellow-300">
          <strong>Warning:</strong> {results.warning}
        </div>
      )}

      {/* ...existing code... */}
    </motion.div>
  );
};
