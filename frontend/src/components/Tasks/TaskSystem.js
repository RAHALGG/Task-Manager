import React, { useState } from 'react';
import { TaskContext } from '../../contexts/TaskContext';
import { TaskList } from './TaskList';
import { TaskDetails } from './TaskDetails';
import { TaskActions } from './TaskActions';
import { socket } from '../../services/socket';
import { enhanceTaskWithAI, createTask, updateTask, updateDependencies, notifyAssignees, updateAnalytics } from '../../services/taskService';
import { showError } from '../../utils/errorHandler';

const TaskSystem = () => {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  const handleTaskCreate = async (taskData) => {
    try {
      // إنشاء المهمة مع الذكاء الاصطناعي
      const enhancedTask = await enhanceTaskWithAI(taskData);
      
      // إضافة المهمة
      const newTask = await createTask(enhancedTask);
      
      // تحديث الواجهة
      setTasks(prev => [...prev, newTask]);
      
      // إرسال الإشعارات
      notifyAssignees(newTask);
      
      // تحديث التحليلات
      updateAnalytics('task_created', newTask);
      
    } catch (error) {
      handleError(error);
    }
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      // تحديث مباشر في الواجهة
      setTasks(prev => updateTaskInList(prev, taskId, updates));
      
      // حفظ في قاعدة البيانات
      await updateTask(taskId, updates);
      
      // تحديث التبعيات
      await updateDependencies(taskId, updates);
      
      // إرسال التحديثات المباشرة
      socket.emit('task-updated', { taskId, updates });
      
    } catch (error) {
      // التراجع عن التغييرات
      setTasks(prev => [...prev]);
      showError('فشل تحديث المهمة');
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, activeTask, handleTaskUpdate }}>
      <TaskList tasks={tasks} />
      <TaskDetails task={activeTask} />
      <TaskActions onTaskCreate={handleTaskCreate} />
    </TaskContext.Provider>
  );
};

export default TaskSystem; 