# 🚀 Vercel Deployment Guide for Krishna-2.0

## ✅ Your Codebase is Now Deployment-Ready!

---

## 📁 What Was Added/Modified

### New Files Created:
1. ✅ `vercel.json` - Monorepo configuration for Vercel
2. ✅ `frontend/.env.production` - Production environment variables
3. ✅ `frontend/.env.development` - Development environment variables
4. ✅ `frontend/.env.local.example` - Example env file template
5. ✅ `backend/api/index.py` - Vercel serverless wrapper
6. ✅ `backend/requirements-vercel.txt` - Vercel-optimized dependencies

### Files Modified:
1. ✅ `frontend/components/Chat.jsx` - Now uses environment variable for API URL

---

## 🎯 Deployment Architecture

Your app will be deployed as a **monorepo** with two services:

```
https://your-app.vercel.app/
├── /                    → Frontend (Next.js)
└── /_/backend/          → Backend API (FastAPI)
```

- **Frontend**: Served at root (`/`)
- **Backend**: Served at `/_/backend/` route
- Both deployed together in one Vercel project

---

## 📝 Step-by-Step Deployment

### Step 1: Push to GitHub/GitLab

1. **Initialize Git** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Krishna-2.0 ready for Vercel"
   ```

2. **Create Repository** on GitHub/GitLab

3. **Push Code**:
   ```bash
   git remote add origin https://github.com/yourusername/krishna-2.0.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Import to Vercel

