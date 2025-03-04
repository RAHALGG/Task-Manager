import React, { useState, useEffect } from 'react';
import { CollaborationContext } from '../../contexts/CollaborationContext';
import { LivePresence } from './LivePresence';
import { CursorOverlay } from './CursorOverlay';
import { ChangeIndicators } from './ChangeIndicators';
import { ActivityFeed } from './ActivityFeed';

const LiveCollaboration = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [userCursors, setUserCursors] = useState({});
  const [changes, setChanges] = useState([]);

  useEffect(() => {
    // إعداد اتصال WebSocket
    const socket = setupWebSocket();

    socket.on('user-joined', handleUserJoined);
    socket.on('user-left', handleUserLeft);
    socket.on('cursor-moved', handleCursorMove);
    socket.on('content-changed', handleContentChange);

    return () => socket.disconnect();
  }, []);

  const handleUserActivity = (activity) => {
    // تحديث نشاط المستخدم
    updateUserPresence(activity);
    
    // تزامن التغييرات
    broadcastChanges(activity);
    
    // تحديث المؤشرات المباشرة
    updateCursors(activity);
  };

  return (
    <CollaborationContext.Provider value={{ activeUsers, userCursors }}>
      <LivePresence users={activeUsers} />
      <CursorOverlay cursors={userCursors} />
      <ChangeIndicators changes={changes} />
      <ActivityFeed />
    </CollaborationContext.Provider>
  );
};

export default LiveCollaboration; 