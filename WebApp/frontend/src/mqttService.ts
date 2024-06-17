import { Client, Message } from 'paho-mqtt';

const websocketUrl = 'ws://49.13.173.130:9001/mqtt';  // WebSocket URL für den MQTT-Broker

function getClient(onConnectionLost: (responseObject: any) => void, onMessageArrived: (message: Message) => void): Client {
  const client = new Client(websocketUrl, `mqttjs_${Math.random().toString(16).substr(2, 8)}`);

  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  client.connect({
    onSuccess: () => {
      console.log('Connected to MQTT Broker');
    },
    onFailure: (error) => {
      console.error('Connection failed:', error);
    },
    useSSL: false,
    timeout: 3,
  });

  return client;
}

function subscribe(client: Client, topic: string, errorHandler: (error: string) => void) {
  const callBack = (err: any, granted: any) => {
    if (err) {
      errorHandler('Subscription request failed');
    } else {
      console.log(`Subscribed to topic: ${topic}`);
    }
  };
  client.subscribe(topic, { onSuccess: callBack, onFailure: callBack });
}

function publish(client: Client, topic: string, message: string) {
  const msg = new Message(message);
  msg.destinationName = topic;
  client.send(msg);
}

function unsubscribe(client: Client, topic: string) {
  client.unsubscribe(topic, {
    onSuccess: () => {
      console.log(`Unsubscribed from topic: ${topic}`);
    },
    onFailure: (error) => {
      console.error(`Unsubscription failed: ${error}`);
    },
  });
}

function closeConnection(client: Client) {
  client.disconnect();
}

const mqttService = {
  getClient,
  subscribe,
  publish,
  unsubscribe,
  closeConnection,
};

export default mqttService;
