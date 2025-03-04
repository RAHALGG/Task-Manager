import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  IconButton,
  Collapse,
  Typography,
  Autocomplete,
  Chip,
  Avatar,
  Stack,
  Dialog
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import LabelIcon from '@mui/icons-material/Label';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { DateTimePicker } from '@mui/x-date-pickers';
import { motion, AnimatePresence } from 'framer-motion';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  '&:hover': {
    boxShadow: theme.shadows[4]
  }
}));

const QuickActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2)
}));

const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: 20,
  padding: '4px 12px'
}));

function AddCard({ onAdd, labels, members, attachmentTypes }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [cardData, setCardData] = useState({
    title: '',
    description: '',
    labels: [],
    assignees: [],
    dueDate: null,
    attachments: [],
    checklist: []
  });
  const [showLabelDialog, setShowLabelDialog] = useState(false);
  const [showMemberDialog, setShowMemberDialog] = useState(false);

  const handleSubmit = () => {
    if (cardData.title.trim()) {
      onAdd({
        ...cardData,
        id: `card-${Date.now()}`,
        createdAt: new Date().toISOString()
      });
      setCardData({
        title: '',
        description: '',
        labels: [],
        assignees: [],
        dueDate: null,
        attachments: [],
        checklist: []
      });
      setIsExpanded(false);
    }
  };

  const handleAddLabel = (label) => {
    setCardData(prev => ({
      ...prev,
      labels: [...prev.labels, label]
    }));
  };

  const handleAddMember = (member) => {
    setCardData(prev => ({
      ...prev,
      assignees: [...prev.assignees, member]
    }));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <StyledPaper>
          {!isExpanded ? (
            <Button
              fullWidth
              startIcon={<AddIcon />}
              onClick={() => setIsExpanded(true)}
              sx={{ justifyContent: 'flex-start' }}
            >
              إضافة بطاقة جديدة
            </Button>
          ) : (
            <Stack spacing={2}>
              <TextField
                fullWidth
                multiline
                placeholder="عنوان البطاقة"
                value={cardData.title}
                onChange={(e) => setCardData({ ...cardData, title: e.target.value })}
                autoFocus
                variant="outlined"
              />

              <TextField
                fullWidth
                multiline
                placeholder="وصف البطاقة (اختياري)"
                value={cardData.description}
                onChange={(e) => setCardData({ ...cardData, description: e.target.value })}
                rows={3}
                variant="outlined"
              />

              {cardData.labels.length > 0 && (
                <Box display="flex" gap={1} flexWrap="wrap">
                  {cardData.labels.map((label) => (
                    <Chip
                      key={label.id}
                      label={label.name}
                      onDelete={() => {
                        setCardData(prev => ({
                          ...prev,
                          labels: prev.labels.filter(l => l.id !== label.id)
                        }));
                      }}
                      style={{ backgroundColor: label.color, color: '#fff' }}
                    />
                  ))}
                </Box>
              )}

              {cardData.assignees.length > 0 && (
                <Box display="flex" gap={1}>
                  {cardData.assignees.map((member) => (
                    <Chip
                      key={member.id}
                      avatar={<Avatar src={member.avatar} />}
                      label={member.name}
                      onDelete={() => {
                        setCardData(prev => ({
                          ...prev,
                          assignees: prev.assignees.filter(m => m.id !== member.id)
                        }));
                      }}
                    />
                  ))}
                </Box>
              )}

              <QuickActions>
                <ActionButton
                  startIcon={<LabelIcon />}
                  onClick={() => setShowLabelDialog(true)}
                  variant="outlined"
                  size="small"
                >
                  التصنيفات
                </ActionButton>
                <ActionButton
                  startIcon={<PersonAddIcon />}
                  onClick={() => setShowMemberDialog(true)}
                  variant="outlined"
                  size="small"
                >
                  الأعضاء
                </ActionButton>
                <ActionButton
                  startIcon={<DateRangeIcon />}
                  onClick={() => {/* Show date picker */}}
                  variant="outlined"
                  size="small"
                >
                  التاريخ
                </ActionButton>
                <ActionButton
                  startIcon={<AttachFileIcon />}
                  onClick={() => {/* Show attachment dialog */}}
                  variant="outlined"
                  size="small"
                >
                  مرفقات
                </ActionButton>
              </QuickActions>

              <Box display="flex" justifyContent="space-between" mt={2}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!cardData.title.trim()}
                >
                  إضافة
                </Button>
                <IconButton onClick={() => setIsExpanded(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Stack>
          )}
        </StyledPaper>
      </motion.div>

      {/* Label Dialog */}
      <Dialog open={showLabelDialog} onClose={() => setShowLabelDialog(false)}>
        {/* محتوى حوار التصنيفات */}
      </Dialog>

      {/* Member Dialog */}
      <Dialog open={showMemberDialog} onClose={() => setShowMemberDialog(false)}>
        {/* محتوى حوار الأعضاء */}
      </Dialog>
    </AnimatePresence>
  );
}

export default AddCard; 