import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../../services/api';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [openNewProject, setOpenNewProject] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    description: ''
  });

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

  const handleCreateProject = async () => {
    try {
      const response = await api.post('/projects', newProjectData);
      setProjects([...projects, response.data]);
      setOpenNewProject(false);
      setNewProjectData({ name: '', description: '' });
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(project => project._id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        إدارة المشاريع
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpenNewProject(true)}
      >
        مشروع جديد
      </Button>
      <Paper sx={{ mt: 2, p: 2 }}>
        <List>
          {projects.map(project => (
            <ListItem key={project._id} secondaryAction={
              <IconButton edge="end" onClick={() => handleDeleteProject(project._id)}>
                <DeleteIcon />
              </IconButton>
            }>
              <ListItemText primary={project.name} secondary={project.description} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={openNewProject} onClose={() => setOpenNewProject(false)}>
        <DialogTitle>إنشاء مشروع جديد</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="اسم المشروع"
            fullWidth
            value={newProjectData.name}
            onChange={(e) => setNewProjectData({ ...newProjectData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="وصف المشروع"
            fullWidth
            multiline
            rows={4}
            value={newProjectData.description}
            onChange={(e) => setNewProjectData({ ...newProjectData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewProject(false)}>إلغاء</Button>
          <Button onClick={handleCreateProject} variant="contained">
            إنشاء
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectManagement; 