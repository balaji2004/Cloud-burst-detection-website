# Database Structure Update - Implementation Guide

## 🔄 Overview

The Firebase Realtime Database has been updated to use a new append-mode structure that separates **real-time current values** from **historical data**. This provides better performance for dashboard queries while preserving complete historical data for analysis.

---

## 📊 New Database Structure

```
cloudburst-detection-sih/
├── system/
│   └── status: "online"
│
└── nodes/
    ├── gateway/
    │   ├── metadata/
    │   │   ├── nodeId: "gateway"
    │   │   ├── type: "gateway"
    │   │   ├── name: "Main Gateway"
    │   │   ├── latitude: 28.6150
    │   │   ├── longitude: 77.2100
    │   │   ├── altitude: 920.0
    │   │   └── ...
    │   │
    │   ├── realtime/
    │   │   ├── temperature: 26.2
    │   │   ├── pressure: 915.3
    │   │   ├── altitude: 920.0
    │   │   ├── humidity: 65.0
    │   │   ├── status: "online"
    │   │   └── lastUpdate: "1736934620"
    │   │
    │   └── history/
    │       ├── -NXabc123xyz/
    │       │   ├── temperature: 26.2
    │       │   ├── pressure: 915.3
    │       │   ├── altitude: 920.0
    │       │   ├── humidity: 65.0
    │       │   └── timestamp: "1736934620"
    │       │
    │       └── -NXabc124abc/
    │           ├── temperature: 26.5
    │           └── ...
    │
    └── node_001/
        ├── metadata/
        ├── realtime/
        │   ├── temperature: 25.7
        │   ├── pressure: 912.0
        │   ├── altitude: 878.9
        │   ├── rssi: -52
        │   ├── status: "online"
        │   └── lastUpdate: "1736934615"
        │
        └── history/
            ├── -NXdef456ghi/
            │   ├── temperature: 25.7
            │   ├── pressure: 912.0
            │   ├── altitude: 878.9
            │   ├── rainfall: 0.0
            │   ├── rssi: -52
            │   └── timestamp: "1736934615"
            │
            └── ...
```

---

## 🔑 Key Changes

### 1. **System Status** (New)
- **Path:** `/system/status`
- **Value:** `"online"` or `"offline"`
- **Purpose:** Global system health indicator

### 2. **Realtime Data**
- **Path:** `/nodes/{nodeId}/realtime/`
- **Update Behavior:** Overwrites on each update
- **Fields:**

| Field | Type | Gateway | Nodes | Description |
|-------|------|---------|-------|-------------|
| `temperature` | Float | ✅ | ✅ | Temperature in °C |
| `pressure` | Float | ✅ | ✅ | Pressure in hPa |
| `altitude` | Float | ✅ | ✅ | Altitude in meters |
| `humidity` | Float | ✅ | ✅ | Humidity in % |
| `rssi` | Integer | ❌ | ✅ | Signal strength in dBm |
| `status` | String | ✅ | ✅ | `"online"` or `"offline"` |
| `lastUpdate` | String | ✅ | ✅ | Unix timestamp (seconds) |

**Changes from old structure:**
- ❌ Removed: `lastSeen`, `timestamp`, `alertStatus`, `messageCount`, `batteryLevel`, `rainfall`
- ✅ Added: `lastUpdate` (replaces `lastSeen`)
- ✅ Changed: `lastUpdate` is in **Unix seconds** (not milliseconds)

### 3. **History Data**
- **Path:** `/nodes/{nodeId}/history/`
- **Update Behavior:** Appends new entries (never deletes)
- **Key Format:** Auto-generated Firebase push keys (e.g., `-NXabc123xyz`)

**Gateway History Entry:**
```json
{
  "temperature": 26.2,
  "pressure": 915.3,
  "altitude": 920.0,
  "humidity": 65.0,
  "timestamp": "1736934620"
}
```

**Node History Entry:**
```json
{
  "temperature": 25.7,
  "pressure": 912.0,
  "altitude": 878.9,
  "rainfall": 0.0,
  "rssi": -52,
  "timestamp": "1736934615"
}
```

**Changes from old structure:**
- ✅ Keys are now auto-generated (not timestamp-based)
- ✅ `timestamp` is now **inside** the entry (not the key)
- ✅ Added `rainfall` field for nodes

---

## 🔧 Implementation Changes

### Files Updated

1. **`src/app/dashboard/page.js`**
   - Updated `getNodeStatus()` to use `realtime.lastUpdate` instead of `realtime.lastSeen`
   - Added timestamp conversion (Unix seconds → milliseconds)
   - Updated status determination logic

2. **`src/app/graphs/page.js`**
   - Updated history parsing to handle auto-generated keys
   - Added timestamp conversion for historical data
   - Updated data mapping to include `rainfall` field

3. **`src/app/register/page.js`**
   - Updated initial node structure
   - Changed `lastSeen` to `lastUpdate`
   - Removed obsolete fields (`alertStatus`, `messageCount`, `batteryLevel`, `rainfall` from realtime)

4. **`firebase-sample-data.json`**
   - Completely restructured to match new format
   - Added `system/status` section
   - Updated all nodes with new realtime/history structure

---

## 🕐 Timestamp Handling

### Important: Two Timestamp Formats

The system handles **two possible timestamp formats**:

#### 1. **Unix Timestamp (Seconds)** - Used by ESP32
- Format: String containing seconds since Jan 1, 1970
- Example: `"1736934620"`
- Used in: `realtime.lastUpdate` and `history[key].timestamp`

#### 2. **Milliseconds** - Used by Website
- Format: JavaScript timestamp (milliseconds)
- Example: `1736934620000`
- Used internally for calculations and comparisons

