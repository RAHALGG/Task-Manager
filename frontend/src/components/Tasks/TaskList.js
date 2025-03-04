import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Typography,
  Paper,
  Button,
  Box,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { useProject } from '../../contexts/ProjectContext';

const TaskItem = styled(ListItem)(({ theme, priority }) => ({
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  },
  borderLeft: `4px solid ${
    priority === 'HIGH' ? theme.palette.error.main :
    priority === 'MEDIUM' ? theme.palette.warning.main :
    theme.palette.success.main
  }`
}));

function TaskList({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, task) => {
    setSelectedTask(task);
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedTask(null);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">المهام ({tasks.length})</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {/* Handle add task */}}
        >
          مهمة جديدة
        </Button>
      </Box>

      <List>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            priority={task.priority}
            component={Paper}
            elevation={1}
          >
            <ListItemIcon>
              <Checkbox
                checked={task.status === 'COMPLETED'}
                onChange={() => {/* Handle status change */}}
              />
            </ListItemIcon>
            <ListItemText
              primary={task.title}
              secondary={
                <Box display="flex" gap={1} mt={0.5}>
                  <Chip
                    size="small"
                    label={task.priority}
                    color={
                      task.priority === 'HIGH' ? 'error' :
                      task.priority === 'MEDIUM' ? 'warning' : 'success'
                    }
                  />
                  <Chip
                    size="small"
                    label={new Date(task.dueDate).toLocaleDateString('ar-SA')}
                    variant="outlined"
                  />
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar
                  src={task.assignee?.avatar}
                  alt={task.assignee?.name}
                  sx={{ width: 30, height: 30 }}
                />
                <IconButton
                  edge="end"
                  onClick={(e) => handleMenuOpen(e, task)}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </ListItemSecondaryAction>
          </TaskItem>
        ))}
      </List>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>تعديل</MenuItem>
        <MenuItem onClick={handleMenuClose}>تغيير الحالة</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          حذف
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default TaskList; 