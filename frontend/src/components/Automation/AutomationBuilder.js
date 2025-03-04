import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Button,
    TextField,
    Select,
    MenuItem,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Switch
} from '@mui/material';
import {
    Add,
    Delete,
    PlayArrow,
    Pause,
    Settings,
    Timeline,
    Email,
    Notifications,
    GitHub,
    Slack,
    Google
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const TriggerCard = styled(Paper)`
    padding: 16px;
    margin: 8px 0;
    cursor: pointer;
    &:hover {
        background: #f5f5f5;
    }
`;

const ActionStep = styled(Box)`
    padding: 16px;
    border: 1px dashed #ccc;
    margin: 8px 0;
    border-radius: 4px;
    background: ${props => props.isDragging ? '#e3f2fd' : 'white'};
`;

function AutomationBuilder() {
    const [automations, setAutomations] = useState([]);
    const [currentAutomation, setCurrentAutomation] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [trigger, setTrigger] = useState('');
    const [action, setAction] = useState('');
    const [conditions, setConditions] = useState([]);

    const triggers = [
        { id: 'task_created', name: 'إنشاء مهمة جديدة', icon: <Add /> },
        { id: 'task_completed', name: 'اكتمال المهمة', icon: <PlayArrow /> },
        { id: 'due_date', name: 'موعد استحقاق قريب', icon: <Timeline /> },
        { id: 'comment_added', name: 'إضافة تعليق', icon: <Email /> }
    ];

    const actions = [
        { id: 'send_email', name: 'إرسال بريد إلكتروني', icon: <Email /> },
        { id: 'send_notification', name: 'إرسال إشعار', icon: <Notifications /> },
        { id: 'create_github_issue', name: 'إنشاء مشكلة في GitHub', icon: <GitHub /> },
        { id: 'slack_message', name: 'إرسال رسالة Slack', icon: <Slack /> },
        { id: 'google_calendar', name: 'إضافة حدث تقويم', icon: <Google /> }
    ];

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(currentAutomation.steps);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setCurrentAutomation({
            ...currentAutomation,
            steps: items
        });
    };

    const addAutomation = () => {
        const newAutomation = {
            id: Date.now(),
            name: 'أتمتة جديدة',
            trigger: null,
            steps: [],
            active: true
        };
        setAutomations([...automations, newAutomation]);
        setCurrentAutomation(newAutomation);
    };

    const addStep = (action) => {
        setCurrentAutomation({
            ...currentAutomation,
            steps: [...currentAutomation.steps, { ...action, id: Date.now() }]
        });
    };

    const handleCreateAutomation = () => {
        const automation = {
            trigger,
            conditions,
            action,
            boardId: currentBoard.id
        };
        
        saveAutomation(automation);
    };

    return (
        <Box p={3}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">الأتمتة</Typography>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={addAutomation}
                            >
                                جديد
                            </Button>
                        </Box>
                        <List>
                            {automations.map(automation => (
                                <ListItem
                                    key={automation.id}
                                    button
                                    selected={currentAutomation?.id === automation.id}
                                    onClick={() => setCurrentAutomation(automation)}
                                >
                                    <ListItemIcon>
                                        {automation.active ? <PlayArrow /> : <Pause />}
                                    </ListItemIcon>
                                    <ListItemText primary={automation.name} />
                                    <Switch
                                        checked={automation.active}
                                        onChange={() => {/* تغيير الحالة */}}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={9}>
                    {currentAutomation && (
                        <Paper sx={{ p: 2 }}>
                            <Box mb={3}>
                                <TextField
                                    fullWidth
                                    label="اسم الأتمتة"
                                    value={currentAutomation.name}
                                    onChange={(e) => setCurrentAutomation({
                                        ...currentAutomation,
                                        name: e.target.value
                                    })}
                                />
                            </Box>

                            <Typography variant="h6" gutterBottom>
                                المحفز
                            </Typography>
                            <Grid container spacing={2}>
                                {triggers.map(trigger => (
                                    <Grid item xs={6} md={3} key={trigger.id}>
                                        <TriggerCard
                                            elevation={currentAutomation.trigger === trigger.id ? 3 : 1}
                                            onClick={() => setCurrentAutomation({
                                                ...currentAutomation,
                                                trigger: trigger.id
                                            })}
                                        >
                                            <Box display="flex" alignItems="center" gap={1}>
                                                {trigger.icon}
                                                <Typography>{trigger.name}</Typography>
                                            </Box>
                                        </TriggerCard>
                                    </Grid>
                                ))}
                            </Grid>

                            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                                الخطوات
                            </Typography>
                            <DragDropContext onDragEnd={handleDragEnd}>
                                <Droppable droppableId="steps">
                                    {(provided) => (
                                        <Box
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >
                                            {currentAutomation.steps.map((step, index) => (
                                                <Draggable
                                                    key={step.id}
                                                    draggableId={step.id.toString()}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => (
                                                        <ActionStep
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            isDragging={snapshot.isDragging}
                                                        >
                                                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                                                <Box display="flex" alignItems="center" gap={1}>
                                                                    {step.icon}
                                                                    <Typography>{step.name}</Typography>
                                                                </Box>
                                                                <Box>
                                                                    <IconButton onClick={() => {/* تعديل الخطوة */}}>
                                                                        <Settings />
                                                                    </IconButton>
                                                                    <IconButton color="error" onClick={() => {/* حذف الخطوة */}}>
                                                                        <Delete />
                                                                    </IconButton>
                                                                </Box>
                                                            </Box>
                                                        </ActionStep>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </Box>
                                    )}
                                </Droppable>
                            </DragDropContext>

                            <Button
                                variant="outlined"
                                startIcon={<Add />}
                                onClick={() => setDialogOpen(true)}
                                sx={{ mt: 2 }}
                            >
                                إضافة خطوة
                            </Button>
                        </Paper>
                    )}
                </Grid>
            </Grid>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>إضافة خطوة</DialogTitle>
                <DialogContent>
                    <List>
                        {actions.map(action => (
                            <ListItem
                                button
                                key={action.id}
                                onClick={() => {
                                    addStep(action);
                                    setDialogOpen(false);
                                }}
                            >
                                <ListItemIcon>{action.icon}</ListItemIcon>
                                <ListItemText primary={action.name} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>

            <Select
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                label="المشغل"
            >
                <MenuItem value="card_moved">عند نقل البطاقة</MenuItem>
                <MenuItem value="due_date">عند اقتراب الموعد النهائي</MenuItem>
                <MenuItem value="label_added">عند إضافة تصنيف</MenuItem>
            </Select>

            <Button onClick={handleCreateAutomation}>
                حفظ الأتمتة
            </Button>
        </Box>
    );
}

export default AutomationBuilder; 