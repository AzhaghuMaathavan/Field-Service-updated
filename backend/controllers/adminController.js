import pool from '../config/database.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

export const getAllUsers = asyncHandler(async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [users] = await connection.query(
      'SELECT id, email, full_name, role, status, phone FROM users ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      users
    });
  } finally {
    connection.release();
  }
});

export const approveUser = asyncHandler(async (req, res) => {
  const { user_id, role } = req.body;

  if (!user_id || !role) {
    throw new AppError('User ID and role are required', 400);
  }

  const validRoles = ['admin', 'manager', 'employee', 'customer'];
  if (!validRoles.includes(role)) {
    throw new AppError('Invalid role', 400);
  }

  const connection = await pool.getConnection();
  try {
    const [users] = await connection.query(
      'SELECT id FROM users WHERE id = ?',
      [user_id]
    );

    if (users.length === 0) {
      throw new AppError('User not found', 404);
    }

    await connection.query(
      'UPDATE users SET role = ?, status = "Active" WHERE id = ?',
      [role, user_id]
    );

    res.json({
      success: true,
      message: 'User approved successfully'
    });
  } finally {
    connection.release();
  }
});

export const deactivateUser = asyncHandler(async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    throw new AppError('User ID is required', 400);
  }

  const connection = await pool.getConnection();
  try {
    const [users] = await connection.query(
      'SELECT id FROM users WHERE id = ?',
      [user_id]
    );

    if (users.length === 0) {
      throw new AppError('User not found', 404);
    }

    await connection.query(
      'UPDATE users SET status = "Inactive" WHERE id = ?',
      [user_id]
    );

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } finally {
    connection.release();
  }
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    throw new AppError('User ID is required', 400);
  }

  const connection = await pool.getConnection();
  try {
    await connection.query(
      'DELETE FROM users WHERE id = ?',
      [user_id]
    );

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } finally {
    connection.release();
  }
});

export const getAdminStats = asyncHandler(async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [userStats] = await connection.query(
      `SELECT role, COUNT(*) as count, status FROM users GROUP BY role, status`
    );

    const [taskStats] = await connection.query(
      `SELECT status, COUNT(*) as count FROM tasks GROUP BY status`
    );

    const [pendingUsers] = await connection.query(
      `SELECT COUNT(*) as count FROM users WHERE status = 'Pending'`
    );

    const [overdueTasks] = await connection.query(
      `SELECT COUNT(*) as count FROM tasks WHERE due_date < CURDATE() AND status != 'Completed'`
    );

    res.json({
      success: true,
      stats: {
        users: userStats,
        tasks: taskStats,
        pendingApprovals: pendingUsers[0].count,
        overdueTasks: overdueTasks[0].count
      }
    });
  } finally {
    connection.release();
  }
});
