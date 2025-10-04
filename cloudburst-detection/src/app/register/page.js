// src/app/register/page.js
'use client';

import { useState } from 'react';
import { database, ref, set, get } from '@/lib/firebase';
import { isValidLatitude, isValidLongitude, generateId } from '@/lib/utils';
import { MapPin, Navigation } from 'lucide-react';

export default function RegisterNode() {
  const [formData, setFormData] = useState({
    nodeId: '',
    type: 'node',
    name: '',
    latitude: '',
    longitude: '',
    altitude: '',
    installedBy: '',
    description: '',
    nearbyNodes: '',
  });

  const [captureMethod, setCaptureMethod] = useState('manual'); // manual, gps, map
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGPSCapture = () => {
    if (!navigator.geolocation) {
      setMessage({ type: 'error', text: 'Geolocation is not supported by your browser' });
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setMessage({ type: 'success', text: 'GPS coordinates captured successfully!' });
        setLoading(false);
      },
      (error) => {
        setMessage({ type: 'error', text: 'GPS capture failed: ' + error.message });
        setCaptureMethod('manual');
        setLoading(false);
      }
    );
  };

  const validateForm = async () => {
    // Check if node ID already exists
    const nodeRef = ref(database, `nodes/${formData.nodeId}`);
    const snapshot = await get(nodeRef);
    if (snapshot.exists()) {
      throw new Error('Node ID already exists. Please choose a different ID.');
    }

    // Validate required fields
    if (!formData.nodeId || !formData.name) {
      throw new Error('Node ID and Name are required');
    }

    // Validate coordinates
    if (!isValidLatitude(formData.latitude)) {
      throw new Error('Invalid latitude. Must be between -90 and 90');
    }

    if (!isValidLongitude(formData.longitude)) {
      throw new Error('Invalid longitude. Must be between -180 and 180');
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await validateForm();

      // Parse nearby nodes
      const nearbyNodesArray = formData.nearbyNodes
        .split(',')
        .map(id => id.trim())
        .filter(id => id.length > 0);

      // Prepare metadata
      const metadata = {
        nodeId: formData.nodeId,
        type: formData.type,
        name: formData.name,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        altitude: formData.altitude ? parseFloat(formData.altitude) : null,
        installedDate: new Date().toISOString(),
        installedBy: formData.installedBy || 'Unknown',
        description: formData.description || '',
        nearbyNodes: nearbyNodesArray,
        status: 'active',
        createdAt: Date.now(),
      };

      // Initialize realtime data structure
      const realtime = {
        temperature: 0,
        pressure: 0,
        altitude: formData.altitude ? parseFloat(formData.altitude) : 0,
        humidity: formData.type === 'gateway' ? 0 : null,
        rainfall: null,
        rssi: formData.type === 'gateway' ? null : 0,
        batteryLevel: null,
        timestamp: Date.now(),
        lastSeen: 0,
        status: 'offline',
        alertStatus: 'normal',
        messageCount: 0,
      };

      // Save to Firebase
      await set(ref(database, `nodes/${formData.nodeId}`), {
        metadata,
        realtime,
        history: {}
      });

      setMessage({ 
        type: 'success', 
        text: `Node "${formData.name}" registered successfully!` 
      });

      // Reset form
      setFormData({
        nodeId: '',
        type: 'node',
        name: '',
        latitude: '',
        longitude: '',
        altitude: '',
        installedBy: '',
        description: '',
        nearbyNodes: '',
      });

    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Register New Node</h1>
          <p className="text-gray-600 mb-6">
            Add a new sensor node or gateway to the system
          </p>

          {message.text && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Node ID and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Node ID *
                </label>
                <input
                  type="text"
                  name="nodeId"
                  value={formData.nodeId}
                  onChange={handleChange}
                  required
                  placeholder="e.g., node1, node2, gateway"
                  className="input-field"
                />
                <p className="text-xs text-gray-500 mt-1">Unique identifier for this node</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="node">Node</option>
                  <option value="gateway">Gateway</option>
                </select>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Node Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Valley Sensor Station"
                className="input-field"
              />
            </div>

            {/* Location Capture Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Capture Method
              </label>
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setCaptureMethod('manual')}
                  className={`px-4 py-2 rounded-lg border ${
                    captureMethod === 'manual'
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700'
                  }`}
                >
                  <MapPin className="inline h-4 w-4 mr-2" />
                  Manual Entry
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCaptureMethod('gps');
                    handleGPSCapture();
                  }}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg border ${
                    captureMethod === 'gps'
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700'
                  } disabled:opacity-50`}
                >
                  <Navigation className="inline h-4 w-4 mr-2" />
                  Use GPS
                </button>
              </div>
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude *
                </label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  required
                  step="any"
                  placeholder="e.g., 28.6139"
                  className="input-field"
                />
                <p className="text-xs text-gray-500 mt-1">Range: -90 to 90</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude *
                </label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  required
                  step="any"
                  placeholder="e.g., 77.2090"
                  className="input-field"
                />
                <p className="text-xs text-gray-500 mt-1">Range: -180 to 180</p>
              </div>
            </div>

            {/* Altitude */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Altitude (meters)
              </label>
              <input
                type="number"
                name="altitude"
                value={formData.altitude}
                onChange={handleChange}
                step="any"
                placeholder="e.g., 878.9"
                className="input-field"
              />
            </div>

            {/* Installed By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Installed By
              </label>
              <input
                type="text"
                name="installedBy"
                value={formData.installedBy}
                onChange={handleChange}
                placeholder="e.g., Team Alpha"
                className="input-field"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="e.g., Near river crossing, valley location"
                className="input-field"
              />
            </div>

            {/* Nearby Nodes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nearby Nodes (comma-separated)
              </label>
              <input
                type="text"
                name="nearbyNodes"
                value={formData.nearbyNodes}
                onChange={handleChange}
                placeholder="e.g., node2, gateway, node3"
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">
                List IDs of nearby nodes for mesh network visualization
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering...' : 'Register Node'}
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}