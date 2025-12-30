# Quick Deployment Guide

## Frontend Only Deployment to Vercel

### Step 1: Set Environment Variable
In Vercel Dashboard → Settings → Environment Variables, add:
```
VITE_API_URL=http://your-backend-server:5000/api
```

Replace `http://your-backend-server:5000/api` with your actual backend URL.

### Step 2: Push to GitHub
```bash
git add .
git commit -m "Deploy frontend to Vercel"
git push origin main
```

### Step 3: Deploy
Vercel will automatically detect changes and redeploy.

### Step 4: Test
Visit your Vercel URL and the app will call your backend server.

---

## Backend Setup (Run Separately)

Run your backend server on your own server/machine:
```bash
cd backend
npm install
npm start
```

Make sure:
- Backend is accessible from the internet
- Database credentials are correct
- CORS is configured to allow your Vercel domain

Update backend/server.js CORS origin if needed:
```javascript
origin: process.env.FRONTEND_URL || 'https://your-vercel-domain.vercel.app'
```
