import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <h1>Field Service Scheduler</h1>
          </div>
          <div className="nav-buttons">
            <button className="nav-btn" onClick={() => navigate('/login/customer')}>
              Customer Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Field Service Task Scheduling System</h2>
          <p>Streamline task scheduling, manage technician availability, and track service delivery in real-time</p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => navigate('/login/customer')}>
              Request Service Now
            </button>
            <button className="btn-secondary" onClick={() => navigate('/login')}>
              Staff Login
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Smart Task Scheduling</h3>
            <p>Intelligent assignment based on technician availability, skills, and location</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Technician Management</h3>
            <p>Comprehensive availability and performance tracking system</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Advanced Reporting</h3>
            <p>Detailed analytics on completion times, efficiency, and service quality</p>
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="roles-section">
        <h2>Login as Staff Member</h2>
        <div className="roles-grid">
          <div className="role-card" onClick={() => navigate('/login/admin')}>
            <div className="role-icon">👨‍💼</div>
            <h3>Administrator</h3>
            <p>Manage employees and system settings</p>
            <span className="arrow">→</span>
          </div>
          <div className="role-card" onClick={() => navigate('/login/manager')}>
            <div className="role-icon">👨‍✈️</div>
            <h3>Manager</h3>
            <p>Assign and monitor tasks</p>
            <span className="arrow">→</span>
          </div>
          <div className="role-card" onClick={() => navigate('/login/employee')}>
            <div className="role-icon">👨‍🔧</div>
            <h3>Employee/Technician</h3>
            <p>View and manage assigned tasks</p>
            <span className="arrow">→</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 Field Service Task Scheduling System. All rights reserved.</p>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#privacy">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
