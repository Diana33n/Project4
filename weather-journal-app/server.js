// Import necessary libraries
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();  // Ensure environment variables are loaded

// Initialize the Express application
const app = express();

// Middleware to handle CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Define the port to listen on, default to 3000 if not specified
const port = process.env.PORT || 3000;

// Root route to check if the server is running
app.get('/', (req, res) => {
    res.send('Weather Journal App is running!');
});

// GET route to fetch weather data using the OpenWeatherMap API
app.get('/weather', async (req, res) => {
    const { zip } = req.query; // Assumes ZIP code is provided by the client
    const apiKey = process.env.API_KEY;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=${apiKey}`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}: ${data.message}`);
        }
        res.json(data); // Send back the successful data
    } catch (error) {
        console.error('Failed to fetch weather data:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// POST route to receive data from the client and log it
app.post('/data', (req, res) => {
    const userData = req.body;  // Extract data from the request body
    console.log('Received data:', userData);  // Log the data for verification
    res.status(200).json({ message: 'Data received successfully', data: userData });
});

// Start the server and listen on the configured port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
