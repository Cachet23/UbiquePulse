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
  if (!client.isConnected()) {
    client.connect({ 
      onSuccess: onConnect,
      onFailure: (error) => {
        console.error('Connection failed:', error);
      }
    });
  }

  // Called when the client connects
  function onConnect() {
    console.log('Connected');
    client.subscribe('Pulse');
    client.subscribe('Beat');
  }

  // Called when the client loses its connection
  function onConnectionLost(responseObject: any) {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:', responseObject.errorMessage);
    }
  }

  // Called when a message arrives
  function onMessageArrived(message: Message) {
    console.log('onMessageArrived:', message.payloadString);
    onMessageCallback(message);
  }

  return client;
};

export default createMQTTClient;
