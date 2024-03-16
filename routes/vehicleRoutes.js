const express = require('express');
const Vehicle = require('../models/Vehicle');
const { isAuthenticated } = require('./middleware/authMiddleware');
const router = express.Router();
const {Client} = require("@googlemaps/google-maps-services-js");
const client = new Client({});
const fetch = require('node-fetch');

// Route to show form for adding a vehicle
router.get('/vehicles/add', isAuthenticated, (req, res) => {
  res.render('addVehicle');
});

// Add a vehicle
router.post('/vehicles/add', isAuthenticated, async (req, res) => {
  const { vehicleIdentifier, make, model } = req.body;
  if (!vehicleIdentifier || !make || !model) {
    console.log("Attempt to add a vehicle without providing all required details.");
    return res.status(400).send("Vehicle identifier, make, and model are required.");
  }

  try {
    // Update to include handling of make and model fields
    const vehicle = new Vehicle({
      userId: req.session.userId,
      vehicleIdentifier,
      make,
      model
    });
    await vehicle.save();
    console.log(`Vehicle ${vehicleIdentifier} (Make: ${make}, Model: ${model}) added successfully for user ID: ${req.session.userId}.`);
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error adding vehicle:', error);
    res.status(500).send("Error adding vehicle");
  }
});

// Remove a vehicle
router.post('/vehicles/remove/:vehicleId', isAuthenticated, async (req, res) => {
  const { vehicleId } = req.params;

  try {
    const result = await Vehicle.removeVehicle(vehicleId);
    if (result.deletedCount === 0) {
      console.log(`Attempted to remove a vehicle with ID: ${vehicleId}, but it was not found.`);
      return res.status(404).send("Vehicle not found.");
    }
    console.log(`Vehicle ${vehicleId} removed successfully.`);
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error removing vehicle:', error);
    res.status(500).send("Error removing vehicle");
  }
});

// List vehicles
router.get('/vehicles/list', isAuthenticated, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.session.userId }).lean();
    console.log(`Retrieved ${vehicles.length} vehicles for user ID: ${req.session.userId}.`);
    res.render('dashboard', { vehicles });
  } catch (error) {
    console.error('Error listing vehicles:', error);
    res.status(500).send("Error listing vehicles");
  }
});

// Fetch vehicle location
router.get('/vehicles/location/:vehicleId', isAuthenticated, async (req, res) => {
  const vehicleId = req.params.vehicleId;

  try {
    const apiUrl = process.env.GPS_TRACKING_DEVICE_API_URL; 
    const apiToken = process.env.GPS_TRACKING_DEVICE_API_TOKEN; 

    const response = await fetch(`${apiUrl}${vehicleId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch vehicle location for vehicle ID: ${vehicleId}`);
    }

    const locationData = await response.json();

    const vehicleLocation = {
      lat: locationData.latitude,
      lng: locationData.longitude,
    };

    console.log(`Fetched location for vehicle ID: ${vehicleId}`, vehicleLocation);
    res.render('vehicleLocation', { vehicleLocation });

  } catch (error) {
    console.error('Error fetching vehicle location:', error);
    res.status(500).send("Error fetching vehicle location");
  }
});

// Dashboard - List all vehicles for the logged-in user
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.session.userId }).lean();
    console.log(`Rendering dashboard for user ID: ${req.session.userId} with ${vehicles.length} vehicles.`);
    res.render('dashboard', { vehicles });
  } catch (error) {
    console.error('Error fetching vehicles for dashboard:', error);
    res.status(500).send('Error loading dashboard');
  }
});

module.exports = router;