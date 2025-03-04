import React from 'react';
import { Button, TextField, Box } from '@mui/material';

const ProjectForm = ({ onSubmit, teamMembers }) => {
  const [projectName, setProjectName] = React.useState('');

  const handleSubmit = () => {
    if (projectName.trim()) {
      onSubmit({ name: projectName });
      setProjectName('');
    }
  };

  return (
    <Box>
      <TextField
        label="Project Name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        fullWidth
      />
      <Button onClick={handleSubmit} variant="contained" sx={{ mt: 2 }}>
        Create Project
      </Button>
    </Box>
  );
};

export default ProjectForm; 