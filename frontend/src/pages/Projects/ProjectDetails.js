import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Grid,
  Avatar,
  AvatarGroup,
  Chip,
  Button,
  IconButton,
  LinearProgress,
  Divider,
  Menu,
  MenuItem,
  Dialog,
  Card,
  CardContent,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams, useNavigate, Routes, Route } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TimelineIcon from '@mui/icons-material/Timeline';
import TaskIcon from '@mui/icons-material/Task';
import GroupIcon from '@mui/icons-material/Group';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useProject, PROJECT_STATUS } from '../../contexts/ProjectContext';
import { useRole } from '../../contexts/RoleContext';
import TaskList from '../../components/Tasks/TaskList';
import ProjectTimeline from '../../components/Timeline/ProjectTimeline';
import ProjectFiles from '../../components/Files/ProjectFiles';

const ProjectHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(255,255,255,0.1), transparent)',
    zIndex: 1
  }
}));

const StatsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4]
  }
}));

const TabPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  minHeight: 400
}));

const TeamMembers = ({ members }) => {
  return (
    <AvatarGroup max={4} sx={{ mb: 2 }}>
      {members.map((member) => (
        <Tooltip key={member.id} title={member.name}>
          <Avatar
            alt={member.name}
            src={member.avatar}
            sx={{
              width: 40,
              height: 40,
              border: '2px solid white'
            }}
          />
        </Tooltip>
      ))}
    </AvatarGroup>
  );
};

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProject, loading, updateProject } = useProject();
  const { hasPermission } = useRole();
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    // Fetch project details
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateProject(id, { ...currentProject, status: newStatus });
      setMenuAnchor(null);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case PROJECT_STATUS.COMPLETED:
        return 'success';
      case PROJECT_STATUS.IN_PROGRESS:
        return 'primary';
      case PROJECT_STATUS.ON_HOLD:
        return 'warning';
      case PROJECT_STATUS.CANCELLED:
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <ProjectHeader elevation={3}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" zIndex={2} position="relative">
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {currentProject?.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2, opacity: 0.9 }}>
              {currentProject?.description}
            </Typography>
            <Box display="flex" gap={2} alignItems="center">
              <Chip
                label={currentProject?.status}
                color={getStatusColor(currentProject?.status)}
                sx={{ borderRadius: 2 }}
              />
              <TeamMembers members={currentProject?.members || []} />
            </Box>
          </Box>

          {hasPermission('MANAGE_PROJECTS') && (
            <Box>
              <IconButton
                color="inherit"
                onClick={(e) => setMenuAnchor(e.currentTarget)}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </ProjectHeader>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TaskIcon color="primary" />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {currentProject?.tasks?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    المهام الكلية
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </StatsCard>
        </Grid>
        {/* Add more stats cards */}
      </Grid>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<TaskIcon />} label="المهام" />
          <Tab icon={<TimelineIcon />} label="الجدول الزمني" />
          <Tab icon={<GroupIcon />} label="الفريق" />
          <Tab icon={<InsertDriveFileIcon />} label="الملفات" />
        </Tabs>
      </Paper>

      <TabPanel>
        <Routes>
          <Route path="tasks" element={<TaskList projectId={id} />} />
          <Route path="timeline" element={<ProjectTimeline projectId={id} />} />
          <Route path="files" element={<ProjectFiles projectId={id} />} />
          <Route path="team" element={<TeamMembers members={currentProject?.members || []} />} />
        </Routes>
      </TabPanel>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => setEditDialogOpen(true)}>
          <EditIcon sx={{ mr: 1 }} /> تعديل المشروع
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange(PROJECT_STATUS.COMPLETED)}>
          تحديث الحالة
        </MenuItem>
        <MenuItem sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} /> حذف المشروع
        </MenuItem>
      </Menu>

      {/* Add Edit Project Dialog */}
    </Box>
  );
}

export default ProjectDetails; 