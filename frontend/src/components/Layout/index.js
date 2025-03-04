import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <CssBaseline />
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8, // إضافة هامش علوي لتجنب تداخل المحتوى مع Navbar
          width: { sm: `calc(100% - 240px)` }
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 