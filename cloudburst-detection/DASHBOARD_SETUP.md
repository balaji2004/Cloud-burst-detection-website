# Dashboard Setup Guide

## ✅ Complete Implementation

The dashboard has been fully implemented with the following features:

### 🎯 Core Features

1. **Real-time Firebase Integration**
   - Live data streaming from Firebase Realtime Database
   - Automatic updates when node data changes
   - Proper cleanup of listeners on unmount

2. **Interactive Leaflet Map**
   - Dynamic markers with status-based colors (green/red/yellow)
   - Pulsing animation for online nodes
   - Custom marker sizes (larger for gateways)
   - Connection lines between nearby nodes
   - Auto-fit bounds to show all nodes

3. **Rich Popups**
   - Sensor readings (temperature, pressure, humidity, RSSI)
   - Status indicators
   - Last update timestamp
   - Quick access to detailed view

4. **Detailed Sidebar Panel**
   - Slides in from right when node is clicked
   - Current sensor readings with icons
   - Node metadata (coordinates, altitude, installed by)
   - Link to detailed history graphs
   - Mobile-responsive with backdrop overlay

5. **State Management**
   - Loading state with spinner
   - Error state with retry button
   - Empty state with registration prompt
   - Proper error handling throughout

---

## 🔧 Setup Instructions

### 1. Firebase Configuration

The dashboard is already configured to connect to Firebase. You need to add your Firebase credentials:

**Option A: Using Environment Variables (Recommended)**

Create a `.env.local` file in the `cloudburst-detection` directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

Then update `src/lib/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};
```

**Option B: Direct Configuration**

Update the values in `src/lib/firebase.js` directly (not recommended for production):

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 2. Firebase Database Structure

The dashboard expects nodes at `/nodes/{nodeId}` with this structure:

```json
{
  "nodes": {
    "node1": {
      "metadata": {
        "nodeId": "node1",
        "type": "node",
        "name": "Valley Sensor",
        "latitude": 28.6139,
        "longitude": 77.2090,
        "altitude": 878.9,
        "installedBy": "Team Alpha",
        "description": "Near river crossing",
        "nearbyNodes": ["node2", "gateway"],
        "status": "active"
      },
      "realtime": {
        "temperature": 25.7,
        "pressure": 912.0,
        "altitude": 878.9,
        "humidity": 65.0,
        "rssi": -52,
        "timestamp": 1736934615000,
        "lastSeen": 1736934615000,
        "status": "online",
        "alertStatus": "normal"
      }
    },
    "gateway": {
      "metadata": {
        "nodeId": "gateway",
        "type": "gateway",
        "name": "Main Gateway",
        "latitude": 28.6200,
        "longitude": 77.2150,
        "altitude": 920.0,
        "installedBy": "Team Alpha",
        "description": "Central hub",
        "nearbyNodes": ["node1", "node2"],
        "status": "active"
      },
      "realtime": {
        "temperature": 26.2,
        "pressure": 915.3,
        "altitude": 920.0,
        "humidity": 65.0,
        "rssi": -45,
        "timestamp": 1736934620000,
        "lastSeen": 1736934620000,
        "status": "online",
        "alertStatus": "normal"
      }
    }
  }
}
```

### 3. Firebase Database Rules

For testing, you can use these permissive rules (⚠️ NOT for production):

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

For production, implement proper authentication and authorization.

### 4. Test the Dashboard

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the dashboard:**
   Open `http://localhost:3000/dashboard`

3. **Add test data to Firebase:**
   - Go to Firebase Console > Realtime Database
   - Import the JSON structure above
   - Watch the dashboard update in real-time!

---

## 🎨 Features Breakdown

### Status Indicators

Nodes are categorized by status:

- **🟢 Online** (Green): Last seen within 5 minutes, pulsing animation
- **🔴 Offline** (Red): Last seen more than 5 minutes ago
- **🟡 Warning** (Yellow): Alert status is "critical"

### Marker Types

- **Regular Node**: Small circular marker (24px)
- **Gateway Node**: Larger marker with blue border (32px)

### Connection Lines

Dashed blue lines connect nodes listed in the `nearbyNodes` array, showing the network topology.

### Map Controls

- **Zoom**: Mouse wheel or +/- buttons
- **Pan**: Click and drag
- **Auto-fit**: Map automatically adjusts to show all nodes
- **Marker Click**: Opens sidebar with detailed information
- **Marker Hover**: Shows popup with quick stats

---

## 🐛 Troubleshooting

### Map doesn't appear

✅ **Check:**
- Browser console for errors
- Leaflet CSS is imported in `layout.js` (already done)
- Component has `'use client'` directive (already done)
- Map container has height set (already done)

### Firebase connection fails

✅ **Check:**
- Firebase config values are correct
- Database URL includes `https://` and `-default-rtdb`
- Database rules allow read access
- Network tab shows successful requests
- Console shows "🔥 Initializing Firebase listener..."

### Markers don't show

✅ **Check:**
- Nodes have valid `latitude` and `longitude`
- Console shows "✅ Processed X valid nodes"
- Node data structure matches expected format
- Browser zoom level (try resetting to 100%)

### Real-time updates don't work

✅ **Check:**
- Firebase listener is active (check console logs)
- Listener cleanup is working properly
- Test by manually updating data in Firebase Console
- No JavaScript errors in console

---

## 📁 File Structure

```
cloudburst-detection/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.js            # Main dashboard page
│   │   ├── layout.js              # Imports Leaflet CSS
│   │   └── globals.css            # Custom styles & animations
│   ├── components/
│   │   ├── DashboardMap.js        # Map component (NEW)
│   │   └── NodeStatusBadge.js     # Status badge component
│   └── lib/
│       └── firebase.js            # Firebase configuration
└── DASHBOARD_SETUP.md             # This file
```

---

## 🚀 Next Steps

1. **Add Firebase credentials** to `.env.local` or `firebase.js`
2. **Add test data** to Firebase Realtime Database
3. **Test the dashboard** at `/dashboard`
4. **Customize styling** in `globals.css` if needed
5. **Implement authentication** for production use

---

## 📝 Notes

- All dependencies are already installed (firebase, leaflet, react-leaflet, lucide-react)
- Leaflet CSS is already imported in `layout.js`
- The map uses dynamic import to prevent SSR issues
- All console logs are prefixed with emojis for easy debugging
- The component is fully typed with JSDoc comments

---

## 🎯 Production Checklist

Before deploying to production:

- [ ] Replace Firebase config with production credentials
- [ ] Implement proper Firebase authentication
- [ ] Set up secure database rules
- [ ] Remove debug console.log statements
- [ ] Add error tracking (e.g., Sentry)
- [ ] Test on multiple devices and browsers
- [ ] Optimize bundle size (if needed)
- [ ] Add loading skeletons instead of spinners
- [ ] Implement retry logic for failed requests
- [ ] Add user permissions and role-based access

---

**Dashboard is ready to use! 🎉**

