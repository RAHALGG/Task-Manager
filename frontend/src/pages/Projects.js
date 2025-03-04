import React, { useState } from 'react';
import '../styles/Projects.css';

function Projects() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'تطوير الموقع الإلكتروني',
      description: 'تطوير موقع الشركة الجديد باستخدام React',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2024-03-15',
      team: [
        { id: 1, name: 'أحمد محمد', avatar: '/avatar1.png' },
        { id: 2, name: 'سارة أحمد', avatar: '/avatar2.png' },
      ],
      progress: 75
    },
    // يمكنك إضافة المزيد من المشاريع هنا
  ]);

  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  return (
    <div className="projects-page">
      <div className="projects-header">
        <div className="header-left">
          <h1>المشاريع</h1>
          <div className="view-options">
            <button className="view-btn active">
              <i className="fas fa-th-large"></i>
            </button>
            <button className="view-btn">
              <i className="fas fa-list"></i>
            </button>
          </div>
        </div>
        <div className="header-right">
          <button className="filter-btn">
            <i className="fas fa-filter"></i>
            تصفية
          </button>
          <button 
            className="new-project-btn"
            onClick={() => setShowNewProjectModal(true)}
          >
            <i className="fas fa-plus"></i>
            مشروع جديد
          </button>
        </div>
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <div className="project-card-header">
              <span className={`status-badge ${project.status}`}>
                {project.status === 'in-progress' ? 'قيد التنفيذ' : 'مكتمل'}
              </span>
              <div className="project-menu">
                <i className="fas fa-ellipsis-h"></i>
              </div>
            </div>

            <h3 className="project-title">{project.title}</h3>
            <p className="project-description">{project.description}</p>

            <div className="project-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <span className="progress-text">{project.progress}%</span>
            </div>

            <div className="project-details">
              <div className="project-team">
                {project.team.map(member => (
                  <img 
                    key={member.id}
                    src={member.avatar}
                    alt={member.name}
                    title={member.name}
                    className="team-member-avatar"
                  />
                ))}
                <button className="add-member-btn">
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              <div className="project-info">
                <span className={`priority-badge ${project.priority}`}>
                  {project.priority === 'high' ? 'عالي' : 'متوسط'}
                </span>
                <span className="due-date">
                  <i className="far fa-calendar-alt"></i>
                  {new Date(project.dueDate).toLocaleDateString('ar-SA')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for new project */}
      {showNewProjectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>مشروع جديد</h2>
            {/* Add form here */}
            <button onClick={() => setShowNewProjectModal(false)}>
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects; 