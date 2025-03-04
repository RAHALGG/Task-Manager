import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';

const KanbanBoard = ({ projects }) => {
  const [columns, setColumns] = useState([
    { id: 'todo', title: 'قيد الانتظار', tasks: [] },
    { id: 'inProgress', title: 'قيد التنفيذ', tasks: [] },
    { id: 'done', title: 'مكتمل', tasks: [] }
  ]);

  const [openNewTask, setOpenNewTask] = useState(false);
  const [openEditTask, setOpenEditTask] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    columnId: ''
  });
  const [editingTask, setEditingTask] = useState(null);

  const handleAddTask = (columnId) => {
    setNewTaskData({ ...newTaskData, columnId });
    setOpenNewTask(true);
  };

  const handleSaveTask = () => {
    const updatedColumns = columns.map(column => {
      if (column.id === newTaskData.columnId) {
        return {
          ...column,
          tasks: [...column.tasks, {
            id: Date.now(),
            title: newTaskData.title,
            description: newTaskData.description
          }]
        };
      }
      return column;
    });
    setColumns(updatedColumns);
    setOpenNewTask(false);
    setNewTaskData({ title: '', description: '', columnId: '' });
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTaskData({ title: task.title, description: task.description, columnId: task.columnId });
    setOpenEditTask(true);
  };

  const handleUpdateTask = () => {
    const updatedColumns = columns.map(column => {
      return {
        ...column,
        tasks: column.tasks.map(task => {
          if (task.id === editingTask.id) {
            return { ...task, title: newTaskData.title, description: newTaskData.description };
          }
          return task;
        })
      };
    });
    setColumns(updatedColumns);
    setOpenEditTask(false);
    setNewTaskData({ title: '', description: '', columnId: '' });
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId) => {
    const updatedColumns = columns.map(column => {
      return {
        ...column,
        tasks: column.tasks.filter(task => task.id !== taskId)
      };
    });
    setColumns(updatedColumns);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', p: 2 }}>
      {columns.map(column => (
        <Paper
          key={column.id}
          sx={{
            width: 300,
            minHeight: 500,
            bgcolor: '#f0f0f0',
            p: 2
          }}
        >
          <Typography variant="h6" gutterBottom>
            {column.title}
          </Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={() => handleAddTask(column.id)}
            fullWidth
            variant="contained"
            sx={{ mb: 2 }}
          >
            إضافة مهمة
          </Button>
          
          {column.tasks.map(task => (
            <Card key={task.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {task.description}
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton size="small" onClick={() => handleEditTask(task)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDeleteTask(task.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Paper>
      ))}

      <Dialog open={openNewTask} onClose={() => setOpenNewTask(false)}>
        <DialogTitle>إضافة مهمة جديدة</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="عنوان المهمة"
            fullWidth
            value={newTaskData.title}
            onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="وصف المهمة"
            fullWidth
            multiline
            rows={4}
            value={newTaskData.description}
            onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewTask(false)}>إلغاء</Button>
          <Button onClick={handleSaveTask} variant="contained">
            حفظ
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditTask} onClose={() => setOpenEditTask(false)}>
        <DialogTitle>تعديل المهمة</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="عنوان المهمة"
            fullWidth
            value={newTaskData.title}
            onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="وصف المهمة"
            fullWidth
            multiline
            rows={4}
            value={newTaskData.description}
            onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditTask(false)}>إلغاء</Button>
          <Button onClick={handleUpdateTask} variant="contained">
            حفظ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KanbanBoard; 