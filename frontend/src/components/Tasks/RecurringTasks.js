import React, { useState } from 'react';
import { 
  Paper, 
  List, 
  ListItem, 
  ListItemText,
  IconButton,
  Dialog
} from '@mui/material';
import RepeatIcon from '@mui/icons-material/Repeat';

function RecurringTasks() {
  const [tasks, setTasks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleAddRecurring = (task) => {
    setTasks([...tasks, {
      ...task,
      recurring: {
        frequency: 'weekly', // يومي، أسبوعي، شهري
        nextDue: new Date()
      }
    }]);
  };

  return (
    <Paper>
      <List>
        {tasks.map(task => (
          <ListItem
            key={task.id}
            secondaryAction={
              <IconButton>
                <RepeatIcon />
              </IconButton>
            }
          >
            <ListItemText 
              primary={task.title}
              secondary={`يتكرر: ${task.recurring.frequency}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default RecurringTasks; 