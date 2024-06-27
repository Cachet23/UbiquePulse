import React, { useState, useEffect, useRef } from 'react';
import createMQTTClient from './mqttClient';
import { Message, Client } from 'paho-mqtt';
import Header from './components/Header';
import Menu from './components/Menu';
import SensorDataDisplay from './components/SensorDataDisplay';

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
  const [sendRedRaw, setSendRedRaw] = useState<boolean>(true); // default to true
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [heartbeatBuffer, setHeartbeatBuffer] = useState<AudioBuffer | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
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

      return () => {
        if (mqttClient.isConnected()) {
          mqttClient.disconnect();
        }
      };
    }
  }, [client, soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
    if (audioRef.current) {
      audioRef.current.muted = !soundEnabled;
    }
  };

  const toggleSendRedRaw = () => {
    const newValue = !sendRedRaw;
    setSendRedRaw(newValue);
    if (client && client.isConnected()) {
      client.send('sendRedRaw', JSON.stringify(newValue));
      console.log(`Sending red raw data: ${newValue}`);
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
    <div className="App min-h-screen bg-gray-100 flex flex-col items-center p-4 md:p-6 lg:p-8" onClick={handleUserGesture}>
      <Header onMenuClick={() => setMenuOpen(!menuOpen)} />
      {menuOpen && (
        <Menu
          soundEnabled={soundEnabled}
          sendRedRaw={sendRedRaw}
          toggleSound={toggleSound}
          toggleSendRedRaw={toggleSendRedRaw}
        />
      )}
      <SensorDataDisplay sensorData={sensorData} redValues={redValues} />
      <audio ref={audioRef} src="/heartbeat2.mp3" preload="auto" />
    </div>
  );
};

export default App;