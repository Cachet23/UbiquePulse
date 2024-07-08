/**
 * @file mqttClient.ts
 * Provides functionality to create and manage an MQTT client connection.
 * @author Nils Baierl
 */

import { connect, MqttClient } from 'mqtt';

/**
 * @param {string} host The hostname or IP address of the MQTT broker.
 * @param {number} port The port number on which the MQTT broker is running.
 * @param {string} clientId A unique string that identifies the client to the MQTT broker.
 * @param {(topic: string, message: Buffer) => void} onMessageCallback A callback function that is called whenever a message is received. It receives the topic and message as parameters.
 * @returns {MqttClient} An instance of MqttClient connected to the specified MQTT broker.
 */
const createMQTTClient = (
  host: string,
  port: number,
  clientId: string,
  onMessageCallback: (topic: string, message: Buffer) => void
): MqttClient => {
  const url = `ws://${host}:${port}`; // Constructs the WebSocket URL for the MQTT connection.
  const client = connect(url, { clientId }); 

  client.on('connect', () => {
    console.log('Connected');
    client.subscribe('Pulse', (err) => { 
      if (err) {
        console.error('Subscription error:', err);
      }
    });
  });

  client.on('message', (topic, message) => {
    console.log('onMessageArrived:', message.toString());
    onMessageCallback(topic, message);
  });

  client.on('error', (err) => { 
    console.error('Connection error:', err);
  });

  client.on('close', () => { 
    console.log('Connection closed');
  });

  return client; 
};

export default createMQTTClient;