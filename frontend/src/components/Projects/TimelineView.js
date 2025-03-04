import React from 'react';

const TimelineView = ({ projects }) => {
  return (
    <div>
      {projects.map((project) => (
        <div key={project.id}>
          <h3>{project.name}</h3>
          {/* Add more timeline view logic here */}
        </div>
      ))}
    </div>
  );
};

export default TimelineView; 