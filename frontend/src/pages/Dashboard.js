import React, { useState } from 'react';
import '../styles/Dashboard.css';

function Dashboard() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'تطوير الموقع الإلكتروني',
      progress: 75,
      members: [
        { id: 1, avatar: '/avatar1.png' },
        { id: 2, avatar: '/avatar2.png' },
      ],
      tasks: { total: 12, completed: 9 },
      dueDate: '2024-03-15'
    },
    // Add more projects...
  ]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>لوحة التحكم</h1>
        <div className="dashboard-actions">
          <button className="btn-primary">
            <i className="fas fa-plus"></i>
            مشروع جديد
          </button>
          <button className="btn-secondary">
            <i className="fas fa-filter"></i>
            تصفية
          </button>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-tasks"></i>
          </div>
          <div className="stat-info">
            <h3>المهام النشطة</h3>
            <p>24</p>
          </div>
        </div>
        {/* Add more stat cards */}
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <div className="project-header">
              <h3>{project.title}</h3>
              <div className="project-menu">
                <i className="fas fa-ellipsis-h"></i>
              </div>
            </div>
            
            <div className="project-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <span>{project.progress}%</span>
            </div>

            <div className="project-details">
              <div className="project-members">
                {project.members.map(member => (
                  <img 
                    key={member.id} 
                    src={member.avatar} 
                    alt="Member" 
                    className="member-avatar"
                  />
                ))}
              </div>
              <div className="project-stats">
                <span>
                  <i className="fas fa-check-circle"></i>
                  {project.tasks.completed}/{project.tasks.total}
                </span>
                <span>
                  <i className="far fa-calendar"></i>
                  {new Date(project.dueDate).toLocaleDateString('ar-SA')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard; 