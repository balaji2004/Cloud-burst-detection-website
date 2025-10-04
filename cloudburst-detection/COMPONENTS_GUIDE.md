# Reusable Components Guide

This guide provides detailed information on using the reusable UI components for the Cloudburst Detection Website.

## Table of Contents

1. [Setup](#setup)
2. [Components](#components)
   - [StatsCard](#statscard)
   - [AlertBanner](#alertbanner)
   - [LoadingSpinner](#loadingspinner)
   - [NodeStatusBadge](#nodestatusbadge)
   - [Modal](#modal)
   - [ConfirmDialog](#confirmdialog)
   - [Toast](#toast)
   - [DataTable](#datatable)
   - [TimeAgo](#timeago)
   - [EmptyState](#emptystate)
3. [Utilities](#utilities)
4. [Best Practices](#best-practices)

---

## Setup

### Installing Required Dependencies

Make sure you have the following dependencies installed:

```bash
npm install lucide-react
```

### Setting Up Toast Provider

To use the Toast notifications system, wrap your app with `ToastProvider` and add `ToastContainer`:

```jsx
// src/app/layout.js
import { ToastProvider } from '@/contexts/ToastContext';
import { ToastContainer } from '@/components/Toast';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {children}
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
```

---

## Components

### StatsCard

Display statistics with icons, values, and optional trend indicators.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| icon | ReactComponent | - | Lucide icon component |
| title | string | - | Card title (e.g., "Total Nodes") |
| value | string \| number | - | Main value to display |
| subtitle | string | - | Optional subtitle text |
| trend | 'up' \| 'down' | - | Trend direction |
| trendValue | string | - | Trend value (e.g., "+12%") |
| color | string | 'blue' | Color theme (blue, green, red, etc.) |
| className | string | '' | Additional CSS classes |

**Example:**

```jsx
import { Activity } from 'lucide-react';
import { StatsCard } from '@/components';

<StatsCard
  icon={Activity}
  title="Active Nodes"
  value={8}
  subtitle="Out of 10 total"
  trend="up"
  trendValue="+2"
  color="green"
/>
```

---

### AlertBanner

Display dismissible alert/notification banners with different severity levels.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | 'info' \| 'success' \| 'warning' \| 'error' | 'info' | Alert type |
| title | string | - | Optional alert title |
| message | string | - | Alert message (required) |
| dismissible | boolean | false | Show close button |
| onDismiss | function | - | Callback when dismissed |
| action | object | - | Optional action button {label, onClick} |
| autoDismiss | boolean | false | Auto-dismiss after delay |
| autoDismissDelay | number | 5000 | Auto-dismiss delay in ms |

**Example:**

```jsx
import { AlertBanner } from '@/components';

<AlertBanner
  type="warning"
  title="High Pressure Drop Detected"
  message="Node 1 shows rapid pressure decrease. Alert sent to contacts."
  dismissible
  onDismiss={() => console.log('Dismissed')}
  action={{
    label: "View Details",
    onClick: () => router.push('/alerts')
  }}
/>
```

---

### LoadingSpinner

Consistent loading indicator with customizable size and full-screen option.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | 'sm' \| 'md' \| 'lg' | 'md' | Spinner size |
| color | string | 'blue' | Color theme |
| fullScreen | boolean | false | Show as full-screen overlay |
| text | string | '' | Optional loading text |

**Example:**

```jsx
import { LoadingSpinner } from '@/components';

// Inline spinner
<LoadingSpinner size="md" text="Loading nodes..." />

// Full-screen spinner
<LoadingSpinner fullScreen text="Fetching data..." />
```

---

### NodeStatusBadge

Display node status with colored badge and optional pulsing dot.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| status | 'online' \| 'offline' \| 'warning' | 'offline' | Node status |
| showDot | boolean | false | Show status indicator dot |
| showText | boolean | true | Show status text |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Badge size |

**Example:**

```jsx
import { NodeStatusBadge } from '@/components';

<NodeStatusBadge status="online" showDot showText />
<NodeStatusBadge status="warning" showText size="lg" />
```

---

### Modal

Reusable modal dialog with customizable content and footer.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isOpen | boolean | - | Modal open state |
| onClose | function | - | Close callback |
| title | string | - | Modal title |
| children | ReactNode | - | Modal content |
| footer | ReactNode | - | Footer content (buttons) |
| size | 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' | Modal width |
| closeOnOutsideClick | boolean | true | Close on backdrop click |
| closeOnEscape | boolean | true | Close on Escape key |
| showCloseButton | boolean | true | Show X button |

**Example:**

```jsx
import { Modal } from '@/components';
import { useState } from 'react';

const [showModal, setShowModal] = useState(false);

<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Edit Node Details"
  size="md"
  footer={
    <>
      <button onClick={handleSave} className="btn-primary">Save</button>
      <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
    </>
  }
>
  <form>
    {/* Your form content */}
  </form>
</Modal>
```

---

### ConfirmDialog

Confirmation dialog for destructive or important actions.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isOpen | boolean | - | Dialog open state |
| onClose | function | - | Close callback |
| onConfirm | function | - | Confirm callback |
| title | string | - | Dialog title |
| message | string | - | Confirmation message |
| confirmText | string | 'Confirm' | Confirm button text |
| cancelText | string | 'Cancel' | Cancel button text |
| variant | 'danger' \| 'warning' \| 'info' | 'danger' | Dialog style |
| requireTyping | string | null | Text user must type to confirm |

**Example:**

```jsx
import { ConfirmDialog } from '@/components';
import { useState } from 'react';

const [showDelete, setShowDelete] = useState(false);

<ConfirmDialog
  isOpen={showDelete}
  onClose={() => setShowDelete(false)}
  onConfirm={handleDeleteNode}
  title="Delete Node"
  message="Are you sure you want to delete node1? This will remove all historical data."
  confirmText="Delete"
  variant="danger"
  requireTyping="DELETE"
/>
```

---

### Toast

Global toast notification system using React Context.

**Usage:**

```jsx
import { useToast } from '@/contexts/ToastContext';

function MyComponent() {
  const { showToast } = useToast();

  const handleSuccess = () => {
    showToast({
      type: 'success',
      title: 'Node Registered',
      message: 'Node3 has been successfully added',
      duration: 3000 // Optional, default 5000ms
    });
  };

  const handleError = () => {
    showToast({
      type: 'error',
      title: 'Connection Failed',
      message: 'Unable to connect to the server',
      duration: 0 // 0 = no auto-dismiss
    });
  };

  return (
    <>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </>
  );
}
```

**Toast Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| type | 'info' \| 'success' \| 'warning' \| 'error' | 'info' | Toast type |
| title | string | - | Optional title |
| message | string | - | Toast message (required) |
| duration | number | 5000 | Auto-dismiss delay (0 to disable) |

---

### DataTable

Feature-rich table with sorting, filtering, and pagination.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| columns | Array<Column> | - | Column definitions |
| data | Array<Object> | [] | Table data |
| loading | boolean | false | Show loading state |
| emptyMessage | string | 'No data available' | Empty state message |
| pagination | boolean | false | Enable pagination |
| pageSize | number | 10 | Rows per page |
| searchable | boolean | false | Enable search |
| searchPlaceholder | string | 'Search...' | Search input placeholder |

**Column Definition:**

```typescript
{
  key: string,              // Data key
  label: string,            // Column header
  sortable?: boolean,       // Enable sorting
  render?: (value, row) => ReactNode  // Custom cell renderer
}
```

**Example:**

```jsx
import { DataTable, NodeStatusBadge } from '@/components';
import { Edit, Trash2 } from 'lucide-react';

const columns = [
  { 
    key: 'id', 
    label: 'Node ID', 
    sortable: true 
  },
  { 
    key: 'name', 
    label: 'Name', 
    sortable: true 
  },
  { 
    key: 'location', 
    label: 'Location', 
    sortable: true 
  },
  { 
    key: 'status', 
    label: 'Status', 
    render: (status) => (
      <NodeStatusBadge status={status} showDot showText />
    )
  },
  { 
    key: 'actions', 
    label: 'Actions', 
    render: (_, row) => (
      <div className="flex gap-2">
        <button onClick={() => handleEdit(row)}>
          <Edit className="w-4 h-4" />
        </button>
        <button onClick={() => handleDelete(row)}>
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    )
  }
];

<DataTable
  columns={columns}
  data={nodes}
  searchable
  pagination
  pageSize={10}
  emptyMessage="No nodes registered yet"
/>
```

---

### TimeAgo

Display relative time that auto-updates.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| timestamp | number \| Date | - | Unix timestamp or Date object |
| format | 'relative' \| 'absolute' \| 'both' | 'relative' | Display format |
| updateInterval | number | 60000 | Update interval in ms |
| className | string | '' | Additional CSS classes |

**Example:**

```jsx
import { TimeAgo } from '@/components';

// Relative time
<TimeAgo timestamp={1736934615000} format="relative" />
// Output: "2 minutes ago"

// Absolute time
<TimeAgo timestamp={new Date()} format="absolute" />
// Output: "Jan 15, 2025 14:32"

// Both formats
<TimeAgo timestamp={lastUpdate} format="both" />
// Output: "2 minutes ago (Jan 15, 14:32)"
```

---

### EmptyState

Consistent empty state design with icon and optional action.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| icon | ReactComponent | - | Lucide icon component |
| title | string | - | Empty state title |
| description | string | - | Optional description |
| action | object | - | Optional action {label, onClick, icon} |
| className | string | '' | Additional CSS classes |

**Example:**

```jsx
import { EmptyState } from '@/components';
import { Inbox, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const router = useRouter();

<EmptyState
  icon={Inbox}
  title="No alerts yet"
  description="When alerts are triggered, they will appear here."
  action={{
    label: "Create Manual Alert",
    onClick: () => router.push('/admin'),
    icon: Plus
  }}
/>
```

---

## Utilities

### classNames

Utility function to conditionally join CSS class names.

```jsx
import { classNames } from '@/utils/classNames';

classNames('btn', 'btn-primary')
// Output: 'btn btn-primary'

classNames('btn', { 'btn-active': isActive, 'btn-disabled': isDisabled })
// Output: 'btn btn-active' (if isActive is true)

classNames(['btn', 'btn-primary'], { 'opacity-50': loading })
// Output: 'btn btn-primary opacity-50' (if loading is true)
```

### formatTime

Utility functions for formatting timestamps.

```jsx
import { 
  formatRelativeTime, 
  formatAbsoluteTime, 
  formatBothTime,
  formatExactTime 
} from '@/utils/formatTime';

formatRelativeTime(Date.now() - 120000)  // "2 minutes ago"
formatAbsoluteTime(Date.now())           // "Jan 15, 2025 14:32"
formatBothTime(Date.now())               // "just now (Jan 15, 2025 14:32)"
formatExactTime(Date.now())              // "2025-01-15T14:32:00.000Z"
```

---

## Best Practices

### 1. Import Components Efficiently

Use the barrel export for cleaner imports:

```jsx
// ✅ Good
import { StatsCard, AlertBanner, LoadingSpinner } from '@/components';

// ❌ Avoid
import StatsCard from '@/components/StatsCard';
import AlertBanner from '@/components/AlertBanner';
import LoadingSpinner from '@/components/LoadingSpinner';
```

### 2. Use Loading States

Always handle loading states in your components:

```jsx
function NodeList() {
  const [loading, setLoading] = useState(true);
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    fetchNodes().then((data) => {
      setNodes(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading nodes..." />;
  }

  return <DataTable columns={columns} data={nodes} />;
}
```

### 3. Error Handling with Toasts

Use toasts for user feedback on actions:

```jsx
const { showToast } = useToast();

const handleDeleteNode = async (nodeId) => {
  try {
    await deleteNode(nodeId);
    showToast({
      type: 'success',
      title: 'Node Deleted',
      message: 'The node has been successfully removed'
    });
  } catch (error) {
    showToast({
      type: 'error',
      title: 'Delete Failed',
      message: error.message
    });
  }
};
```

### 4. Confirmation for Destructive Actions

Always use ConfirmDialog for destructive actions:

```jsx
const [showConfirm, setShowConfirm] = useState(false);

<button onClick={() => setShowConfirm(true)}>
  Delete Node
</button>

<ConfirmDialog
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDeleteNode}
  title="Delete Node"
  message="This action cannot be undone."
  variant="danger"
/>
```

### 5. Responsive Design

All components are mobile-friendly, but test on different screen sizes:

```jsx
// Use responsive classes with Tailwind
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatsCard {...props} />
  <StatsCard {...props} />
  <StatsCard {...props} />
  <StatsCard {...props} />
</div>
```

### 6. Accessibility

Components include ARIA labels and keyboard navigation. Enhance further when needed:

```jsx
<button
  onClick={handleAction}
  aria-label="Delete node sensor-01"
>
  <Trash2 className="w-4 h-4" />
</button>
```

---

## Component Dependencies

```
StatsCard → classNames
AlertBanner → classNames
LoadingSpinner → classNames
NodeStatusBadge → classNames
Modal → classNames
ConfirmDialog → Modal, classNames
Toast → ToastContext, classNames
DataTable → LoadingSpinner, EmptyState, classNames
TimeAgo → formatTime utils
EmptyState → classNames
```

---

## Examples in Real Pages

### Dashboard with Stats

```jsx
import { StatsCard, LoadingSpinner } from '@/components';
import { Activity, AlertTriangle, Database, Wifi } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  if (!stats) return <LoadingSpinner fullScreen />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        icon={Database}
        title="Total Nodes"
        value={stats.totalNodes}
        color="blue"
      />
      <StatsCard
        icon={Wifi}
        title="Active Nodes"
        value={stats.activeNodes}
        subtitle="Out of 10 total"
        trend="up"
        trendValue="+2"
        color="green"
      />
      <StatsCard
        icon={AlertTriangle}
        title="Alerts Today"
        value={stats.alertsToday}
        trend="down"
        trendValue="-5"
        color="red"
      />
      <StatsCard
        icon={Activity}
        title="Uptime"
        value="99.8%"
        subtitle="Last 30 days"
        color="green"
      />
    </div>
  );
}
```

### Node Management Table

```jsx
import { DataTable, NodeStatusBadge, TimeAgo } from '@/components';
import { Edit, Trash2 } from 'lucide-react';

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { 
    key: 'status', 
    label: 'Status',
    render: (status) => <NodeStatusBadge status={status} showDot showText />
  },
  { 
    key: 'lastSeen', 
    label: 'Last Seen',
    render: (timestamp) => <TimeAgo timestamp={timestamp} />
  },
  { 
    key: 'actions', 
    label: 'Actions',
    render: (_, row) => (
      <div className="flex gap-2">
        <button onClick={() => handleEdit(row.id)}>
          <Edit className="w-4 h-4" />
        </button>
        <button onClick={() => handleDelete(row.id)}>
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    )
  }
];

<DataTable
  columns={columns}
  data={nodes}
  searchable
  pagination
  pageSize={10}
/>
```

---

## Support

For issues or questions about these components, please refer to the component source code which includes detailed JSDoc comments and examples.

