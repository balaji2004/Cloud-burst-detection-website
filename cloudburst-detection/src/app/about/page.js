'use client';

import { AlertCircle, Shield, Users, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Cloudburst Detection System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A real-time monitoring and prediction system designed to detect and alert communities about potential cloudbursts and extreme weather events.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our mission is to leverage advanced technology and machine learning to provide early warning systems for extreme weather events, particularly cloudbursts. By analyzing real-time meteorological data, we aim to protect lives and property by giving communities crucial time to prepare and respond to potentially dangerous weather conditions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-center mb-4">
              <Zap className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
              Real-Time Monitoring
            </h3>
            <p className="text-gray-600 text-center">
              Continuous monitoring of weather conditions using distributed sensor nodes and advanced analytics to detect anomalies instantly.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
              Predictive Analysis
            </h3>
            <p className="text-gray-600 text-center">
              Machine learning models trained on historical weather data to predict cloudburst events with high accuracy before they occur.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-center mb-4">
              <Users className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
              Community Alerts
            </h3>
            <p className="text-gray-600 text-center">
              Instant notifications to registered contacts and authorities to ensure rapid response and community safety during critical events.
            </p>
          </div>
        </div>

        {/* Technology Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Technology Stack</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Frontend</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Next.js 15 with React 19</li>
                <li>TailwindCSS for modern UI</li>
                <li>Real-time data visualization with Recharts</li>
                <li>Interactive maps with Leaflet</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Backend</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Firebase for real-time database</li>
                <li>XGBoost machine learning model</li>
                <li>RESTful API for predictions</li>
                <li>SMS notification system</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Data Collection</h4>
                <p className="text-gray-600">
                  Sensor nodes continuously collect meteorological data including rainfall, temperature, humidity, and pressure.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Analysis</h4>
                <p className="text-gray-600">
                  Machine learning models analyze the data in real-time to identify patterns and predict potential cloudburst events.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Alert Generation</h4>
                <p className="text-gray-600">
                  When a potential threat is detected, the system automatically generates alerts and notifies registered contacts via SMS and app notifications.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Response</h4>
                <p className="text-gray-600">
                  Communities and authorities can take preventive measures and evacuate if necessary, minimizing potential damage and casualties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

