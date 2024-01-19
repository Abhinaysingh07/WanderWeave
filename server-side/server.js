const express = require('express'); // Import the Express.js framework
const app = express(); // Create an Express application
const port = 5500; // Set the port number

const cors = require('cors'); // Import the cors package
app.use(cors()); // Enable Cross-Origin Resource Sharing

app.use(express.urlencoded({ extended: true })); // Middleware to parse incoming request bodies (urlencoded)
app.use(express.json()); // Middleware to parse incoming request bodies (JSON)

app.post('/submitPackage', (req, res) => {
    // Handle POST requests to '/submitPackage' endpoint
    // Sending a simple success message in JSON format
    res.json({ status: 'success', message: 'Form data submitted successfully!' });
});

// Listen on environment port or 3000
app.listen(port, () => console.log(`Listening on port ${port}`));
