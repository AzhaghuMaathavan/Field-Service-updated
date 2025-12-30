import pool from '../config/database.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, customer_id, priority, due_date, address } = req.body;
  const created_by = req.user.userId;

  if (!title || !customer_id || !due_date) {
    throw new AppError('Title, customer, and due date are required', 400);
  }

  // Validate due date is not in the past
  const dueDateTime = new Date(due_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (dueDateTime < today) {
    throw new AppError('Due date cannot be in the past', 400);
  }

  const connection = await pool.getConnection();
  try {
    // Verify customer exists
    const [customers] = await connection.query(
      'SELECT id FROM users WHERE id = ?',
      [customer_id]
    );

    if (customers.length === 0) {
      throw new AppError('Customer not found', 404);
    }

    const created_date = new Date().toISOString().split('T')[0];

    const [result] = await connection.query(
      `INSERT INTO tasks (title, description, customer_id, priority, created_date, due_date, address, created_by, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, customer_id, priority, created_date, due_date, address, created_by, 'Pending']
    );

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      taskId: result.insertId
    });
  } finally {
    connection.release();
  }
});

export const assignTask = asyncHandler(async (req, res) => {
  const { task_id, assigned_to } = req.body;

  if (!task_id || !assigned_to) {
    throw new AppError('Task ID and assigned employee are required', 400);
  }

  const connection = await pool.getConnection();
  try {
    // Verify task exists
    const [tasks] = await connection.query(
      'SELECT id, created_date FROM tasks WHERE id = ?',
      [task_id]
    );

    if (tasks.length === 0) {
      throw new AppError('Task not found', 404);
    }

    // Verify employee exists
    const [employees] = await connection.query(
      'SELECT id FROM users WHERE id = ? AND role IN ("employee", "manager")',
      [assigned_to]
    );

    if (employees.length === 0) {
      throw new AppError('Employee not found', 404);
    }

    const taskCreatedDate = new Date(tasks[0].created_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (taskCreatedDate < today) {
      throw new AppError('Cannot assign task created before today. Please contact admin.', 400);
    }

    await connection.query(
      'UPDATE tasks SET assigned_to = ?, status = "Assigned" WHERE id = ?',
      [assigned_to, task_id]
    );

    res.json({
      success: true,
      message: 'Task assigned successfully'
    });
  } finally {
    connection.release();
  }
});

export const getTasks = asyncHandler(async (req, res) => {
  const { status, role, userId } = req.user;
  let query = 'SELECT t.*, u.full_name as customer_name, e.full_name as assigned_tech FROM tasks t LEFT JOIN users u ON t.customer_id = u.id LEFT JOIN users e ON t.assigned_to = e.id WHERE 1=1';
  const params = [];

  // Filter based on role
  if (role === 'customer') {
    query += ' AND t.customer_id = ?';
    params.push(userId);
  } else if (role === 'employee') {
    query += ' AND t.assigned_to = ?';
    params.push(userId);
  } else if (role === 'manager') {
    // Managers can see all tasks
  } else if (role !== 'admin') {
    throw new AppError('Unauthorized', 403);
  }

  query += ' ORDER BY t.created_at DESC';

  const connection = await pool.getConnection();
  try {
    const [tasks] = await connection.query(query, params);

    res.json({
      success: true,
      tasks: tasks.map(task => ({
        ...task,
        created_date: new Date(task.created_date).toISOString().split('T')[0],
        due_date: new Date(task.due_date).toISOString().split('T')[0],
        completion_date: task.completion_date ? new Date(task.completion_date).toISOString().split('T')[0] : null
      }))
    });
  } finally {
    connection.release();
  }
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { task_id, status } = req.body;
  const userId = req.user.userId;

  if (!task_id || !status) {
    throw new AppError('Task ID and status are required', 400);
  }

  const validStatuses = ['Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    throw new AppError('Invalid status', 400);
  }

  const connection = await pool.getConnection();
  try {
    const [tasks] = await connection.query(
      'SELECT id, assigned_to FROM tasks WHERE id = ?',
      [task_id]
    );

    if (tasks.length === 0) {
      throw new AppError('Task not found', 404);
    }

    // Only assigned employee or admin can update status
    if (tasks[0].assigned_to !== userId && req.user.role !== 'admin') {
      throw new AppError('You can only update tasks assigned to you', 403);
    }

    const completion_date = status === 'Completed' ? new Date().toISOString().split('T')[0] : null;

    await connection.query(
      'UPDATE tasks SET status = ?, completion_date = ? WHERE id = ?',
      [status, completion_date, task_id]
    );

    res.json({
      success: true,
      message: 'Task status updated successfully'
    });
  } finally {
    connection.release();
  }
});

export const getTaskStats = asyncHandler(async (req, res) => {
  const { role, userId } = req.user;

  const connection = await pool.getConnection();
  try {
    let countQuery = 'SELECT COUNT(*) as count FROM tasks WHERE 1=1';
    const params = [];

    if (role === 'customer') {
      countQuery += ' AND customer_id = ?';
      params.push(userId);
    } else if (role === 'employee') {
      countQuery += ' AND assigned_to = ?';
      params.push(userId);
    }

    const stats = {};
    const [totalResult] = await connection.query(countQuery, params);
    stats.total = totalResult[0].count;

    for (const status of ['Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled']) {
      const [result] = await connection.query(
        countQuery + ' AND status = ?',
        [...params, status]
      );
      stats[status.toLowerCase().replace(' ', '_')] = result[0].count;
    }

    res.json({
      success: true,
      stats
    });
  } finally {
    connection.release();
  }
});
