const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    console.log('Register endpoint hit');
    const { fullname, username, password } = req.body;

    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'Username already taken. Please choose a different one.' });
        }

        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
        await pool.query('INSERT INTO users (fullname, username, password) VALUES (?, ?, ?)', 
                         [fullname, username, hashedPassword]);

        console.log(`User registered successfully: ${username}`);
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).json({ error: 'An error occurred during registration. Please try again.' });
    }
};

const login = async (req, res) => {
    console.log('Login endpoint hit');
    const { username, password } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials. Please check your username and password.' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials. Please check your username and password.' });
        }

        const token = jwt.sign(
            { user_id: user.user_id, username: user.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME }
        );

        console.log(`User logged in successfully: ${username}`);
        res.json({ token });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ error: 'An error occurred during login. Please try again.' });
    }
};

module.exports = { register, login };
