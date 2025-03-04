import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: 'fas fa-columns', label: 'لوحة التحكم' },
    { path: '/projects', icon: 'fas fa-project-diagram', label: 'المشاريع' },
    { path: '/tasks', icon: 'fas fa-tasks', label: 'المهام' },
    { path: '/teams', icon: 'fas fa-users', label: 'الفرق' },
    { path: '/calendar', icon: 'far fa-calendar-alt', label: 'التقويم' },
    { path: '/reports', icon: 'fas fa-chart-bar', label: 'التقارير' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
      
      <div className="sidebar-footer">
        <div className="workspace-info">
          <h3>مساحة العمل</h3>
          <p>فريق التطوير</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar; 