'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import { Thermometer, Gauge, Droplets, Radio } from 'lucide-react';

// Fix Leaflet's default marker icons for Next.js
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

/**
 * MapBoundsUpdater Component
 * Automatically fits map bounds when nodes change
 */
function MapBoundsUpdater({ nodes }) {
  const map = useMap();

  useEffect(() => {
    if (nodes.length > 0) {
      const bounds = nodes.map(node => [
        node.metadata.latitude,
        node.metadata.longitude
      ]);
      
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }
  }, [nodes, map]);

  return null;
}

/**
 * DashboardMap Component
 * Renders interactive map with node markers, connections, and popups
 */
export default function DashboardMap({
  nodes,
  selectedNode,
  setSelectedNode,
  getNodeStatus,
  formatTimeAgo
}) {
  /**
   * Creates custom colored marker icon based on node status
   * @param {Object} node - Node object with metadata and realtime data
   * @returns {L.DivIcon} Custom Leaflet icon
   */
  const getMarkerIcon = (node) => {
    const status = getNodeStatus(node);
    const isGateway = node.metadata.type === 'gateway';

    // Status colors
    const colors = {
      online: '#10b981',    // green-500
      offline: '#ef4444',   // red-500
      warning: '#f59e0b'    // yellow-500
    };

    const color = colors[status] || colors.offline;
    const size = isGateway ? 32 : 24;

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background-color: ${color};
          border: ${isGateway ? '3px solid #3b82f6' : '2px solid white'};
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ${status === 'online' ? 'animation: markerPulse 2s infinite;' : ''}
        "></div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
  };

  // Default center (India)
  const defaultCenter = [20.5937, 78.9629];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={5}
      className="h-full w-full"
      style={{ zIndex: 0 }}
    >
      {/* OpenStreetMap Tile Layer */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Auto-fit bounds to show all nodes */}
      <MapBoundsUpdater nodes={nodes} />

      {/* Render connection lines between nearby nodes */}
      {nodes.map(node => {
        if (!node.metadata.nearbyNodes || node.metadata.nearbyNodes.length === 0) {
          return null;
        }

        return node.metadata.nearbyNodes.map(nearbyNodeId => {
          const nearbyNode = nodes.find(n => n.metadata.nodeId === nearbyNodeId);
          if (!nearbyNode) return null;

          return (
            <Polyline
              key={`${node.metadata.nodeId}-${nearbyNodeId}`}
              positions={[
                [node.metadata.latitude, node.metadata.longitude],
                [nearbyNode.metadata.latitude, nearbyNode.metadata.longitude]
              ]}
              pathOptions={{
                color: '#3b82f6',      // blue-500
                weight: 2,
                opacity: 0.6,
                dashArray: '5, 10'
              }}
            />
          );
        });
      })}

      {/* Render node markers with popups */}
      {nodes.map(node => (
        <Marker
          key={node.metadata.nodeId}
          position={[node.metadata.latitude, node.metadata.longitude]}
          icon={getMarkerIcon(node)}
          eventHandlers={{
            click: () => setSelectedNode(node)
          }}
        >
          <Popup className="custom-popup" minWidth={220}>
            <div className="min-w-[200px]">
              {/* Header with status */}
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    getNodeStatus(node) === 'online'
                      ? 'bg-green-500'
                      : getNodeStatus(node) === 'warning'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                />
                <h3 className="font-bold text-gray-900">{node.metadata.name}</h3>
              </div>

              {/* Node type badge */}
              <div className="mb-2">
                <span
                  className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${
                    node.metadata.type === 'gateway'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {node.metadata.type === 'gateway' ? '🛰️ Gateway' : '📡 Sensor Node'}
                </span>
              </div>

              {/* Sensor readings */}
              <div className="space-y-1.5 text-sm border-t pt-2">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-red-500" />
                  <span className="text-gray-700">
                    {node.realtime?.temperature?.toFixed(1) || 'N/A'}°C
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-700">
                    {node.realtime?.pressure?.toFixed(1) || 'N/A'} hPa
                  </span>
                </div>

                {node.realtime?.humidity !== null && node.realtime?.humidity !== undefined && (
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-cyan-500" />
                    <span className="text-gray-700">{node.realtime.humidity.toFixed(1)}%</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700">{node.realtime?.rssi || 'N/A'} dBm</span>
                </div>
              </div>

              {/* Last updated time */}
              <div className="text-xs text-gray-500 mt-2 border-t pt-1.5">
                Updated: {formatTimeAgo(node.realtime?.lastSeen)}
              </div>

              {/* View details button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNode(node);
                }}
                className="text-blue-600 text-sm mt-2 hover:underline w-full text-left font-medium"
              >
                View Details →
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

