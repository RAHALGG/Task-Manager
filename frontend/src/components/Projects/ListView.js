import React from 'react';

const ListView = ({ projects, onProjectUpdate }) => {
  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>
          {project.name}
          {/* Add more list view logic here */}
        </li>
      ))}
    </ul>
  );
};

export default ListView; 