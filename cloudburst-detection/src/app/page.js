// src/app/page.js
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { database, ref, onValue } from '@/lib/firebase';
import { Activity, AlertTriangle, Cloud, MapPin } from 'lucide-react';

export default function Home() {
  const [stats, setStats] = useState({
    totalNodes: 0,
    activeNodes: 0,
    totalDataPoints: 0,
    activeAlerts: 0,
  });

  const [recentAlerts, setRecentAlerts] = useState([]);
  const [lastUpdateTime, setLastUpdateTime] = useState('');

  useEffect(() => {
    // Set initial time on client side
    setLastUpdateTime(new Date().toLocaleTimeString());
    
    // Update time every second
    const timeInterval = setInterval(() => {
      setLastUpdateTime(new Date().toLocaleTimeString());
    }, 1000);

    // Listen to system stats
    const systemRef = ref(database, 'system');
    const unsubscribe = onValue(systemRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setStats({
          totalNodes: data.totalNodes || 0,
          activeNodes: data.activeNodes || 0,
          totalDataPoints: data.totalDataPoints || 0,
          activeAlerts: data.activeAlerts || 0,
        });
      }
    });

    // Listen to alerts
    const alertsRef = ref(database, 'alerts');
    const unsubscribeAlerts = onValue(alertsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const alertsArray = Object.values(data)
          .filter(alert => !alert.acknowledged)
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 3);
        setRecentAlerts(alertsArray);
      }
    });

    return () => {
      clearInterval(timeInterval);
      unsubscribe();
      unsubscribeAlerts();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Cloudburst Detection System
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Early Warning System for Flash Flood Prevention
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            Real-time monitoring and AI-powered anomaly detection to protect communities 
            from sudden cloudbursts in hilly regions. Our distributed sensor network 
            provides hyperlocal rainfall and atmospheric data for timely alerts.
          </p>
          
          <div className="flex justify-center gap-4">
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View Dashboard
            </Link>
            <Link
              href="/about"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-blue-600"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Key Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <Cloud className="h-8 w-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.totalNodes}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Total Nodes</h3>
            <p className="text-sm text-gray-600">Sensor nodes deployed</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <Activity className="h-8 w-8 text-green-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.activeNodes}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Active Sensors</h3>
            <p className="text-sm text-gray-600">Currently online</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <MapPin className="h-8 w-8 text-purple-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.totalDataPoints}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Data Points</h3>
            <p className="text-sm text-gray-600">Collected readings</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.activeAlerts}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Active Alerts</h3>
            <p className="text-sm text-gray-600">Unacknowledged</p>
          </div>
        </div>

        {/* Live Status Indicator */}
        <div className="mt-12 flex items-center justify-center">
          <div className="bg-white px-6 py-3 rounded-full shadow-md flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-gray-900">System Online</span>
            </div>
            <div className="h-6 w-px bg-gray-300"></div>
            <span className="text-gray-600">
              Last update: {lastUpdateTime}
            </span>
          </div>
        </div>

        {/* Recent Alerts Ticker */}
        {recentAlerts.length > 0 && (
          <div className="mt-12 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Alerts
            </h3>
            <div className="space-y-2">
              {recentAlerts.map((alert, index) => (
                <div key={index} className="text-red-700 text-sm">
                  {alert.message}
                </div>
              ))}
            </div>
            <Link
              href="/alerts"
              className="text-red-600 hover:text-red-800 font-medium text-sm mt-2 inline-block"
            >
              View all alerts →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}