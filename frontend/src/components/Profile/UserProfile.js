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
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth } from '../../contexts/AuthContext';

const ProfileHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  position: 'relative'
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.8
  }
}));

function UserProfile() {
  const { user, updateProfile } = useAuth();
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
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  return (
    <Box>
      <ProfileHeader elevation={2}>
        <input
          type="file"
          accept="image/*"
          id="avatar-input"
          style={{ display: 'none' }}
          onChange={handleAvatarChange}
        />
        <label htmlFor="avatar-input">
          <StyledAvatar src={user?.avatar} alt={user?.name} />
        </label>

        <Box flex={1}>
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="الاسم"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="البريد الإلكتروني"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="نبذة"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="رقم الهاتف"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="المنصب"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  />
                </Grid>
              </Grid>
              <Box mt={2} display="flex" gap={1} justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  type="submit"
                >
                  حفظ
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => setIsEditing(false)}
                >
                  إلغاء
                </Button>
              </Box>
            </form>
          ) : (
            <>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">{user?.name}</Typography>
                <IconButton onClick={() => setIsEditing(true)}>
                  <EditIcon />
                </IconButton>
              </Box>
              <Typography color="text.secondary">{user?.email}</Typography>
              <Typography variant="body1" mt={2}>
                {user?.bio}
              </Typography>
              <Box mt={2} display="flex" gap={1}>
                <Chip label={`الهاتف: ${user?.phone}`} />
                <Chip label={`المنصب: ${user?.position}`} />
              </Box>
            </>
          )}
        </Box>
      </ProfileHeader>

      <Paper elevation={1}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          centered
        >
          <Tab label="المهام" />
          <Tab label="النشاطات" />
          <Tab label="الإحصائيات" />
        </Tabs>

        <Box p={3}>
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
          {/* Add other tab contents */}
        </Box>
      </Paper>
    </Box>
  );
}

export default UserProfile; 