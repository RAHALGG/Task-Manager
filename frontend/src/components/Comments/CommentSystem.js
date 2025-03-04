import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Button,
  Stack,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReplyIcon from '@mui/icons-material/Reply';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import { formatDistance } from 'date-fns';
import { arSA } from 'date-fns/locale';

const CommentContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: 12
}));

const ReplyContainer = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(6),
  marginTop: theme.spacing(1)
}));

const CommentInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 20,
    backgroundColor: theme.palette.background.paper
  }
}));

const CommentActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1)
}));

const Reactions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
  alignItems: 'center'
}));

function Comment({ comment, onReply, onEdit, onDelete, onReact }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { currentUser } = useUser();

  const handleEdit = () => {
    onEdit(comment.id, editedContent);
    setIsEditing(false);
    setAnchorEl(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <CommentContainer elevation={1}>
        <Box display="flex" alignItems="flex-start" gap={2}>
          <Avatar src={comment.author.avatar} />
          <Box flex={1}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle2" fontWeight="bold">
                {comment.author.name}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="caption" color="text.secondary">
                  {formatDistance(new Date(comment.createdAt), new Date(), {
                    locale: arSA,
                    addSuffix: true
                  })}
                </Typography>
                <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {isEditing ? (
              <Box mt={1}>
                <CommentInput
                  fullWidth
                  multiline
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  autoFocus
                />
                <Box display="flex" gap={1} mt={1}>
                  <Button size="small" variant="contained" onClick={handleEdit}>
                    حفظ
                  </Button>
                  <Button size="small" onClick={() => setIsEditing(false)}>
                    إلغاء
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Typography variant="body2" mt={1}>
                  {comment.content}
                </Typography>
                {comment.attachments?.length > 0 && (
                  <Stack direction="row" spacing={1} mt={1}>
                    {comment.attachments.map((attachment) => (
                      <Chip
                        key={attachment.id}
                        icon={<AttachFileIcon />}
                        label={attachment.name}
                        onClick={() => window.open(attachment.url)}
                        size="small"
                      />
                    ))}
                  </Stack>
                )}
              </>
            )}

            <CommentActions>
              <Reactions>
                <IconButton 
                  size="small" 
                  color={comment.reactions.includes(currentUser.id) ? "primary" : "default"}
                  onClick={() => onReact(comment.id)}
                >
                  <ThumbUpIcon fontSize="small" />
                </IconButton>
                <Typography variant="caption">
                  {comment.reactions.length}
                </Typography>
              </Reactions>
              <Button
                size="small"
                startIcon={<ReplyIcon />}
                onClick={() => onReply(comment.id)}
              >
                رد
              </Button>
            </CommentActions>

            {comment.replies?.length > 0 && (
              <ReplyContainer>
                {comment.replies.map((reply) => (
                  <Comment
                    key={reply.id}
                    comment={reply}
                    onReply={onReply}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onReact={onReact}
                  />
                ))}
              </ReplyContainer>
            )}
          </Box>
        </Box>
      </CommentContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => {
          setIsEditing(true);
          setAnchorEl(null);
        }}>
          تعديل
        </MenuItem>
        <MenuItem onClick={() => {
          onDelete(comment.id);
          setAnchorEl(null);
        }}>
          حذف
        </MenuItem>
      </Menu>
    </motion.div>
  );
}

export default function CommentSystem({ cardId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { currentUser } = useUser();

  useEffect(() => {
    // Load comments from API
    // loadComments(cardId);
  }, [cardId]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: `comment-${Date.now()}`,
        content: newComment,
        author: currentUser,
        createdAt: new Date().toISOString(),
        reactions: [],
        replies: [],
        attachments: []
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  return (
    <Box>
      <Box display="flex" gap={2} mb={3}>
        <Avatar src={currentUser?.avatar} />
        <Box flex={1}>
          <CommentInput
            fullWidth
            multiline
            placeholder="أضف تعليقاً..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Box display="flex" justifyContent="flex-end" mt={1}>
            <Button
              variant="contained"
              disabled={!newComment.trim()}
              onClick={handleAddComment}
            >
              إضافة تعليق
            </Button>
          </Box>
        </Box>
      </Box>

      <AnimatePresence>
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onReply={(parentId) => {/* Handle reply */}}
            onEdit={(id, content) => {/* Handle edit */}}
            onDelete={(id) => {/* Handle delete */}}
            onReact={(id) => {/* Handle reaction */}}
          />
        ))}
      </AnimatePresence>
    </Box>
  );
} 