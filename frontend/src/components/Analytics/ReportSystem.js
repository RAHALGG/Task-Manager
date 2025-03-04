import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Grid 
} from '@mui/material';
import { Chart } from 'react-chartjs-2';

function ReportSystem() {
  const [reportData, setReportData] = useState({
    tasks: [],
    completion: [],
    performance: []
  });

  useEffect(() => {
    // جلب البيانات من الخادم
    fetchReportData();
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <Typography variant="h6">تقرير المهام</Typography>
          <Chart type="bar" data={reportData.tasks} />
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card>
          <Typography variant="h6">نسبة الإنجاز</Typography>
          <Chart type="pie" data={reportData.completion} />
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <Typography variant="h6">أداء الفريق</Typography>
          <Chart type="line" data={reportData.performance} />
        </Card>
      </Grid>
    </Grid>
  );
}

export default ReportSystem; 