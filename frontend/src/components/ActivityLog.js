import React from 'react';
import '../styles/ActivityLog.css';

function ActivityLog({ activities }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'add': return 'fas fa-plus-circle';
      case 'move': return 'fas fa-arrow-right';
      case 'comment': return 'fas fa-comment';
      case 'attachment': return 'fas fa-paperclip';
      case 'checklist': return 'fas fa-check-square';
      default: return 'fas fa-history';
    }
  };

  return (
    <div className="activity-log">
      <div className="activity-header">
        <i className="fas fa-list-ul"></i>
        <h3>سجل النشاطات</h3>
      </div>
      
      <div className="activities-list">
        {activities.map(activity => (
          <div key={activity.id} className="activity-item">
            <div className="activity-icon">
              <i className={getActivityIcon(activity.type)}></i>
            </div>
            <div className="activity-content">
              <div className="activity-user">
                <img src={activity.user.avatar} alt={activity.user.name} />
                <span className="user-name">{activity.user.name}</span>
              </div>
              <p className="activity-text">{activity.text}</p>
              <span className="activity-time">
                {new Date(activity.timestamp).toLocaleString('ar-SA')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityLog; 