# 🚀 Firebase Setup - 5 Minute Quickstart

**The fastest way to get your dashboard connected to Firebase.**

---

## ⚡ Super Quick Setup (5 Steps)

### Step 1: Create Firebase Project (2 minutes)

1. Go to https://console.firebase.google.com/
2. Click **"Create a project"** or **"Add project"**
3. Name: `cloudburst-detection` → **Continue**
4. Disable Google Analytics (optional) → **Create project**
5. Click **Continue** when done

### Step 2: Enable Realtime Database (1 minute)

1. Left sidebar: **Build** → **Realtime Database**
2. Click **"Create Database"**
3. Location: **United States** → **Next**
4. Start in **test mode** → **Enable**

### Step 3: Get Your Credentials (1 minute)

1. Click ⚙️ icon (top left) → **Project settings**
2. Scroll down to **"Your apps"** section
3. Click **Web icon** `</>`
4. App nickname: `dashboard` → **Register app**
5. **Copy the firebaseConfig object** (you'll need this!)

You'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "cloudburst-abc123.firebaseapp.com",
  databaseURL: "https://cloudburst-abc123-default-rtdb.firebaseio.com",
  projectId: "cloudburst-abc123",
  storageBucket: "cloudburst-abc123.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

### Step 4: Create `.env.local` File (1 minute)

**Option A: Quick Command (Windows PowerShell)**

Open terminal in `cloudburst-detection/` folder and run:

```powershell
@"
NEXT_PUBLIC_FIREBASE_API_KEY=PASTE_YOUR_API_KEY_HERE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=PASTE_AUTH_DOMAIN_HERE
NEXT_PUBLIC_FIREBASE_DATABASE_URL=PASTE_DATABASE_URL_HERE
NEXT_PUBLIC_FIREBASE_PROJECT_ID=PASTE_PROJECT_ID_HERE
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=PASTE_STORAGE_BUCKET_HERE
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=PASTE_SENDER_ID_HERE
NEXT_PUBLIC_FIREBASE_APP_ID=PASTE_APP_ID_HERE
"@ | Out-File -FilePath .env.local -Encoding utf8
```

Then edit `.env.local` and replace the values.

**Option B: Manual**

1. In `cloudburst-detection/` folder, create new file: `.env.local`
2. Copy `ENV_SETUP_TEMPLATE.txt` content
3. Replace all placeholder values with your Firebase credentials
4. Save

**Example (with YOUR actual values):**

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC1xYz2aBcDefGhIjKlMnOpQrStUvWxYz0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cloudburst-abc123.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://cloudburst-abc123-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cloudburst-abc123
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cloudburst-abc123.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

⚠️ **CRITICAL:**
- All variables MUST start with `NEXT_PUBLIC_`
- No spaces around `=`
- No quotes
- Database URL must include `https://` and end with `.firebaseio.com`

### Step 5: Import Sample Data & Test (1 minute)

**Import Data:**

1. In Firebase Console → **Realtime Database**
2. Click **⋮** (three dots) → **Import JSON**
3. Select `firebase-sample-data.json`
4. Click **Import**

**Restart Server:**

```bash
npm run dev
```

**Open Dashboard:**

Visit: http://localhost:3000/dashboard

**You should see:**
- 6 markers on the map
- Green pulsing markers (online nodes)
- One red marker (offline)
- One yellow marker (warning)
- Blue connection lines

---

## ✅ Verification

### Check Browser Console (F12)

You should see:

```
🔥 Firebase Configuration Status:
- API Key: ✅ Set
- Database URL: https://cloudburst-abc123-default-rtdb.firebaseio.com
- Project ID: cloudburst-abc123
✅ Firebase initialized successfully
🔥 Initializing Firebase listener...
📦 Firebase data received: {nodes: {...}}
✅ Processed 6 valid nodes
```

### Test Real-time Updates

1. Keep dashboard open
2. Open Firebase Console → Realtime Database
3. Find `nodes/node1/realtime/temperature`
4. Change value from `25.7` to `30.0`
5. Press Enter
6. **Dashboard updates instantly!** ✨

---

## 🚨 Common Issues

### ❌ "Using placeholder credentials"

**Problem:** `.env.local` not found or not loaded

**Fix:**
```bash
# Check file exists
ls .env.local

# Check file location (must be in cloudburst-detection/)
pwd  # Should show: .../cloudburst-detection

# Restart dev server
npm run dev
```

### ❌ "PERMISSION_DENIED"

**Problem:** Database rules too restrictive

**Fix:**
1. Firebase Console → Realtime Database → **Rules** tab
2. Replace with:
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
3. Click **Publish**

### ❌ "Invalid API key"

**Problem:** Wrong API key

**Fix:**
- Copy API key again from Firebase Console
- Should start with `AIzaSy`
- No extra spaces or quotes
- Update `.env.local`
- Restart server

### ❌ Map loads but no markers

**Problem:** No data in Firebase

**Fix:**
- Import `firebase-sample-data.json`
- Or add data manually in Firebase Console

---

## 📁 File Checklist

Make sure you have:

```
cloudburst-detection/
├── .env.local                    ← YOUR CREDENTIALS (you created this)
├── firebase-sample-data.json     ← Sample data (provided)
├── src/
│   └── lib/
│       └── firebase.js           ← Updated (already done)
└── package.json
```

---

## 🎯 What's Next?

Once connected:

1. **Explore the map** - Click markers to see details
2. **Test real-time** - Change data in Firebase, watch updates
3. **Add more nodes** - Duplicate existing nodes with new coordinates
4. **Customize** - Change node names, locations, sensor readings
5. **Read full docs** - See `FIREBASE_SETUP_COMPLETE.md` for advanced setup

---

## 🔑 Where to Find Each Value

Quick reference for copying from Firebase Console:

| Variable | Location in Firebase Console |
|----------|------------------------------|
| API Key | Project Settings → General → Web apps → Config → apiKey |
| Auth Domain | Same location → authDomain |
| Database URL | Realtime Database tab (top of page) OR same config → databaseURL |
| Project ID | Project Settings → General → Project ID |
| Storage Bucket | Same config → storageBucket |
| Messaging Sender ID | Same config → messagingSenderId |
| App ID | Same config → appId |

---

## 💡 Pro Tips

### Tip 1: Test Connection Quickly

Add this to `firebase.js` temporarily:

```javascript
// Test connection
onValue(ref(database, '.info/connected'), (snapshot) => {
  console.log('🔥 Connection status:', snapshot.val() ? '✅ Connected' : '❌ Disconnected');
});
```

### Tip 2: Auto-reload on Save

Your `.env.local` changes require server restart, but the dashboard itself hot-reloads.

### Tip 3: Check File Name

The file MUST be named `.env.local` (with the dot). Common mistakes:
- ❌ `env.local` (missing dot)
- ❌ `.env` (wrong name)
- ❌ `.env.local.txt` (wrong extension)

To check in terminal:
```bash
ls -la .env.local
```

Should show: `.env.local` (not `env.local.txt`)

---

## 🆘 Still Not Working?

### Debug Steps:

1. **Check console logs:**
   - Open http://localhost:3000/dashboard
   - Press F12 → Console tab
   - Look for 🔥 Firebase messages
   - Copy any error messages

2. **Verify .env.local:**
   ```bash
   cat .env.local
   ```
   Should show all your environment variables

3. **Check Firebase Console:**
   - Realtime Database tab
   - Should see `nodes` → `node1`, `node2`, etc.
   - Rules tab → Should be set to test mode

4. **Restart everything:**
   ```bash
   # Stop dev server (Ctrl+C)
   # Clear Next.js cache
   rm -rf .next
   # Restart
   npm run dev
   ```

---

## 📞 Get Help

If stuck:

1. Read full guide: `FIREBASE_SETUP_COMPLETE.md`
2. Check visual guide: `VISUAL_GUIDE.md`
3. Review error messages in browser console
4. Verify all 7 environment variables are set
5. Make sure database has data

---

**🎉 That's it! Your dashboard should now be live with real-time Firebase data.**

**Total time: ~5 minutes**

**Next:** Try changing data in Firebase and watch it update in real-time! ✨

