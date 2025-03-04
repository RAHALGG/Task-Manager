import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function AddProjectButton({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState('');

  const handleSubmit = () => {
    if (projectName.trim()) {
      onAdd(projectName);
      setProjectName('');
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
        fullWidth
        sx={{ mx: 2, mb: 2 }}
      >
        مشروع جديد
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>إضافة مشروع جديد</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="اسم المشروع"
            fullWidth
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button onClick={handleSubmit} variant="contained">
            إضافة
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddProjectButton; 