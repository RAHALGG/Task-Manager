import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRole, ROLES, PERMISSIONS } from '../../contexts/RoleContext';
import { useAuth } from '../../contexts/AuthContext';

const TeamHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}));

const RoleChip = styled(Chip)(({ theme, role }) => ({
  backgroundColor: role === ROLES.OWNER ? theme.palette.error.main :
                  role === ROLES.ADMIN ? theme.palette.primary.main :
                  role === ROLES.MANAGER ? theme.palette.warning.main :
                  theme.palette.success.main,
  color: '#fff'
}));

function TeamDashboard() {
  const { userRole, hasPermission } = useRole();
  const { user } = useAuth();
  const [team, setTeam] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    role: ROLES.MEMBER,
    name: '',
    position: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team/members');
      const data = await response.json();
      setTeam(data);
    } catch (error) {
      setError('فشل في تحميل بيانات الفريق');
    }
  };

  const handleAddMember = async () => {
    try {
      const response = await fetch('/api/team/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('فشل في إضافة العضو');
      
      const newMember = await response.json();
      setTeam([...team, newMember]);
      handleCloseDialog();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateMember = async () => {
    try {
      const response = await fetch(`/api/team/members/${selectedMember.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('فشل في تحديث العضو');
      
      const updatedMember = await response.json();
      setTeam(team.map(member => 
        member.id === selectedMember.id ? updatedMember : member
      ));
      handleCloseDialog();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا العضو؟')) return;

    try {
      const response = await fetch(`/api/team/members/${memberId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('فشل في حذف العضو');
      
      setTeam(team.filter(member => member.id !== memberId));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleOpenDialog = (member = null) => {
    setSelectedMember(member);
    if (member) {
      setFormData({
        email: member.email,
        role: member.role,
        name: member.name,
        position: member.position
      });
    } else {
      setFormData({
        email: '',
        role: ROLES.MEMBER,
        name: '',
        position: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMember(null);
    setFormData({
      email: '',
      role: ROLES.MEMBER,
      name: '',
      position: ''
    });
    setError('');
  };

  return (
    <Box>
      <TeamHeader>
        <Typography variant="h4">إدارة الفريق</Typography>
        {hasPermission(PERMISSIONS.MANAGE_TEAM) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            إضافة عضو جديد
          </Button>
        )}
      </TeamHeader>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>العضو</TableCell>
              <TableCell>البريد الإلكتروني</TableCell>
              <TableCell>المنصب</TableCell>
              <TableCell>الدور</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {team.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar src={member.avatar} alt={member.name} />
                    <Typography>{member.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.position}</TableCell>
                <TableCell>
                  <RoleChip
                    label={member.role}
                    role={member.role}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {hasPermission(PERMISSIONS.MANAGE_TEAM) && (
                    <>
                      <IconButton
                        onClick={() => handleOpenDialog(member)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      {member.role !== ROLES.OWNER && (
                        <IconButton
                          onClick={() => handleDeleteMember(member.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedMember ? 'تعديل عضو' : 'إضافة عضو جديد'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }} gap={2} display="flex" flexDirection="column">
            <TextField
              fullWidth
              label="الاسم"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="البريد الإلكتروني"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              fullWidth
              label="المنصب"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>الدور</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                label="الدور"
              >
                {Object.values(ROLES).map((role) => (
                  <MenuItem
                    key={role}
                    value={role}
                    disabled={role === ROLES.OWNER || 
                             (userRole !== ROLES.OWNER && role === ROLES.ADMIN)}
                  >
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>إلغاء</Button>
          <Button
            variant="contained"
            onClick={selectedMember ? handleUpdateMember : handleAddMember}
          >
            {selectedMember ? 'تحديث' : 'إضافة'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TeamDashboard; 