const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500'
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow non-browser requests (e.g., curl, server-to-server).
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('CORS not allowed for this origin'));
    }
}));
app.use(express.json());

// Initializes Firebase Admin via service module env vars.
require('./services/firebaseStore');

// Routes
const authRoutes = require('./routes/authRoutes');
const personRoutes = require('./routes/personRoutes');
const tipRoutes = require('./routes/tipRoutes'); // New
const fileRoutes = require('./routes/fileRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/people', personRoutes);
app.use('/api/tips', tipRoutes); // New
app.use('/api/files', fileRoutes);

app.get('/', (req, res) => {
    res.send('Missing Person Finder API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
