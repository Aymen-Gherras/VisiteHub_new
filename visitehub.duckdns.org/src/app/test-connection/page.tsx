'use client';

import { useState, useEffect } from 'react';
import { ApiService } from '@/api';

export default function TestConnectionPage() {
  // ✅ SECURITY: Disable debug pages in production
  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
          <p className="text-gray-600">The page you are looking for does not exist.</p>
        </div>
      </div>
    );
  }
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...');
  const [backendData, setBackendData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setConnectionStatus('Testing connection...');
      setError(null);

      // Test basic connection to backend
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/properties`);
      
      if (response.ok) {
        const data = await response.json();
        setBackendData(data);
        setConnectionStatus('✅ Connected successfully!');
      } else {
        setConnectionStatus(`❌ Connection failed: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setConnectionStatus('❌ Connection failed');
    }
  };

  const testSwaggerDocs = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    window.open(`${apiUrl}/docs`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frontend-Backend Connection Test
          </h1>
          
          <div className="space-y-6">
            {/* Connection Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">Connection Status</h2>
              <p className="text-blue-800">{connectionStatus}</p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Error Details</h3>
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Backend Data Display */}
            {backendData && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Backend Response</h3>
                <pre className="text-green-800 text-sm overflow-auto">
                  {JSON.stringify(backendData, null, 2)}
                </pre>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={testConnection}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Test Connection Again
              </button>
              
              <button
                onClick={testSwaggerDocs}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Open Swagger Docs
              </button>
            </div>

            {/* Configuration Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Configuration</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Frontend URL:</strong> http://localhost:3001</p>
                <p><strong>Backend URL:</strong> http://localhost:3000</p>
                <p><strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}</p>
                <p><strong>Swagger Docs:</strong> http://localhost:3000/docs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
