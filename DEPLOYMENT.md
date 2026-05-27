# PostFlow AI Deployment Guide

This guide covers deploying your PostFlow AI dashboard to production.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Tested form submission
- [ ] Recent posts table loads and updates
- [ ] n8n webhook URL verified and accessible
- [ ] Docker build tested (if using Docker)
- [ ] TypeScript builds without errors

## Option 1: Docker Deployment to VPS

### Prerequisites

- Docker installed on your VPS
- SSH access to your server
- Domain name (optional but recommended)

### Steps

1. **Copy project to VPS**:
   ```bash
   scp -r /path/to/postflow-ai user@your-vps.com:/home/user/postflow-ai
   ```

2. **SSH into your VPS**:
   ```bash
   ssh user@your-vps.com
   ```

3. **Build Docker image**:
   ```bash
   cd /home/user/postflow-ai
   docker build -t postflow-ai:v1 .
   ```

4. **Create .env file on VPS**:
   ```bash
   cat > .env.production << EOF
   N8N_WEBHOOK_URL=https://n8n.postflow-aiagency.com/webhook/publisher
   EOF
   ```

5. **Run container**:
   ```bash
   docker run -d \
     --name postflow-ai \
     --restart unless-stopped \
     -p 3000:3000 \
     --env-file .env.production \
     postflow-ai:v1
   ```

6. **Verify deployment**:
   ```bash
   curl http://localhost:3000/api/posts
   ```

### Using Nginx Reverse Proxy

If you want to expose the app on port 80/443:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
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

## Option 2: Vercel Deployment

### Steps

1. **Push to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   ```bash
   pnpm install -g vercel
   vercel
   ```

3. **Configure environment variables** in Vercel dashboard:
   - Go to Settings → Environment Variables
   - Add: `N8N_WEBHOOK_URL` = your webhook URL

4. **Deploy**:
   ```bash
   vercel --prod
   ```

## Option 3: Traditional VPS Deployment (No Docker)

### Prerequisites

- Node.js 22+ on your VPS
- pnpm or npm installed
- PM2 for process management (optional but recommended)

### Steps

1. **SSH into VPS**:
   ```bash
   ssh user@your-vps.com
   ```

2. **Clone/copy repository**:
   ```bash
   cd /home/user
   git clone https://github.com/yourusername/postflow-ai.git
   cd postflow-ai
   ```

3. **Install dependencies**:
   ```bash
   pnpm install --frozen-lockfile
   ```

4. **Build for production**:
   ```bash
   pnpm build
   ```

5. **Create environment file**:
   ```bash
   cat > .env.production.local << EOF
   N8N_WEBHOOK_URL=https://n8n.postflow-aiagency.com/webhook/publisher
   NODE_ENV=production
   EOF
   ```

6. **Start with PM2**:
   ```bash
   npm install -g pm2
   pm2 start "pnpm start" --name "postflow-ai"
   pm2 save
   pm2 startup
   ```

7. **Setup Nginx** (same as Docker option above)

## Post-Deployment Verification

1. **Check application is running**:
   ```bash
   curl http://your-domain/api/posts
   ```

2. **Verify webhook integration**:
   - Go to http://your-domain
   - Create a test post
   - Check n8n logs to verify webhook received the request

3. **Monitor logs**:
   - Docker: `docker logs -f postflow-ai`
   - PM2: `pm2 logs postflow-ai`
   - Traditional: Check application logs

## SSL/TLS Setup with Let's Encrypt

If using Nginx with certbot:

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Environment Variables

- `N8N_WEBHOOK_URL`: Your n8n webhook URL (required)
- `NODE_ENV`: Set to `production` for production builds

## Monitoring and Maintenance

### Health Check

Add a health endpoint monitor to check:
```bash
curl -f http://your-domain/api/posts || alert
```

### Log Rotation

For Docker, logs are automatically managed. For traditional deployments:
```bash
# Using logrotate
sudo nano /etc/logrotate.d/postflow-ai
```

### Updates

To update the application:

**Docker**:
```bash
docker pull yourusername/postflow-ai:latest
docker stop postflow-ai
docker rm postflow-ai
docker run -d ... yourusername/postflow-ai:latest
```

**Traditional**:
```bash
cd /home/user/postflow-ai
git pull origin main
pnpm install
pnpm build
pm2 restart postflow-ai
```

## Troubleshooting

### Application won't start

1. Check logs: `docker logs postflow-ai` or `pm2 logs`
2. Verify environment variables are set
3. Check Node.js version: `node --version` (should be 22+)

### Webhook integration not working

1. Test webhook URL locally: `curl https://n8n.postflow-aiagency.com/webhook/publisher`
2. Check firewall rules allow outbound HTTPS
3. Verify `N8N_WEBHOOK_URL` environment variable is set correctly
4. Check n8n logs for incoming requests

### Performance issues

1. Check server resources: `top`, `df -h`
2. Enable caching for `/api/posts` if needed
3. Consider horizontal scaling with load balancer

## Security Hardening

1. **Keep dependencies updated**:
   ```bash
   pnpm update
   ```

2. **Setup Web Application Firewall** (WAF):
   - Consider Cloudflare or AWS WAF

3. **Enable HTTPS** everywhere

4. **Setup backup strategy** for any persistent data

5. **Monitor for security updates**:
   ```bash
   pnpm audit
   ```

## Support

For issues or questions, check:
- Application logs
- n8n webhook logs
- Browser console (DevTools)
- Server system logs (`journalctl`, `dmesg`)
