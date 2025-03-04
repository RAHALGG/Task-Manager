import React, { useState } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Typography
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import { AddProjectButton, ProjectList } from './components';

const drawerWidth = 240;

function Sidebar() {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(true);

  const handleAddProject = (projectName) => {
    setProjects([
      ...projects,
      {
        id: `project-${Date.now()}`,
        name: projectName,
        boards: []
      }
    ]);
  };

  const handleProjectClick = (project) => {
    // سيتم تنفيذ منطق اختيار المشروع هنا
    console.log('Selected project:', project);
  };

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={open}
      sx={{
        width: drawerWidth,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <div>
        <Typography variant="h6" sx={{ p: 2 }}>
          مدير المهام
        </Typography>
        <Divider />
        
        <List>
          <ListItem button>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="لوحة التحكم" />
          </ListItem>
        </List>
        
        <Divider />
        
        <Typography variant="subtitle1" sx={{ p: 2 }}>
          المشاريع
        </Typography>
        
        <AddProjectButton onAdd={handleAddProject} />
        <ProjectList 
          projects={projects} 
          onProjectClick={handleProjectClick}
        />
      </div>
    </Drawer>
  );
}

export default Sidebar; 