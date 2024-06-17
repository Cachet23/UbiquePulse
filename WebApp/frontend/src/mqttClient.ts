import { Client, Message } from 'paho-mqtt';

const createMQTTClient = (
  host: string, 
  port: number, 
  clientId: string, 
  onMessageCallback: (message: Message) => void
): Client => {
  const client = new Client(host, port, clientId);

  // Set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  // Connect the client
  client.connect({ onSuccess: onConnect });

  // Called when the client connects
  function onConnect() {
    console.log('Connected');
    client.subscribe('Pulse'); // Subscribe to the 'Pulse' topic
  }

  // Called when the client loses its connection
  function onConnectionLost(responseObject: any) {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
    }
  }

  // Called when a message arrives
  function onMessageArrived(message: Message) {
    console.log('onMessageArrived:' + message.payloadString);
    onMessageCallback(message); // Call the callback function with the received message
  }

  return client;
};

export default createMQTTClient;
