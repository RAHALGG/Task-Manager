import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import TaskIcon from '@mui/icons-material/Task';
import CommentIcon from '@mui/icons-material/Comment';
import PersonIcon from '@mui/icons-material/Person';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent
} from '@mui/lab';

const StyledTimeline = styled(Timeline)(({ theme }) => ({
  padding: theme.spacing(2),
  '& .MuiTimelineItem-root:before': {
    flex: 0
  }
}));

const TimelineCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1]
}));

function ProjectTimeline({ projectId }) {
  // Mock data - replace with actual API call
  const activities = [
    {
      id: 1,
      type: 'TASK',
      title: 'تم إنشاء مهمة جديدة',
      description: 'تصميم واجهة المستخدم',
      date: new Date(),
      user: 'أحمد محمد'
    },
    // Add more activities...
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'TASK':
        return <TaskIcon />;
      case 'COMMENT':
        return <CommentIcon />;
      case 'USER':
        return <PersonIcon />;
      case 'FILE':
        return <AttachFileIcon />;
      default:
        return <TaskIcon />;
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        النشاطات الأخيرة
      </Typography>

      <StyledTimeline>
        {activities.map((activity) => (
          <TimelineItem key={activity.id}>
            <TimelineOppositeContent>
              <Typography variant="body2" color="text.secondary">
                {new Date(activity.date).toLocaleDateString('ar-SA')}
              </Typography>
            </TimelineOppositeContent>
            
            <TimelineSeparator>
              <TimelineDot color="primary">
                {getActivityIcon(activity.type)}
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>

            <TimelineContent>
              <TimelineCard>
                <Typography variant="subtitle2">
                  {activity.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {activity.description}
                </Typography>
                <Typography variant="caption" color="primary">
                  {activity.user}
                </Typography>
              </TimelineCard>
            </TimelineContent>
          </TimelineItem>
        ))}
      </StyledTimeline>
    </Box>
  );
}

export default ProjectTimeline; 