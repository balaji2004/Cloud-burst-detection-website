# 🔥 Complete Firebase Setup Guide

## Step-by-Step Firebase Configuration

This guide will help you set up Firebase from scratch and connect it to your dashboard.

---

## Part 1: Create Firebase Project (If You Haven't Already)

### 1. Go to Firebase Console

Visit: **https://console.firebase.google.com/**

### 2. Create New Project

1. Click **"Add project"** or **"Create a project"**
2. Enter project name: `cloudburst-detection` (or any name you prefer)
3. Click **Continue**
4. (Optional) Enable Google Analytics
5. Click **Create project**
6. Wait for project to be created
7. Click **Continue**

### 3. Enable Realtime Database

1. In the left sidebar, click **Build** → **Realtime Database**
2. Click **"Create Database"**
3. Choose location: **United States** (or closest to you)
4. Select **"Start in test mode"** (for now)
5. Click **Enable**

Your database is now created! ✅

---

## Part 2: Get Firebase Configuration Credentials

### 1. Register Your Web App

1. In Firebase Console, go to **Project Overview** (home icon)
2. Click the **Web icon** `</>` (below "Get started by adding Firebase to your app")
3. Enter app nickname: `cloudburst-dashboard` (or any name)
4. **DON'T** check "Firebase Hosting" (not needed yet)
5. Click **Register app**

### 2. Copy Your Configuration

You'll see a code snippet like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefghijklmnopqrstuv",
  authDomain: "cloudburst-detection-12345.firebaseapp.com",
  databaseURL: "https://cloudburst-detection-12345-default-rtdb.firebaseio.com",
  projectId: "cloudburst-detection-12345",
  storageBucket: "cloudburst-detection-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

**⚠️ IMPORTANT: Copy these values! You'll need them in the next step.**

---

## Part 3: Configure Your Project

### Option A: Using Environment Variables (RECOMMENDED)

#### Step 1: Create `.env.local` file

In your project root (`cloudburst-detection/` folder), create a file named **`.env.local`**

**On Windows (PowerShell):**
```powershell
cd cloudburst-detection
New-Item -Path ".env.local" -ItemType File
```

**On Windows (Command Prompt):**
```cmd
cd cloudburst-detection
type nul > .env.local
```

**Or manually:** Create a new file in VS Code/Cursor named `.env.local` in the `cloudburst-detection` folder

#### Step 2: Add Your Firebase Credentials

Open `.env.local` and paste this, replacing the values with YOUR Firebase config:

```env
# Firebase Configuration for Cloudburst Detection Dashboard
# Get these values from Firebase Console > Project Settings > General

# API Key (looks like: AIzaSyC...)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuv

# Auth Domain (looks like: your-project.firebaseapp.com)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cloudburst-detection-12345.firebaseapp.com

# Database URL (MUST include https:// and -default-rtdb)
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://cloudburst-detection-12345-default-rtdb.firebaseio.com

# Project ID (looks like: your-project-12345)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cloudburst-detection-12345

# Storage Bucket (looks like: your-project.appspot.com)
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cloudburst-detection-12345.appspot.com

# Messaging Sender ID (looks like: 123456789012)
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012

# App ID (looks like: 1:123456789012:web:abc...)
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef
```

**⚠️ CRITICAL:**
- All variables MUST start with `NEXT_PUBLIC_`
- No spaces around the `=` sign
- No quotes around values
- Database URL must include `https://` and end with `-default-rtdb.firebaseio.com`

#### Step 3: Update `firebase.js` to Use Environment Variables

Open `src/lib/firebase.js` and replace the entire file with this:

```javascript
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, update, remove, query, limitToLast } from 'firebase/database';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Log configuration status (for debugging)
console.log('🔥 Firebase Configuration Status:');
console.log('- API Key:', firebaseConfig.apiKey ? '✅ Set' : '❌ Missing');
console.log('- Database URL:', firebaseConfig.databaseURL || '❌ Missing');
console.log('- Project ID:', firebaseConfig.projectId || '❌ Missing');

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message);
  throw error;
}

// Initialize Realtime Database
export const database = getDatabase(app);

// Export Firebase functions for use in components
export { ref, set, get, onValue, update, remove, query, limitToLast };
```

#### Step 4: Restart Development Server

**IMPORTANT:** Environment variables only load when the server starts.

