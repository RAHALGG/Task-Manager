import React, { useState } from 'react';
import styled from 'styled-components';
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Box,
    IconButton,
    Avatar,
    AvatarGroup
} from '@mui/material';
import { 
    Close,
    Label,
    AccessTime,
    PriorityHigh,
    AttachFile
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import api from '../../utils/api';

const StyledDialog = styled(Dialog)`
    .MuiDialog-paper {
        width: 600px;
        max-width: 95vw;
    }
`;

const LabelChip = styled(Chip)`
    margin: 4px;
`;

function AddTask({ columnId, onClose, onAdd }) {
    const [task, setTask] = useState({
        title: '',
        description: '',
        status: columnId,
        priority: 'medium',
        dueDate: null,
        labels: [],
        assignedTo: []
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/tasks', task);
            onAdd();
        } catch (error) {
            console.error('Error creating task:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field) => (event) => {
        setTask({ ...task, [field]: event.target.value });
    };

    return (
        <StyledDialog open onClose={onClose} maxWidth="md">
            <DialogTitle>
                إضافة مهمة جديدة
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="عنوان المهمة"
                        fullWidth
                        value={task.title}
                        onChange={handleChange('title')}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="وصف المهمة"
                        fullWidth
                        multiline
                        rows={4}
                        value={task.description}
                        onChange={handleChange('description')}
                    />
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>الأولوية</InputLabel>
                            <Select
                                value={task.priority}
                                onChange={handleChange('priority')}
                                label="الأولوية"
                            >
                                <MenuItem value="low">منخفضة</MenuItem>
                                <MenuItem value="medium">متوسطة</MenuItem>
                                <MenuItem value="high">عالية</MenuItem>
                            </Select>
                        </FormControl>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="تاريخ الاستحقاق"
                                value={task.dueDate}
                                onChange={(newValue) => {
                                    setTask({ ...task, dueDate: newValue });
                                }}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>إلغاء</Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? 'جاري الإضافة...' : 'إضافة'}
                    </Button>
                </DialogActions>
            </form>
        </StyledDialog>
    );
}

export default AddTask; 