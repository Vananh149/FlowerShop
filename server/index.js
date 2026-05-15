import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import Routes
import productRoutes from './routes/productRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import timelineRoutes from './routes/timelineRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes chính cho ứng dụng
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/timeline', timelineRoutes);

// Route chào mừng
app.get('/', (req, res) => {
    res.send('Flower Shop API is running...');
});

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });
