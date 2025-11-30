#!/bin/bash

# Configuration
IMAGE_NAME="sip3ntar-web"
CONTAINER_NAME="sip3ntar-web-container"
PORT=3000

echo "======================================"
echo "Docker Build and Run Script"
echo "======================================"
echo ""

# Stop and remove existing container if running
echo "[1/4] Checking for existing container..."
if docker ps -a | grep -q $CONTAINER_NAME; then
    echo "Stopping and removing existing container..."
    docker stop $CONTAINER_NAME 2>/dev/null
    docker rm $CONTAINER_NAME 2>/dev/null
    echo "Container removed."
else
    echo "No existing container found."
fi
echo ""

# Remove old image (optional - uncomment if you want to remove old image)
# echo "[2/4] Removing old image..."
# docker rmi $IMAGE_NAME 2>/dev/null
# echo ""

# Build Docker image
echo "[2/4] Building Docker image..."
docker build -t $IMAGE_NAME .

if [ $? -ne 0 ]; then
    echo "Error: Docker build failed!"
    exit 1
fi
echo "Build successful!"
echo ""

# Run Docker container
echo "[3/4] Running Docker container..."
docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:3000 \
    --restart unless-stopped \
    $IMAGE_NAME

if [ $? -ne 0 ]; then
    echo "Error: Failed to start container!"
    exit 1
fi
echo "Container started successfully!"
echo ""

# Show container status
echo "[4/4] Container Status:"
docker ps | grep $CONTAINER_NAME
echo ""

echo "======================================"
echo "Deployment Complete!"
echo "======================================"
echo "Application is running at: http://localhost:$PORT"
echo ""
echo "Useful commands:"
echo "  View logs:     docker logs $CONTAINER_NAME"
echo "  Follow logs:   docker logs -f $CONTAINER_NAME"
echo "  Stop:          docker stop $CONTAINER_NAME"
echo "  Start:         docker start $CONTAINER_NAME"
echo "  Restart:       docker restart $CONTAINER_NAME"
echo "  Remove:        docker rm -f $CONTAINER_NAME"
echo "======================================"
