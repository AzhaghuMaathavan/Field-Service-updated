import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { verifyToken, verifyRole } from './auth.js';
import { signup, login, getCurrentUser, forgotPassword, resetPassword } from './auth-controller.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    'https://field-service-updated-n2oofqubp-azhaghum aathavan.vercel.app',
    'https://field-service-updated.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
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
