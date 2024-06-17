import { connect, MqttClient } from 'mqtt';

const createMQTTClient = (
  host: string,
  port: number,
  clientId: string,
  onMessageCallback: (topic: string, message: Buffer) => void
): MqttClient => {
  const url = `ws://${host}:${port}`;
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
