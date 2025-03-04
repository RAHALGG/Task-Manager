import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import api from '../../services/api';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">المهام</Typography>
        {tasks.map((task) => (
          <Card key={task._id} sx={{ margin: 1, padding: 1 }}>
            <Typography variant="h6">{task.title}</Typography>
            <Button variant="contained" color="primary">
              عرض التفاصيل
            </Button>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default Tasks; 