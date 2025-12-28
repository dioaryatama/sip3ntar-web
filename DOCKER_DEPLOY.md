# Docker Deployment Guide - Server RAM 2GB

Panduan lengkap untuk deploy aplikasi Next.js di server Ubuntu dengan RAM 2GB.

## 📋 Prerequisites

- Docker & Docker Compose terinstall
- Ubuntu Server dengan minimal 2GB RAM
- Port 8080 tersedia

## 🚀 Quick Start (Recommended)

### Opsi 1: Menggunakan Script Otomatis

```bash
# 1. Clone repository
git clone <your-repo-url>
cd sip3ntar-web

# 2. Berikan permission untuk script
chmod +x docker-build.sh

# 3. Jalankan script (akan otomatis setup swap jika diperlukan)
./docker-build.sh
```

Script akan otomatis:
- ✅ Check dan setup swap space jika diperlukan
- ✅ Build Docker image dengan memory optimization
- ✅ Stop container lama jika ada
- ✅ Run container baru di port 8080

### Opsi 2: Menggunakan Docker Compose

```bash
# 1. Build dan run dengan satu command
docker-compose up -d --build

# 2. Check status
docker-compose ps

# 3. View logs
docker-compose logs -f

# 4. Stop aplikasi
docker-compose down
```

## 🔧 Manual Setup (Jika Script Gagal)

### Step 1: Setup Swap (PENTING untuk RAM 2GB!)

```bash
# Check swap yang ada
free -h

# Jika swap = 0B, buat swap 2GB
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Permanent swap (survive reboot)
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify
free -h
```

### Step 2: Build Docker Image

```bash
# Build dengan memory limit
DOCKER_BUILDKIT=1 docker build \
  --memory="1.5g" \
  --memory-swap="3.5g" \
  -t sip3ntar-web:latest \
  .
```

**Tips jika build gagal:**
- Pastikan swap sudah aktif: `free -h`
- Close aplikasi lain yang menggunakan banyak memory
- Reboot server jika masih gagal: `sudo reboot`

### Step 3: Run Container

```bash
# Stop container lama jika ada
docker stop sip3ntar-web-app 2>/dev/null || true
docker rm sip3ntar-web-app 2>/dev/null || true

# Run container baru
docker run -d \
  --name sip3ntar-web-app \
  --memory="512m" \
  --memory-swap="1g" \
  --restart=unless-stopped \
  -p 8080:8080 \
  sip3ntar-web:latest
```

## 📊 Monitoring & Management

### Check Status & Logs

```bash
# Check container status
docker ps

# View logs
docker logs -f sip3ntar-web-app

# Check memory usage
docker stats sip3ntar-web-app

# Check system resources
free -h
df -h
```

### Container Management

```bash
# Restart container
docker restart sip3ntar-web-app

# Stop container
docker stop sip3ntar-web-app

# Start container
docker start sip3ntar-web-app

# Remove container
docker rm -f sip3ntar-web-app
```

### Cleanup & Maintenance

```bash
# Remove unused images
docker image prune -f

# Remove all stopped containers
docker container prune -f

# Full cleanup (WARNING: removes all unused data)
docker system prune -a -f
```

## 🔍 Troubleshooting

### Build Gagal dengan "Out of Memory"

**Solusi:**

1. Pastikan swap aktif:
   ```bash
   free -h
   ```

2. Increase swap size:
   ```bash
   sudo swapoff /swapfile
   sudo fallocate -l 4G /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

3. Close aplikasi lain yang menggunakan memory

4. Build dengan priority rendah:
   ```bash
   nice -n 19 docker build -t sip3ntar-web:latest .
   ```

### Container Restart Terus

**Check logs:**
```bash
docker logs sip3ntar-web-app
```

**Common issues:**
- Port 8080 sudah digunakan: `sudo lsof -i :8080`
- Memory limit terlalu kecil: Increase ke 768m
- Build incomplete: Rebuild image

### Aplikasi Lambat/Unresponsive

**Solutions:**

1. Check memory usage:
   ```bash
   docker stats sip3ntar-web-app
   ```

2. Increase container memory:
   ```bash
   docker update --memory="768m" --memory-swap="1.5g" sip3ntar-web-app
   docker restart sip3ntar-web-app
   ```

3. Check system load:
   ```bash
   top
   htop  # jika tersedia
   ```

## 🎯 Optimizations

### Dockerfile Optimizations

File `Dockerfile` sudah dioptimasi dengan:

- ✅ Multi-stage build untuk image lebih kecil
- ✅ Memory limit 1024MB saat build
- ✅ Standalone output untuk runtime lebih efisien
- ✅ npm cache cleaning untuk reduce disk usage
- ✅ Non-root user untuk security

### Runtime Optimizations

Container settings:
- Memory limit: 512MB
- Memory + Swap: 1GB
- Auto-restart enabled
- Port 8080 (production standard)

## 🌐 Accessing the Application

Setelah deploy sukses:

- **Local:** http://localhost:8080
- **Server IP:** http://YOUR_SERVER_IP:8080

### Setup Nginx Reverse Proxy (Optional)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📝 Environment Variables

Buat file `.env.production` untuk production config:

```env
NODE_ENV=production
PORT=8080
NEXT_TELEMETRY_DISABLED=1
# Add your custom env vars here
```

Update docker-compose.yml atau docker run command:

```bash
docker run -d \
  --env-file .env.production \
  # ... rest of options
```

## 🔐 Security Recommendations

1. **Use non-root user** ✅ (Already implemented)
2. **Limit container resources** ✅ (Already implemented)
3. **Regular updates:**
   ```bash
   docker pull node:20-alpine
   docker-compose build --no-cache
   ```
4. **Setup firewall:**
   ```bash
   sudo ufw allow 8080/tcp
   sudo ufw enable
   ```

## 📈 Performance Tips

1. **Monitor resources:**
   ```bash
   watch -n 1 'docker stats sip3ntar-web-app'
   ```

2. **Setup log rotation:**
   ```bash
   docker run -d \
     --log-driver json-file \
     --log-opt max-size=10m \
     --log-opt max-file=3 \
     # ... rest of options
   ```

3. **Use tmpfs for /tmp:**
   ```bash
   docker run -d \
     --tmpfs /tmp:rw,noexec,nosuid,size=100m \
     # ... rest of options
   ```

## 📞 Support

Jika masih ada masalah:

1. Check logs: `docker logs -f sip3ntar-web-app`
2. Check resources: `free -h && df -h`
3. Verify swap: `swapon --show`
4. Test port: `curl http://localhost:8080`

## 🔄 Update & Redeploy

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
./docker-build.sh

# Atau dengan docker-compose
docker-compose up -d --build
```

---

**Memory Breakdown:**
- Build time: ~1.5GB (with swap support)
- Runtime: ~300-500MB
- Total recommendation: 2GB RAM + 2GB Swap
