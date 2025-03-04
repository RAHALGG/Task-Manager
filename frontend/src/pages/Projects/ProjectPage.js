import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar
} from '@mui/material';
import KanbanBoard from '../../components/Projects/KanbanBoard';

const ProjectPage = () => {
  const [openNewProject, setOpenNewProject] = useState(false);
  const [projectData, setProjectData] = useState({
    name: '',
    description: ''
  });

  const handleCreateProject = () => {
    // هنا سنضيف منطق إنشاء المشروع
    setOpenNewProject(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">المشروع: تطوير الموقع</Typography>
        <Button
          variant="contained"
          onClick={() => setOpenNewProject(true)}
        >
          مشروع جديد
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          فريق العمل
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            avatar={<Avatar>أ</Avatar>}
            label="أحمد محمد"
            variant="outlined"
          />
          <Chip
            avatar={<Avatar>س</Avatar>}
            label="سارة أحمد"
            variant="outlined"
          />
          <Button size="small">+ إضافة عضو</Button>
        </Box>
      </Box>

      <KanbanBoard />

      <Dialog open={openNewProject} onClose={() => setOpenNewProject(false)}>
        <DialogTitle>إنشاء مشروع جديد</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="اسم المشروع"
            fullWidth
            value={projectData.name}
            onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="وصف المشروع"
            fullWidth
            multiline
            rows={4}
            value={projectData.description}
            onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
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

export default ProjectPage; 