### Conversion in Code

```javascript
// Convert Unix timestamp (seconds) to milliseconds
const lastUpdateMs = typeof node.realtime.lastUpdate === 'string' 
  ? parseInt(node.realtime.lastUpdate) * 1000  // Seconds → Milliseconds
  : node.realtime.lastUpdate;
```

---

## 📈 Query Examples

### Get Current Temperature
```javascript
const tempRef = ref(database, 'nodes/gateway/realtime/temperature');
const snapshot = await get(tempRef);
console.log(snapshot.val()); // 26.2
```

### Listen to Real-time Updates
```javascript
const realtimeRef = ref(database, 'nodes/gateway/realtime');
onValue(realtimeRef, (snapshot) => {
  const data = snapshot.val();
  console.log('Current data:', data);
});
```

### Get Last 10 Historical Entries
```javascript
import { query, limitToLast, orderByChild } from 'firebase/database';

const historyRef = ref(database, 'nodes/gateway/history');
const lastTenQuery = query(historyRef, orderByChild('timestamp'), limitToLast(10));

onValue(lastTenQuery, (snapshot) => {
  const data = snapshot.val();
  // Process data...
});
```

### Get All History for Time Range
```javascript
const historyRef = ref(database, 'nodes/gateway/history');
onValue(historyRef, (snapshot) => {
  const data = snapshot.val() || {};
  
  const now = Date.now();
  const cutoff = now - (24 * 60 * 60 * 1000); // Last 24 hours
  
  const filtered = Object.entries(data)
    .map(([key, values]) => ({
      timestamp: parseInt(values.timestamp) * 1000,
      ...values
    }))
    .filter(d => d.timestamp >= cutoff)
    .sort((a, b) => a.timestamp - b.timestamp);
});
```

---

## ✅ Benefits of New Structure

1. **🚀 Faster Dashboard Loading**
   - Only queries current values from `realtime/`
   - No need to scan through entire history

2. **📊 Complete Data Preservation**
   - All readings stored in `history/`
   - Never overwrites previous data
   - Perfect for trend analysis

3. **🔍 Efficient Queries**
   - Can query specific time ranges
   - Firebase indexing on `timestamp` field
   - Supports `limitToLast()` for recent entries

4. **📦 Scalable Storage**
   - Easy to implement data pruning if needed
   - Can archive old data without affecting current readings
   - Clear separation between current and historical

5. **🔄 Real-time Performance**
   - Minimal data transfer for dashboard updates
   - Listeners only trigger on actual changes
   - No lag from historical data queries

---

## 🛡️ Firebase Security Rules

Recommended security rules for the new structure:

```json
{
  "rules": {
    "system": {
      ".read": true,
      ".write": true
    },
    "nodes": {
      "$nodeId": {
        "metadata": {
          ".read": true,
          ".write": true
        },
        "realtime": {
          ".read": true,
          ".write": true
        },
        "history": {
          ".read": true,
          ".write": true,
          ".indexOn": ["timestamp"]
        }
      }
    }
  }
}
```

The `.indexOn` rule improves query performance when sorting by `timestamp`.

---

## 📊 Data Growth Estimates

### Gateway (30 second interval)
- **Entries per day:** 2,880
- **Entries per month:** ~86,400
- **Size per entry:** ~150 bytes
- **Monthly storage:** ~13 MB

### Node (1 minute interval)
- **Entries per day:** 1,440
- **Entries per month:** ~43,200
- **Size per entry:** ~180 bytes
- **Monthly storage:** ~7.8 MB

### Total for 10 Nodes + 1 Gateway
- **Monthly storage:** ~91 MB
- **Yearly storage:** ~1.1 GB

---

## 🧹 Data Management (Optional)

If history grows too large, implement automatic pruning:

### Option 1: Manual Cleanup
```javascript
import { ref, query, orderByChild, endAt, remove } from 'firebase/database';

// Delete entries older than 30 days
const cutoffTime = Date.now() - (30 * 24 * 60 * 60 * 1000);
const oldDataQuery = query(
  ref(database, 'nodes/gateway/history'),
  orderByChild('timestamp'),
  endAt(Math.floor(cutoffTime / 1000).toString())
);

// Note: Firebase doesn't support direct bulk delete
// You'll need to iterate and delete individually
```

### Option 2: Firebase Functions (Cloud)
Set up Firebase Cloud Functions to automatically archive/delete old data on a schedule.

---

## 🚦 Migration from Old Structure

If you have existing data in the old format:

1. **Backup your database** before migration
2. **Update node structure:**
   - Rename `lastSeen` → `lastUpdate`
   - Convert timestamp to Unix seconds: `Math.floor(lastSeen / 1000).toString()`
   - Remove obsolete fields
3. **Update history structure:**
   - If using timestamp keys, migrate to push keys
   - Move timestamp value inside entry
4. **Test with sample data** first
5. **Deploy updates** to all ESP32 devices

---

## 📞 Support

For questions or issues with the new structure:

1. Check `firebase-sample-data.json` for reference
2. Review Firebase Console for actual data structure
3. Use browser DevTools to debug Firebase queries
4. Check Firebase Console → Rules for security issues

---

## 🎉 Summary

The new database structure provides:
- ✅ Better performance for real-time dashboard
- ✅ Complete historical data preservation
- ✅ Scalable storage with append-only history
- ✅ Efficient queries with Firebase indexing
- ✅ Clear separation of current vs. historical data

All website pages now correctly handle the new structure:
- Dashboard shows current readings from `realtime/`
- Graphs display historical trends from `history/`
- Registration creates nodes with correct structure
- All timestamps properly converted between formats

