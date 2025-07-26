import { AudioAnalysisResult } from '@/pages/Index';

export interface AudioAnalysisRequest {
  file: File;
}

export interface AudioAnalysisResponse {
  azimuth: number;
  elevation: number;
  delay_samples: number;
  delay_seconds: number;
  classification: {
    label: string;
    score: number;
  }[];
  transcription: string | null;
}

// Convert backend response to frontend format
const mapResponseToResult = (response: AudioAnalysisResponse, filename: string): AudioAnalysisResult => {
  return {
    azimuth: response.azimuth,
    elevation: response.elevation,
    classification: response.classification.map(item => ({
      label: item.label,
      score: item.score
    })),
    transcript: response.transcription,
    filename
  };
};

export class AudioAnalysisApi {
  private baseUrl: string;

  constructor(baseUrl: string = import.meta.env.VITE_API_URL || 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  async analyzeAudio(file: File): Promise<AudioAnalysisResult> {
    const formData = new FormData();
    formData.append('audio_file', file);

    try {
      const response = await fetch(`${this.baseUrl}/analyze-audio`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AudioAnalysisResponse = await response.json();
      return mapResponseToResult(data, file.name);
    } catch (error) {
      console.error('Audio analysis failed:', error);
      throw new Error('Failed to analyze audio. Please try again.');
    }
  }

  // Health check endpoint
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Create singleton instance
export const audioAnalysisApi = new AudioAnalysisApi();