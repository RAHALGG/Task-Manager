import { useSocket } from '../contexts/SocketContext';

const YourComponent = () => {
  const { socket, isConnected, emit, on } = useSocket();

  useEffect(() => {
    if (isConnected) {
      // استخدام Socket
      on('some-event', handleEvent);
    }
    
    return () => {
      // تنظيف المستمعين
      socket?.off('some-event');
    };
  }, [isConnected]);

  // ... باقي الكود
}; 