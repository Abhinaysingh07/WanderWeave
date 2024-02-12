const express = require('express');
const app = express();
const sql = require('mysql2');
const cors = require('cors');
const port = 5500;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const pool = sql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wanderWeave'
})

app.post('/submitPackage', (req, res) => {
    const { location, guests, arrivals, leaving } = req.body;
    const packageCodes = [
        "SR004", "KA005", "RD006", "SO007", "TM008", "TI009",
        "MP001", "CP002", "WP003", "SR004", "KA005", "RD006",
        "SO007", "TM008", "TI009",
    ];
    const arrivalDate = new Date(arrivals);
    const leavingDate = new Date(leaving);

    // Check if any of the required fields are empty
    if (location === "" || guests === "" || arrivals === "" || leaving === "") {
        res.json({ status: 'error', message: 'Send Appropriate Data' });
    } else if (!packageCodes.includes(location)) {
        // Check if the location is in the package codes array
        res.json({ status: 'error', message: "Inappropriate location" });
    } else if (guests <= 0) {
        // Check if guests is a non-negative number
        res.json({ status: 'error', message: "Guests can't be in a negative value" });
    } else if (arrivalDate >= leavingDate) {
        res.json({ status: 'error', message: 'Date of arrival must be before the date of leaving' });
    } else {
        const insertQuery = 'INSERT INTO packageDetails (userId,packageCode, guests, arrival, leaving) VALUES (?,?, ?, ?, ?)';
        const insertValues = [1, location, guests, arrivalDate, leavingDate];
        pool.query(insertQuery, insertValues, (error, results) => {
            if (error) {
                console.error('Insert query error:', error);
                return res.status(500).json({ status: 'error', message: 'Error submitting form data' });
            }
            res.json({ status: 'success', message: 'Form data submitted successfully!' });
        });
    }
});

// Route for fetching all packages
app.get('/getPackages', (req, res) => {
    const selectQuery = 'SELECT * FROM packageDetails';
    pool.query(selectQuery, (error, results) => {
        if (error) {
            console.error('Select query error:', error);
            return res.status(500).json({ status: 'error', message: 'Error fetching package data' });
        }
        res.json({ status: 'success', packages: results });
    });
});

// Route for deleting a package by id
app.delete('/deletePackage/:packageCode', (req, res) => {
    const packageCode = req.params.packageCode;
    const deleteQuery = 'DELETE FROM packageDetails WHERE packageCode = ?';
    pool.query(deleteQuery, [packageCode], (error, results) => {
        if (error) {
            return res.status(500).json({ status: 'error', message: 'Error deleting package' });
        }
        res.json({ status: 'success', message: 'Package deleted successfully' });
    });
});


// Route for updating a package by id
app.put('/updatePackage/:id', (req, res) => {
    const packageId = req.params.id;
    const { location, guests, arrivals, leaving } = req.body;
    const updateQuery = 'UPDATE packageDetails SET packageCode = ?, guests = ?, arrival = ?, leaving = ? WHERE id = ?';
    const updateValues = [location, guests, new Date(arrivals), new Date(leaving), packageId];
    pool.query(updateQuery, updateValues, (error, results) => {
        if (error) {
            console.error('Update query error:', error);
            return res.status(500).json({ status: 'error', message: 'Error updating package' });
        }
        res.json({ status: 'success', message: 'Package updated successfully' });
    });
});


app.listen(port, () => console.log(`Listening on port ${port}`));
