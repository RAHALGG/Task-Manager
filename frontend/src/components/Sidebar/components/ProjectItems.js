import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

function ProjectItems({ projects, onProjectClick }) {
  return (
    <List>
      {projects.map((project) => (
        <ListItem
          button
          key={project.id}
          onClick={() => onProjectClick(project.id)}
        >
          <ListItemText primary={project.name} />
        </ListItem>
      ))}
    </List>
  );
}

export default ProjectItems; 