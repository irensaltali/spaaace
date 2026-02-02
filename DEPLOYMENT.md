# Deployment Guide

This document describes the CI/CD pipeline for building and deploying the Spaaace game server across multiple environments.

## Environments

| Environment | Branch | AWS Region | Domain | Description |
|-------------|--------|------------|--------|-------------|
| **Staging** | `develop` | eu-west-1 | staging.spaaace.online | Pre-production testing |
| **Production** | `master`/`main` | eu-north-1 | spaaace.online | Live environment |

## Architecture

```
┌─────────────┐      Push to branch    ┌─────────────────────────────────────┐
│  spaaace    │ ─────────────────────> │  GitHub Actions                     │
│  (source)   │   develop → staging    │  - Build Docker image               │
│             │   master → production  │  - Run tests                        │
│             │                        │  - Push to ECR (region-specific)    │
│             │                        │  - Trigger spaaace-tf deployment    │
└─────────────┘                        └─────────────────────────────────────┘
                                                         │
                                                         │ repository_dispatch
                                                         │ (includes env, region, tag)
                                                         ▼
                                               ┌──────────────────┐
                                               │   spaaace-tf     │
                                               │   (terraform)    │
                                               │                  │
                                               │  - eu-west-1     │  ← Staging
                                               │  - eu-north-1    │  ← Production
                                               └──────────────────┘
```

## GitHub Actions Workflow

### File: `.github/workflows/docker-build-push.yml`

This workflow automatically determines the environment based on the branch:

**On push to `develop`:**
- Builds Docker image
- Pushes to ECR in **eu-west-1**
- Tags: `staging`, `{sha}`, `latest`
- Triggers deployment to **staging** environment

**On push to `master`/`main`:**
- Builds Docker image
- Pushes to ECR in **eu-north-1**
- Tags: `latest`, `{sha}`
- Triggers deployment to **production** environment

## Docker Image Tags

| Environment | Tags | ECR Repository |
|-------------|------|----------------|
| Staging | `staging`, `{sha}`, `{short-sha}`, `latest` | `spaaace-staging-game` |
| Production | `latest`, `{sha}`, `{short-sha}` | `spaaace-prod-game` |

## Required Secrets

Configure these secrets in your GitHub repository settings:

### For `spaaace` repo:

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS access key (must have access to both regions) |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `TF_REPO_PAT` | Personal Access Token with `repo` scope |

### For `spaaace-tf` repo:

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `SOURCE_REPO_PAT` | PAT for checking out spaaace repo (for website deployment) |

## Workflow

### Staging Deployment

```bash
# 1. Make changes locally
git checkout develop
# ... make changes ...
git add .
git commit -m "feat: new feature"

# 2. Push to develop
git push origin develop

# 3. Automatic deployment:
#    - Docker image built and pushed to eu-west-1
#    - Image tagged as 'staging'
#    - ECS service in staging updated
#    - Website deployed to staging S3 bucket
```

### Production Deployment

```bash
# 1. Merge develop to master/main
git checkout master
git merge develop

# 2. Push to master/main
git push origin master

# 3. Automatic deployment:
#    - Docker image built and pushed to eu-north-1
#    - Image tagged as 'latest'
#    - ECS service in production updated
#    - Website deployed to production S3 bucket
```

## Manual Deployment

If you need to deploy manually or redeploy a specific version:

### Staging

```bash
# Build for staging
docker build -t spaaace-game:staging .

# Login to staging ECR (eu-west-1)
aws ecr get-login-password --region eu-west-1 | \
  docker login --username AWS --password-stdin <account>.dkr.ecr.eu-west-1.amazonaws.com

# Tag and push
docker tag spaaace-game:staging <account>.dkr.ecr.eu-west-1.amazonaws.com/spaaace-staging-game:staging
docker push <account>.dkr.ecr.eu-west-1.amazonaws.com/spaaace-staging-game:staging

# Trigger deployment via GitHub Actions
# Go to spaaace-tf repo → Actions → "Deploy Game" → Run workflow
# Select environment: staging
```

### Production

```bash
# Build for production
docker build -t spaaace-game:latest .

# Login to production ECR (eu-north-1)
aws ecr get-login-password --region eu-north-1 | \
  docker login --username AWS --password-stdin <account>.dkr.ecr.eu-north-1.amazonaws.com

# Tag and push
docker tag spaaace-game:latest <account>.dkr.ecr.eu-north-1.amazonaws.com/spaaace-prod-game:latest
docker push <account>.dkr.ecr.eu-north-1.amazonaws.com/spaaace-prod-game:latest

# Trigger deployment via GitHub Actions
# Go to spaaace-tf repo → Actions → "Deploy Game" → Run workflow
# Select environment: prod
```

## Troubleshooting

### Build fails during test phase
Check that the game server starts correctly and responds on port 3000.

### Push fails
- Verify AWS credentials have access to the correct region
- Ensure ECR repositories exist (run terraform apply in spaaace-tf)

### Deployment not triggered
- Check that `TF_REPO_PAT` is set correctly in `spaaace` repo
- Verify the `irensaltali/spaaace-tf` repository name is correct
- Check GitHub Actions logs for the trigger event

### Wrong environment deployed
- Ensure you're pushing to the correct branch (`develop` for staging, `master` for production)
- Check the branch-to-environment mapping in the workflow file

## Environment-Specific Configuration

The game server receives the `ENVIRONMENT` environment variable:

```javascript
// In your game server code
const environment = process.env.ENVIRONMENT || 'development';

if (environment === 'production') {
  // Production-specific settings
} else if (environment === 'staging') {
  // Staging-specific settings
}
```
