import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { verifyToken, verifyRole } from './auth.js';
import { signup, login, getCurrentUser, forgotPassword, resetPassword } from './auth-controller.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || origin === 'http://localhost:5173' || origin === 'http://localhost:3000') {
      callback(null, true);
    } else if (origin && origin.includes('vercel.app')) {
      // Allow all Vercel deployments
      callback(null, true);
    } else {
      callback(null, true); // Allow for now, can restrict later
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth routes
app.post('/auth/signup', signup);
app.post('/auth/login', login);
app.post('/auth/forgot-password', forgotPassword);
app.post('/auth/reset-password', resetPassword);
app.get('/auth/me', verifyToken, getCurrentUser);

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

export default app;
