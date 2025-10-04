# 📸 Dashboard Visual Guide

## What You'll See

### 🗺️ Main Map View

```
┌─────────────────────────────────────────────────────────────┐
│  [Active Nodes: 6]                                          │
│                                                             │
│         🟢 node1 (Valley Sensor)                           │
│        /│\                                                  │
│       / │ \                                                 │
│  🟢 node3 🟢 node2 (Ridge Monitor)                        │
│       \   │   /                                             │
│        \  │  /                                              │
│         🛰️ gateway (Main Gateway)                          │
│          / │ \                                              │
│         /  │  \                                             │
│    🔴 node4  🟡 node5_warning                              │
│                                                             │
│  Legend:                                                    │
│  🟢 Online (pulsing)                                        │
│  🔴 Offline                                                 │
│  🟡 Warning/Critical                                        │
│  🛰️ Gateway (larger)                                        │
│  --- Network connections                                    │
│                                                             │
│  [OpenStreetMap tiles, zoom controls, pan/drag enabled]    │
└─────────────────────────────────────────────────────────────┘
```

### 💬 Marker Popup (on hover)

```
┌─────────────────────────────┐
│ 🟢 Valley Sensor           │
│ 📡 Sensor Node              │
│ ─────────────────────────   │
│ 🌡️  25.7°C                  │
│ 📊  912.0 hPa               │
│ 💧  68.5%                   │
│ 📡  -52 dBm                 │
│ ─────────────────────────   │
│ Updated: 2 min ago          │
│                             │
│ View Details →              │
└─────────────────────────────┘
```

### 📱 Detailed Sidebar (on marker click)

```
┌─────────────────────────────────────┐
│ ╔════════════════════════════════╗  │
│ ║ Valley Sensor                  ║  │
│ ║ node1                      [X] ║  │
│ ╚════════════════════════════════╝  │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🟢 ONLINE                       │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ▼ Current Readings                  │
│ ┌─────────────────────────────────┐ │
│ │ 🌡️ Temperature    25.7°C        │ │
│ │ 📊 Pressure       912.0 hPa     │ │
│ │ 💧 Humidity       68.5%         │ │
│ │ 📡 Signal Strength -52 dBm     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ▼ Node Information                  │
│ ┌─────────────────────────────────┐ │
│ │ 📡 Type: Sensor Node            │ │
│ │ 📍 28.6139°N, 77.2090°E         │ │
│ │ ⛰️  Altitude: 878.9m             │ │
│ │ 👤 Installed By: Team Alpha     │ │
│ │ 📝 Near river crossing in       │ │
│ │    mountain valley              │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 🕒 Last Updated:                    │
│    Jan 15, 2025, 10:23 AM           │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │  📈 View Detailed History       │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │  Close                          │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### ⚠️ Loading State

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│               ⭕ (spinning)             │
│                                         │
│         Loading Dashboard               │
│      Connecting to Firebase...          │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

### ❌ Error State

```
┌─────────────────────────────────────────┐
│                                         │
│              🚨                         │
│                                         │
│      Error Loading Dashboard            │
│                                         │
│  Failed to connect to Firebase          │
│  PERMISSION_DENIED: Permission denied   │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │     Retry Connection              │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Make sure Firebase is properly         │
│  configured in firebase.js              │
│                                         │
└─────────────────────────────────────────┘
```

### 📭 Empty State

```
┌─────────────────────────────────────────┐
│                                         │
│              📍                         │
│                                         │
│      No Nodes Registered                │
│                                         │
│  Register your first sensor node to     │
│  start monitoring weather conditions    │
│  and detecting cloudbursts.             │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │     Register First Node           │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎨 Color Palette

### Status Colors

- **🟢 Online**: `#10b981` (green-500)
  - Bright green with pulsing animation
  - Indicates active nodes (last seen < 5 min)

- **🔴 Offline**: `#ef4444` (red-500)
  - Bright red, static (no animation)
  - Indicates inactive nodes (last seen > 5 min)

- **🟡 Warning**: `#f59e0b` (yellow-500)
  - Orange/yellow for critical alerts
  - Static, but draws attention

### Component Colors

- **Primary (Blue)**: `#3b82f6`
  - Buttons, links, active elements
  - Gateway node borders
  - Connection lines

- **Success (Green)**: `#10b981`
  - Status badges
  - Positive indicators

- **Danger (Red)**: `#ef4444`
  - Error states
  - Offline indicators

- **Neutral (Gray)**: Various shades
  - Text: `#111827` (gray-900)
  - Secondary text: `#6b7280` (gray-500)
  - Backgrounds: `#f9fafb` (gray-50)

---

## 🖼️ Layout Breakpoints

### Desktop (≥ 768px)

```
┌────────────────────────────────────────────────────┐
│ [Counter Badge]                                    │
│                                                    │
│                                                    │
│                    MAP                             │
│                  (Full View)                       │
│                                                    │
│                                                    │
└────────────────────────────────────────────────────┘

When node clicked:

┌──────────────────────────────┬─────────────────────┐
│ [Counter Badge]              │                     │
│                              │                     │
│                              │   SIDEBAR           │
│        MAP                   │   (420px)           │
│     (Reduced)                │                     │
│                              │   [Scrollable]      │
│                              │                     │
└──────────────────────────────┴─────────────────────┘
```

### Mobile (< 768px)

```
┌──────────────────────────┐
│ [Counter Badge]          │
│                          │
│                          │
│         MAP              │
│      (Full View)         │
│                          │
│                          │
└──────────────────────────┘

When node clicked:

┌──────────────────────────┐
│ ████████████████████████ │ ← Backdrop (dimmed)
│ █                      █ │
│ █    SIDEBAR           █ │
│ █   (Full Width)       █ │
│ █                      █ │
│ █  [Scrollable]        █ │
│ █                      █ │
└──────────────────────────┘
```

---

## 🎭 Animations

### Marker Pulse (Online Nodes)

```
Time: 0s          1s          2s
      ●    →     ◉    →     ●    (repeats)
    100%       110%       100%
   opacity:    opacity:   opacity:
      1         0.7          1
```

### Sidebar Slide-In

```
Before:                        After:
                              ┌──────┐
                              │      │
                              │ Side │
                              │ bar  │
     [Map view]     →         │      │
                              └──────┘
                              (300ms ease-out)
```

### Loading Spinner

```
  ⭕    →    ⭕    →    ⭕
  0°        90°       180°
(continuous rotation)
```

---

## 🔢 Typography

### Font Sizes

- **Heading Large**: `text-3xl` (30px) - Error/Empty state titles
- **Heading Medium**: `text-2xl` (24px) - Node counter
- **Heading Small**: `text-xl` (20px) - Sidebar header
- **Body Large**: `text-lg` (18px) - Section headers
- **Body**: `text-base` (16px) - Main content
- **Body Small**: `text-sm` (14px) - Labels, secondary text
- **Caption**: `text-xs` (12px) - Timestamps, metadata

### Font Weights

- **Bold**: `font-bold` (700) - Headings, emphasized values
- **Semibold**: `font-semibold` (600) - Subheadings
- **Medium**: `font-medium` (500) - Labels
- **Normal**: `font-normal` (400) - Body text

---

## 📐 Spacing System

### Padding

- **Tight**: `p-2` (8px) - Icon containers
- **Compact**: `p-3` (12px) - Data cards
- **Standard**: `p-4` (16px) - General containers
- **Comfortable**: `p-5` (20px) - Sidebar sections
- **Spacious**: `p-6` (24px) - Large containers

### Gap (Between Elements)

- **Minimal**: `gap-1` (4px) - Inline icons
- **Compact**: `gap-2` (8px) - Icon + text
- **Standard**: `gap-3` (12px) - List items
- **Comfortable**: `gap-4` (16px) - Sections

---

## 🖱️ Interactive Elements

### Markers

- **Idle**: Default size, static (or pulsing if online)
- **Hover**: Shows popup automatically
- **Click**: Opens sidebar, highlights marker

### Buttons

- **Idle**: Solid color, shadow
- **Hover**: Darker shade, larger shadow
- **Active**: Slightly darker, smaller shadow
- **Disabled**: Opacity 50%, no hover effect

### Map

- **Pan**: Click + drag
- **Zoom**: Scroll wheel or +/- buttons
- **Marker Click**: Select node
- **Background Click**: Deselect node

---

## 📱 Mobile Optimizations

### Touch Targets

- Minimum size: **44x44px** (iOS guidelines)
- Buttons have extra padding for easier tapping
- Sidebar close button: **48x48px**

### Gestures

- **Tap marker**: Open sidebar
- **Tap backdrop**: Close sidebar
- **Pinch map**: Zoom in/out
- **Drag map**: Pan view

### Responsive Text

- Larger font sizes on mobile for readability
- Reduced padding to maximize content area
- Stacked layouts instead of side-by-side

---

## ✨ Visual Hierarchy

### Priority Levels

1. **Critical** - Error messages, critical alerts
   - Red color, large text, prominent placement

2. **High** - Node status, primary actions
   - Bold text, colored badges, primary buttons

3. **Medium** - Sensor readings, node info
   - Standard text, icons, secondary buttons

4. **Low** - Timestamps, metadata, descriptions
   - Small text, gray color, subtle styling

---

## 🎯 Call-to-Action Buttons

### Primary Actions

```
┌─────────────────────────────────┐
│  📈 View Detailed History       │
└─────────────────────────────────┘
Blue background, white text, icon
```

### Secondary Actions

```
┌─────────────────────────────────┐
│  Close                          │
└─────────────────────────────────┘
Gray background, dark text, no icon
```

### Tertiary Actions

```
View Details →
Blue text, underline on hover
```

---

## 🔍 Accessibility Features

- ✅ Semantic HTML (headings, buttons, landmarks)
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Focus indicators on interactive elements
- ✅ Color contrast meets WCAG AA standards
- ✅ Screen reader friendly structure
- ✅ Responsive to user preferences (reduced motion)

---

**This guide shows the visual design and user experience of the dashboard.**

**For technical details, see `IMPLEMENTATION_SUMMARY.md`**

**For setup instructions, see `QUICK_START.md`**

