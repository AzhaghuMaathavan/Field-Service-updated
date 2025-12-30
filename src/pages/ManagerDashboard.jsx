import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Air Conditioner Repair', customer: 'John Doe', technician: 'Mike Davis', status: 'In Progress', priority: 'High', dueDate: '2025-01-15' },
    { id: 2, title: 'Heating System Maintenance', customer: 'Jane Smith', technician: 'Sarah Johnson', status: 'Pending', priority: 'Medium', dueDate: '2025-01-16' },
    { id: 3, title: 'Plumbing Installation', customer: 'Bob Wilson', technician: 'John Smith', status: 'Completed', priority: 'Low', dueDate: '2025-01-10' },
  ]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', customer: '', technician: '', priority: 'Medium', dueDate: '' });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    setTasks([...tasks, {
      id: tasks.length + 1,
      ...newTask,
      status: 'Pending'
    }]);
    setNewTask({ title: '', customer: '', technician: '', priority: 'Medium', dueDate: '' });
    setShowTaskModal(false);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setTasks(tasks.map(task => task.id === id ? {...task, status: newStatus} : task));
  };

  const technicians = ['Mike Davis', 'Sarah Johnson', 'John Smith', 'Alex Turner'];
  const customers = ['John Doe', 'Jane Smith', 'Bob Wilson', 'Alice Brown'];

  return (
    <div className="dashboard-container manager-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>📋 Manager Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            ✓ All Tasks
          </button>
          <button 
            className={`nav-item ${activeTab === 'technicians' ? 'active' : ''}`}
            onClick={() => setActiveTab('technicians')}
          >
            👥 Technicians
          </button>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Manager Dashboard</h1>
          <p>Assign tasks and monitor technician progress</p>
        </header>

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <section className="dashboard-section">
            <div className="section-header">
              <h2>Task Overview</h2>
              <button className="btn-primary" onClick={() => setShowTaskModal(true)}>
                + Create Task
              </button>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>{tasks.length}</h3>
                <p>Total Tasks</p>
              </div>
              <div className="stat-card">
                <h3>{tasks.filter(t => t.status === 'In Progress').length}</h3>
                <p>In Progress</p>
              </div>
              <div className="stat-card">
                <h3>{tasks.filter(t => t.status === 'Pending').length}</h3>
                <p>Pending</p>
              </div>
              <div className="stat-card">
                <h3>{tasks.filter(t => t.status === 'Completed').length}</h3>
                <p>Completed</p>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Task ID</th>
                    <th>Title</th>
                    <th>Customer</th>
                    <th>Technician</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(task => (
                    <tr key={task.id}>
                      <td>#{task.id}</td>
                      <td>{task.title}</td>
                      <td>{task.customer}</td>
                      <td>{task.technician}</td>
                      <td>
                        <select 
                          value={task.status}
                          onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                          className="status-select"
                        >
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                      </td>
                      <td><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span></td>
                      <td>{task.dueDate}</td>
                      <td>
                        <button className="btn-small">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Technicians Tab */}
        {activeTab === 'technicians' && (
          <section className="dashboard-section">
            <h2>Technician Management</h2>
            <div className="technicians-grid">
              {technicians.map((tech, idx) => (
                <div key={idx} className="technician-card">
                  <div className="tech-avatar">👤</div>
                  <h3>{tech}</h3>
                  <p className="tech-status">Available</p>
                  <div className="tech-stats">
                    <p>Tasks Assigned: <strong>{Math.floor(Math.random() * 10) + 1}</strong></p>
                    <p>Completion Rate: <strong>95%</strong></p>
                  </div>
                  <button className="btn-secondary">View Profile</button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Task</h2>
            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label>Task Title</label>
                <input 
                  type="text" 
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Customer</label>
                <select 
                  value={newTask.customer}
                  onChange={(e) => setNewTask({...newTask, customer: e.target.value})}
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map(cust => <option key={cust}>{cust}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Technician</label>
                <select 
                  value={newTask.technician}
                  onChange={(e) => setNewTask({...newTask, technician: e.target.value})}
                  required
                >
                  <option value="">Select Technician</option>
                  {technicians.map(tech => <option key={tech}>{tech}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select 
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input 
                  type="date" 
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  required 
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn-primary">Create Task</button>
                <button type="button" className="btn-secondary" onClick={() => setShowTaskModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
