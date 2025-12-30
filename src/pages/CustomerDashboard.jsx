import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requests, setRequests] = useState([
    { id: 1, title: 'AC Not Working', status: 'In Progress', assignedTech: 'Mike Davis', createdDate: '2025-01-12', dueDate: '2025-01-15', priority: 'High' },
    { id: 2, title: 'Heater Maintenance', status: 'Pending', assignedTech: 'Pending Assignment', createdDate: '2025-01-14', dueDate: '2025-01-17', priority: 'Medium' },
    { id: 3, title: 'Plumbing Check', status: 'Completed', assignedTech: 'John Smith', createdDate: '2025-01-05', dueDate: '2025-01-10', priority: 'Low' },
  ]);
  const [newRequest, setNewRequest] = useState({ title: '', description: '', priority: 'Medium', preferredDate: '' });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    setRequests([...requests, {
      id: requests.length + 1,
      ...newRequest,
      status: 'Pending',
      assignedTech: 'Pending Assignment',
      createdDate: new Date().toISOString().split('T')[0],
      dueDate: newRequest.preferredDate
    }]);
    setNewRequest({ title: '', description: '', priority: 'Medium', preferredDate: '' });
    setShowRequestModal(false);
  };

  return (
    <div className="dashboard-container customer-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>👤 Customer Portal</h2>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            📝 My Requests
          </button>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Customer Dashboard</h1>
          <p>Request and track your field service tasks</p>
        </header>

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <section className="dashboard-section">
            <div className="section-header">
              <h2>Service Requests</h2>
              <button className="btn-primary" onClick={() => setShowRequestModal(true)}>
                + New Request
              </button>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>{requests.length}</h3>
                <p>Total Requests</p>
              </div>
              <div className="stat-card">
                <h3>{requests.filter(r => r.status === 'Pending').length}</h3>
                <p>Pending</p>
              </div>
              <div className="stat-card">
                <h3>{requests.filter(r => r.status === 'In Progress').length}</h3>
                <p>In Progress</p>
              </div>
              <div className="stat-card">
                <h3>{requests.filter(r => r.status === 'Completed').length}</h3>
                <p>Completed</p>
              </div>
            </div>

            <div className="requests-list">
              {requests.map(request => (
                <div key={request.id} className="request-card">
                  <div className="request-header">
                    <div>
                      <h3>{request.title}</h3>
                      <p className="request-id">Request ID: #{request.id}</p>
                    </div>
                    <span className={`status ${request.status.toLowerCase().replace(' ', '-')}`}>{request.status}</span>
                  </div>

                  <div className="request-details">
                    <div className="detail-col">
                      <p><strong>📅 Created:</strong> {request.createdDate}</p>
                      <p><strong>📅 Due Date:</strong> {request.dueDate}</p>
                    </div>
                    <div className="detail-col">
                      <p><strong>👤 Assigned Tech:</strong> {request.assignedTech}</p>
                      <p><strong>Priority:</strong> <span className={`priority ${request.priority.toLowerCase()}`}>{request.priority}</span></p>
                    </div>
                  </div>

                  <div className="request-actions">
                    <button className="btn-secondary">View Details</button>
                    {request.status !== 'Completed' && (
                      <button className="btn-small danger">Cancel</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* New Request Modal */}
      {showRequestModal && (
        <div className="modal-overlay" onClick={() => setShowRequestModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Submit Service Request</h2>
            <form onSubmit={handleSubmitRequest}>
              <div className="form-group">
                <label>Service Type</label>
                <input 
                  type="text" 
                  value={newRequest.title}
                  onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                  placeholder="e.g., AC Repair, Heating Maintenance"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                  placeholder="Describe the service you need"
                  rows="4"
                  required
                />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select 
                  value={newRequest.priority}
                  onChange={(e) => setNewRequest({...newRequest, priority: e.target.value})}
                >
                  <option>Low</option>
                  <option selected>Medium</option>
                  <option>High</option>
                  <option>Emergency</option>
                </select>
              </div>
              <div className="form-group">
                <label>Preferred Date</label>
                <input 
                  type="date" 
                  value={newRequest.preferredDate}
                  onChange={(e) => setNewRequest({...newRequest, preferredDate: e.target.value})}
                  required 
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn-primary">Submit Request</button>
                <button type="button" className="btn-secondary" onClick={() => setShowRequestModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
