import React from "react";
import TaskList from "./TaskList";
import "./Dashboard.css";

const Dashboard = () => {
  const dashboardStats = [
    { label: "Total Tasks", value: 24, icon: "📋", color: "#6366f1" },
    { label: "Completed", value: 16, icon: "✓", color: "#34d399" },
    { label: "In Progress", value: 5, icon: "⚡", color: "#60a5fa" },
    { label: "Pending", value: 3, icon: "⏳", color: "#fbbf24" }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Dashboard Overview</h1>
        <p>Welcome back! Here's your task summary.</p>
      </div>

      <div className="stats-container">
        {dashboardStats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20` }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-number">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-tasks">
        <h2>📌 Recent Tasks</h2>
        <TaskList />
      </div>
    </div>
  );
};

export default Dashboard;
