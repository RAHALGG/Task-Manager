import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { 
  Card as MuiCard, 
  Typography, 
  Chip,
  Avatar,
  Box,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const StyledCard = styled(MuiCard)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(2),
  backgroundColor: '#fff',
  '&:hover': {
    boxShadow: theme.shadows[3]
  }
}));

const CardHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: 8
});

const CardContent = styled(Box)({
  marginBottom: 8
});

const CardFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: theme.spacing(1)
}));

const LabelContainer = styled(Box)({
  display: 'flex',
  gap: 4,
  flexWrap: 'wrap',
  marginBottom: 8
});

function TaskCard({ card, index, onEdit, onDelete }) {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <StyledCard
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          elevation={snapshot.isDragging ? 8 : 1}
        >
          <CardHeader>
            <Typography variant="h6">{card.title}</Typography>
            <Box>
              <IconButton size="small" onClick={() => onEdit(card)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => onDelete(card.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </CardHeader>

          {card.labels && (
            <LabelContainer>
              {card.labels.map((label) => (
                <Chip
                  key={label.id}
                  label={label.name}
                  size="small"
                  style={{ backgroundColor: label.color, color: '#fff' }}
                />
              ))}
            </LabelContainer>
          )}

          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {card.description}
            </Typography>
          </CardContent>

          <CardFooter>
            <Box display="flex" alignItems="center" gap={1}>
              {card.dueDate && (
                <Chip
                  icon={<AccessTimeIcon />}
                  label={new Date(card.dueDate).toLocaleDateString('ar-SA')}
                  size="small"
                  color={new Date(card.dueDate) < new Date() ? 'error' : 'default'}
                />
              )}
            </Box>
            
            <Box display="flex" gap={1}>
              {card.assignees?.map((assignee) => (
                <Avatar
                  key={assignee.id}
                  src={assignee.avatar}
                  alt={assignee.name}
                  sx={{ width: 24, height: 24 }}
                />
              ))}
            </Box>
          </CardFooter>
        </StyledCard>
      )}
    </Draggable>
  );
}

export default TaskCard; 