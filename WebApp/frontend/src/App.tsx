import React, { useState, useEffect } from 'react';
import mqttService from './mqttService';
import { Client, Message } from 'paho-mqtt';

interface SensorData {
  heartRate: number;
  spO2: number;
}

const App: React.FC = () => {
  const [data, setData] = useState<SensorData>({ heartRate: 0, spO2: 0 });
  const [mqttClient, setMqttClient] = useState<Client | null>(null);

  useEffect(() => {
    const onConnectionLost = (responseObject: any) => {
      console.error('Connection lost:', responseObject.errorMessage);
    };

    const onMessageArrived = (message: Message) => {
      console.log(`Received message on ${message.destinationName}: ${message.payloadString}`);
      try {
        const sensorData: SensorData = JSON.parse(message.payloadString);
        setData(sensorData);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    const client = mqttService.getClient(onConnectionLost, onMessageArrived);
    setMqttClient(client);

    mqttService.subscribe(client, 'Pulse', (error: string) => {
      console.error(error);
    });

    return () => {
      if (mqttClient) {
        mqttService.unsubscribe(mqttClient, 'Pulse');
        mqttService.closeConnection(mqttClient);
      }
    };
  }, [mqttClient]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Real-Time Sensor Data</h1>
      <div className="mt-4">
        <h2 className="text-lg">Heart Rate: {data.heartRate} bpm</h2>
        <h2 className="text-lg">SpO2: {data.spO2} %</h2>
      </div>
    </div>
  );
};

export default App;
