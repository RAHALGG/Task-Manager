import React, { useState } from 'react';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Button,
  Grid,
  TextField,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  IconButton,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import TaskIcon from '@mui/icons-material/Task';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useAuth } from '../../contexts/AuthContext';
import { useSnackbar } from '../../contexts/SnackbarContext';

const ProfileHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: theme.palette.primary.contrastText,
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

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  border: `4px solid ${theme.palette.common.white}`,
  boxShadow: theme.shadows[3],
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.9
  }
}));

const StatsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4]
  }
}));

function UserProfile() {
  const { user, updateProfile } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [isEditing, setIsEditing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    position: user?.position || ''
  });

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ ...user, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ ...user, ...formData });
      setIsEditing(false);
      showSnackbar('تم تحديث الملف الشخصي بنجاح', 'success');
    } catch (error) {
      showSnackbar('حدث خطأ أثناء تحديث الملف الشخصي', 'error');
    }
  };

  return (
    <Box>
      <ProfileHeader elevation={3}>
        <Box position="relative" zIndex={2}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id="avatar-input"
                onChange={handleAvatarChange}
              />
              <label htmlFor="avatar-input">
                <StyledAvatar src={user?.avatar} alt={user?.name}>
                  {user?.name?.charAt(0)}
                </StyledAvatar>
              </label>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                {user?.name}
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                {user?.position}
              </Typography>
              <Box mt={2}>
                <Chip label={user?.role} color="secondary" />
              </Box>
            </Grid>
            <Grid item>
              {!isEditing ? (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                >
                  تعديل الملف
                </Button>
              ) : (
                <Box display="flex" gap={1}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit}
                    sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                  >
                    حفظ
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => setIsEditing(false)}
                    sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
                  >
                    إلغاء
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </ProfileHeader>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TaskIcon color="primary" fontSize="large" />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {user?.stats?.completedTasks || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    المهام المكتملة
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
          centered
        >
          <Tab icon={<TaskIcon />} label="المهام" />
          <Tab icon={<TimelineIcon />} label="النشاطات" />
        </Tabs>
      </Paper>

      <Box p={3} component={Paper}>
        {tabValue === 0 && (
          <List>
            {user?.tasks?.map((task) => (
              <ListItem key={task.id}>
                <ListItemAvatar>
                  <Avatar>{task.status === 'completed' ? '✓' : '○'}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={task.title}
                  secondary={`تاريخ الإنشاء: ${new Date(task.createdAt).toLocaleDateString('ar-SA')}`}
                />
                <Chip
                  label={task.status === 'completed' ? 'مكتمل' : 'قيد التنفيذ'}
                  color={task.status === 'completed' ? 'success' : 'warning'}
                />
              </ListItem>
            ))}
          </List>
        )}
        {tabValue === 1 && (
          <Typography color="text.secondary" align="center">
            قريباً...
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default UserProfile; 