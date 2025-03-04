import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { BoardContainer, BoardHeader, BoardContent, Columns, AutoColumn, Column, ActivityStream } from './styles';
import { QuickFilters, ViewOptions, BoardActions } from './components';
import { socket } from '../../contexts/SocketContext';
import { reorderItems, updateBoardState, reorderList, moveCard, initialBoard } from '../../utils/boardUtils';
import { showError, handleError } from '../../utils/errorUtils';
import { useSocket } from '../../contexts/SocketContext';
import { List } from './components';

const IntegratedBoard = () => {
  const [board, setBoard] = useState(initialBoard);
  const { socket } = useSocket();

  const handleBoardUpdate = useCallback((newBoard) => {
    setBoard(newBoard);
  }, []);

  const handleTaskUpdate = useCallback((updatedTask) => {
    setBoard(prevBoard => {
      const newBoard = { ...prevBoard };
      const list = newBoard.lists.find(l => l.cards.some(c => c.id === updatedTask.id));
      if (list) {
        const cardIndex = list.cards.findIndex(c => c.id === updatedTask.id);
        if (cardIndex !== -1) {
          list.cards[cardIndex] = { ...list.cards[cardIndex], ...updatedTask };
        }
      }
      return newBoard;
    });
  }, []);

  const handleColumnUpdate = useCallback((columnId, updates) => {
    setBoard(prevBoard => {
      const newBoard = { ...prevBoard };
      const listIndex = newBoard.lists.findIndex(l => l.id === columnId);
      if (listIndex !== -1) {
        newBoard.lists[listIndex] = { ...newBoard.lists[listIndex], ...updates };
      }
      return newBoard;
    });
  }, []);

  const handleNewTask = useCallback((task) => {
    setBoard(prevBoard => {
      const newBoard = { ...prevBoard };
      const list = newBoard.lists.find(l => l.id === task.listId);
      if (list) {
        list.cards.push(task);
      }
      return newBoard;
    });
  }, []);

  useEffect(() => {
    socket?.on('boardUpdate', handleBoardUpdate);
    socket?.on('taskUpdate', handleTaskUpdate);

    return () => {
      socket?.off('boardUpdate', handleBoardUpdate);
      socket?.off('taskUpdate', handleTaskUpdate);
    };
  }, [socket, handleBoardUpdate, handleTaskUpdate]);

  const handleDragEnd = (result) => {
    try {
      const { source, destination } = result;
      if (!destination) return;

      const newBoard = { ...board };
      const sourceList = newBoard.lists.find(list => list.id === source.droppableId);
      const destList = newBoard.lists.find(list => list.id === destination.droppableId);

      if (source.droppableId === destination.droppableId) {
        // إعادة ترتيب في نفس القائمة
        const newCards = Array.from(sourceList.cards);
        const [removed] = newCards.splice(source.index, 1);
        newCards.splice(destination.index, 0, removed);
        sourceList.cards = newCards;
      } else {
        // نقل بين القوائم
        const sourceCards = Array.from(sourceList.cards);
        const destCards = Array.from(destList.cards);
        const [removed] = sourceCards.splice(source.index, 1);
        destCards.splice(destination.index, 0, removed);
        sourceList.cards = sourceCards;
        destList.cards = destCards;
      }

      setBoard(newBoard);
    } catch (error) {
      handleError(error);
    }
  };

  const handleAddCard = (listId, cardTitle) => {
    const newBoard = { ...board };
    const list = newBoard.lists.find(l => l.id === listId);
    if (list) {
      const newCard = {
        id: `card-${Date.now()}`,
        title: cardTitle,
        createdAt: new Date().toISOString(),
        description: '',
        labels: [],
        assignees: [],
        dueDate: null
      };
      list.cards.push(newCard);
      setBoard(newBoard);
    }
  };

  const handleDeleteCard = (listId, cardId) => {
    const newBoard = { ...board };
    const list = newBoard.lists.find(l => l.id === listId);
    if (list) {
      list.cards = list.cards.filter(card => card.id !== cardId);
      setBoard(newBoard);
    }
  };

  const handleUpdateCard = (listId, cardId, updates) => {
    const newBoard = { ...board };
    const list = newBoard.lists.find(l => l.id === listId);
    if (list) {
      const cardIndex = list.cards.findIndex(c => c.id === cardId);
      if (cardIndex !== -1) {
        list.cards[cardIndex] = {
          ...list.cards[cardIndex],
          ...updates,
          lastModified: new Date().toISOString()
        };
        setBoard(newBoard);
      }
    }
  };

  const handleAddList = (title) => {
    const newBoard = { ...board };
    const newList = {
      id: `list-${Date.now()}`,
      title,
      cards: []
    };
    newBoard.lists.push(newList);
    setBoard(newBoard);
  };

  const handleDeleteList = (listId) => {
    const newBoard = { ...board };
    newBoard.lists = newBoard.lists.filter(list => list.id !== listId);
    setBoard(newBoard);
  };

  const handleUpdateList = (listId, updates) => {
    const newBoard = { ...board };
    const listIndex = newBoard.lists.findIndex(l => l.id === listId);
    if (listIndex !== -1) {
      newBoard.lists[listIndex] = {
        ...newBoard.lists[listIndex],
        ...updates,
        lastModified: new Date().toISOString()
      };
      setBoard(newBoard);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <BoardContainer>
        {board.lists.map((list) => (
          <List 
            key={list.id} 
            list={list}
            onAddCard={handleAddCard}
            onDeleteCard={handleDeleteCard}
            onUpdateCard={handleUpdateCard}
            onUpdateList={handleUpdateList}
            onDeleteList={handleDeleteList}
          />
        ))}
      </BoardContainer>
    </DragDropContext>
  );
};

export default IntegratedBoard; 