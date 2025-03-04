import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  BarChart, 
  PieChart 
} from 'recharts';
import { Card, Typography } from '@mui/material';

function BoardAnalytics({ boardId }) {
  const [analytics, setAnalytics] = useState({
    taskCompletion: [],
    memberActivity: [],
    timeTracking: []
  });

  useEffect(() => {
    fetchBoardAnalytics(boardId);
  }, [boardId]);

  return (
    <div className="analytics-dashboard">
      <Card>
        <Typography variant="h6">معدل إنجاز المهام</Typography>
        <LineChart data={analytics.taskCompletion} />
      </Card>
      
      <Card>
        <Typography variant="h6">نشاط الأعضاء</Typography>
        <BarChart data={analytics.memberActivity} />
      </Card>

      <Card>
        <Typography variant="h6">تتبع الوقت</Typography>
        <PieChart data={analytics.timeTracking} />
      </Card>
    </div>
  );
}

export default BoardAnalytics; 