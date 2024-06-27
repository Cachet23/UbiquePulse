import express from 'express';
import mongoose from 'mongoose';
import createMQTTClient from './mqttClient';
import SensorData from './sensorDataModel';
import cors from 'cors'; // CORS importieren

const app = express();
const PORT = process.env.PORT || 3001;

// CORS für alle Anfragen aktivieren
app.use(cors());

// MongoDB-Verbindung herstellen
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/sensordata';
mongoose.set('strictQuery', true);

mongoose.connect(mongoURI).then(
  () => {
    console.log('Connected to MongoDB');
  },
  (err) => {
    console.error('Connection error:', err);
  }
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/data', async (req, res) => {
  try {
    const data = await SensorData.find().sort({ timestamp: -1 }).limit(10); // Letzte 10 Datensätze
    res.json(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

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

// MQTT-Client konfigurieren
const host = '49.13.173.130';
const port = 9001;
const clientId = 'backend-client-' + Math.random().toString(36).substring(7);

const aggregatedData: { heartRate: number[]; spO2: number[]; red: number[] } = {
  heartRate: [],
  spO2: [],
  red: [],
};

const onMessageCallback = (topic: string, message: Buffer) => {
  const data = JSON.parse(message.toString());
  aggregatedData.heartRate.push(data.heartRate);
  aggregatedData.spO2.push(data.spO2);
  aggregatedData.red.push(data.red);
};

// MQTT-Client initialisieren
const client = createMQTTClient(host, port, clientId, onMessageCallback);

setInterval(async () => {
  if (aggregatedData.heartRate.length > 0) {
    const heartRateAvg = aggregatedData.heartRate.reduce((a, b) => a + b, 0) / aggregatedData.heartRate.length;
    const spO2Avg = aggregatedData.spO2.reduce((a, b) => a + b, 0) / aggregatedData.spO2.length;
    const redAvg = aggregatedData.red.reduce((a, b) => a + b, 0) / aggregatedData.red.length;

    // Sicherstellen, dass die Durchschnittswerte gültige Zahlen sind
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
