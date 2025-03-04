import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { 
  Paper,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TaskCard from './Card';
import AddCard from './AddCard';

const ListContainer = styled(Paper)(({ theme }) => ({
  width: 300,
  backgroundColor: theme.palette.grey[100],
  margin: theme.spacing(1),
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 'calc(100vh - 180px)',
  borderRadius: 12
}));

const ListHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 8px 0 8px'
});

const ListContent = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  minHeight: 100
});

function List({ list, onAddCard, onDeleteList, onUpdateList }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDeleteList(list.id);
    handleMenuClose();
  };

  return (
    <ListContainer>
      <ListHeader>
        <Typography variant="h6">{list.title}</Typography>
        <IconButton size="small" onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>تعديل</MenuItem>
          <MenuItem onClick={handleDelete}>حذف</MenuItem>
        </Menu>
      </ListHeader>

      <Divider sx={{ my: 1 }} />

      <Droppable droppableId={list.id}>
        {(provided, snapshot) => (
          <ListContent
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              backgroundColor: snapshot.isDraggingOver ? 'action.hover' : 'transparent'
            }}
          >
            {list.cards.map((card, index) => (
              <TaskCard
                key={card.id}
                card={card}
                index={index}
                onEdit={(card) => onUpdateList(list.id, card)}
                onDelete={(cardId) => onDeleteList(list.id, cardId)}
              />
            ))}
            {provided.placeholder}
          </ListContent>
        )}
      </Droppable>

      <AddCard onAdd={(title) => onAddCard(list.id, title)} />
    </ListContainer>
  );
}

export default List; 