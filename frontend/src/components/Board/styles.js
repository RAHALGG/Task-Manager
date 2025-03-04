import { styled } from '@mui/material/styles';

export const BoardContainer = styled('div')({
  display: 'flex',
  overflowX: 'auto',
  padding: '20px',
  minHeight: 'calc(100vh - 64px)',
  backgroundColor: '#f5f5f5'
});

export const ListContainer = styled('div')({
  backgroundColor: '#ebecf0',
  borderRadius: '3px',
  width: '300px',
  marginRight: '10px',
  padding: '8px',
  height: 'fit-content'
});

export const CardContainer = styled('div')({
  backgroundColor: '#fff',
  borderRadius: '3px',
  padding: '8px',
  marginBottom: '8px',
  boxShadow: '0 1px 0 rgba(9,30,66,.25)'
}); 