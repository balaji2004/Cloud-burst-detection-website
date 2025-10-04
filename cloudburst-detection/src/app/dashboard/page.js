'use client';

import { useEffect, useState } from 'react';
import { database, ref, onValue } from '@/lib/firebase';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Attempting Firebase connection...');
    
    const nodesRef = ref(database, 'nodes');
    const unsubscribe = onValue(
      nodesRef, 
      (snapshot) => {
        console.log('Firebase data received:', snapshot.val());
        setData(snapshot.val());
      },
      (error) => {
        console.error('Firebase error:', error);
        setError(error.message);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Test</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {!data && !error && <p>Loading...</p>}
      
      {data && (
        <div>
          <h2 className="font-bold mb-2">Firebase Data:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}