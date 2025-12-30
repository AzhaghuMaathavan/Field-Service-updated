import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const Login = ({ role }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const roleConfig = {
    admin: {
      title: 'Administrator Login',
      subtitle: 'Manage employees and system settings',
      icon: '👨‍💼'
    },
    manager: {
      title: 'Manager Login',
      subtitle: 'Assign and monitor tasks',
      icon: '👨‍✈️'
    },
    employee: {
      title: 'Employee/Technician Login',
      subtitle: 'View and manage your assigned tasks',
      icon: '👨‍🔧'
    },
    customer: {
      title: 'Customer Login',
      subtitle: 'Request and track service requests',
      icon: '👤'
    }
  };

  const config = roleConfig[role];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(formData.email, formData.password, role)) {
      navigate(`/dashboard/${role}`);
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      
      <div className="login-wrapper">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>

        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">{config.icon}</div>
            <h1>{config.title}</h1>
            <p>{config.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#forgot" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="login-button">
              Login to Dashboard
            </button>
          </form>

          <div className="login-footer">
            <p>Don't have an account? <a href="#signup">Sign up here</a></p>
          </div>

          {role === 'customer' && (
            <div className="demo-credentials">
              <p className="demo-label">Demo Credentials:</p>
              <p>Email: customer@demo.com</p>
              <p>Password: demo123</p>
            </div>
          )}
        </div>

        <div className="login-info">
          <h3>System Features</h3>
          <ul>
            <li>✓ Real-time task tracking</li>
            <li>✓ Technician availability management</li>
            <li>✓ Customer request handling</li>
            <li>✓ Advanced reporting</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
