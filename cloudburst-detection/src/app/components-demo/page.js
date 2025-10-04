'use client';

import React, { useState } from 'react';
import { 
  StatsCard, 
  AlertBanner, 
  LoadingSpinner, 
  NodeStatusBadge,
  Modal,
  ConfirmDialog,
  DataTable,
  TimeAgo,
  EmptyState
} from '@/components';
import { 
  Activity, 
  Database, 
  Wifi, 
  AlertTriangle,
  Inbox,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

/**
 * Components Demo Page
 * 
 * This page demonstrates all reusable components in action.
 * Use this as a reference for implementing components in your pages.
 */
export default function ComponentsDemo() {
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sample data for DataTable
  const sampleNodes = [
    { id: 'node1', name: 'Sensor A', location: 'Zone 1', status: 'online', lastSeen: Date.now() - 120000 },
    { id: 'node2', name: 'Sensor B', location: 'Zone 2', status: 'offline', lastSeen: Date.now() - 3600000 },
    { id: 'node3', name: 'Sensor C', location: 'Zone 3', status: 'warning', lastSeen: Date.now() - 300000 },
    { id: 'node4', name: 'Sensor D', location: 'Zone 1', status: 'online', lastSeen: Date.now() - 60000 },
  ];

  const columns = [
    { key: 'id', label: 'Node ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    { 
      key: 'status', 
      label: 'Status',
      render: (status) => <NodeStatusBadge status={status} showDot showText />
    },
    { 
      key: 'lastSeen', 
      label: 'Last Seen',
      render: (timestamp) => <TimeAgo timestamp={timestamp} format="relative" />
    },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleEdit(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDelete(row)}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const handleEdit = (row) => {
    setShowModal(true);
    showToast({
      type: 'info',
      message: `Editing ${row.name}`,
      duration: 2000
    });
  };

  const handleDelete = (row) => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    showToast({
      type: 'success',
      title: 'Node Deleted',
      message: 'The node has been successfully removed',
      duration: 3000
    });
  };

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast({
        type: 'success',
        title: 'Data Loaded',
        message: 'Successfully fetched data from server'
      });
    }, 2000);
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading components demo..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Components Demo
          </h1>
          <p className="text-gray-600">
            Interactive demonstration of all reusable UI components
          </p>
        </div>

        {/* StatsCard Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Stats Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              icon={Database}
              title="Total Nodes"
              value={12}
              color="blue"
            />
            <StatsCard
              icon={Wifi}
              title="Active Nodes"
              value={8}
              subtitle="Out of 12 total"
              trend="up"
              trendValue="+2"
              color="green"
            />
            <StatsCard
              icon={AlertTriangle}
              title="Alerts Today"
              value={3}
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
        </section>

        {/* AlertBanner Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Alert Banners</h2>
          <div className="space-y-4">
            <AlertBanner
              type="info"
              title="System Update"
              message="A new firmware update is available for your nodes."
              dismissible
              action={{
                label: "View Details",
                onClick: () => showToast({ type: 'info', message: 'Viewing details...' })
              }}
            />
            <AlertBanner
              type="success"
              title="Node Registered"
              message="Node3 has been successfully added to your network."
              dismissible
            />
            <AlertBanner
              type="warning"
              title="High Pressure Drop"
              message="Node 1 shows rapid pressure decrease. Alert sent to contacts."
              dismissible
            />
            <AlertBanner
              type="error"
              title="Connection Lost"
              message="Unable to connect to Node 5. Last seen 2 hours ago."
              dismissible
            />
          </div>
        </section>

        {/* Status Badges Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Status Badges</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600">Small</p>
                <NodeStatusBadge status="online" showDot showText size="sm" />
                <NodeStatusBadge status="offline" showText size="sm" />
                <NodeStatusBadge status="warning" showDot showText size="sm" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600">Medium</p>
                <NodeStatusBadge status="online" showDot showText size="md" />
                <NodeStatusBadge status="offline" showText size="md" />
                <NodeStatusBadge status="warning" showDot showText size="md" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600">Large</p>
                <NodeStatusBadge status="online" showDot showText size="lg" />
                <NodeStatusBadge status="offline" showText size="lg" />
                <NodeStatusBadge status="warning" showDot showText size="lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Interactive Components</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary"
              >
                Open Modal
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="btn-danger"
              >
                Show Confirm Dialog
              </button>
              <button
                onClick={() => showToast({ type: 'success', title: 'Success!', message: 'This is a toast notification' })}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Show Toast
              </button>
              <button
                onClick={simulateLoading}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Simulate Loading
              </button>
            </div>
          </div>
        </section>

        {/* DataTable Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Table</h2>
          <DataTable
            columns={columns}
            data={sampleNodes}
            searchable
            pagination
            pageSize={3}
            searchPlaceholder="Search nodes..."
          />
        </section>

        {/* TimeAgo Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Time Formatting</h2>
          <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
            <div>
              <span className="font-semibold text-gray-700">Relative: </span>
              <TimeAgo timestamp={Date.now() - 120000} format="relative" />
            </div>
            <div>
              <span className="font-semibold text-gray-700">Absolute: </span>
              <TimeAgo timestamp={Date.now()} format="absolute" />
            </div>
            <div>
              <span className="font-semibold text-gray-700">Both: </span>
              <TimeAgo timestamp={Date.now() - 3600000} format="both" />
            </div>
          </div>
        </section>

        {/* EmptyState Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Empty States</h2>
          <div className="bg-white rounded-lg shadow-md">
            <EmptyState
              icon={Inbox}
              title="No items found"
              description="There are no items to display at this time. Create your first item to get started."
              action={{
                label: "Create Item",
                onClick: () => showToast({ type: 'info', message: 'Creating new item...' }),
                icon: Plus
              }}
            />
          </div>
        </section>

        {/* Loading Spinner Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading Spinners</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-wrap gap-8 items-center justify-around">
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-600 mb-4">Small</p>
                <LoadingSpinner size="sm" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-600 mb-4">Medium</p>
                <LoadingSpinner size="md" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-600 mb-4">Large</p>
                <LoadingSpinner size="lg" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-600 mb-4">With Text</p>
                <LoadingSpinner size="md" text="Loading data..." />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Edit Node Configuration"
        size="md"
        footer={
          <>
            <button
              onClick={() => {
                setShowModal(false);
                showToast({ type: 'success', message: 'Changes saved successfully' });
              }}
              className="btn-primary"
            >
              Save Changes
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Node Name
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter node name"
              defaultValue="Sensor A"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter location"
              defaultValue="Zone 1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="input-field"
              rows={4}
              placeholder="Enter description"
              defaultValue="Main pressure sensor in Zone 1"
            />
          </div>
        </div>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Node"
        message="Are you sure you want to delete this node? All historical data will be permanently removed. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}

