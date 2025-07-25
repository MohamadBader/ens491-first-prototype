# Audio Analysis Backend

This backend provides REST API endpoints for analyzing First-Order Ambisonics (FOA) audio files.

## Features

- **Spatial Audio Analysis**: Computes azimuth and elevation from FOA channels
- **Sound Classification**: Uses MIT's AudioSet model for sound classification  
- **Speech Transcription**: Automatic speech recognition using OpenAI Whisper
- **Cross-platform**: FastAPI with CORS support

## Setup

1. **Install Python 3.8+**

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the server:**
   ```bash
   python main.py
   ```

   The API will be available at `http://localhost:8000`

## API Endpoints

### `GET /health`
Health check endpoint

### `POST /analyze-audio`
Analyze uploaded audio file

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `audio_file` (file upload)

**Response:**
```json
{
  "azimuth": 269.65,
  "elevation": 4.18,
  "delay_samples": 10770,
  "delay_seconds": 0.11219,
  "classification": [
    {"label": "Chicken, rooster", "score": 0.691},
    {"label": "Fowl", "score": 0.145},
    {"label": "Cluck", "score": 0.111}
  ],
  "transcription": null
}
```

## Deployment Options

### 1. Local Development
```bash
python main.py
```

### 2. Docker (Recommended)
```bash
# Build image
docker build -t audio-analysis-api .

# Run container
docker run -p 8000:8000 audio-analysis-api
```

### 3. Cloud Deployment
- **Google Cloud Run**: Easy serverless deployment
- **AWS Lambda**: With API Gateway (requires adaptation)
- **Railway/Render**: Simple deployment with git integration

## Frontend Integration

Update your frontend environment variable:
```bash
VITE_API_URL=http://localhost:8000
```

## Notes

- First request may be slow due to model loading
- Supports .wav, .mp3, .flac, .ogg files
- Handles both mono and multi-channel audio
- Gracefully falls back on processing errors