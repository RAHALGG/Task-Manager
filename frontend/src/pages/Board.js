import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import IntegratedBoard from '../components/Board/IntegratedBoard';

function Board() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [boardData, setBoardData] = useState(null);

  useEffect(() => {
    fetchBoardData();
  }, []);

  const fetchBoardData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/board');
      const data = await response.json();
      setBoardData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{ height: 'calc(100vh - 64px)' }}>
      <IntegratedBoard data={boardData} />
    </Box>
  );
}

export default Board; 