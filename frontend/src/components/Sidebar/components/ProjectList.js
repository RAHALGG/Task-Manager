import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function ProjectList({ projects, onProjectClick }) {
  return (
    <List>
      {projects.map((project) => (
        <ListItem
          button
          key={project.id}
          onClick={() => onProjectClick?.(project)}
        >
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary={project.name} />
          <ListItemSecondaryAction>
            <IconButton edge="end" size="small">
              <MoreVertIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
}

export default ProjectList; 