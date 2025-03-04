import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import Navbar from '../../components/Layout/Navbar';
import Sidebar from '../../components/Layout/Sidebar';
import KanbanBoard from '../../components/Projects/KanbanBoard';
import ProjectManagement from '../../components/Projects/ProjectManagement';
import api from '../../services/api';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          لوحة التحكم
        </Typography>
        <ProjectManagement />
        <KanbanBoard projects={projects} />
      </Box>
    </Box>
  );
};

export default Dashboard; 