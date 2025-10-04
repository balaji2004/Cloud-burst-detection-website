// src/app/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { database, ref, onValue } from '@/lib/firebase';
import { getNodeStatus } from '@/lib/utils';

// Import map component dynamically to avoid SSR issues
const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Dashboard() {
  const [nodes, setNodes] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to all nodes
    const nodesRef = ref(database, 'nodes');
    const unsubscribe = onValue(nodesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Update node status based on lastSeen
        const updatedNodes = {};
        Object.entries(data).forEach(([nodeId, nodeData]) => {
          if (nodeData.realtime && nodeData.metadata) {
            const status = getNodeStatus(nodeData.realtime.lastSeen);
            updatedNodes[nodeId] = {
              ...nodeData,
              realtime: {
                ...nodeData.realtime,
                status
              }
            };
          }
        });
        setNodes(updatedNodes);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleNodeClick = (nodeId) => {
    setSelectedNode(nodeId);
  };

  const handleCloseSidebar = () => {
    setSelectedNode(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white shadow-sm border-b px-4 py-3">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600">Real-time node monitoring</p>
      </div>

      <div className="flex-1 relative">
        <Map 
          nodes={nodes}
          onNodeClick={handleNodeClick}
          selectedNode={selectedNode}
        />

        {/* Sidebar for selected node */}
        {selectedNode && nodes[selectedNode] && (
          <div className="absolute top-0 right-0 w-96 h-full bg-white shadow-2xl overflow-y-auto z-[1000]">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {nodes[selectedNode].metadata?.name || selectedNode}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {nodes[selectedNode].metadata?.nodeId}
                  </p>
                </div>
                <button
                  onClick={handleCloseSidebar}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Status Badge */}
              <div className="mb-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  nodes[selectedNode].realtime.status === 'online' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    nodes[selectedNode].realtime.status === 'online' 
                      ? 'bg-green-600' 
                      : 'bg-red-600'
                  }`}></span>
                  {nodes[selectedNode].realtime.status}
                </span>
              </div>

              {/* Sensor Readings */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-3">Current Readings</h3>
                
                {nodes[selectedNode].realtime.temperature !== undefined && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Temperature</span>
                      <span className="text-2xl font-bold text-gray-900">
                        {nodes[selectedNode].realtime.temperature?.toFixed(1)}°C
                      </span>
                    </div>
                  </div>
                )}

                {nodes[selectedNode].realtime.pressure !== undefined && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Pressure</span>
                      <span className="text-2xl font-bold text-gray-900">
                        {nodes[selectedNode].realtime.pressure?.toFixed(1)} hPa
                      </span>
                    </div>
                  </div>
                )}

                {nodes[selectedNode].realtime.humidity !== undefined && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Humidity</span>
                      <span className="text-2xl font-bold text-gray-900">
                        {nodes[selectedNode].realtime.humidity?.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}

                {nodes[selectedNode].realtime.rssi !== undefined && nodes[selectedNode].realtime.rssi !== null && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Signal Strength</span>
                      <span className="text-2xl font-bold text-gray-900">
                        {nodes[selectedNode].realtime.rssi} dBm
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-3">Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium text-gray-900">
                      {nodes[selectedNode].metadata?.type || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium text-gray-900">
                      {nodes[selectedNode].metadata?.latitude?.toFixed(4)}, {nodes[selectedNode].metadata?.longitude?.toFixed(4)}
                    </span>
                  </div>
                  {nodes[selectedNode].metadata?.description && (
                    <div className="mt-2">
                      <span className="text-gray-600">Description:</span>
                      <p className="text-gray-900 mt-1">{nodes[selectedNode].metadata.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* View Details Button */}
              <div className="mt-6">
                <a
                  href={`/graphs?node=${selectedNode}`}
                  className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  View Detailed History
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}