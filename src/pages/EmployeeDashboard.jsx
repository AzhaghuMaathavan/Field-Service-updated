import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Air Conditioner Repair', customer: 'John Doe', status: 'In Progress', priority: 'High', dueDate: '2025-01-15', address: '123 Main St, City' },
    { id: 2, title: 'Heating System Check', customer: 'Jane Smith', status: 'Assigned', priority: 'Medium', dueDate: '2025-01-16', address: '456 Oak Ave, City' },
    { id: 3, title: 'Plumbing Installation', customer: 'Bob Wilson', status: 'Completed', priority: 'Low', dueDate: '2025-01-10', address: '789 Pine Rd, City' },
  ]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleStatusUpdate = (id, newStatus) => {
    setTasks(tasks.map(task => task.id === id ? {...task, status: newStatus} : task));
  };

  return (
    <div className="dashboard-container employee-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>🔧 Technician Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            ✓ My Tasks
          </button>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Technician Dashboard</h1>
          <p>Manage your assigned tasks and track progress</p>
        </header>

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <section className="dashboard-section">
            <div className="section-header">
              <h2>Your Assigned Tasks</h2>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>{tasks.length}</h3>
                <p>Total Tasks</p>
              </div>
              <div className="stat-card">
                <h3>{tasks.filter(t => t.status === 'Assigned').length}</h3>
                <p>Assigned</p>
              </div>
              <div className="stat-card">
                <h3>{tasks.filter(t => t.status === 'In Progress').length}</h3>
                <p>In Progress</p>
              </div>
              <div className="stat-card">
                <h3>{tasks.filter(t => t.status === 'Completed').length}</h3>
                <p>Completed</p>
              </div>
            </div>

            <div className="tasks-list">
              {tasks.map(task => (
                <div key={task.id} className="task-card">
                  <div className="task-header">
                    <div className="task-title-section">
                      <h3>{task.title}</h3>
                      <p className="customer">Customer: {task.customer}</p>
                    </div>
                    <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
                  </div>
                  
                  <div className="task-details">
                    <p><strong>📍 Location:</strong> {task.address}</p>
                    <p><strong>📅 Due Date:</strong> {task.dueDate}</p>
                    <p><strong>Status:</strong> <span className={`status ${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span></p>
                  </div>

                  <div className="task-actions">
                    {task.status === 'Assigned' && (
                      <button 
                        className="btn-primary" 
                        onClick={() => handleStatusUpdate(task.id, 'In Progress')}
                      >
                        Start Task
                      </button>
                    )}
                    {task.status === 'In Progress' && (
                      <button 
                        className="btn-primary" 
                        onClick={() => handleStatusUpdate(task.id, 'Completed')}
                      >
                        Complete Task
                      </button>
                    )}
                    <button className="btn-secondary">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default EmployeeDashboard;
