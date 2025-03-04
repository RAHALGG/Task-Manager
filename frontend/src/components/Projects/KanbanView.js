import React from 'react';

const KanbanView = ({ projects, onProjectUpdate }) => {
  return (
    <div>
      {projects.map((project) => (
        <div key={project.id}>
          <h3>{project.name}</h3>
          {/* Add more Kanban view logic here */}
        </div>
      ))}
    </div>
  );
};

export default KanbanView; 