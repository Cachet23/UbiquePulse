/**
 * @fileoverview This file sets up an Express server with routes to handle sensor data,
 * connects to MongoDB for data storage, and configures an MQTT client for real-time data processing.
 * and MQTT for real-time communication.
 * @author Dominik Schwagerl
 */

import express from 'express';
import mongoose from 'mongoose';
import createMQTTClient from './mqttClient';
import SensorData from './sensorDataModel';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());


const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/sensordata';
mongoose.set('strictQuery', true);
mongoose.connect(mongoURI).then(
  () => console.log('Connected to MongoDB'),
  err => console.error('Connection error:', err)
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


app.use(express.json());

/**
 * Root route indicating backend is functional
 */
app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

/**
 * Route to fetch the last 10 sensor data entries from MongoDB.
 */
app.get('/data', async (req, res) => {
  try {
    const data = await SensorData.find().sort({ timestamp: -1 }).limit(10);
    res.json(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

/**
 * Route to fetch the last 50 sensor data entries from MongoDB.
 */
app.get('/aggregate', async (req, res) => {
  try {
    const data = await SensorData.find().sort({ timestamp: -1 }).limit(50);
    res.json(data);
  } catch (err) {
    res.status(500).send(err);
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/**
 * Configuration for the MQTT client, including host, port, and client ID.
 */
const host = '49.13.173.130';
const port = 9001; // websocket port (configureed in mosquitto.conf)
const clientId = `backend-client-${Math.random().toString(36).substring(7)}`;

/**
 * Object to store aggregated data from MQTT messages.
 */
const aggregatedData: { heartRate: number[]; spO2: number[]; red: number[] } = {
  heartRate: [],
  spO2: [],
  red: [],
};

/**
 * Callback function for MQTT messages. Parses the message and updates aggregated data.
 */
const onMessageCallback = (topic: string, message: Buffer) => {
  const data = JSON.parse(message.toString());
  aggregatedData.heartRate.push(data.heartRate);
  aggregatedData.spO2.push(data.spO2);
  aggregatedData.red.push(data.red);
};

/**
 * Initializes the MQTT client with the specified configuration and message callback.
 * client subscribes automatically to topics on connection.
 */
const client = createMQTTClient(host, port, clientId, onMessageCallback);

/**
 * Interval to process and save aggregated data to MongoDB every 10 seconds.
 */
setInterval(async () => {
  if (aggregatedData.heartRate.length > 0) {
    const heartRateAvg = aggregatedData.heartRate.reduce((a, b) => a + b, 0) / aggregatedData.heartRate.length;
    const spO2Avg = aggregatedData.spO2.reduce((a, b) => a + b, 0) / aggregatedData.spO2.length;
    const redAvg = aggregatedData.red.reduce((a, b) => a + b, 0) / aggregatedData.red.length;

    if (!isNaN(heartRateAvg) && !isNaN(spO2Avg) && !isNaN(redAvg)) {
      const sensorData = new SensorData({
        timestamp: new Date(),
        heartRate: heartRateAvg,
        spO2: spO2Avg,
        red: redAvg,
      });

      try {
        await sensorData.save();
        console.log('Aggregated data saved:', sensorData);
      } catch (err) {
        console.error('Error saving aggregated data:', err);
      }
    } else {
      console.error('Invalid aggregated data:', { heartRateAvg, spO2Avg, redAvg });
    }

    // Clear aggregated data
    aggregatedData.heartRate = [];
    aggregatedData.spO2 = [];
    aggregatedData.red = [];
  }
}, 10000);