1. **Stop** the current dev server (Ctrl+C in terminal)
2. **Start** it again:
   ```bash
   npm run dev
   ```

---

### Option B: Direct Configuration (NOT RECOMMENDED for Production)

If you want to test quickly without environment variables:

Open `src/lib/firebase.js` and replace the placeholder values directly:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefghijklmnopqrstuv",
  authDomain: "cloudburst-detection-12345.firebaseapp.com",
  databaseURL: "https://cloudburst-detection-12345-default-rtdb.firebaseio.com",
  projectId: "cloudburst-detection-12345",
  storageBucket: "cloudburst-detection-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

**⚠️ WARNING:** This method exposes your credentials if you commit to Git. Use Option A for production!

---

## Part 4: Configure Firebase Database Rules

### For Testing (Permissive - NOT for Production)

1. In Firebase Console, go to **Realtime Database**
2. Click the **Rules** tab
3. Replace the rules with this:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

4. Click **Publish**

**⚠️ WARNING:** These rules allow anyone to read/write. Only use for testing!

### For Production (Secure)

```json
{
  "rules": {
    "nodes": {
      ".read": "auth != null",
      "$nodeId": {
        ".write": "auth != null && (auth.uid == data.child('metadata/createdBy').val() || root.child('admins').child(auth.uid).exists())"
      }
    }
  }
}
```

This requires authentication. Implement Firebase Auth first.

---

## Part 5: Add Sample Data to Firebase

### Method 1: Import JSON File

1. In Firebase Console, go to **Realtime Database**
2. Click the **⋮** (three dots) menu next to your database URL
3. Select **"Import JSON"**
4. Click **"Browse"** and select `firebase-sample-data.json` from your project
5. Click **"Import"**

### Method 2: Manual Entry (for testing)

1. In Firebase Console, go to **Realtime Database**
2. Click the **+** icon next to your database root
3. Name: `nodes`
4. Click **+** again under `nodes`
5. Name: `node1`
6. Add fields manually:
   - `metadata/nodeId`: `node1`
   - `metadata/name`: `Test Sensor`
   - `metadata/latitude`: `28.6139`
   - `metadata/longitude`: `77.2090`
   - `realtime/temperature`: `25.5`
   - `realtime/pressure`: `912.0`
   - `realtime/lastSeen`: `[current timestamp in milliseconds]`

### Method 3: Use Firebase Console Web Interface

Copy this and paste directly into Firebase Console (Data tab):

```json
{
  "nodes": {
    "node1": {
      "metadata": {
        "nodeId": "node1",
        "type": "node",
        "name": "Test Sensor",
        "latitude": 28.6139,
        "longitude": 77.2090,
        "altitude": 878.9,
        "status": "active"
      },
      "realtime": {
        "temperature": 25.7,
        "pressure": 912.0,
        "humidity": 68.5,
        "rssi": -52,
        "timestamp": 1736934615000,
        "lastSeen": 1736934615000,
        "status": "online",
        "alertStatus": "normal"
      }
    }
  }
}
```

---

## Part 6: Verify Connection

### 1. Check Browser Console

1. Open your dashboard: `http://localhost:3000/dashboard`
2. Open browser console (Press **F12** → **Console** tab)
3. Look for these messages:

**✅ Success:**
```
🔥 Firebase Configuration Status:
- API Key: ✅ Set
- Database URL: https://your-project-default-rtdb.firebaseio.com
- Project ID: your-project
✅ Firebase initialized successfully
🔥 Initializing Firebase listener...
📦 Firebase data received: {nodes: {...}}
✅ Processed 1 valid nodes
```

**❌ Error:**
```
❌ Firebase initialization error: Invalid API key
```
or
```
❌ Firebase error: PERMISSION_DENIED: Permission denied
```

### 2. Test Real-time Updates

1. Keep dashboard open
2. Open Firebase Console in another tab
3. Go to **Realtime Database**
4. Navigate to `nodes/node1/realtime/temperature`
5. Click the value and change it (e.g., from 25.7 to 30.0)
6. Press Enter to save
7. **Watch your dashboard update instantly!** ✨

If the value updates in real-time, your connection is working! 🎉

---

## Common Issues & Solutions

### ❌ Issue: "Firebase not initialized"

**Solution:**
- Check that `.env.local` exists in `cloudburst-detection/` folder
- Verify all `NEXT_PUBLIC_` variables are set
- Restart dev server after creating `.env.local`

