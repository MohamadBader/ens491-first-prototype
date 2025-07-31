# ENS491 Project Prototype - Audio Analysis & 3D Localization

A web application for analyzing audio files with spatial sound localization and classification capabilities. This project processes First-Order Ambisonics (FOA) audio files to determine sound direction, classify audio content, and provide speech transcription.

## Features

- **3D Audio Visualization**: Interactive sphere visualization showing sound source localization
- **Spatial Audio Analysis**: Computes azimuth and elevation from FOA channels
- **Sound Classification**: Uses MIT's AudioSet model for automatic sound classification
- **Speech Transcription**: Automatic speech recognition using OpenAI Whisper
- **Real-time Processing**: Fast audio analysis with visual feedback
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **3D Graphics**: Three.js with React Three Fiber
- **Backend**: Python FastAPI with audio processing libraries
- **Deployment**: Docker & Docker Compose

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+ (for backend)
- Docker and Docker Compose (optional, for containerized deployment)

## Quick Start

### Option 1: Docker Compose (Recommended)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

### Option 2: Local Development

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Set up the backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Start the backend server:**
   ```bash
   cd backend
   python main.py
   ```

5. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

6. **Access the application:**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:8000

## Project Structure

```
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── utils/             # Utility functions
├── backend/               # Python backend
│   ├── main.py           # FastAPI application
│   ├── requirements.txt  # Python dependencies
│   └── Dockerfile        # Backend container config
├── docker-compose.yml    # Multi-container setup
└── README.md            # Project documentation
```

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
    {"label": "Fowl", "score": 0.145}
  ],
  "transcription": "Hello world"
}
```

## Supported Audio Formats

- WAV (.wav)
- MP3 (.mp3)
- FLAC (.flac)
- OGG (.ogg)

Supports both mono and multi-channel audio files.

## Development Commands

```bash
# Frontend development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Docker commands
docker-compose up --build    # Build and run all services
docker-compose down         # Stop all services
docker-compose logs        # View logs
```

## Deployment

### Local Production Build

```bash
# Build frontend
npm run build

# Serve with a static file server
npx serve dist
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build -d

# Or build individual containers
docker build -t audio-frontend .
docker build -t audio-backend ./backend
```

## Troubleshooting

- **Port conflicts**: Ensure ports 3000 (frontend) and 8000 (backend) are available
- **Backend startup**: First request may be slow due to model loading
- **Audio processing**: Large files may take longer to process
- **CORS issues**: Backend includes CORS middleware for cross-origin requests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the ENS491 course prototype development.