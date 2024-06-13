import express from 'express';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB-Verbindung herstellen
const mongoURI = 'mongodb://mongodb:27017';
mongoose.set('strictQuery', true); // Option für strikte Abfragen (optional)

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
