import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Paper, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert, Add } from '@mui/icons-material';
import Task from './Task';
import AddTask from './AddTask';

const ColumnContainer = styled(Paper)`
    width: 300px;
    min-height: 500px;
    background: #f4f5f7;
    margin: 8px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
`;

const ColumnHeader = styled.div`
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    border-radius: 8px 8px 0 0;
`;

const Title = styled.h3`
    margin: 0;
    color: #172b4d;
    font-size: 14px;
    font-weight: 600;
`;

const TaskList = styled.div`
    padding: 8px;
    flex-grow: 1;
    min-height: 100px;
    background: ${props => props.isDraggingOver ? '#E3FCEF' : 'transparent'};
    transition: background-color 0.2s ease;
`;

const TaskCount = styled.span`
    background: #dfe1e6;
    color: #172b4d;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    margin-left: 8px;
`;

function Column({ column, provided, onTaskUpdate }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isAddingTask, setIsAddingTask] = useState(false);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleAddClick = () => {
        setIsAddingTask(true);
        handleMenuClose();
    };

    const handleTaskAdded = () => {
        setIsAddingTask(false);
        onTaskUpdate();
    };

    return (
        <ColumnContainer
            elevation={1}
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <ColumnHeader>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Title>{column.title}</Title>
                    <TaskCount>{column.tasks.length}</TaskCount>
                </div>
                <div>
                    <IconButton size="small" onClick={handleAddClick}>
                        <Add fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={handleMenuClick}>
                        <MoreVert fontSize="small" />
                    </IconButton>
                </div>
            </ColumnHeader>

            <TaskList
                ref={provided.innerRef}
                {...provided.droppableProps}
            >
                {column.tasks.map((task, index) => (
                    <Task 
                        key={task._id} 
                        task={task} 
                        index={index}
                        onUpdate={onTaskUpdate}
                    />
                ))}
                {provided.placeholder}
            </TaskList>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleAddClick}>إضافة مهمة</MenuItem>
                <MenuItem onClick={handleMenuClose}>تعديل العمود</MenuItem>
                <MenuItem onClick={handleMenuClose}>حذف العمود</MenuItem>
            </Menu>

            {isAddingTask && (
                <AddTask
                    columnId={column.id}
                    onClose={() => setIsAddingTask(false)}
                    onAdd={handleTaskAdded}
                />
            )}
        </ColumnContainer>
    );
}

export default Column; 