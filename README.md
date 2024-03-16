# AIRide_

AIRide_ is a web application designed to provide a platform for users to track their vehicles in real-time using Google Maps. It enables users to manage their vehicles, including adding or removing them, and view their real-time locations on a map. The application supports user authentication, allowing users to register and login.

## Overview

The application is built on a Node/Express/MongoDB/Mongoose stack with EJS for templating and Vanilla JS with Bootstrap for the frontend. It incorporates the Google Maps API for displaying real-time vehicle locations and integrates with an external GPS tracking device API for fetching location data.

## Features

- **User Authentication:** Register and login functionalities.
- **Dashboard:** Overview of user's vehicles with options to add or remove vehicles.
- **Vehicle Management:** Add a new vehicle by providing a vehicle identifier and remove vehicles.
- **Real-time Vehicle Tracking:** View the vehicle's real-time location on Google Maps.

## Getting started

### Requirements

- Node.js
- MongoDB
- Google Maps API key
- GPS Tracking Device API credentials

### Quickstart

1. Clone the repository to your local machine.
2. Copy `.env.example` to `.env` and fill in your MongoDB URL, Google Maps API key, and GPS Tracking Device API credentials.
3. Install dependencies with `npm install`.
4. Run the application using `npm start`.

### License

Copyright (c) 2024.