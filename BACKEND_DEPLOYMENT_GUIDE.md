# Bankify Backend Deployment Guide

## Overview
Your backend needs to be deployed to a cloud platform that supports .NET applications. This guide covers the best free/low-cost options.

---

## **OPTION 1: Railway.app (Recommended - Easiest) ⭐**

### Why Railway?
✅ Free tier available (up to 5GB storage)
✅ SQL Server support
✅ Auto-deploys on git push
✅ Environment variables management included

### Steps:

1. **Sign Up & Create Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Authorize Railway to access your repos

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Choose your `Bankify-Application` repository
   - Select the `main` branch

3. **Configure Environment Variables**
   - In Railway dashboard → Settings → Variables
   - Add these variables:
   ```
   ConnectionStrings__DefaultConnection=your-database-connection-string
   Jwt__Key=YOUR_SUPER_SECRET_JWT_KEY_MIN_32_CHARS
   Jwt__Issuer=https://your-railway-app-url.railway.app
   Jwt__Audience=BankifyClient
   AllowedOrigins=https://your-app-name.vercel.app
   ASPNETCORE_ENVIRONMENT=Production
   ```

4. **Add Database**
   - In Railway → New → Database → PostgreSQL (or MySQL)
   - Railway will auto-populate the connection string
   - Get the connection string from the database settings
   - Format it for SQL Server or use PostgreSQL

5. **Deploy**
   - Railway auto-detects .NET project
   - Builds and deploys automatically
   - Your API will be live at: `https://your-app-name.railway.app/api`

---

## **OPTION 2: Azure (Free Trial - $200 Credit)**

### Steps:

1. **Create Azure Account**
   - Go to [azure.microsoft.com/free](https://azure.microsoft.com/en-us/free)
   - Sign up with Microsoft account
   - Get $200 free credit for 30 days

2. **Create App Service**
   - In Azure Portal → Create Resource → App Service
   - Runtime: .NET 8.0 (or your version)
   - Tier: Free (F1)

3. **Create SQL Database**
   - Create Resource → SQL Database
   - Server: Create new
   - Pricing: DTU model, Basic tier ($5/month after trial)

4. **Deploy Code**
   - Option A: Git deployment via Azure DevOps
   - Option B: Publish from Visual Studio
   - Option C: Use ZIP file deployment

5. **Configure Connection String**
   - App Service → Configuration → Connection Strings
   - Add your SQL Server connection string

6. **Set Environment Variables**
   - App Service → Configuration → Application settings
   - Add all variables from Railway section above

---

## **OPTION 3: Render.com (Simple Alternative)**

### Steps:

1. **Sign Up**
   - Go to [render.com](https://render.com)
   - Connect GitHub account

2. **Create Web Service**
   - New → Web Service
   - Connect to your GitHub repo
   - Root directory: `MyApplication/WebAPI`
   - Build command: `dotnet build`
   - Start command: `dotnet MyApplication/WebAPI/bin/Release/net10.0/WebAPI.dll`

3. **Add Environment**
   - Set environment variables in dashboard
   - Add PostgreSQL database
   - No free tier - starts at $7/month

---

## **Step-by-Step for Railway (Recommended)**

### 1. Install Railway CLI (Optional but helpful)
```bash
npm i -g @railway/cli
railway login
```

### 2. Create railway.json in project root
```json
{
  "build": {
    "builder": "nixpacks"
  }
}
```

### 3. Push to GitHub
```bash
git add .
git commit -m "Add production configuration"
git push origin main
```

### 4. Deploy via Railway Dashboard
- New Project → Deploy from GitHub
- Select `Bankify-Application`
- Watch the deployment logs
- Get your API URL from the dashboard

### 5. Update Frontend Environment Variables

In Vercel:
- Go to Settings → Environment Variables
- Update `REACT_APP_API_URL` to your Railway API URL:
  ```
  REACT_APP_API_URL=https://your-railway-app.railway.app/api
  ```
- Redeploy frontend

### 6. Update appsettings.Production.json
```json
{
  "AllowedOrigins": "https://your-app-name.vercel.app",
  "ConnectionStrings": {
    "DefaultConnection": "Your-Railway-DB-Connection-String"
  }
}
```

---

## **Database Migration to Production**

### Option A: Migrate from Local SQL Server to Railway PostgreSQL

1. **Export data from local DB**
   ```bash
   cd MyApplication/WebAPI
   dotnet ef migrations script > migration.sql
   ```

2. **Run migrations on production**
   ```bash
   dotnet ef database update --project WebAPI --startup-project WebAPI
   ```

### Option B: Use SQL Server on Azure/Railway

1. **Get production connection string**
2. **Update appsettings.Production.json**
3. **Deploy - migrations run automatically**

---

## **Troubleshooting**

### Build Fails
- Check logs in Railway dashboard
- Ensure correct runtime (.NET version)
- Verify project file has correct output type

### Database Connection Error
- Check connection string format
- Verify firewall rules allow connections
- Test connection locally first

### CORS Errors
- Update `AllowedOrigins` in environment variables
- Ensure Vercel URL is correct
- Redeploy backend

### JWT Token Issues
- Ensure `Jwt__Key` is at least 32 characters
- Use same secret in all environments
- Check token expiration in appsettings

---

## **Monitoring & Logs**

### Railway
- Dashboard → Your App → Logs tab
- Real-time log streaming
- Error tracking

### Azure
- Portal → App Service → Log Stream
- Application Insights for detailed monitoring

---

## **Production Checklist**

- [ ] Database migrated to production
- [ ] Environment variables set correctly
- [ ] CORS configured for Vercel URL
- [ ] JWT key is secure (32+ characters)
- [ ] Connection string uses production database
- [ ] Frontend API URL points to production backend
- [ ] HTTPS enabled
- [ ] Logs being captured
- [ ] Backups configured
- [ ] Testing API endpoints with Postman

---

## **After Deployment**

1. **Test API Endpoints**
   ```bash
   # Test health check
   curl https://your-api-url/health
   
   # Test login
   curl -X POST https://your-api-url/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password"}'
   ```

2. **Verify Frontend Connection**
   - Open your Vercel app
   - Check browser Network tab for API calls
   - Verify data is loading from backend

3. **Monitor Logs**
   - Watch logs during peak usage
   - Monitor error rates
   - Check database performance

---

## **My Recommendation**

**Use Railway for simplicity:**
1. Easiest setup (5 minutes)
2. Free tier sufficient for learning
3. Automatic deployments
4. Included PostgreSQL database
5. Great documentation

**Then upgrade to Azure/Render when:**
- You need SQL Server specifically
- You want longer free trial ($200)
- You need more resources

---

Need help with a specific platform? Let me know!
