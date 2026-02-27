# PDF2Word Pro - Deployment Guide

## Deploy to Render.com (Free)

### Prerequisites:
1. GitHub account
2. Render account (sign up at render.com)

### Step-by-Step Deployment:

#### 1. Push Code to GitHub

```bash
# Initialize git in your project root
cd D:\rohitkurade\projects\pdf_to_word_convertor\pdf-word-converter
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - PDF2Word Pro"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/pdf-word-converter.git
git branch -M main
git push -u origin main
```

#### 2. Deploy on Render

**Option A: Using Dashboard (Recommended)**

1. Go to https://render.com and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** `pdf2word-pro-api`
   - **Region:** Oregon (or closest to you)
   - **Branch:** `main`
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `npm install && pip install -r requirements.txt`
   - **Start Command:** `node server.js`
   - **Plan:** Free

5. Click "Create Web Service"

**Option B: Using Blueprint (render.yaml)**

1. Go to Render Dashboard
2. Click "New +" → "Blueprint"
3. Connect your repository
4. Render will auto-detect `render.yaml`
5. Click "Apply"

#### 3. Wait for Deployment
- First deploy takes 5-10 minutes
- You'll get a URL like: `https://pdf2word-pro-api.onrender.com`

#### 4. Test Your API
```bash
curl https://your-app-name.onrender.com/health
```

#### 5. Update Frontend
Update the API URL in your React app:

**File:** `client/src/components/FileUpload.jsx`

Replace:
```javascript
xhr.open('POST', 'http://localhost:5000/upload')
```

With:
```javascript
xhr.open('POST', 'https://your-app-name.onrender.com/upload')
```

**Also update in:** `client/src/App.jsx`
```javascript
const response = await fetch('https://your-app-name.onrender.com/stats')
```

#### 6. Rebuild React App
```bash
cd client
npm run build
npx cap sync android
```

## Important Notes:

⚠️ **Free Tier Limitations:**
- Server sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- 750 hours/month free (enough for testing)

💡 **Solutions:**
- Use cron-job.org to ping your API every 10 minutes
- Upgrade to paid plan ($7/month) for always-on service

## Environment Variables (Optional):
In Render dashboard, you can add:
- `NODE_ENV=production`
- `MAX_FILE_SIZE=10485760` (10MB)

## Your API Endpoints:
- **Health Check:** `GET /health`
- **Stats:** `GET /stats`
- **Convert:** `POST /upload`
- **Root:** `GET /`

## Troubleshooting:

**Build Failed?**
- Check Render logs for errors
- Ensure Python 3.11+ is available
- Verify all dependencies are in requirements.txt

**Conversion Fails?**
- Check server logs in Render dashboard
- LibreOffice might not work on Render free tier
- Consider using only PDF→DOCX (which uses Python)

**Timeout Errors?**
- Large files take time
- Free tier has 30-second request timeout
- Consider upgrading or implementing queue system

## Next Steps:
1. Deploy server to Render
2. Get your API URL
3. Update frontend with new URL
4. Rebuild Android app
5. Test thoroughly
6. Submit to Play Store!

Good luck! 🚀
