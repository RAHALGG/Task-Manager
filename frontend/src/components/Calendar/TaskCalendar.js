import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent
} from '@mui/material';
import {
    ViewDay,
    ViewWeek,
    ViewModule,
    ChevronLeft,
    ChevronRight
} from '@mui/icons-material';
import {
    format,
    addMonths,
    subMonths,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    parseISO
} from 'date-fns';
import { ar } from 'date-fns/locale';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const CalendarContainer = styled(Paper)`
    padding: 20px;
    height: calc(100vh - 100px);
    display: flex;
    flex-direction: column;
`;

const CalendarHeader = styled(Box)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

const CalendarGrid = styled(Box)`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
    flex-grow: 1;
`;

const DayCell = styled(motion.div)`
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 8px;
    min-height: 100px;
    background: ${props => props.isToday ? '#e3f2fd' : 'white'};
    opacity: ${props => props.isCurrentMonth ? 1 : 0.5};
    cursor: pointer;
    
    &:hover {
        background: #f5f5f5;
    }
`;

const TaskChip = styled(motion.div)`
    padding: 4px 8px;
    border-radius: 4px;
    background: ${props => props.color};
    color: white;
    margin: 2px 0;
    font-size: 12px;
    cursor: pointer;
    
    &:hover {
        filter: brightness(0.9);
    }
`;

function TaskCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, [currentDate]);

    const fetchTasks = async () => {
        try {
            const start = startOfMonth(currentDate);
            const end = endOfMonth(currentDate);
            const response = await api.get(`/tasks?start=${start}&end=${end}`);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const renderCalendarDays = () => {
        const start = startOfWeek(startOfMonth(currentDate));
        const end = endOfWeek(endOfMonth(currentDate));
        const days = eachDayOfInterval({ start, end });

        return days.map(day => {
            const dayTasks = tasks.filter(task => 
                isSameDay(parseISO(task.dueDate), day)
            );

            return (
                <DayCell
                    key={day.toString()}
                    isToday={isSameDay(day, new Date())}
                    isCurrentMonth={isSameMonth(day, currentDate)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                >
                    <Typography variant="caption">
                        {format(day, 'd', { locale: ar })}
                    </Typography>
                    
                    <AnimatePresence>
                        {dayTasks.map(task => (
                            <TaskChip
                                key={task._id}
                                color={getPriorityColor(task.priority)}
                                onClick={() => setSelectedTask(task)}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                {task.title}
                            </TaskChip>
                        ))}
                    </AnimatePresence>
                </DayCell>
            );
        });
    };

    return (
        <CalendarContainer elevation={2}>
            <CalendarHeader>
                <Box display="flex" alignItems="center">
                    <IconButton onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                        <ChevronRight />
                    </IconButton>
                    <Typography variant="h6" sx={{ mx: 2 }}>
                        {format(currentDate, 'MMMM yyyy', { locale: ar })}
                    </Typography>
                    <IconButton onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                        <ChevronLeft />
                    </IconButton>
                </Box>
                <Box>
                    <IconButton>
                        <ViewDay />
                    </IconButton>
                    <IconButton>
                        <ViewWeek />
                    </IconButton>
                    <IconButton>
                        <ViewModule />
                    </IconButton>
                </Box>
            </CalendarHeader>

            <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" mb={2}>
                {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(day => (
                    <Typography 
                        key={day} 
                        variant="subtitle2" 
                        align="center"
                        sx={{ color: 'text.secondary' }}
                    >
                        {day}
                    </Typography>
                ))}
            </Box>

            <CalendarGrid>
                {renderCalendarDays()}
            </CalendarGrid>

            <Dialog 
                open={Boolean(selectedTask)} 
                onClose={() => setSelectedTask(null)}
                maxWidth="sm"
                fullWidth
            >
                {selectedTask && (
                    <>
                        <DialogTitle>{selectedTask.title}</DialogTitle>
                        <DialogContent>
                            <Typography>{selectedTask.description}</Typography>
                            {/* يمكن إضافة المزيد من تفاصيل المهمة هنا */}
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </CalendarContainer>
    );
}

export default TaskCalendar; 