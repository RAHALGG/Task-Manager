import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Card, 
    Typography, 
    Chip,
    IconButton,
    Avatar,
    AvatarGroup,
    Menu,
    MenuItem
} from '@mui/material';
import { 
    MoreVert,
    AccessTime,
    Label,
    Comment,
    AttachFile
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const TaskCard = styled(Card)`
    margin-bottom: 8px;
    background: white;
    border-radius: 8px;
    box-shadow: ${props => props.isDragging ? '0 5px 10px rgba(0,0,0,0.15)' : 'none'};
    &:hover {
        background: #fafbfc;
    }
`;

const TaskContent = styled.div`
    padding: 12px;
`;

const TaskHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
`;

const TaskTitle = styled(Typography)`
    font-weight: 500;
    color: #172b4d;
`;

const TaskMeta = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    color: #5e6c84;
    font-size: 12px;
`;

const Labels = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 8px;
`;

function Task({ task, index, onUpdate }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#ef5350';
            case 'medium': return '#ff9800';
            case 'low': return '#4caf50';
            default: return '#757575';
        }
    };

    return (
        <Draggable draggableId={task._id} index={index}>
            {(provided, snapshot) => (
                <TaskCard
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    isDragging={snapshot.isDragging}
                    elevation={snapshot.isDragging ? 3 : 1}
                    as={motion.div}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    <TaskContent>
                        <TaskHeader>
                            <TaskTitle variant="body1">
                                {task.title}
                            </TaskTitle>
                            <IconButton 
                                size="small" 
                                onClick={handleMenuClick}
                            >
                                <MoreVert fontSize="small" />
                            </IconButton>
                        </TaskHeader>

                        <Labels>
                            {task.labels?.map((label, index) => (
                                <Chip
                                    key={index}
                                    label={label}
                                    size="small"
                                    icon={<Label />}
                                    variant="outlined"
                                />
                            ))}
                        </Labels>

                        <TaskMeta>
                            {task.dueDate && (
                                <Chip
                                    icon={<AccessTime fontSize="small" />}
                                    label={format(new Date(task.dueDate), 'dd MMM', { locale: ar })}
                                    size="small"
                                    color="default"
                                />
                            )}
                            
                            <Chip
                                size="small"
                                style={{ 
                                    backgroundColor: getPriorityColor(task.priority),
                                    color: 'white'
                                }}
                                label={task.priority}
                            />

                            {task.comments?.length > 0 && (
                                <Chip
                                    icon={<Comment fontSize="small" />}
                                    label={task.comments.length}
                                    size="small"
                                />
                            )}

                            {task.attachments?.length > 0 && (
                                <Chip
                                    icon={<AttachFile fontSize="small" />}
                                    label={task.attachments.length}
                                    size="small"
                                />
                            )}
                        </TaskMeta>

                        {task.assignedTo?.length > 0 && (
                            <AvatarGroup 
                                max={3}
                                sx={{ justifyContent: 'flex-end', mt: 1 }}
                            >
                                {task.assignedTo.map((user) => (
                                    <Avatar 
                                        key={user._id}
                                        alt={user.name}
                                        src={user.avatar}
                                        sx={{ width: 24, height: 24 }}
                                    />
                                ))}
                            </AvatarGroup>
                        )}
                    </TaskContent>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleMenuClose}>تعديل المهمة</MenuItem>
                        <MenuItem onClick={handleMenuClose}>حذف المهمة</MenuItem>
                    </Menu>
                </TaskCard>
            )}
        </Draggable>
    );
}

export default Task; 