1. **Go to** [vercel.com](https://vercel.com)
2. **Click** "Add New" → "Project"
3. **Import** your GitHub/GitLab repository
4. **Vercel will detect** the monorepo structure automatically

### Step 3: Configure Environment Variables

In Vercel project settings → Environment Variables, add:

#### Required:
- **Name**: `GEMINI_API_KEY`
- **Value**: `Your_Gemini_API_Key_Here`
- **Environment**: Production, Preview, Development (all)

### Step 4: Deploy

1. **Click** "Deploy"
2. **Wait** ~2-3 minutes for build
3. **Done!** Your app is live

---

## 🔧 Project Settings in Vercel

### Root Directory
- Leave as **root** (Vercel will auto-detect monorepo)

### Build Settings
Vercel will automatically configure:
- **Frontend**: Detected as Next.js
- **Backend**: Detected as Python/FastAPI

### Framework Preset
- **Frontend**: Next.js
- **Backend**: Other (FastAPI)

---

## 🌍 Environment Variables Explained

### Development (Local):
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```
- Frontend talks to local backend on port 8000

### Production (Vercel):
```env
NEXT_PUBLIC_API_URL=/_/backend
```
- Frontend talks to backend via Vercel's internal routing
- Backend accessible at `https://your-app.vercel.app/_/backend`

---

## 📂 File Structure Explanation

```
krishna-2.0/
├── vercel.json                    # Monorepo config
├── frontend/
│   ├── .env.development          # Local dev env vars
│   ├── .env.production           # Production env vars
│   ├── .env.local.example        # Template for local setup
│   ├── components/
│   │   └── Chat.jsx              # Uses process.env.NEXT_PUBLIC_API_URL
│   ├── pages/
│   ├── styles/
│   └── package.json
│
└── backend/
    ├── api/
    │   └── index.py              # Vercel serverless entry point
    ├── app.py                    # Main FastAPI app
    ├── krishna_api.py            # API routes
    ├── krishna_system_prompt.txt # System prompt
    ├── requirements.txt          # Local requirements
    └── requirements-vercel.txt   # Vercel requirements
```

---

## 🔐 Security Best Practices

### DO NOT Commit:
- ❌ `backend/.env` (contains your API key)
- ❌ `frontend/.env.local` (local overrides)
- ❌ `frontend/.next/` (build artifacts)
- ❌ `node_modules/` (dependencies)
- ❌ `backend/__pycache__/` (Python cache)

### Already in .gitignore:
✅ All sensitive files are already ignored

### Vercel Environment Variables:
- Set `GEMINI_API_KEY` in Vercel dashboard
- Never hardcode API keys in code
- Use Vercel's encrypted environment variables

---

## 🧪 Testing Before Deployment

### Test Locally:

1. **Start Backend**:
   ```bash
   python -m backend.run_server
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test** at http://localhost:3001

### Test Production Build Locally:

1. **Build Frontend**:
   ```bash
   cd frontend
   npm run build
   npm start
   ```

2. **Verify** everything works with production env vars

---

## 🚨 Common Issues & Solutions

### Issue 1: "Build Failed" in Vercel
**Solution**: Check build logs for specific errors
- Missing environment variables?
- Syntax errors in code?
- Dependencies not installed?

### Issue 2: "API Not Found" After Deployment
**Solution**: 
- Verify `NEXT_PUBLIC_API_URL` is set to `/_/backend`
- Check backend is deployed in same project
- Look at Vercel deployment logs

### Issue 3: "GEMINI_API_KEY not found"
**Solution**:
- Add environment variable in Vercel dashboard
- Redeploy after adding
- Make sure it's set for Production environment

### Issue 4: Backend Timeout
**Solution**:
- Vercel free tier: 10s timeout
- Upgrade to Pro for 60s timeout
- Or deploy backend separately (Railway, Render)

### Issue 5: Large PDF Upload Fails
**Solution**:
- Vercel has 4.5MB request body limit on free tier
- Pro tier: 500MB limit
- Or deploy backend separately

---

## 🎯 Alternative: Split Deployment

If you prefer to deploy frontend and backend separately:

### Option 1: Frontend on Vercel, Backend on Railway/Render

1. **Deploy Frontend** to Vercel (only `frontend` folder)
2. **Deploy Backend** to Railway/Render
3. **Update** `NEXT_PUBLIC_API_URL` in Vercel to Railway/Render URL

### Option 2: Both on Vercel but Separate Projects

1. **Project 1**: Frontend only
2. **Project 2**: Backend only
3. **Update** frontend env var to point to backend project URL

---

## 📊 Vercel Plans Comparison

### Free (Hobby):
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ⚠️ 10s serverless timeout
- ⚠️ 4.5MB request body limit

### Pro ($20/month):
- ✅ Everything in Free
- ✅ 60s serverless timeout
- ✅ 500MB request body limit
- ✅ Better performance
- ✅ Analytics

**Recommendation**: Start with Free, upgrade if needed for large PDFs/long processing

---

## 🔄 Continuous Deployment

Once set up, Vercel automatically:
- ✅ Deploys on every `git push` to main
- ✅ Creates preview deployments for PRs
- ✅ Runs builds and tests
- ✅ Provides deployment URL instantly

---

## 📱 After Deployment

### Your Live URLs:
- **Production**: `https://your-app.vercel.app`
- **Backend API**: `https://your-app.vercel.app/_/backend`
- **API Test**: `https://your-app.vercel.app/_/backend/krishna2/test`

### Share with Nitigya:
- Send her the live URL
- She can access from any device
- No need to run servers locally
- Always up-to-date with latest code

---

## ✅ Pre-Deployment Checklist

Before deploying, make sure:

- [ ] Code is pushed to GitHub/GitLab
- [ ] `.gitignore` excludes sensitive files
- [ ] `vercel.json` is in root directory
- [ ] Environment variables are ready (GEMINI_API_KEY)
- [ ] Frontend builds successfully locally (`npm run build`)
- [ ] Backend runs without errors locally
- [ ] All dependencies are in `package.json` and `requirements.txt`
- [ ] File uploads work locally

---

## 🎉 You're Ready to Deploy!

Your codebase is now **100% Vercel-ready**. Just:

1. Push to GitHub
2. Import to Vercel
3. Add `GEMINI_API_KEY` environment variable
4. Click Deploy

**Total time**: ~5 minutes 🚀

---

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Python on Vercel](https://vercel.com/docs/functions/runtimes/python)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Need help?** Check Vercel deployment logs for detailed error messages.

**Ready to deploy?** Let's go! 🚀✨
