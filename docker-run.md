# Running Audio Analysis App with Docker

## Prerequisites
- Docker installed on your system
- Docker Compose installed (usually comes with Docker Desktop)

## Quick Start

1. **Clone/Download the project** to your local machine

2. **Navigate to the project directory:**
   ```bash
   cd audio-analysis-app
   ```

3. **Build and run the application:**
   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   - Frontend: http://localhost
   - Backend API: http://localhost:8000
   - API Health Check: http://localhost:8000/health

## Detailed Commands

### Build the containers
```bash
docker-compose build
```

### Run in background (detached mode)
```bash
docker-compose up -d
```

### View logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs frontend
docker-compose logs backend
```

### Stop the application
```bash
docker-compose down
```

### Stop and remove volumes
```bash
docker-compose down -v
```

## Sharing with Friends

### Option 1: Share Docker Images
```bash
# Build and save images
docker save audio-analysis-app_frontend:latest | gzip > frontend.tar.gz
docker save audio-analysis-app_backend:latest | gzip > backend.tar.gz

# Friends can load the images
docker load < frontend.tar.gz
docker load < backend.tar.gz
```

### Option 2: Share Source Code
1. Share the entire project folder
2. Friends run: `docker-compose up --build`

### Option 3: Docker Hub (Public)
```bash
# Tag and push to Docker Hub
docker tag audio-analysis-app_frontend your-username/audio-analysis-frontend
docker tag audio-analysis-app_backend your-username/audio-analysis-backend

docker push your-username/audio-analysis-frontend
docker push your-username/audio-analysis-backend
```

## Troubleshooting

### Port conflicts
If ports 80 or 8000 are in use, modify `docker-compose.yml`:
```yaml
ports:
  - "3000:80"  # Frontend on port 3000
  - "8001:8000"  # Backend on port 8001
```

### Backend startup issues
The backend may take a minute to load AI models. Check logs:
```bash
docker-compose logs backend
```

### File upload issues
Large files might need increased limits. This is already configured in nginx.conf.

## Production Deployment

For production, consider:
- Using environment variables for configuration
- Setting up proper SSL certificates
- Configuring proper CORS origins
- Using a reverse proxy like Traefik or nginx
- Setting up monitoring and logging