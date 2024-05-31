const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const sql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');


const port = 5500;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const pool = sql.createPool({
    connectionLimit: 10,
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

// Middleware to verify JWT token from Authorization header
function verifyToken(req, res, next) {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({ message: 'Token missing' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token part after "Bearer"

    if (!token) {
        return res.status(403).json({ message: 'Token missing' });
    }

    jwt.verify(token, 'your-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        // Store the decoded user information in the request object
        req.user = decoded;
        next(); // Continue processing the request
    });
}

app.post('/signup', (req, res) => {

    const { s_username, pno, password } = req.body;

    // Check if the phone number is already registered
    pool.query('SELECT * FROM userss WHERE phone = ?', [pno], (phoneCheckErr, phoneCheckResults) => {
        if (phoneCheckErr) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (phoneCheckResults.length > 0) {
            return res.status(400).json({ message: 'Phone number already registered' });
        }

        // Phone number is not registered, proceed with registration
        const hashedPassword = bcrypt.hashSync(password, 10); // Using sync version for simplicity

        pool.query('INSERT INTO userss (username, phone, password) VALUES (?, ?, ?)', [s_username, pno, hashedPassword], (insertErr, result) => {
            if (insertErr) {
                return res.status(500).json({ error: 'Server error' });
            }

            if (result.affectedRows > 0) {
                return res.json({ message: 'User registered successfully' });
            } else {
                return res.status(500).json({ error: 'Server error' });
            }
        });
    });
});

app.post('/login', (req, res) => {
    const { phone, password } = req.body;

    // Retrieve user information based on the provided phone number
    pool.query('SELECT * FROM userss WHERE phone = ?', [phone], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'This number is not registered' });
        }

        const user = results[0];

        // Check if password is correct
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Password incorrect' });
        }

        return res.json({ 
            message: 'Login successful', 
            username: user.username, 
            phone: user.phone 
        });
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
