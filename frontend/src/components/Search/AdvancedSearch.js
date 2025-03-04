import React, { useState } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Popover,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import TuneIcon from '@mui/icons-material/Tune';
import AddProjectButton from './AddProjectButton';
import ProjectList from './ProjectList';

function AdvancedSearch() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [filters, setFilters] = useState({
    tasks: true,
    projects: true,
    comments: false,
    archived: false
  });
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (name) => (event) => {
    setFilters({
      ...filters,
      [name]: event.target.checked
    });
  };

  const handleSearch = () => {
    // تنفيذ البحث مع المرشحات
    const searchParams = {
      query: searchQuery,
      filters: Object.entries(filters)
        .filter(([_, value]) => value)
        .map(([key]) => key)
    };
    console.log('Searching with params:', searchParams);
  };

  return (
    <Paper
      component="form"
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
        m: 2
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="بحث متقدم..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      <IconButton onClick={handleFilterClick}>
        <TuneIcon />
      </IconButton>
      
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      
      <IconButton onClick={handleSearch}>
        <SearchIcon />
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Paper sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="subtitle1" gutterBottom>
            خيارات البحث
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.tasks}
                  onChange={handleFilterChange('tasks')}
                />
              }
              label="المهام"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.projects}
                  onChange={handleFilterChange('projects')}
                />
              }
              label="المشاريع"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.comments}
                  onChange={handleFilterChange('comments')}
                />
              }
              label="التعليقات"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.archived}
                  onChange={handleFilterChange('archived')}
                />
              }
              label="المؤرشفة"
            />
          </FormGroup>
        </Paper>
      </Popover>
    </Paper>
  );
}

export default AdvancedSearch; 