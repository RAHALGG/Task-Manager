import React, { useState } from 'react';

const TimeTracker = ({ taskId }) => {
  const [timer, setTimer] = useState({
    isRunning: false,
    startTime: null,
    totalTime: 0
  });

  const [timeEntries, setTimeEntries] = useState([]);

  const startTimer = () => {
    setTimer({
      isRunning: true,
      startTime: Date.now(),
      totalTime: timer.totalTime
    });
  };

  const stopTimer = () => {
    const endTime = Date.now();
    const duration = endTime - timer.startTime;
    
    setTimeEntries([...timeEntries, {
      start: timer.startTime,
      end: endTime,
      duration: duration
    }]);
  };

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
};

export default TimeTracker; 