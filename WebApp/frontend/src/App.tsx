import React, { useEffect, useState } from 'react';
import createMQTTClient from './mqttClient';
import { Message } from 'paho-mqtt';
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

const App: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [redValues, setRedValues] = useState<RedData[]>([]);

  useEffect(() => {
    const host = '49.13.173.130';
    const port = 9001;
    const clientId = 'clientId-' + Math.random().toString(36).substring(7);

    const onMessageCallback = (message: Message) => {
      const data = JSON.parse(message.payloadString);
      setSensorData(data);
      setRedValues((prevValues) => [
        ...prevValues,
        { timestamp: new Date(), value: data.red }
      ].slice(-50)); // Keep the last 50 values
    };

    const client = createMQTTClient(host, port, clientId, onMessageCallback);

    return () => {
      client.disconnect();
    };
  }, []);

  return (
    <div className="App min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <header className="bg-blue-600 w-full py-6 text-white text-center shadow-md">
        <h1 className="text-3xl font-bold">MQTT Client Dashboard</h1>
        <p className="mt-2 text-lg">Real-time Biosensor Data Visualization</p>
      </header>
      <div className="mt-8 w-full md:w-3/4 lg:w-1/2">
        {sensorData ? (
          <div className="grid gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Sensor Data</h2>
              <div className="grid grid-cols-2 gap-6">
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
    </div>
  );
};

export default App;
