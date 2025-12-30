import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([
    { id: 1, name: 'John Smith', email: 'john@example.com', role: 'Technician', status: 'Active' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Manager', status: 'Active' },
    { id: 3, name: 'Mike Davis', email: 'mike@example.com', role: 'Technician', status: 'Inactive' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Technician' });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    setEmployees([...employees, {
      id: employees.length + 1,
      ...formData,
      status: 'Active'
    }]);
    setFormData({ name: '', email: '', role: 'Technician' });
    setShowModal(false);
  };

  const handleDeleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  return (
    <div className="dashboard-container admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>🔐 Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            👥 Employees
          </button>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Administrator Dashboard</h1>
          <p>Manage all employees and system settings</p>
        </header>

        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <section className="dashboard-section">
            <div className="section-header">
              <h2>Employee Management</h2>
              <button className="btn-primary" onClick={() => setShowModal(true)}>
                + Add Employee
              </button>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>{employees.length}</h3>
                <p>Total Employees</p>
              </div>
              <div className="stat-card">
                <h3>{employees.filter(e => e.status === 'Active').length}</h3>
                <p>Active</p>
              </div>
              <div className="stat-card">
                <h3>{employees.filter(e => e.role === 'Technician').length}</h3>
                <p>Technicians</p>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.id}>
                      <td>#{emp.id}</td>
                      <td>{emp.name}</td>
                      <td>{emp.email}</td>
                      <td><span className="badge">{emp.role}</span></td>
                      <td><span className={`status ${emp.status.toLowerCase()}`}>{emp.status}</span></td>
                      <td>
                        <button className="btn-small">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Employee</h2>
            <form onSubmit={handleAddEmployee}>
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option>Technician</option>
                  <option>Manager</option>
                </select>
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn-primary">Add Employee</button>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
