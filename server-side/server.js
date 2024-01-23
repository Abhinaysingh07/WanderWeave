const express = require('express');
const app = express();
const port = 5500;

const cors = require('cors');
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/submitPackage', (req, res) => {
    const { location, guests, arrivals, leaving } = req.body;
    const packageCodes = [
        "SR004", "KA005", "RD006", "SO007", "TM008", "TI009",
        "MP001", "CP002", "WP003", "SR004", "KA005", "RD006",
        "SO007", "TM008", "TI009",
    ];

    // Check if any of the required fields are empty
    if (location === "" || guests === "" || arrivals === "" || leaving === "") {
        res.json({ status: 'error', message: 'Send Appropriate Data' });
    } else if (!packageCodes.includes(location)) {
        // Check if the location is in the package codes array
        res.json({ status: 'error', message: "Inappropriate location" });
    } else if (guests <= 0) {
        // Check if guests is a non-negative number
        res.json({ status: 'error', message: "Guests can't be in a negative value" });
    } else {
        const arrivalDate = new Date(arrivals);
        const leavingDate = new Date(leaving);
        if (arrivalDate >= leavingDate) {
            res.json({ status: 'error', message: 'Date of arrival must be before the date of leaving' });
        } else {
            res.json({ status: 'success', message: 'Form data submitted successfully!' });
        }
    }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
