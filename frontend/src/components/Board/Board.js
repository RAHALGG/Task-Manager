import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Column from './Column';
import AddColumn from './AddColumn';
import api from '../../utils/api';

const BoardContainer = styled(motion.div)`
    display: flex;
    height: calc(100vh - 64px);
    padding: 20px;
    background: #f5f6f8;
    overflow-x: auto;
`;

const ColumnsContainer = styled.div`
    display: flex;
    gap: 20px;
    align-items: flex-start;
`;

function Board() {
    const [columns, setColumns] = useState({
        todo: {
            id: 'todo',
            title: 'المهام الجديدة',
            tasks: []
        },
        in_progress: {
            id: 'in_progress',
            title: 'قيد التنفيذ',
            tasks: []
        },
        review: {
            id: 'review',
            title: 'قيد المراجعة',
            tasks: []
        },
        done: {
            id: 'done',
            title: 'مكتمل',
            tasks: []
        }
    });

    // إضافة نظام التصنيف المتقدم
    const [labels, setLabels] = useState({
        urgent: { color: '#ff0000', name: 'عاجل' },
        bug: { color: '#ff9900', name: 'خطأ برمجي' },
        feature: { color: '#00ff00', name: 'ميزة جديدة' },
        enhancement: { color: '#0099ff', name: 'تحسين' }
    });

    // إضافة نظام الأولويات
    const [priorities, setPriorities] = useState([
        { id: 1, name: 'عالي جداً', color: '#ff0000' },
        { id: 2, name: 'عالي', color: '#ff9900' },
        { id: 3, name: 'متوسط', color: '#ffff00' },
        { id: 4, name: 'منخفض', color: '#00ff00' }
    ]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/tasks`);
            const data = await response.json();
            
            // تنظيم المهام في الأعمدة
            const newColumns = { ...columns };
            data.forEach(task => {
                if (newColumns[task.status]) {
                    newColumns[task.status].tasks.push(task);
                }
            });

            // ترتيب المهام حسب الموقع
            Object.keys(newColumns).forEach(columnId => {
                newColumns[columnId].tasks.sort((a, b) => a.position - b.position);
            });

            setColumns(newColumns);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];
        const task = sourceColumn.tasks.find(t => t._id === draggableId);

        // حساب الموقع الجديد
        let newPosition;
        if (destination.index === 0) {
            newPosition = destColumn.tasks[0]?.position / 2 || 1000;
        } else if (destination.index === destColumn.tasks.length) {
            newPosition = destColumn.tasks[destColumn.tasks.length - 1].position + 1000;
        } else {
            newPosition = (
                destColumn.tasks[destination.index - 1].position +
                destColumn.tasks[destination.index].position
            ) / 2;
        }

        // تحديث الواجهة
        const newColumns = { ...columns };
        newColumns[source.droppableId].tasks.splice(source.index, 1);
        newColumns[destination.droppableId].tasks.splice(destination.index, 0, {
            ...task,
            status: destination.droppableId,
            position: newPosition
        });
        setColumns(newColumns);

        // تحديث السيرفر
        try {
            await api.patch(`/tasks/${draggableId}/position`, {
                status: destination.droppableId,
                position: newPosition
            });
        } catch (error) {
            console.error('Error updating task position:', error);
            // إعادة تحميل المهام في حالة الخطأ
            fetchTasks();
        }
    };

    return (
        <BoardContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <DragDropContext onDragEnd={handleDragEnd}>
                <ColumnsContainer>
                    {Object.values(columns).map(column => (
                        <Droppable key={column.id} droppableId={column.id}>
                            {(provided) => (
                                <Column
                                    column={column}
                                    provided={provided}
                                    onTaskUpdate={fetchTasks}
                                />
                            )}
                        </Droppable>
                    ))}
                    <AddColumn onAdd={fetchTasks} />
                </ColumnsContainer>
            </DragDropContext>
        </BoardContainer>
    );
}

export default Board; 