'use client';

export default function DebugEnvPage() {
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Environment Variables Debug
          </h1>
          
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">Environment Variables</h2>
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
                <p><strong>NEXT_PUBLIC_API_BASE_URL:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL || 'NOT SET'}</p>
                <p><strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'NOT SET'}</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-green-900 mb-2">Expected Configuration</h2>
              <div className="space-y-2 text-sm text-green-800">
                <p><strong>Expected Backend URL:</strong> http://localhost:3000</p>
                <p><strong>Expected Frontend URL:</strong> http://localhost:3001</p>
                <p><strong>Current Issue:</strong> Frontend is using old hosted backend</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-yellow-900 mb-2">Debug Information</h2>
              <div className="space-y-2 text-sm text-yellow-800">
                <p><strong>Window Location:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server Side'}</p>
                <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent : 'Server Side'}</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-red-900 mb-2">Solution</h2>
              <div className="space-y-2 text-sm text-red-800">
                <p>1. Check if there are any .env files in the project</p>
                <p>2. Check if environment variables are set in the system</p>
                <p>3. Clear browser cache and localStorage</p>
                <p>4. Restart the frontend development server</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
