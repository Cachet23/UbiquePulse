/**
 * @file mqttClient.ts
 * This file defines a function to create and manage a connection to an MQTT broker using the `paho-mqtt` library.
 * @author Nils Baierl
 * (GPT generated) 
 */

import { Client, Message } from 'paho-mqtt';

/**
 * @param {string} host The hostname or IP address of the MQTT broker.
 * @param {number} port The port number on which the MQTT broker is running.
 * @param {string} clientId A unique string that identifies the client to the MQTT broker.
 * @param {(message: Message) => void} onMessageCallback A callback function that is called whenever a message arrives. It receives the message as a parameter.
 * @returns {Client} An instance of `Client` connected to the specified MQTT broker.
 */
const createMQTTClient = (
  host: string, 
  port: number, 
  clientId: string, 
  onMessageCallback: (message: Message) => void
): Client => {
  const client = new Client(host, port, clientId); // Initializes a new MQTT Client.

  // Set callback handlers
  client.onConnectionLost = onConnectionLost; // Handles lost connection scenarios.
  client.onMessageArrived = onMessageArrived; // Handles incoming messages.

  // Connect the client
  if (!client.isConnected()) {
    client.connect({ 
      onSuccess: onConnect, // Called when the connection is successfully established.
      onFailure: (error) => { // Called when the connection attempt fails.
        console.error('Connection failed:', error);
      }
    });
  }

  /**
   * Called when the client successfully connects to the MQTT broker.
   * Subscribes to 'Pulse' and 'Beat' topics.
   */
  function onConnect() {
    console.log('Connected');
    client.subscribe('Pulse');
    client.subscribe('Beat');
  }

  /**
   * Called when the connection to the MQTT broker is lost.
   * @param {any} responseObject Object containing error details.
   */
  function onConnectionLost(responseObject: any) {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:', responseObject.errorMessage);
    }
  }

  /**
   * Called when a new message arrives from the MQTT broker.
   * @param {Message} message The message that arrived.
   */
  function onMessageArrived(message: Message) {
    console.log('onMessageArrived:', message.payloadString);
    onMessageCallback(message); // Invokes the provided callback with the arrived message.
  }

  return client; // Returns the initialized and configured MQTT client.
};

export default createMQTTClient; // Exports the createMQTTClient function.