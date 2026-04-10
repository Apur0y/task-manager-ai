# Vercel Deployment Guide

## Pre-Deployment Checklist

### 1. **Build Configuration** ✅
- `vercel.json` created with proper build settings
- `package.json` includes Node engine specification (18.x)
- Build command configured: `npm run build`
- Output directory: `dist`

### 2. **Environment Variables Setup** ✅
- `.env.example` created with template variables
- REQUIRED environment variables for Vercel:
  - `MONGO_URI` - MongoDB connection string
  - `GEMINI_API_KEY` - Google Gemini API key
  - `OPENAI_API_KEY` - OpenAI API key (optional)
  - `CORS_ORIGIN` - Frontend domain URL
  - `NODE_ENV` - Set to "production"

### 3. **Git Repository** ✅
- `.gitignore` configured properly
- `.vercelignore` created to optimize build

---

## Deployment Steps

### Step 1: Prepare Your Git Repository
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Connect to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel --prod
```

#### Option B: Using Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js/Node.js setup
6. Click "Deploy"

### Step 3: Configure Environment Variables in Vercel

1. Go to your project settings in Vercel dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add the following variables:
   - `MONGO_URI` - Your MongoDB Atlas connection string
   - `GEMINI_API_KEY` - Your Gemini API key
   - `OPENAI_API_KEY` - Your OpenAI API key (if using)
   - `CORS_ORIGIN` - Your frontend domain (e.g., `https://yourdomain.com`)
   - `PORT` - 5000 (optional, Vercel assigns automatically)

### Step 4: Redeploy with Environment Variables

After adding environment variables, trigger a new deployment:
```bash
vercel --prod
```
Or click "Redeploy" in Vercel dashboard

---

## Verification Checklist

- [ ] Build completes successfully (check deployment logs)
- [ ] Health check endpoint works: `https://your-deployment.vercel.app/api/health`
- [ ] Database connection established (check logs for "DB Connected")
- [ ] CORS is properly configured for your frontend domain
- [ ] All environment variables are set in Vercel dashboard

---

## Troubleshooting

### Build Fails
1. Check `tsconfig.json` - should match your src structure
2. Verify all TypeScript types are installed
3. Run `npm run build` locally to test

### Database Connection Issues
- Verify `MONGO_URI` is correct and accessible
- Check MongoDB whitelist includes Vercel IP addresses
- For MongoDB Atlas: Add 0.0.0.0/0 to IP Whitelist (or specific Vercel region IPs)

### CORS Errors
- Ensure `CORS_ORIGIN` in `.env` matches your frontend domain exactly
- Should NOT include trailing slash in domain

### API Returns 502/503
1. Check Vercel deployment logs for errors
2. Verify all environment variables are set
3. Check if external API keys (Gemini, OpenAI) are valid

---

## Production Environment Variables Template

```env
# MongoDB Connection - Use Atlas cluster
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/task-manager?retryWrites=true&w=majority

# API Keys
GEMINI_API_KEY=your_production_gemini_key
OPENAI_API_KEY=your_production_openai_key

# Frontend Configuration
CORS_ORIGIN=https://your-frontend-domain.com

# Logging
LOG_LEVEL=info

# General
NODE_ENV=production
```

---

## Monitoring After Deployment

### View Logs
```bash
vercel logs [deployment-url]
```

### Check Deployments
- Dashboard: Settings → Deployments
- CLI: `vercel list`

### Rollback if Needed
- Dashboard: Click on previous deployment → "Redeploy"
- CLI: `vercel rollback`

---

## Additional Resources

- [Vercel Node.js Documentation](https://vercel.com/docs/functions/runtimes/node-js)
- [Express on Vercel](https://vercel.com/guides/using-express-with-vercel)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Deployment Troubleshooting](https://vercel.com/docs/deployments/troubleshooting)

---

## Current Project Info

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **Main Entry**: `dist/server.js`
- **Build Output**: `dist/`
- **Health Check**: `GET /api/health`
