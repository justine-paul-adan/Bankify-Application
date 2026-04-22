# Frontend + Backend Deployment Quick Reference

## Frontend (Vercel) ✅ READY
- [x] All ESLint errors fixed
- [x] Compiled successfully
- [x] API URL configured with environment variables
- [x] .env.local created for local development

**Files Updated:**
- `src/services/api.tsx` - Now uses `REACT_APP_API_URL` env var
- `.env.local` - Local development API URL

---

## Backend Deployment Checklist

### Prerequisites
- [ ] GitHub repository created and pushed
- [ ] All code committed to `main` branch
- [ ] .gitignore file configured

### Choose Your Platform

#### **🎯 Recommended: Railway.app**

**Local Testing First:**
```bash
# Test your backend locally
cd MyApplication/WebAPI
dotnet run

# In another terminal, test API
curl https://localhost:7239/api
```

**Deploy Steps:**
1. [ ] Go to [railway.app](https://railway.app)
2. [ ] Sign up with GitHub
3. [ ] Create New Project → Deploy from GitHub
4. [ ] Select `Bankify-Application` repo
5. [ ] Add environment variables:
   - `ConnectionStrings__DefaultConnection=your-db-string`
   - `Jwt__Key=YOUR_32_CHAR_SECRET_KEY`
   - `Jwt__Issuer=https://your-railway-app.railway.app`
   - `AllowedOrigins=https://your-vercel-app.vercel.app`
   - `ASPNETCORE_ENVIRONMENT=Production`
6. [ ] Add PostgreSQL database from Railway dashboard
7. [ ] Wait for deployment to complete
8. [ ] Get API URL from dashboard (e.g., `https://app-name.railway.app`)

**OR Choose Alternative:**
- [ ] Azure (Free $200 trial) - See BACKEND_DEPLOYMENT_GUIDE.md
- [ ] Render.com ($7/month minimum)

---

## Connect Frontend to Backend

### Step 1: Get Backend API URL
- Railway: `https://your-app-name.railway.app/api`
- Azure: `https://your-app-name.azurewebsites.net/api`
- Render: `https://your-app-name.onrender.com/api`

### Step 2: Update Vercel Environment Variables
1. Go to [vercel.com](https://vercel.com)
2. Select your `Bankify-Application` project
3. Settings → Environment Variables
4. Add new variable:
   ```
   Name: REACT_APP_API_URL
   Value: https://your-backend-url/api
   Environments: Production, Preview, Development
   ```
5. Redeploy

### Step 3: Test Connection
1. Open your Vercel app in browser
2. Open DevTools → Network tab
3. Try logging in or fetching data
4. Check that API calls go to your backend URL
5. Verify data loads correctly

---

## Production URLs Template

After deployment, your URLs will be:

**Frontend (Vercel)**
```
https://bankify-app.vercel.app
```

**Backend API (Railway)**
```
https://bankify-api.railway.app/api
```

**Database Connection**
```
Your-Production-Database-Connection-String
```

---

## Environment Variables Summary

### Frontend (.env in Vercel)
```
REACT_APP_API_URL=https://your-backend-url/api
```

### Backend (appsettings.Production.json + Railway)
```
ConnectionStrings__DefaultConnection=your-db-connection
Jwt__Key=YOUR_STRONG_SECRET_KEY
Jwt__Issuer=https://your-backend-url
Jwt__Audience=BankifyClient
AllowedOrigins=https://your-vercel-app.vercel.app
ASPNETCORE_ENVIRONMENT=Production
```

---

## Testing API Endpoints

After deployment, test with Postman:

### 1. Health Check
```
GET https://your-backend-url/api/health
```

### 2. Login
```
POST https://your-backend-url/api/auth/login
Content-Type: application/json

{
  "email": "admin@bankify.com",
  "password": "YourPassword"
}
```

### 3. Get Accounts
```
GET https://your-backend-url/api/accounts
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Troubleshooting

### Frontend shows "API Connection Error"
- [ ] Check backend URL in Vercel env vars
- [ ] Verify backend is running (`curl https://backend-url/api`)
- [ ] Check CORS settings in Program.cs
- [ ] Redeploy frontend after changing env vars

### CORS Error in Browser Console
- [ ] Update `AllowedOrigins` in backend
- [ ] Include `https://` in the URL
- [ ] Redeploy backend

### Database Connection Failed
- [ ] Verify connection string is correct
- [ ] Check database credentials
- [ ] Ensure firewall allows connections
- [ ] Check logs in Railway dashboard

### Login not working
- [ ] Verify database has user records
- [ ] Check JWT key is set correctly (32+ chars)
- [ ] Run migrations: `dotnet ef database update`

---

## Final Verification

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway/Azure/Render
- [ ] Database created and migrated
- [ ] Environment variables set on both platforms
- [ ] Frontend can connect to backend API
- [ ] Login functionality works
- [ ] Can fetch data (accounts, users, transactions)
- [ ] CORS errors resolved
- [ ] SSL certificates working (HTTPS)

---

## Support Resources

- [Railway Docs](https://docs.railway.app/)
- [Azure .NET Deployment](https://learn.microsoft.com/en-us/azure/app-service/quickstart-dotnetcore)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [ASP.NET Core CORS](https://learn.microsoft.com/en-us/aspnet/core/security/cors)

---

**Ready to deploy? Start with Railway - it's the quickest! 🚀**
