from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import librosa
import soundfile as sf
from transformers import pipeline
from scipy.signal import correlate
import tempfile
import os
from typing import List, Dict, Any
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Audio Analysis API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for models (loaded once)
audio_classifier = None
speech_recognizer = None

def load_models():
    """Load ML models on startup"""
    global audio_classifier, speech_recognizer
    try:
        logger.info("Loading audio classification model...")
        audio_classifier = pipeline("audio-classification", model="MIT/ast-finetuned-audioset-10-10-0.4593")
        
        logger.info("Loading speech recognition model...")
        speech_recognizer = pipeline("automatic-speech-recognition", model="openai/whisper-base.en")
        
        logger.info("Models loaded successfully!")
    except Exception as e:
        logger.error(f"Failed to load models: {e}")

@app.on_event("startup")
async def startup_event():
    load_models()

def load_foa_audio(file_path: str):
    """Load FOA audio file"""
    try:
        audio, sr = librosa.load(file_path, sr=None, mono=False)
        
        # Handle both mono and multi-channel files
        if len(audio.shape) == 1:
            # Mono file - create mock FOA channels
            logger.warning("Mono file detected, creating mock FOA channels")
            W = audio
            X = audio * 0.5  # Mock spatial channels
            Y = audio * 0.3
            Z = audio * 0.2
        else:
            # Multi-channel file
            if audio.shape[0] < 4:
                logger.warning(f"Expected 4-channel FOA, got {audio.shape[0]} channels. Padding with zeros.")
                # Pad with zeros if needed
                padding = np.zeros((4 - audio.shape[0], audio.shape[1]))
                audio = np.vstack([audio, padding])
            
            W, X, Y, Z = audio[:4]  # Take first 4 channels
        
        return W, X, Y, Z, sr
    except Exception as e:
        logger.error(f"Error loading audio: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to load audio file: {str(e)}")

def compute_direction(X, Y, Z):
    """Compute azimuth and elevation from FOA channels"""
    try:
        x_mean = np.mean(X)
        y_mean = np.mean(Y)
        z_mean = np.mean(Z)

        azimuth = np.degrees(np.arctan2(x_mean, y_mean)) % 360
        horizontal_energy = np.sqrt(x_mean**2 + y_mean**2)
        elevation = np.degrees(np.arctan2(z_mean, horizontal_energy))

        return azimuth, elevation
    except Exception as e:
        logger.error(f"Error computing direction: {e}")
        return 0.0, 0.0

def estimate_itd(channel1, channel2, sr):
    """Estimate inter-temporal delay"""
    try:
        corr = correlate(channel1, channel2, mode='full')
        delay_samples = int(corr.argmax() - len(channel2))
        delay_seconds = delay_samples / sr
        return delay_samples, delay_seconds
    except Exception as e:
        logger.error(f"Error estimating ITD: {e}")
        return 0, 0.0

def classify_audio(file_path: str, threshold: float = 0.1):
    """Classify audio using transformers pipeline"""
    try:
        if audio_classifier is None:
            raise HTTPException(status_code=500, detail="Audio classifier not loaded")
        
        results = audio_classifier(file_path)
        
        # Filter and sort results by confidence
        filtered = [r for r in results if r['score'] > threshold]
        filtered.sort(key=lambda x: x['score'], reverse=True)
        
        return results, filtered
    except Exception as e:
        logger.error(f"Error classifying audio: {e}")
        # Return fallback results
        return [], []

def transcribe_audio_if_speech(file_path: str, classification_results: List[Dict]):
    """Transcribe audio if speech is detected"""
    try:
        # Check if speech is detected with high confidence
        has_speech = any("speech" in r['label'].lower() and r['score'] > 0.7 
                        for r in classification_results)
        
        if has_speech and speech_recognizer is not None:
            result = speech_recognizer(file_path)
            return result.get("text", "")
        
        return None
    except Exception as e:
        logger.error(f"Error transcribing audio: {e}")
        return None

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "models_loaded": audio_classifier is not None}

@app.post("/analyze-audio")
async def analyze_audio(audio_file: UploadFile = File(...)):
    """Main endpoint for audio analysis"""
    
    if not audio_file.filename.lower().endswith(('.wav', '.mp3', '.flac', '.ogg')):
        raise HTTPException(status_code=400, detail="Unsupported file format")
    
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{audio_file.filename.split('.')[-1]}") as tmp_file:
        content = await audio_file.read()
        tmp_file.write(content)
        tmp_file_path = tmp_file.name
    
    try:
        logger.info(f"Processing file: {audio_file.filename}")
        
        # Step 1: Load and map FOA channels
        W, X, Y, Z, sr = load_foa_audio(tmp_file_path)
        
        # Step 2: Compute direction
        azimuth, elevation = compute_direction(X, Y, Z)
        logger.info(f"Estimated Azimuth: {azimuth:.2f}°, Elevation: {elevation:.2f}°")
        
        # Step 3: ITD delay estimate
        delay_samples, delay_seconds = estimate_itd(X, W, sr)
        logger.info(f"Estimated delay: {delay_samples} samples (~{delay_seconds:.5f} s)")
        
        # Step 4: Classify audio
        all_results, filtered_results = classify_audio(tmp_file_path)
        
        # Step 5: Transcribe if speech detected
        transcription = transcribe_audio_if_speech(tmp_file_path, all_results)
        
        # Format response
        response = {
            "azimuth": float(azimuth),
            "elevation": float(elevation),
            "delay_samples": int(delay_samples),
            "delay_seconds": float(delay_seconds),
            "classification": [
                {"label": r["label"], "score": float(r["score"])} 
                for r in (filtered_results[:10] if filtered_results else [])
            ],
            "transcription": transcription
        }
        
        logger.info("Analysis completed successfully")
        return response
        
    except Exception as e:
        logger.error(f"Error during analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
    
    finally:
        # Clean up temporary file
        try:
            os.unlink(tmp_file_path)
        except:
            pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)