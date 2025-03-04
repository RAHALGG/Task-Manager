import React, { useContext } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Badge,
  IconButton 
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

function AdvancedNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({
    email: true,
    push: true,
    desktop: true
  });

  const handleNotificationReceived = (newNotification) => {
    setNotifications(prev => [newNotification, ...prev]);
    
    if (settings.desktop) {
      showDesktopNotification(newNotification);
    }
  };

  return (
    <div>
      <Badge badgeContent={notifications.length} color="primary">
        <NotificationsIcon />
      </Badge>
      
      <List>
        {notifications.map(notification => (
          <ListItem key={notification.id}>
            <ListItemText 
              primary={notification.title}
              secondary={notification.message}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default AdvancedNotifications; 