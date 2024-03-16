const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleIdentifier: { type: String, required: true, unique: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
}, { timestamps: true });

vehicleSchema.statics.addVehicle = async function(userId, vehicleIdentifier, make, model) {
  try {
    const vehicle = new this({
      userId,
      vehicleIdentifier,
      make,
      model,
    });
    await vehicle.save();
    console.log(`Vehicle with ID ${vehicleIdentifier} (Make: ${make}, Model: ${model}) added for user ${userId}.`);
    return vehicle;
  } catch (error) {
    console.error('Error adding vehicle:', error.message);
    console.error(error.stack);
    throw error;
  }
};

vehicleSchema.statics.removeVehicle = async function(vehicleId) {
  try {
    const result = await this.deleteOne({ _id: vehicleId });
    if (result.deletedCount === 0) {
      console.log(`No vehicle found with ID ${vehicleId} to delete.`);
    } else {
      console.log(`Vehicle with ID ${vehicleId} removed.`);
    }
    return result;
  } catch (error) {
    console.error('Error removing vehicle:', error.message);
    console.error(error.stack);
    throw error;
  }
};

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;