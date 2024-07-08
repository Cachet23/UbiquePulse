/**
 * @file SensorDataDisplay.tsx
 * This component is responsible for displaying sensor data including heart rate, SpO2 levels, and a graph.
 * The RedGraph component is utilized to visualize the red raw values over time.
 * (GPT generated)
 * @author Nils Baierl
 */

import React from 'react';
import RedGraph from './RedGraph';

interface SensorData {
  heartRate: number;
  spO2: number;
  red: number;
}

interface RedData {
  timestamp: Date;
  value: number;
}

interface SensorDataDisplayProps {
  sensorData: SensorData | null;
  redValues: RedData[];
}

const SensorDataDisplay: React.FC<SensorDataDisplayProps> = ({ sensorData, redValues }) => {
  return (
    <div className="mt-8 w-full px-4 sm:px-6 lg:px-8">
      {sensorData ? (
        <div className="grid gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Sensor Data</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-green-100 p-4 rounded-lg text-center shadow-sm">
                <h3 className="text-xl font-medium text-gray-600">Heart Rate</h3>
                <p className="text-3xl font-bold text-gray-800">{sensorData.heartRate} bpm</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg text-center shadow-sm">
                <h3 className="text-xl font-medium text-gray-600">SpO2</h3>
                <p className="text-3xl font-bold text-gray-800">{sensorData.spO2} %</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Red Raw Value</h2>
            <RedGraph data={redValues} />
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">No data received</p>
      )}
    </div>
  );
};

export default SensorDataDisplay;