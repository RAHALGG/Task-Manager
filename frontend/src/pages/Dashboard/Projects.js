import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import api from '../../services/api';

const Projects = () => {
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
    <Card>
      <CardContent>
        <Typography variant="h5">المشاريع</Typography>
        {projects.map((project) => (
          <Card key={project._id} sx={{ margin: 1, padding: 1 }}>
            <Typography variant="h6">{project.name}</Typography>
            <Button variant="contained" color="primary">
              عرض التفاصيل
            </Button>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default Projects; 