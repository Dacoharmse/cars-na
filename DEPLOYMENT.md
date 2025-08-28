# Deployment Workflow for Cars.na

## Local Development Setup ✅ COMPLETED

The repository is configured with the following remotes:
- **origin**: GitHub repository (https://github.com/Dacoharmse/cars-na.git)
- **vps**: Production VPS (ssh://root@45.8.226.60/home/carsna/htdocs/cars.na/cars-na)

## Deployment Workflow

### Standard Development Flow
1. **Develop locally** on your machine
2. **Push to GitHub**: `git push origin main`
3. **SSH to VPS**: `ssh root@45.8.226.60`
4. **Deploy**: Run `deploy-cars` or `/home/carsna/deploy.sh`

### Quick Commands
```bash
# Push changes to GitHub
git push origin main

# SSH to VPS
ssh root@45.8.226.60

# Deploy on VPS
deploy-cars
# OR
/home/carsna/deploy.sh
```

## Automated Deployment Options

### Option 1: GitHub Webhook
- Go to repository settings on GitHub
- Add webhook URL: `https://cars.na/api/deploy`
- This requires creating the webhook endpoint in your application

### Option 2: GitHub Actions
- Set up automated deployment pipeline
- Triggers on push to main branch
- Automatically deploys to VPS

## Remote Configuration
- **origin**: Used for GitHub integration and collaboration
- **vps**: Direct connection to production server for manual deployments