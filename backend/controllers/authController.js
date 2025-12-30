import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import crypto from 'crypto';

export const signup = asyncHandler(async (req, res) => {
  const { email, password, full_name } = req.body;

  // Validation
  if (!email || !password || !full_name) {
    throw new AppError('Email, password, and full name are required', 400);
  }

  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400);
  }

  const connection = await pool.getConnection();
  try {
    // Check if user exists
    const [existingUser] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      throw new AppError('Email already registered', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with 'Pending' status (admin needs to assign role)
    const [result] = await connection.query(
      'INSERT INTO users (email, password, full_name, role, status) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, full_name, 'customer', 'Pending']
    );

    res.status(201).json({
      success: true,
      message: 'Signup successful. Please wait for admin approval.',
      userId: result.insertId
    });
  } finally {
    connection.release();
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const connection = await pool.getConnection();
  try {
    const [users] = await connection.query(
      'SELECT id, email, password, full_name, role, status FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      throw new AppError('Invalid email or password', 401);
    }

    const user = users[0];

    // Check if user account is approved
    if (user.status === 'Pending') {
      throw new AppError('Your account is pending admin approval', 403);
    }

    if (user.status === 'Inactive') {
      throw new AppError('Your account has been deactivated', 403);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken(user.id, user.email, user.role);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  } finally {
    connection.release();
  }
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  const connection = await pool.getConnection();
  try {
    const [users] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      // Don't reveal if email exists for security
      throw new AppError('If an account exists with this email, a reset link will be sent', 200);
    }

    const user = users[0];
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = await bcrypt.hash(resetToken, 10);
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await connection.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, tokenHash, expiresAt]
    );

    // In production, send email with reset link
    // For now, return the token for testing
    res.json({
      success: true,
      message: 'Password reset link sent to your email',
      // Note: Remove this in production
      resetToken: resetToken,
      expiresIn: '1 hour'
    });
  } finally {
    connection.release();
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, token, newPassword } = req.body;

  if (!email || !token || !newPassword) {
    throw new AppError('Email, token, and new password are required', 400);
  }

  if (newPassword.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400);
  }

  const connection = await pool.getConnection();
  try {
    const [users] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      throw new AppError('User not found', 404);
    }

    const user = users[0];

    const [tokens] = await connection.query(
      `SELECT id, token FROM password_reset_tokens 
       WHERE user_id = ? AND used = FALSE AND expires_at > NOW() 
       ORDER BY created_at DESC LIMIT 1`,
      [user.id]
    );

    if (tokens.length === 0) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    const resetTokenRecord = tokens[0];
    const isValidToken = await bcrypt.compare(token, resetTokenRecord.token);

    if (!isValidToken) {
      throw new AppError('Invalid reset token', 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await connection.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, user.id]
    );

    await connection.query(
      'UPDATE password_reset_tokens SET used = TRUE WHERE id = ?',
      [resetTokenRecord.id]
    );

    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } finally {
    connection.release();
  }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [users] = await connection.query(
      'SELECT id, email, full_name, role, status, phone, address FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      user: users[0]
    });
  } finally {
    connection.release();
  }
});
