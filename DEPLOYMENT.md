# Deployment Guide - SIP3NTAR Web

Panduan deployment aplikasi Next.js ke Ubuntu 22.04 menggunakan Docker.

## Prerequisites

Pastikan server Ubuntu Anda sudah memiliki:
- Docker (tanpa sudo)
- Git
- Port 3000 tersedia (atau ubah di script jika perlu)

## Deployment Steps

### 1. Clone Repository

```bash
git clone <repository-url> sip3ntar-web
cd sip3ntar-web
```

### 2. Berikan Permission pada Script

```bash
chmod +x docker-build-run.sh
```

### 3. Jalankan Build dan Deployment

```bash
./docker-build-run.sh
```

Script ini akan:
- Stop dan remove container lama (jika ada)
- Build Docker image dari source code
- Jalankan container baru dengan auto-restart policy
- Expose aplikasi di port 3000

### 4. Verifikasi Deployment

Cek status container:
```bash
docker ps
```

Lihat logs:
```bash
docker logs sip3ntar-web-container
```

Follow logs real-time:
```bash
docker logs -f sip3ntar-web-container
```

Akses aplikasi di browser:
```
http://your-server-ip:3000
```

## Run Image Secara Manual

Jika image sudah di-build dan Anda ingin menjalankannya secara manual (tanpa menggunakan script):

### Basic Run

```bash
docker run -d \
    --name sip3ntar-web-container \
    -p 3000:3000 \
    sip3ntar-web
```

### Run dengan Auto-Restart

```bash
docker run -d \
    --name sip3ntar-web-container \
    -p 3000:3000 \
    --restart unless-stopped \
    sip3ntar-web
```

### Run dengan Custom Port

```bash
# Expose di port 8080 instead of 3000
docker run -d \
    --name sip3ntar-web-container \
    -p 8080:3000 \
    --restart unless-stopped \
    sip3ntar-web
```

### Run dengan Environment Variables

```bash
docker run -d \
    --name sip3ntar-web-container \
    -p 3000:3000 \
    -e NODE_ENV=production \
    -e NEXT_PUBLIC_API_URL=https://api.example.com \
    --restart unless-stopped \
    sip3ntar-web
```

### Run dengan .env File

```bash
docker run -d \
    --name sip3ntar-web-container \
    -p 3000:3000 \
    --env-file .env \
    --restart unless-stopped \
    sip3ntar-web
```

### Run dengan Volume (untuk persistent data)

```bash
docker run -d \
    --name sip3ntar-web-container \
    -p 3000:3000 \
    -v /path/to/data:/app/data \
    --restart unless-stopped \
    sip3ntar-web
```

### Run dengan Network Custom

```bash
# Buat network terlebih dahulu
docker network create app-network

# Run container di network tersebut
docker run -d \
    --name sip3ntar-web-container \
    -p 3000:3000 \
    --network app-network \
    --restart unless-stopped \
    sip3ntar-web
```

### Penjelasan Options

- `-d`: Run container di background (detached mode)
- `--name`: Nama container
- `-p HOST_PORT:CONTAINER_PORT`: Port mapping (HOST:CONTAINER)
- `--restart unless-stopped`: Auto-restart policy
  - `no`: Tidak restart otomatis
  - `on-failure`: Restart jika container exit dengan error
  - `always`: Selalu restart
  - `unless-stopped`: Restart kecuali container di-stop manual
- `-e`: Set environment variable
- `--env-file`: Load environment variables dari file
- `-v`: Mount volume (HOST_PATH:CONTAINER_PATH)
- `--network`: Attach ke Docker network

## Update Aplikasi

Jika ada perubahan code:

```bash
# Pull latest changes
git pull origin main

# Rebuild and redeploy
./docker-build-run.sh
```

## Management Commands

### Stop Container
```bash
docker stop sip3ntar-web-container
```

### Start Container
```bash
docker start sip3ntar-web-container
```

### Restart Container
```bash
docker restart sip3ntar-web-container
```

### Remove Container
```bash
docker rm -f sip3ntar-web-container
```

### View Logs
```bash
# Last 100 lines
docker logs --tail 100 sip3ntar-web-container

# Follow logs
docker logs -f sip3ntar-web-container
```

### Execute Command in Container
```bash
docker exec -it sip3ntar-web-container sh
```

## Kustomisasi

### Ubah Port

Edit file `docker-build-run.sh` dan ubah variable `PORT`:
```bash
PORT=8080  # Ganti sesuai kebutuhan
```

### Environment Variables

Jika aplikasi membutuhkan environment variables, tambahkan file `.env` di root project, lalu update script `docker-build-run.sh`:

```bash
docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:3000 \
    --env-file .env \
    --restart unless-stopped \
    $IMAGE_NAME
```

## Troubleshooting

### Container Tidak Bisa Start

1. Cek logs untuk error:
   ```bash
   docker logs sip3ntar-web-container
   ```

2. Pastikan port tidak digunakan:
   ```bash
   netstat -tlnp | grep 3000
   ```

### Rebuild Image dari Awal

```bash
# Remove container
docker rm -f sip3ntar-web-container

# Remove image
docker rmi sip3ntar-web

# Rebuild
./docker-build-run.sh
```

### Disk Space Issues

Bersihkan unused images dan containers:
```bash
docker system prune -a
```

## Production Considerations

### Reverse Proxy (Nginx)

Untuk production, disarankan menggunakan Nginx sebagai reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL/HTTPS

Gunakan Certbot untuk SSL certificate:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Resources

- Next.js Documentation: https://nextjs.org/docs
- Docker Documentation: https://docs.docker.com/
