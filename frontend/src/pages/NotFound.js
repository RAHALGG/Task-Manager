import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundContainer = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default
}));

const ContentWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: 'center',
  maxWidth: 400,
  borderRadius: theme.shape.borderRadius * 2,
  background: `linear-gradient(45deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
  boxShadow: theme.shadows[3]
}));

const ErrorIcon = styled(ErrorOutlineIcon)(({ theme }) => ({
  fontSize: 100,
  color: theme.palette.error.main,
  marginBottom: theme.spacing(2)
}));

function NotFound() {
  const navigate = useNavigate();

  return (
    <NotFoundContainer>
      <ContentWrapper elevation={3}>
        <ErrorIcon />
        <Typography variant="h3" gutterBottom fontWeight="bold">
          404
        </Typography>
        <Typography variant="h5" gutterBottom color="text.secondary">
          الصفحة غير موجودة
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          العودة للرئيسية
        </Button>
      </ContentWrapper>
    </NotFoundContainer>
  );
}

export default NotFound; 