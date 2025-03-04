import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Popper,
  MenuList,
  MenuItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Tooltip,
  IconButton,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import CodeIcon from '@mui/icons-material/Code';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import data from '@emoji-mart/data/sets/14/apple.json';
import Picker from '@emoji-mart/react';

const EditorContainer = styled(Paper)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
  '& .ql-container': {
    borderRadius: '0 0 12px 12px',
    fontSize: 16,
    fontFamily: theme.typography.fontFamily
  },
  '& .ql-editor': {
    minHeight: 100,
    maxHeight: 300,
    overflowY: 'auto',
    '&.ql-blank::before': {
      fontStyle: 'normal',
      color: theme.palette.text.secondary
    }
  },
  '& .ql-mention-list-container': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 8,
    boxShadow: theme.shadows[3],
    width: 250
  },
  '& .ql-mention-list-item': {
    padding: theme.spacing(1),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    }
  }
}));

const Toolbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  borderRadius: '12px 12px 0 0'
}));

const modules = {
  toolbar: false,
  mention: {
    allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
    mentionDenotationChars: ['@'],
    source: function(searchTerm, renderList, mentionChar) {
      const values = [
        { id: 1, value: 'أحمد محمد', avatar: '/avatars/1.jpg' },
        { id: 2, value: 'سارة أحمد', avatar: '/avatars/2.jpg' },
        // ... المزيد من المستخدمين
      ];
      
      if (searchTerm.length === 0) {
        renderList(values, searchTerm);
      } else {
        const matches = values.filter(item =>
          item.value.toLowerCase().includes(searchTerm.toLowerCase())
        );
        renderList(matches, searchTerm);
      }
    },
    renderItem: function(item) {
      return `
        <div class="ql-mention-list-item" data-id="${item.id}">
          <img src="${item.avatar}" style="width: 24px; height: 24px; border-radius: 50%; margin-right: 8px;">
          ${item.value}
        </div>
      `;
    }
  }
};

function RichTextEditor({ value, onChange, onMention, onAttachment }) {
  const [emojiPickerAnchor, setEmojiPickerAnchor] = useState(null);
  const quillRef = useRef(null);

  const handleFormat = (format) => {
    const quill = quillRef.current.getEditor();
    quill.format(format, !quill.getFormat()[format]);
  };

  const handleEmoji = (emoji) => {
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection(true);
    quill.insertText(range.index, emoji.native);
    setEmojiPickerAnchor(null);
  };

  const handleAttachment = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      onAttachment?.(files);
    };
    input.click();
  }, [onAttachment]);

  return (
    <EditorContainer elevation={0}>
      <Toolbar>
        <Tooltip title="غامق">
          <IconButton size="small" onClick={() => handleFormat('bold')}>
            <FormatBoldIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="مائل">
          <IconButton size="small" onClick={() => handleFormat('italic')}>
            <FormatItalicIcon />
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem />
        <Tooltip title="قائمة نقطية">
          <IconButton size="small" onClick={() => handleFormat('list')}>
            <FormatListBulletedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="قائمة رقمية">
          <IconButton size="small" onClick={() => handleFormat('ordered')}>
            <FormatListNumberedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="كود">
          <IconButton size="small" onClick={() => handleFormat('code-block')}>
            <CodeIcon />
          </IconButton>
        </Tooltip>
        <Box flex={1} />
        <Tooltip title="إضافة ملف">
          <IconButton size="small" onClick={handleAttachment}>
            <AttachFileIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="إضافة رمز تعبيري">
          <IconButton 
            size="small" 
            onClick={(e) => setEmojiPickerAnchor(e.currentTarget)}
          >
            <EmojiEmotionsIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>

      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder="اكتب تعليقك هنا... استخدم @ لمنشن شخص"
      />

      <Popper
        open={Boolean(emojiPickerAnchor)}
        anchorEl={emojiPickerAnchor}
        placement="top-end"
      >
        <Paper elevation={3}>
          <Picker
            data={data}
            onEmojiSelect={handleEmoji}
            locale="ar"
            theme="light"
          />
        </Paper>
      </Popper>
    </EditorContainer>
  );
}

export default RichTextEditor; 