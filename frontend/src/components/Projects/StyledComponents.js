import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledProjectCard = styled(Card)(({ theme, status }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
  borderLeft: `4px solid ${
    status === 'COMPLETED' ? theme.palette.success.main :
    status === 'IN_PROGRESS' ? theme.palette.primary.main :
    status === 'ON_HOLD' ? theme.palette.warning.main :
    theme.palette.error.main
  }`
})); 