/**
 * @fileoverview  *Schema for storing sensor data in MongoDB.
 * @author Dominik Schwagerl
 */

import mongoose from 'mongoose';

const sensorDataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  heartRate: { type: Number, required: true },
  spO2: { type: Number, required: true },
  red: { type: Number, required: true },
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);

export default SensorData;
