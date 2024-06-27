import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface AggregatedData {
  _id: string;
  timestamp: string;
  heartRate: number;
  spO2: number;
  red: number;
}

const AggregateDataDisplay: React.FC = () => {
  const [data, setData] = useState<AggregatedData[]>([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/aggregate'); // Update the endpoint to include the correct port
      setData(response.data);
    } catch (error) {
      console.error('Error fetching aggregated data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Daten alle 10 Sekunden abfragen
    return () => clearInterval(interval); // Intervall beim Demontieren der Komponente bereinigen
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