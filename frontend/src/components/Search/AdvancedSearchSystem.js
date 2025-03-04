import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  InputBase,
  IconButton,
  Chip,
  Popover,
  Typography,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Stack,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import CloseIcon from '@mui/icons-material/Close';
import { DateRangePicker } from '@mui/x-date-pickers-pro';
import { motion, AnimatePresence } from 'framer-motion';

const SearchContainer = styled(Paper)(({ theme }) => ({
  padding: '2px 4px',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  maxWidth: 800,
  borderRadius: 20,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  '&:hover': {
    boxShadow: theme.shadows[4]
  }
}));

const FilterContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  width: 400,
  maxHeight: '80vh',
  overflowY: 'auto'
}));

const FilterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3)
}));

const ResultItem = styled(ListItem)(({ theme }) => ({
  borderRadius: 8,
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));

function AdvancedSearchSystem() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    types: {
      tasks: true,
      comments: true,
      attachments: true,
      boards: true
    },
    priority: [0, 3], // 0: Low, 1: Medium, 2: High, 3: Urgent
    dateRange: [null, null],
    assignees: [],
    labels: [],
    archived: false
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [savedSearches, setSavedSearches] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // محاكاة طلب البحث
      const results = await searchAPI(searchQuery, filters);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSaveSearch = () => {
    const newSavedSearch = {
      id: Date.now(),
      query: searchQuery,
      filters: { ...filters },
      createdAt: new Date().toISOString()
    };
    setSavedSearches(prev => [newSavedSearch, ...prev]);
  };

  const handleLoadSavedSearch = (savedSearch) => {
    setSearchQuery(savedSearch.query);
    setFilters(savedSearch.filters);
    handleSearch();
  };

  const priorityLabels = ['منخفضة', 'متوسطة', 'عالية', 'عاجلة'];

  return (
    <Box>
      <SearchContainer>
        <IconButton onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="ابحث في المهام، التعليقات، المرفقات..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <TuneIcon />
        </IconButton>
        <IconButton onClick={handleSaveSearch}>
          <SavedSearchIcon />
        </IconButton>
      </SearchContainer>

      <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
        {Object.entries(filters.types)
          .filter(([_, value]) => value)
          .map(([type]) => (
            <Chip
              key={type}
              label={type === 'tasks' ? 'المهام' : 
                     type === 'comments' ? 'التعليقات' :
                     type === 'attachments' ? 'المرفقات' : 'اللوحات'}
              onDelete={() => handleFilterChange('types', {
                ...filters.types,
                [type]: false
              })}
            />
          ))}
        {filters.dateRange[0] && (
          <Chip
            label={`من ${new Date(filters.dateRange[0]).toLocaleDateString('ar-SA')}`}
            onDelete={() => handleFilterChange('dateRange', [null, filters.dateRange[1]])}
          />
        )}
        {filters.dateRange[1] && (
          <Chip
            label={`إلى ${new Date(filters.dateRange[1]).toLocaleDateString('ar-SA')}`}
            onDelete={() => handleFilterChange('dateRange', [filters.dateRange[0], null])}
          />
        )}
      </Box>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <FilterContainer>
          <FilterSection>
            <Typography variant="h6" gutterBottom>
              نوع العنصر
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.types.tasks}
                    onChange={(e) => handleFilterChange('types', {
                      ...filters.types,
                      tasks: e.target.checked
                    })}
                  />
                }
                label="المهام"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.types.comments}
                    onChange={(e) => handleFilterChange('types', {
                      ...filters.types,
                      comments: e.target.checked
                    })}
                  />
                }
                label="التعليقات"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.types.attachments}
                    onChange={(e) => handleFilterChange('types', {
                      ...filters.types,
                      attachments: e.target.checked
                    })}
                  />
                }
                label="المرفقات"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.types.boards}
                    onChange={(e) => handleFilterChange('types', {
                      ...filters.types,
                      boards: e.target.checked
                    })}
                  />
                }
                label="اللوحات"
              />
            </FormGroup>
          </FilterSection>

          <Divider />

          <FilterSection>
            <Typography variant="h6" gutterBottom>
              الأولوية
            </Typography>
            <Slider
              value={filters.priority}
              onChange={(_, value) => handleFilterChange('priority', value)}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => priorityLabels[value]}
              marks={priorityLabels.map((label, index) => ({
                value: index,
                label
              }))}
              min={0}
              max={3}
              step={1}
            />
          </FilterSection>

          <Divider />

          <FilterSection>
            <Typography variant="h6" gutterBottom>
              النطاق الزمني
            </Typography>
            <DateRangePicker
              value={filters.dateRange}
              onChange={(newValue) => handleFilterChange('dateRange', newValue)}
              localeText={{ start: 'من', end: 'إلى' }}
            />
          </FilterSection>
        </FilterContainer>
      </Popover>

      <Box mt={4}>
        <AnimatePresence>
          {searchResults.map((result) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <ResultItem>
                <ListItemAvatar>
                  <Avatar src={result.avatar}>
                    {result.type === 'task' && <AssignmentIcon />}
                    {result.type === 'comment' && <CommentIcon />}
                    {result.type === 'attachment' && <AttachFileIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={result.title}
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {result.description}
                      <br />
                      {new Date(result.createdAt).toLocaleDateString('ar-SA')}
                    </Typography>
                  }
                />
              </ResultItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
    </Box>
  );
}

export default AdvancedSearchSystem; 