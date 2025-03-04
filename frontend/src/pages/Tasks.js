import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import '../styles/Tasks.css';
import Modal from '../components/Modal';
import NewTaskForm from '../components/NewTaskForm';
import TaskDetails from '../components/TaskDetails';
import AdvancedSearch from '../components/AdvancedSearch';
import ActivityLog from '../components/ActivityLog';

function Tasks() {
  const [members] = useState([
    { id: 1, name: 'أحمد محمد', avatar: '/avatar1.png' },
    { id: 2, name: 'سارة أحمد', avatar: '/avatar2.png' },
    { id: 3, name: 'محمد علي', avatar: '/avatar3.png' },
  ]);

  const [labels] = useState([
    { id: 1, name: 'تطوير', color: '#4CAF50' },
    { id: 2, name: 'تصميم', color: '#2196F3' },
    { id: 3, name: 'محتوى', color: '#FF9800' },
    { id: 4, name: 'عاجل', color: '#F44336' },
  ]);

  const [columns, setColumns] = useState({
    todo: {
      id: 'todo',
      title: 'قيد الانتظار',
      tasks: [
        {
          id: 't1',
          title: 'تصميم واجهة المستخدم',
          description: 'تصميم واجهة المستخدم الجديدة للتطبيق',
          priority: 'high',
          dueDate: '2024-03-20',
          assignee: members[0],
          labels: ['تصميم', 'UI/UX'],
          attachments: 2,
          comments: 5
        },
        {
          id: 't2',
          title: 'تطوير واجهة API',
          description: 'تطوير واجهة برمجة التطبيقات الخلفية',
          priority: 'medium',
          dueDate: '2024-03-25',
          assignee: members[1],
          labels: ['تطوير', 'Backend'],
          attachments: 1,
          comments: 3
        }
      ]
    },
    inProgress: {
      id: 'inProgress',
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

  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchFilters, setSearchFilters] = useState(null);
  const [activities] = useState([
    {
      id: 1,
      type: 'add',
      user: { name: 'أحمد محمد', avatar: '/avatar1.png' },
      text: 'أضاف مهمة جديدة',
      timestamp: new Date().toISOString()
    },
    // المزيد من النشاطات...
  ]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    
    if (!destination) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceTasks = Array.from(sourceColumn.tasks);
    const destTasks = Array.from(destColumn.tasks);

    if (source.droppableId === destination.droppableId) {
      // إعادة ترتيب في نفس العمود
      const [removed] = sourceTasks.splice(source.index, 1);
      sourceTasks.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          tasks: sourceTasks
        }
      });
    } else {
      // نقل بين الأعمدة
      const [removed] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          tasks: sourceTasks
        },
        [destination.droppableId]: {
          ...destColumn,
          tasks: destTasks
        }
      });
    }
  };

  const handleNewTask = (taskData) => {
    const newTask = {
      id: `t${Date.now()}`,
      ...taskData,
      assignee: { name: 'أنا', avatar: '/avatar1.png' },
      attachments: 0,
      comments: 0
    };

    setColumns(prev => ({
      ...prev,
      todo: {
        ...prev.todo,
        tasks: [...prev.todo.tasks, newTask]
      }
    }));
  };

  const filterTasks = (tasks) => {
    if (!searchFilters) return tasks;
    return tasks.filter(task => {
      const matchesText = !searchFilters.searchText || 
        task.title.toLowerCase().includes(searchFilters.searchText.toLowerCase());
      
      const matchesAssignee = !searchFilters.assignee || 
        task.assignee.id.toString() === searchFilters.assignee;
      
      const matchesLabels = searchFilters.labels.length === 0 || 
        searchFilters.labels.some(labelId => 
          task.labels.includes(labels.find(l => l.id === labelId)?.name)
        );
      
      const matchesPriority = !searchFilters.priority || 
        task.priority === searchFilters.priority;
      
      const matchesDueDate = !searchFilters.dueDate || 
        task.dueDate === searchFilters.dueDate;

      return matchesText && matchesAssignee && matchesLabels && 
             matchesPriority && matchesDueDate;
    });
  };

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <h1>المهام</h1>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => setShowNewTaskModal(true)}
          >
            <i className="fas fa-plus"></i>
            مهمة جديدة
          </button>
        </div>
      </div>

      <AdvancedSearch
        onSearch={setSearchFilters}
        members={members}
        labels={labels}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="task-columns">
          {Object.values(columns).map(column => (
            <div key={column.id} className="task-column">
              <div className="column-header">
                <h3>{column.title}</h3>
                <span className="task-count">
                  {filterTasks(column.tasks).length}
                </span>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`task-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                  >
                    {filterTasks(column.tasks).map((task, index) => (
                      <Draggable 
                        key={task.id} 
                        draggableId={task.id} 
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
                            onClick={() => setSelectedTask(task)}
                          >
                            <div className="task-card-header">
                              <span className={`priority-badge ${task.priority}`}>
                                {task.priority === 'high' ? 'عالي' : 
                                 task.priority === 'medium' ? 'متوسط' : 'منخفض'}
                              </span>
                            </div>
                            <h4 className="task-title">{task.title}</h4>
                            <div className="task-labels">
                              {task.labels.map((label, i) => (
                                <span key={i} className="task-label">{label}</span>
                              ))}
                            </div>
                            <div className="task-meta">
                              <div className="task-assignee">
                                <img 
                                  src={task.assignee.avatar} 
                                  alt={task.assignee.name} 
                                />
                              </div>
                              <div className="task-stats">
                                {task.attachments > 0 && (
                                  <span className="task-stat">
                                    <i className="fas fa-paperclip"></i>
                                    {task.attachments}
                                  </span>
                                )}
                                {task.comments > 0 && (
                                  <span className="task-stat">
                                    <i className="fas fa-comment"></i>
                                    {task.comments}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <Modal
        isOpen={showNewTaskModal}
        onClose={() => setShowNewTaskModal(false)}
        title="مهمة جديدة"
      >
        <NewTaskForm
          onSubmit={handleNewTask}
          onClose={() => setShowNewTaskModal(false)}
          members={members}
          labels={labels}
        />
      </Modal>

      <Modal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.title}
      >
        {selectedTask && (
          <TaskDetails
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={(updatedTask) => {
              // تحديث المهمة في العمود المناسب
              const columnId = Object.keys(columns).find(key => 
                columns[key].tasks.some(t => t.id === updatedTask.id)
              );
              
              if (columnId) {
                setColumns(prev => ({
                  ...prev,
                  [columnId]: {
                    ...prev[columnId],
                    tasks: prev[columnId].tasks.map(t => 
                      t.id === updatedTask.id ? updatedTask : t
                    )
                  }
                }));
              }
              setSelectedTask(null);
            }}
            members={members}
            labels={labels}
          />
        )}
      </Modal>
    </div>
  );
}

export default Tasks; 