### ❌ Issue: "PERMISSION_DENIED"

**Solution:**
- Go to Firebase Console → Realtime Database → Rules
- Set to test mode rules (see Part 4)
- Click Publish

### ❌ Issue: "Invalid API key"

**Solution:**
- Double-check API key in `.env.local` matches Firebase Console
- No spaces around `=` sign
- No quotes around values
- API key should start with `AIzaSy`

### ❌ Issue: "Database URL is not valid"

**Solution:**
- Must include `https://`
- Must end with `-default-rtdb.firebaseio.com`
- Example: `https://your-project-default-rtdb.firebaseio.com`

### ❌ Issue: "No nodes found"

**Solution:**
- Import `firebase-sample-data.json` to Firebase
- Or manually add a node in Firebase Console
- Check that node has `metadata.latitude` and `metadata.longitude`

### ❌ Issue: Environment variables not loading

**Solution:**
- File MUST be named exactly `.env.local` (with the dot)
- File MUST be in `cloudburst-detection/` folder (same level as `package.json`)
- Variables MUST start with `NEXT_PUBLIC_`
- Must restart dev server after changes

---

## Verification Checklist

Before proceeding, verify each step:

- [ ] Firebase project created
- [ ] Realtime Database enabled
- [ ] Web app registered
- [ ] Configuration credentials copied
- [ ] `.env.local` file created
- [ ] All 7 environment variables set
- [ ] `firebase.js` updated to use environment variables
- [ ] Dev server restarted
- [ ] Database rules set to test mode
- [ ] Sample data imported
- [ ] Browser console shows success messages
- [ ] Dashboard loads without errors
- [ ] Markers appear on map
- [ ] Real-time updates work

---

## File Structure

After setup, you should have:

```
cloudburst-detection/
├── .env.local              ← YOUR CREDENTIALS (never commit!)
├── firebase-sample-data.json
├── src/
│   ├── lib/
│   │   └── firebase.js     ← Updated to use env vars
│   └── app/
│       └── dashboard/
│           └── page.js     ← Dashboard that uses Firebase
└── package.json
```

---

## Security Best Practices

### ✅ DO:
- Use `.env.local` for credentials
- Keep `.env.local` in `.gitignore`
- Use secure database rules in production
- Implement Firebase Authentication
- Use environment-specific configs

### ❌ DON'T:
- Commit `.env.local` to Git
- Share your API keys publicly
- Use test mode rules in production
- Hardcode credentials in source files
- Push credentials to GitHub

---

## Next Steps

Once Firebase is connected:

1. ✅ **Test the dashboard** at `/dashboard`
2. ✅ **Try real-time updates** by changing data in Firebase Console
3. ✅ **Add more nodes** by duplicating existing ones
4. ✅ **Customize** node locations, names, and data
5. ✅ **Implement authentication** for production
6. ✅ **Set up secure database rules**

---

## Getting Your Firebase Credentials (Quick Reference)

**Where to find each value in Firebase Console:**

1. **API Key**: Project Settings → General → Your apps → SDK setup and configuration → Config
2. **Auth Domain**: Same location (ends with `.firebaseapp.com`)
3. **Database URL**: Realtime Database tab → Top of page (ends with `.firebaseio.com`)
4. **Project ID**: Project Settings → General → Project ID
5. **Storage Bucket**: Same location (ends with `.appspot.com`)
6. **Messaging Sender ID**: Same location (12-digit number)
7. **App ID**: Same location (starts with `1:`)

---

## Need More Help?

### Check Console Logs

The updated `firebase.js` includes helpful logging:
- Shows which config values are set
- Shows initialization status
- Shows connection errors

### Firebase Documentation

- **Getting Started**: https://firebase.google.com/docs/web/setup
- **Realtime Database**: https://firebase.google.com/docs/database/web/start
- **Security Rules**: https://firebase.google.com/docs/database/security

### Test Connection Script

If you're still having issues, add this to `firebase.js` temporarily:

```javascript
// Test database connection
onValue(ref(database, '.info/connected'), (snapshot) => {
  if (snapshot.val() === true) {
    console.log('✅ Connected to Firebase!');
  } else {
    console.log('❌ Not connected to Firebase');
  }
});
```

---

**🎉 You're all set! Your Firebase connection should now be working.**

**If you followed all steps and still have issues, check the browser console for specific error messages.**

