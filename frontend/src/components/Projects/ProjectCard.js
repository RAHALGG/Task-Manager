import React from 'react';
import {
  CardContent,
  Typography,
  Box,
  Chip,
  AvatarGroup,
  Avatar,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  AccessTime as AccessTimeIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import { StyledProjectCard } from './StyledComponents';

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledProjectCard status={project.status}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="h2">
            {project.name}
          </Typography>
          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => {
              onEdit(project);
              handleMenuClose();
            }}>
              تعديل
            </MenuItem>
            <MenuItem onClick={() => {
              onDelete(project.id);
              handleMenuClose();
            }}>
              حذف
            </MenuItem>
          </Menu>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {project.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip
            size="small"
            label={project.status}
            color={
              project.status === 'COMPLETED' ? 'success' :
              project.status === 'IN_PROGRESS' ? 'primary' :
              project.status === 'ON_HOLD' ? 'warning' : 'error'
            }
          />
          <Chip
            size="small"
            icon={<FlagIcon />}
            label={project.priority}
            color={
              project.priority === 'HIGH' ? 'error' :
              project.priority === 'MEDIUM' ? 'warning' : 'info'
            }
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              التقدم
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {project.progress}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={project.progress} 
            sx={{ height: 6, borderRadius: 1 }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {new Date(project.dueDate).toLocaleDateString('ar-EG')}
            </Typography>
          </Box>
          <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 30, height: 30 } }}>
            {project.team?.map((member) => (
              <Avatar
                key={member.id}
                alt={member.name}
                src={member.avatar}
                title={member.name}
              />
            ))}
          </AvatarGroup>
        </Box>
      </CardContent>
    </StyledProjectCard>
  );
};

export default ProjectCard; 