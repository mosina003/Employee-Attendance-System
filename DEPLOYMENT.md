# Deployment Guide - Employee Attendance System

## 🚀 Deploy to Render

### Prerequisites
- GitHub account with the repository pushed
- Render account (free tier available at [render.com](https://render.com))
- MongoDB Atlas account (free tier at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))

---

## Step 1: Prepare MongoDB Atlas

1. **Create MongoDB Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Click "Connect" and select "Connect your application"
   - Copy the connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

2. **Configure Network Access**
   - Go to "Network Access" in MongoDB Atlas
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0) for Render deployment

3. **Create Database User**
   - Go to "Database Access"
   - Add a new database user with username and password
   - Give it "Read and Write" permissions

---

## Step 2: Deploy to Render

### Option A: Using Render Dashboard (Recommended)

1. **Create New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `mosina003/Employee-Attendance-System`

2. **Configure Build Settings**
   ```
   Name: employee-attendance-system
   Region: Choose closest to your location
   Branch: main
   Root Directory: (leave blank)
   Environment: Node
   Build Command: npm run render-build
   Start Command: npm start
   ```

3. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable" and add:
   ```
   NODE_ENV=production
   MONGO_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_random_secret_key_here
   PORT=10000
   ```

   **Generate JWT_SECRET:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application
   - Wait for the build to complete (5-10 minutes)

### Option B: Using render.yaml (Blueprint)

1. **From Render Dashboard**
   - Click "New +" → "Blueprint"
   - Select your repository
   - Render will detect `render.yaml` and configure automatically

2. **Add Environment Variables**
   - After blueprint is created, go to the service
   - Add the required environment variables as shown above

---

## Step 3: Verify Deployment

1. **Check Build Logs**
   - Go to your service on Render
   - Click "Logs" to see build progress
   - Look for: `Server is running on port 10000`

2. **Test the Application**
   - Open the Render URL (e.g., `https://employee-attendance-system.onrender.com`)
   - Try logging in with test credentials:
     - Manager: `manager@gmail.com` / `password`
     - Employee: `smosina003@gmail.com` / `password`

3. **Seed the Database (Optional)**
   - If you want to populate with test data, run from Render shell:
   ```bash
   npm run seed
   ```

---

## Step 4: Post-Deployment Configuration

### Update CORS (if needed)
If you encounter CORS errors, update `backend/server.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

### Set Custom Domain (Optional)
1. Go to your Render service → Settings
2. Click "Add Custom Domain"
3. Follow DNS configuration instructions

---

## 📋 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Node environment | `production` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/attendance` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-64-character-random-string` |
| `PORT` | Server port (Render uses 10000) | `10000` |

---

## 🔧 Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Verify all dependencies are in package.json
- Ensure Node version compatibility (>=18.0.0)

### Database Connection Fails
- Verify MONGO_URI is correct
- Check MongoDB Atlas Network Access allows Render IPs
- Ensure database user has correct permissions

### Frontend Not Loading
- Check if build command completed successfully
- Verify `frontend/dist` folder was created
- Check server.js has correct static file serving

### Application Crashes
- Check Render logs for error messages
- Verify all environment variables are set
- Ensure MongoDB connection is stable

---

## 🎯 Production Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Network access allows all IPs (0.0.0.0/0)
- [ ] Database user created with read/write permissions
- [ ] JWT_SECRET generated (64+ characters)
- [ ] All environment variables added to Render
- [ ] Build command completes successfully
- [ ] Application starts without errors
- [ ] Login functionality works
- [ ] API endpoints respond correctly
- [ ] Frontend loads and displays data

---

## 🚀 Free Tier Limits

**Render Free Tier:**
- ✅ Free SSL certificate
- ✅ Automatic deploys from GitHub
- ⚠️ Spins down after 15 minutes of inactivity (cold start ~30 seconds)
- ⚠️ 750 hours/month of runtime

**MongoDB Atlas Free Tier:**
- ✅ 512 MB storage
- ✅ Shared cluster
- ✅ Perfect for development/demo

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 🎉 Success!

Your application should now be live at: `https://employee-attendance-system.onrender.com`

**Default Credentials:**
- **Manager:** manager@gmail.com / password
- **Employee:** smosina003@gmail.com / password

---

## 🔄 Continuous Deployment

Render automatically deploys when you push to the `main` branch:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render will detect changes and redeploy automatically! 🎊
