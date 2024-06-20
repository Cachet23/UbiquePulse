import React, { useState, useEffect, useRef } from 'react';
import createMQTTClient from './mqttClient';
import { Message, Client } from 'paho-mqtt';
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
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true); // default to true
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [heartbeatBuffer, setHeartbeatBuffer] = useState<AudioBuffer | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const loadHeartbeatSound = async () => {
      if (!audioContext) return;
      try {
        const response = await fetch('/heartbeat2.mp3'); // Your mp3 file
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = await audioContext.decodeAudioData(arrayBuffer);
        setHeartbeatBuffer(buffer);
        console.log('Heartbeat sound loaded successfully');
      } catch (error) {
        console.error('Error decoding audio data:', error);
      }
    };

    if (audioContext) {
      loadHeartbeatSound();
    }
  }, [audioContext]);

  useEffect(() => {
    if (!client) {
      const mqttClient = createMQTTClient(
        '49.13.173.130',
        9001,
        'clientId-' + Math.random().toString(36).substring(7),
        (message) => {
          if (message.destinationName === 'Pulse') {
            const data = JSON.parse(message.payloadString);
            setSensorData(data);
            setRedValues((prevValues) => [
              ...prevValues,
              { timestamp: new Date(), value: data.red }
            ].slice(-50)); // Keep the last 50 values
          }
          if (message.destinationName === 'Beat') {
            console.log('Heartbeat detected');
            if (soundEnabled && audioRef.current) {
              audioRef.current.play();
            }
          }
        }
      );
      setClient(mqttClient);
    }

    return () => {
      if (client && client.isConnected()) {
        client.disconnect();
      }
    };
  }, [client, soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
    if (audioRef.current) {
      audioRef.current.muted = !soundEnabled;
    }
  };

  const initializeAudioContext = () => {
    if (!audioContext) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(context);
    }
  };

  const handleUserGesture = () => {
    initializeAudioContext();
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div className="App min-h-screen bg-gray-100 flex flex-col items-center p-4" onClick={handleUserGesture}>
      <header className="bg-blue-600 w-full py-6 text-white text-center shadow-md">
        <h1 className="text-3xl font-bold">MQTT Client Dashboard</h1>
        <p className="mt-2 text-lg">Real-time Biosensor Data Visualization</p>
        <button onClick={toggleSound} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
          {soundEnabled ? 'Disabled' : 'Enabled'} Sound
        </button>
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
      <audio ref={audioRef} src="/heartbeat2.mp3" preload="auto" />
    </div>
  );
};

export default App;
