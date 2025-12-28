#!/bin/bash

# Configuration
IMAGE_NAME="sip3ntar-web"
CONTAINER_NAME="sip3ntar-web-container"
PORT=8080
INTERNAL_PORT=3000

echo "======================================"
echo "Docker Build and Run Script"
echo "======================================"
echo ""

# Stop and remove existing container if running
echo "[1/5] Checking for existing container..."
if docker ps -a | grep -q $CONTAINER_NAME; then
    echo "Stopping and removing existing container..."
    docker stop $CONTAINER_NAME 2>/dev/null
    docker rm $CONTAINER_NAME 2>/dev/null
    echo "Container removed."
else
    echo "No existing container found."
fi
echo ""

# Remove old image to save space
echo "[2/5] Cleaning up old images..."
docker rmi $IMAGE_NAME 2>/dev/null
docker image prune -f
echo ""

# Build Docker image with memory limits
echo "[3/5] Building Docker image (optimized for 2GB RAM)..."
docker build \
    --memory="1.5g" \
    --memory-swap="2g" \
    -t $IMAGE_NAME .

if [ $? -ne 0 ]; then
    echo "Error: Docker build failed!"
    echo "Tip: Make sure you have enough disk space and Docker is running properly"
    exit 1
fi
echo "Build successful!"
echo ""

# Run Docker container with resource limits
echo "[4/5] Running Docker container with resource limits..."
docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:$INTERNAL_PORT \
    --memory="512m" \
    --memory-swap="1g" \
    --cpus="1.0" \
    --restart unless-stopped \
    $IMAGE_NAME

if [ $? -ne 0 ]; then
    echo "Error: Failed to start container!"
    exit 1
fi
echo "Container started successfully!"
echo ""

# Show container status
echo "[5/5] Container Status:"
docker ps | grep $CONTAINER_NAME
echo ""

# Show resource usage
echo "Resource Usage:"
docker stats --no-stream $CONTAINER_NAME
echo ""

echo "======================================"
echo "Deployment Complete!"
echo "======================================"
echo "Application is running at: http://localhost:$PORT"
echo "External access: http://YOUR_SERVER_IP:$PORT"
echo ""
echo "Useful commands:"
echo "  View logs:        docker logs $CONTAINER_NAME"
echo "  Follow logs:      docker logs -f $CONTAINER_NAME"
echo "  Resource stats:   docker stats $CONTAINER_NAME"
echo "  Stop:             docker stop $CONTAINER_NAME"
echo "  Start:            docker start $CONTAINER_NAME"
echo "  Restart:          docker restart $CONTAINER_NAME"
echo "  Remove:           docker rm -f $CONTAINER_NAME"
echo ""
echo "Memory limits set:"
echo "  Build: 1.5GB RAM"
echo "  Runtime: 512MB RAM (1GB with swap)"
echo "======================================"