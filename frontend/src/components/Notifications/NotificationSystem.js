import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { 
    Snackbar, 
    Alert, 
    Badge,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Box,
    IconButton,
    Popover,
    List,
    ListItemAvatar,
    Avatar,
    Divider,
    Button,
    Chip
} from '@mui/material';
import {
    Assignment,
    Comment,
    AccessTime,
    Person,
    Check
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { styled as muiStyled } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CommentIcon from '@mui/icons-material/Comment';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { formatDistance } from 'date-fns';
import { arSA } from 'date-fns/locale';

const NotificationBell = styled(motion.div)`
    position: relative;
    cursor: pointer;
`;

const NotificationList = styled(Box)`
    max-height: 400px;
    overflow-y: auto;
    width: 350px;
`;

const NotificationItem = styled(MenuItem)`
    padding: 16px;
    border-bottom: 1px solid #eee;
    
    &:hover {
        background-color: #f5f5f5;
    }
`;

const NotificationWrapper = muiStyled('div')({
    position: 'relative',
    display: 'inline-block'
});

const NotificationBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
        fontSize: 10,
        height: 20,
        minWidth: 20,
        padding: '0 6px'
    }
}));

const NotificationListStyled = muiStyled(List)({
    width: 360,
    maxHeight: 480,
    overflowY: 'auto'
});

const getNotificationIcon = (type) => {
    switch (type) {
        case 'task':
            return <AssignmentIcon color="primary" />;
        case 'comment':
            return <CommentIcon color="info" />;
        case 'attachment':
            return <AttachFileIcon color="success" />;
        default:
            return <NotificationsIcon />;
    }
};

const getNotificationColor = (priority) => {
    switch (priority) {
        case 'high':
            return 'error';
        case 'medium':
            return 'warning';
        case 'low':
            return 'success';
        default:
            return 'default';
    }
};

const NotificationSystem = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'info' });
    const [open, setOpen] = useState(false);

    const notificationTypes = {
        TASK_ASSIGNED: 'تم تعيين مهمة جديدة',
        DEADLINE_APPROACHING: 'موعد التسليم يقترب',
        MENTION: 'تمت الإشارة إليك',
        TASK_COMPLETED: 'تم إكمال المهمة',
        COMMENT_ADDED: 'تعليق جديد'
    };

    const sendNotification = (type, data) => {
        // إرسال إشعار فوري
        // دعم الإشعارات المتعددة
        // تكامل مع البريد الإلكتروني
    };

    useEffect(() => {
        const socket = io('http://localhost:3001');
        
        socket.on('notification', (notification) => {
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
            showSnackbar(notification.message, notification.type);
        });

        return () => socket.disconnect();
    }, []);

    const showSnackbar = (message, type = 'info') => {
        setSnackbar({ open: true, message, type });
    };

    const handleNotificationClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationAction = (notification) => {
        // تنفيذ الإجراء المناسب حسب نوع الإشعار
        switch (notification.type) {
            case 'task_assigned':
                // الانتقال إلى المهمة
                break;
            case 'comment':
                // فتح التعليقات
                break;
            case 'mention':
                // الانتقال إلى المحادثة
                break;
            default:
                break;
        }
        handleClose();
    };

    const handleMarkAsRead = (notificationId) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === notificationId
                    ? { ...notification, isRead: true }
                    : notification
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, isRead: true }))
        );
        setUnreadCount(0);
    };

    return (
        <>
            <IconButton onClick={handleNotificationClick} color="inherit">
                <NotificationBadge badgeContent={unreadCount}>
                    <NotificationsIcon />
                </NotificationBadge>
            </IconButton>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">التنبيهات</Typography>
                    {unreadCount > 0 && (
                        <Button size="small" onClick={handleMarkAllAsRead}>
                            تحديد الكل كمقروء
                        </Button>
                    )}
                </Box>
                <Divider />
                
                <NotificationListStyled>
                    <AnimatePresence>
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <NotificationItem
                                        isUnread={!notification.isRead}
                                        onClick={() => handleMarkAsRead(notification.id)}
                                    >
                                        <ListItemAvatar>
                                            <Avatar>
                                                {getNotificationIcon(notification.type)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Typography variant="subtitle2">
                                                        {notification.title}
                                                    </Typography>
                                                    <Chip
                                                        size="small"
                                                        label={notification.priority}
                                                        color={getNotificationColor(notification.priority)}
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {notification.message}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatDistance(new Date(notification.timestamp), new Date(), {
                                                            addSuffix: true,
                                                            locale: arSA
                                                        })}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </NotificationItem>
                                    <Divider />
                                </motion.div>
                            ))
                        ) : (
                            <Box p={3} textAlign="center">
                                <Typography color="text.secondary">
                                    لا توجد تنبيهات جديدة
                                </Typography>
                            </Box>
                        )}
                    </AnimatePresence>
                </NotificationListStyled>
            </Popover>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.type} 
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}

export default NotificationSystem; 