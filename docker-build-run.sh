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

# Check and create swap if not exists
echo "[0/6] Checking swap memory..."
SWAP_SIZE=$(free -m | grep Swap | awk '{print $2}')
if [ "$SWAP_SIZE" -lt 2000 ]; then
    echo "Warning: Swap memory is less than 2GB"
    echo "Recommended to add swap: sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile"
else
    echo "Swap memory: ${SWAP_SIZE}MB - OK"
fi
echo ""

# Stop and remove existing container if running
echo "[1/6] Checking for existing container..."
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
echo "[2/6] Cleaning up old images..."
docker rmi $IMAGE_NAME 2>/dev/null
docker image prune -f
echo "Cleanup complete."
echo ""

# Clean up dangling images and build cache
echo "[3/6] Cleaning Docker build cache..."
docker builder prune -f
echo ""

# Build Docker image with memory limits and Node options
echo "[4/6] Building Docker image (optimized for 2GB RAM)..."
echo "This may take several minutes..."
echo "Build logs will be displayed below:"
echo "--------------------------------------"
docker build \
    --memory="1.8g" \
    --memory-swap="3g" \
    --build-arg NODE_OPTIONS="--max-old-space-size=1536" \
    --progress=plain \
    --no-cache \
    -t $IMAGE_NAME . 2>&1 | tee build.log

BUILD_STATUS=${PIPESTATUS[0]}

if [ $BUILD_STATUS -ne 0 ]; then
    echo ""
    echo "======================================"
    echo "Error: Docker build failed!"
    echo "======================================"
    echo "Build log has been saved to: build.log"
    echo ""
    echo "Troubleshooting tips:"
    echo "1. Check if swap is enabled: free -h"
    echo "2. Add swap if needed:"
    echo "   sudo fallocate -l 2G /swapfile"
    echo "   sudo chmod 600 /swapfile"
    echo "   sudo mkswap /swapfile"
    echo "   sudo swapon /swapfile"
    echo "3. Check disk space: df -h"
    echo "4. Review build log: cat build.log"
    echo "5. Check Docker logs: docker logs $CONTAINER_NAME"
    echo "======================================"
    exit 1
fi
echo "--------------------------------------"
echo "Build successful!"
echo "Build log saved to: build.log"
echo ""

# Run Docker container with resource limits
echo "[5/6] Running Docker container with resource limits..."
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
    echo "Check logs with: docker logs $CONTAINER_NAME"
    exit 1
fi
echo "Container started successfully!"
echo ""

# Show container status
echo "[6/6] Container Status:"
docker ps | grep $CONTAINER_NAME
echo ""

# Wait a moment for container to start
sleep 2

# Show resource usage
echo "Resource Usage:"
docker stats --no-stream $CONTAINER_NAME 2>/dev/null || echo "Container starting..."
echo ""

echo "======================================"
echo "Deployment Complete!"
echo "======================================"
echo "Application is running at:"
echo "  Local:    http://localhost:$PORT"
echo "  Network:  http://$(hostname -I | awk '{print $1}'):$PORT"
echo ""
echo "Useful commands:"
echo "  View logs:        docker logs $CONTAINER_NAME"
echo "  Follow logs:      docker logs -f $CONTAINER_NAME"
echo "  Resource stats:   docker stats $CONTAINER_NAME"
echo "  Stop:             docker stop $CONTAINER_NAME"
echo "  Start:            docker start $CONTAINER_NAME"
echo "  Restart:          docker restart $CONTAINER_NAME"
echo "  Remove:           docker rm -f $CONTAINER_NAME"
echo "  View build log:   cat build.log"
echo ""
echo "Resource limits:"
echo "  Build:    1.8GB RAM (3GB with swap)"
echo "  Runtime:  512MB RAM (1GB with swap)"
echo "  CPU:      1.0 core"
echo ""
echo "Node options: --max-old-space-size=1536"
echo "======================================"