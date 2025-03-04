import React, { useState, useEffect, useRef } from 'react';
import {
    Drawer,
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    TextField,
    IconButton,
    Typography,
    Badge,
    Divider
} from '@mui/material';
import {
    Send,
    Close,
    AttachFile,
    EmojiEmotions,
    Image
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import EmojiPicker from 'emoji-picker-react';

const ChatContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 320px;
`;

const MessageList = styled(Box)`
    flex-grow: 1;
    overflow-y: auto;
    padding: 16px;
    background: #f5f6f8;
`;

const MessageBubble = styled(motion.div)`
    background: ${props => props.isOwn ? '#e3f2fd' : 'white'};
    padding: 8px 16px;
    border-radius: 16px;
    margin: 8px 0;
    max-width: 80%;
    align-self: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
`;

const InputContainer = styled(Box)`
    padding: 16px;
    background: white;
    border-top: 1px solid #eee;
`;

function ChatSystem() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showEmoji, setShowEmoji] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // التمرير إلى آخر رسالة
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!newMessage.trim()) return;

        const message = {
            id: Date.now(),
            text: newMessage,
            sender: 'user',
            timestamp: new Date(),
            isOwn: true
        };

        setMessages([...messages, message]);
        setNewMessage('');
        // إرسال الرسالة إلى السيرفر
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // معالجة رفع الملف
            const reader = new FileReader();
            reader.onload = (e) => {
                const message = {
                    id: Date.now(),
                    type: 'image',
                    url: e.target.result,
                    sender: 'user',
                    timestamp: new Date(),
                    isOwn: true
                };
                setMessages([...messages, message]);
            };
            reader.readAsDataURL(file);
        }
    };

    const onEmojiClick = (event, emojiObject) => {
        setNewMessage(prev => prev + emojiObject.emoji);
        setShowEmoji(false);
    };

    return (
        <>
            <IconButton onClick={() => setOpen(true)}>
                <Badge badgeContent={3} color="error">
                    <Chat />
                </Badge>
            </IconButton>

            <Drawer
                anchor="right"
                open={open}
                onClose={() => setOpen(false)}
            >
                <ChatContainer>
                    <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
                        <Typography variant="h6">المحادثات</Typography>
                    </Box>

                    <MessageList>
                        {messages.map((message) => (
                            <MessageBubble
                                key={message.id}
                                isOwn={message.isOwn}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {message.type === 'image' ? (
                                    <img 
                                        src={message.url} 
                                        alt="uploaded" 
                                        style={{ maxWidth: '100%', borderRadius: 8 }}
                                    />
                                ) : (
                                    <Typography>{message.text}</Typography>
                                )}
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(message.timestamp).toLocaleTimeString('ar-EG')}
                                </Typography>
                            </MessageBubble>
                        ))}
                        <div ref={messagesEndRef} />
                    </MessageList>

                    <InputContainer>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                                size="small"
                                onClick={() => setShowEmoji(!showEmoji)}
                            >
                                <EmojiEmotions />
                            </IconButton>
                            <IconButton
                                size="small"
                                component="label"
                            >
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                />
                                <AttachFile />
                            </IconButton>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="اكتب رسالة..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <IconButton
                                color="primary"
                                onClick={handleSend}
                            >
                                <Send />
                            </IconButton>
                        </Box>
                        {showEmoji && (
                            <Box sx={{ position: 'absolute', bottom: '100%', right: 0 }}>
                                <EmojiPicker onEmojiClick={onEmojiClick} />
                            </Box>
                        )}
                    </InputContainer>
                </ChatContainer>
            </Drawer>
        </>
    );
}

export default ChatSystem; 