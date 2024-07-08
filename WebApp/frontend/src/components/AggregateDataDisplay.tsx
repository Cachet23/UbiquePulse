/**
 * @file AggregateDataDisplay.tsx
 * This file contains a React component that fetches and displays aggregated data from a specified endpoint.
 * It uses Axios for HTTP requests and React hooks for state management and side effects.
 * (GPT generated)
 * @author Nils Baierl
 */

import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Axios is used for making HTTP requests.

/**
 * @interface AggregatedData
 * Represents the structure of aggregated data received from the backend.
 * @author Nils Baierl
 */
interface AggregatedData {
  _id: string;
  timestamp: string;
  heartRate: number;
  spO2: number;
  red: number;
}

/**
 * @component AggregateDataDisplay
 * Fetches and displays aggregated data from a backend service.
 * It periodically updates the data every 10 seconds.
 * @author Nils Baierl
 */
const AggregateDataDisplay: React.FC = () => {
  const [data, setData] = useState<AggregatedData[]>([]);

  /**
   * @function fetchData
   * Asynchronously fetches aggregated data from the backend and updates the state.
   * Utilizes Axios for the HTTP GET request.
   * @author Nils Baierl
   */
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/aggregate'); 
      setData(response.data);
    } catch (error) {
      console.error('Error fetching aggregated data:', error);
    }
  };

  // useEffect hook to fetch data on component mount and set up a periodic refresh every 10 seconds.
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); 
    return () => clearInterval(interval); 
  }, []);

  return (
    <div className="mt-8 w-full px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Aggregated Data (Last 50 Entries)</h2>
      <ul className="bg-white p-6 rounded-lg shadow-md">
        {data.map((entry) => (
          <li key={entry._id} className="border-b last:border-b-0 py-2">
            <p className="text-gray-700">
              <span className="font-semibold">Timestamp:</span> {new Date(entry.timestamp).toLocaleString()}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Heart Rate:</span> {entry.heartRate.toFixed(2)} bpm
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">SpO2:</span> {entry.spO2.toFixed(2)} %
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Red:</span> {entry.red.toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AggregateDataDisplay;