import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../utils/api';
import './TaskBoard.css';

const TASK_STATUS = {
    TODO: 'todo',
    IN_PROGRESS: 'in_progress',
    DONE: 'done'
};

function TaskBoard() {
    const [tasks, setTasks] = useState({
        [TASK_STATUS.TODO]: [],
        [TASK_STATUS.IN_PROGRESS]: [],
        [TASK_STATUS.DONE]: []
    });
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', status: TASK_STATUS.TODO });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks');
            const groupedTasks = response.data.reduce((acc, task) => {
                if (!acc[task.status]) acc[task.status] = [];
                acc[task.status].push(task);
                return acc;
            }, {
                [TASK_STATUS.TODO]: [],
                [TASK_STATUS.IN_PROGRESS]: [],
                [TASK_STATUS.DONE]: []
            });
            setTasks(groupedTasks);
        } catch (error) {
            showMessage('error', 'فشل في تحميل المهام');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;
        
        if (source.droppableId === destination.droppableId) {
            // إعادة ترتيب في نفس العمود
            const column = tasks[source.droppableId];
            const newColumn = Array.from(column);
            const [removed] = newColumn.splice(source.index, 1);
            newColumn.splice(destination.index, 0, removed);

            setTasks({
                ...tasks,
                [source.droppableId]: newColumn
            });
        } else {
            // نقل بين الأعمدة
            try {
                const taskToMove = tasks[source.droppableId][source.index];
                await api.patch(`/tasks/${draggableId}`, { status: destination.droppableId });

                const sourceColumn = Array.from(tasks[source.droppableId]);
                const destColumn = Array.from(tasks[destination.droppableId]);
                const [removed] = sourceColumn.splice(source.index, 1);
                removed.status = destination.droppableId;
                destColumn.splice(destination.index, 0, removed);

                setTasks({
                    ...tasks,
                    [source.droppableId]: sourceColumn,
                    [destination.droppableId]: destColumn
                });
            } catch (error) {
                showMessage('error', 'فشل في تحديث حالة المهمة');
            }
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/tasks', newTask);
            setTasks({
                ...tasks,
                [newTask.status]: [...tasks[newTask.status], response.data]
            });
            setNewTask({ title: '', description: '', status: TASK_STATUS.TODO });
            setIsAddingTask(false);
            showMessage('success', 'تم إضافة المهمة بنجاح');
        } catch (error) {
            showMessage('error', 'فشل في إضافة المهمة');
        }
    };

    const handleDeleteTask = async (taskId, status) => {
        try {
            await api.delete(`/tasks/${taskId}`);
            setTasks({
                ...tasks,
                [status]: tasks[status].filter(task => task._id !== taskId)
            });
            showMessage('success', 'تم حذف المهمة بنجاح');
        } catch (error) {
            showMessage('error', 'فشل في حذف المهمة');
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loader"></div>
                <p>جاري تحميل المهام...</p>
            </div>
        );
    }

    return (
        <div className="task-board">
            {message.text && (
                <motion.div 
                    className={`message ${message.type}`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    {message.text}
                </motion.div>
            )}

            <div className="board-header">
                <motion.button
                    className="add-task-btn"
                    onClick={() => setIsAddingTask(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <i className="fas fa-plus"></i>
                    إضافة مهمة جديدة
                </motion.button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="board-columns">
                    {Object.entries(tasks).map(([status, columnTasks]) => (
                        <div key={status} className="board-column">
                            <h3 className="column-header">
                                {status === TASK_STATUS.TODO && 'قيد الانتظار'}
                                {status === TASK_STATUS.IN_PROGRESS && 'قيد التنفيذ'}
                                {status === TASK_STATUS.DONE && 'مكتملة'}
                                <span className="task-count">{columnTasks.length}</span>
                            </h3>
                            <Droppable droppableId={status}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="task-list"
                                    >
                                        <AnimatePresence>
                                            {columnTasks.map((task, index) => (
                                                <Draggable
                                                    key={task._id}
                                                    draggableId={task._id}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => (
                                                        <motion.div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.5 }}
                                                            whileHover={{ scale: 1.02 }}
                                                        >
                                                            <h4>{task.title}</h4>
                                                            <p>{task.description}</p>
                                                            <div className="task-footer">
                                                                <span className="task-date">
                                                                    {new Date(task.createdAt).toLocaleDateString('ar-EG')}
                                                                </span>
                                                                <motion.button
                                                                    className="delete-task-btn"
                                                                    onClick={() => handleDeleteTask(task._id, status)}
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </motion.button>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        </AnimatePresence>
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>

            <AnimatePresence>
                {isAddingTask && (
                    <motion.div 
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="add-task-modal"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                        >
                            <h2>إضافة مهمة جديدة</h2>
                            <form onSubmit={handleAddTask}>
                                <div className="form-group">
                                    <label>عنوان المهمة</label>
                                    <input
                                        type="text"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                                        required
                                        placeholder="أدخل عنوان المهمة"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>وصف المهمة</label>
                                    <textarea
                                        value={newTask.description}
                                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                                        required
                                        placeholder="أدخل وصف المهمة"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>الحالة</label>
                                    <select
                                        value={newTask.status}
                                        onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                                    >
                                        <option value={TASK_STATUS.TODO}>قيد الانتظار</option>
                                        <option value={TASK_STATUS.IN_PROGRESS}>قيد التنفيذ</option>
                                        <option value={TASK_STATUS.DONE}>مكتملة</option>
                                    </select>
                                </div>
                                <div className="modal-buttons">
                                    <motion.button
                                        type="submit"
                                        className="submit-btn"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        إضافة المهمة
                                    </motion.button>
                                    <motion.button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={() => setIsAddingTask(false)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        إلغاء
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default TaskBoard; 