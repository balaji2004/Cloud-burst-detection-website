# 🚀 Dashboard Quick Start

## Immediate Testing (3 Steps)

### Step 1: Add Firebase Credentials

Open `src/lib/firebase.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

**Get these from:** Firebase Console → Project Settings → General → Your apps → SDK setup and configuration

### Step 2: Import Sample Data to Firebase

1. Go to **Firebase Console → Realtime Database**
2. Click the **⋮** menu → **Import JSON**
3. Select `firebase-sample-data.json` from the project root
4. Click **Import**

This will create 6 test nodes (5 sensors + 1 gateway) with realistic data.

### Step 3: Start the Dashboard

```bash
npm run dev
```

Visit: `http://localhost:3000/dashboard`

---

## 🎯 What You'll See

### Interactive Map Features

- **🟢 Green pulsing markers**: Online nodes (updated < 5 min ago)
- **🔴 Red markers**: Offline nodes
- **🟡 Yellow markers**: Critical alert status
- **🔵 Blue dashed lines**: Network connections between nodes
- **🛰️ Larger markers**: Gateway nodes

### Interactions

1. **Click a marker** → Opens detailed sidebar
2. **Hover over marker** → Shows quick stats popup
3. **Zoom/Pan map** → Explore node locations
4. **Click "View Detailed History"** → Navigate to graphs page

---

## 📊 Sample Data Includes

| Node ID | Name | Status | Type | Special Features |
|---------|------|--------|------|------------------|
| node1 | Valley Sensor | 🟢 Online | Sensor | Has humidity data |
| node2 | Ridge Monitor | 🟢 Online | Sensor | Higher altitude |
| node3 | Upstream Detector | 🟢 Online | Sensor | No humidity sensor |
| node4 | South Valley Sensor | 🔴 Offline | Sensor | Last seen > 5 min ago |
| gateway | Main Gateway | 🟢 Online | Gateway | Larger marker, central hub |
| node5_warning | Critical Zone Sensor | 🟡 Warning | Sensor | Critical alert status |

---

## 🔄 Test Real-time Updates

1. Open Firebase Console → Realtime Database
2. Navigate to `nodes/node1/realtime/temperature`
3. Change the value (e.g., from 25.7 to 30.5)
4. **Watch the dashboard update instantly!** 🎉

No page refresh needed – it's truly real-time.

---

## 🐛 Quick Troubleshooting

### "Error Loading Dashboard"

**Solution:** Check Firebase credentials in `firebase.js` are correct

### Map shows "No Nodes Registered"

**Solution:** Import `firebase-sample-data.json` to Firebase

### Markers not appearing

**Solution:** Check browser console for errors, verify node data has `latitude` and `longitude`

### Page is blank

**Solution:** 
1. Open browser console (F12)
2. Look for errors
3. Make sure you're on `/dashboard` route
4. Check that dev server is running

---

## 📱 Mobile Testing

The dashboard is fully responsive:
- Sidebar covers full width on mobile
- Backdrop overlay for better UX
- Touch-friendly controls

Test on different screen sizes: Desktop → Tablet → Mobile

---

## ✅ Features Implemented

- ✅ Real-time Firebase data streaming
- ✅ Interactive Leaflet map with auto-zoom
- ✅ Status-based colored markers with pulse animation
- ✅ Network topology lines between nodes
- ✅ Rich hover popups with sensor data
- ✅ Detailed sidebar panel with all node info
- ✅ Loading, error, and empty states
- ✅ Mobile-responsive design
- ✅ Proper cleanup and memory management
- ✅ TypeScript-ready with JSDoc comments

---

## 🎨 Customization Tips

### Change Map Style

In `DashboardMap.js`, replace the TileLayer URL:

```javascript
// Dark mode
url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"

// Terrain
url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"

// Satellite (requires Mapbox token)
url="https://api.mapbox.com/styles/v1/mapbox/satellite-v9/..."
```

### Change Status Colors

In `DashboardMap.js`, modify the `colors` object:

```javascript
const colors = {
  online: '#10b981',    // green
  offline: '#ef4444',   // red
  warning: '#f59e0b'    // orange
};
```

### Adjust Online Threshold

In `dashboard/page.js`, modify the time threshold:

```javascript
const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);  // Change 5 to desired minutes
```

---

**Need help?** Check `DASHBOARD_SETUP.md` for detailed documentation.

**Happy monitoring! 🌦️🗺️**

