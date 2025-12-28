#!/bin/bash

# Script untuk build dan run Docker di server dengan RAM 2GB
# Author: Optimized for low-memory environments

set -e

echo "=== Docker Build & Run Script untuk Server RAM 2GB ==="
echo ""

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Konfigurasi
IMAGE_NAME="sip3ntar-web"
CONTAINER_NAME="sip3ntar-web-app"
PORT=8080
SWAP_SIZE=2G

# Function untuk check swap
check_swap() {
    echo -e "${YELLOW}Checking swap space...${NC}"
    SWAP_TOTAL=$(free -h | grep Swap | awk '{print $2}')
    echo "Current swap: $SWAP_TOTAL"

    if [ "$SWAP_TOTAL" = "0B" ]; then
        echo -e "${YELLOW}No swap detected. Swap sangat direkomendasikan untuk build di RAM 2GB.${NC}"
        read -p "Apakah Anda ingin membuat swap 2GB? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            create_swap
        else
            echo -e "${RED}Warning: Build mungkin gagal tanpa swap!${NC}"
        fi
    else
        echo -e "${GREEN}Swap sudah tersedia: $SWAP_TOTAL${NC}"
    fi
}

# Function untuk create swap
create_swap() {
    echo -e "${YELLOW}Creating swap file...${NC}"

    if [ "$EUID" -ne 0 ]; then
        echo -e "${RED}Error: Membuat swap memerlukan sudo privileges.${NC}"
        echo "Jalankan command berikut secara manual:"
        echo "  sudo fallocate -l $SWAP_SIZE /swapfile"
        echo "  sudo chmod 600 /swapfile"
        echo "  sudo mkswap /swapfile"
        echo "  sudo swapon /swapfile"
        echo "  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab"
        return 1
    fi

    sudo fallocate -l $SWAP_SIZE /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

    echo -e "${GREEN}Swap created successfully!${NC}"
}

# Function untuk stop container yang sudah ada
stop_existing_container() {
    if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
        echo -e "${YELLOW}Stopping existing container...${NC}"
        docker stop $CONTAINER_NAME
    fi

    if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
        echo -e "${YELLOW}Removing existing container...${NC}"
        docker rm $CONTAINER_NAME
    fi
}

# Function untuk cleanup old images
cleanup_old_images() {
    echo -e "${YELLOW}Cleaning up dangling images...${NC}"
    docker image prune -f
}

# Function untuk build image
build_image() {
    echo -e "${GREEN}Building Docker image...${NC}"
    echo "This may take several minutes..."

    # Build dengan BuildKit dan memory limit
    DOCKER_BUILDKIT=1 docker build \
        --memory="1.5g" \
        --memory-swap="3.5g" \
        -t $IMAGE_NAME:latest \
        -f Dockerfile \
        . || {
        echo -e "${RED}Build failed!${NC}"
        echo "Tips:"
        echo "1. Pastikan swap sudah aktif (run: free -h)"
        echo "2. Tutup aplikasi lain yang menggunakan banyak memory"
        echo "3. Coba reboot server jika masih gagal"
        exit 1
    }

    echo -e "${GREEN}Build completed successfully!${NC}"
}

# Function untuk run container
run_container() {
    echo -e "${GREEN}Starting container on port $PORT...${NC}"

    docker run -d \
        --name $CONTAINER_NAME \
        --memory="512m" \
        --memory-swap="1g" \
        --restart=unless-stopped \
        -p $PORT:8080 \
        $IMAGE_NAME:latest

    echo -e "${GREEN}Container started successfully!${NC}"
    echo ""
    echo "=== Container Information ==="
    docker ps -f name=$CONTAINER_NAME
    echo ""
    echo -e "${GREEN}Application is running on http://localhost:$PORT${NC}"
    echo ""
    echo "Useful commands:"
    echo "  View logs: docker logs -f $CONTAINER_NAME"
    echo "  Stop: docker stop $CONTAINER_NAME"
    echo "  Restart: docker restart $CONTAINER_NAME"
}

# Main execution
main() {
    # Check swap
    check_swap
    echo ""

    # Stop existing container
    stop_existing_container
    echo ""

    # Cleanup
    cleanup_old_images
    echo ""

    # Build image
    build_image
    echo ""

    # Run container
    run_container
    echo ""

    echo -e "${GREEN}=== Setup Complete! ===${NC}"
}

# Run main
main
