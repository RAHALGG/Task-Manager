import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  CardContent,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Tooltip,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ViewKanban as ViewKanbanIcon,
  ViewList as ViewListIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTeam } from '../../contexts/TeamContext';
import { useRole } from '../../contexts/RoleContext';
import { PERMISSIONS } from '../../config/roles';
import { StyledProjectCard } from '../../components/Projects/StyledComponents';
import ProjectForm from '../../components/Projects/ProjectForm';
import KanbanView from '../../components/Projects/KanbanView';
import ListView from '../../components/Projects/ListView';
import TimelineView from '../../components/Projects/TimelineView';

const VIEW_TYPES = {
  KANBAN: 'kanban',
  LIST: 'list',
  TIMELINE: 'timeline'
};

const ProjectsDashboard = () => {
  const navigate = useNavigate();
  const { currentTeam, teamMembers } = useTeam();
  const { hasPermission } = useRole();
  const [projects, setProjects] = useState([]);
  const [viewType, setViewType] = useState(VIEW_TYPES.KANBAN);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    assignee: 'all'
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'IN_PROGRESS').length,
    completed: projects.filter(p => p.status === 'COMPLETED').length,
    overdue: projects.filter(p => new Date(p.dueDate) < new Date()).length
  };

  const handleCreateProject = (projectData) => {
    setProjects([...projects, { ...projectData, id: Date.now() }]);
    setCreateDialogOpen(false);
  };

  const handleViewChange = (view) => {
    setViewType(view);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setAnchorEl(null);
  };

  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filters.status === 'all' || project.status === filters.status;
      const matchesPriority = filters.priority === 'all' || project.priority === filters.priority;
      const matchesAssignee = filters.assignee === 'all' || project.assignees.includes(filters.assignee);
      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          return b.priority - a.priority;
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          مشاريع {currentTeam?.name}
        </Typography>
        {hasPermission(PERMISSIONS.CREATE_PROJECT) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            مشروع جديد
          </Button>
        )}
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StyledProjectCard status="default">
            <CardContent>
              <Typography variant="h6">إجمالي المشاريع</Typography>
              <Typography variant="h3">{stats.total}</Typography>
            </CardContent>
          </StyledProjectCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledProjectCard status="IN_PROGRESS">
            <CardContent>
              <Typography variant="h6">قيد التنفيذ</Typography>
              <Typography variant="h3">{stats.inProgress}</Typography>
            </CardContent>
          </StyledProjectCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledProjectCard status="COMPLETED">
            <CardContent>
              <Typography variant="h6">مكتملة</Typography>
              <Typography variant="h3">{stats.completed}</Typography>
            </CardContent>
          </StyledProjectCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledProjectCard status="OVERDUE">
            <CardContent>
              <Typography variant="h6">متأخرة</Typography>
              <Typography variant="h3">{stats.overdue}</Typography>
            </CardContent>
          </StyledProjectCard>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="بحث عن مشروع..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <FilterListIcon />
        </IconButton>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="عرض كانبان">
            <IconButton 
              color={viewType === VIEW_TYPES.KANBAN ? 'primary' : 'default'}
              onClick={() => handleViewChange(VIEW_TYPES.KANBAN)}
            >
              <ViewKanbanIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="عرض قائمة">
            <IconButton
              color={viewType === VIEW_TYPES.LIST ? 'primary' : 'default'}
              onClick={() => handleViewChange(VIEW_TYPES.LIST)}
            >
              <ViewListIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="عرض زمني">
            <IconButton
              color={viewType === VIEW_TYPES.TIMELINE ? 'primary' : 'default'}
              onClick={() => handleViewChange(VIEW_TYPES.TIMELINE)}
            >
              <TimelineIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {viewType === VIEW_TYPES.KANBAN && (
        <KanbanView projects={filteredProjects} onProjectUpdate={(updatedProject) => {
          // تحديث المشروع
        }} />
      )}

      {viewType === VIEW_TYPES.LIST && (
        <ListView projects={filteredProjects} onProjectUpdate={(updatedProject) => {
          // تحديث المشروع
        }} />
      )}

      {viewType === VIEW_TYPES.TIMELINE && (
        <TimelineView projects={filteredProjects} />
      )}

      <Dialog 
        open={isCreateDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>مشروع جديد</DialogTitle>
        <DialogContent>
          <ProjectForm onSubmit={handleCreateProject} teamMembers={teamMembers} />
        </DialogContent>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleSortChange('name')}>ترتيب حسب الاسم</MenuItem>
        <MenuItem onClick={() => handleSortChange('dueDate')}>ترتيب حسب تاريخ الاستحقاق</MenuItem>
        <MenuItem onClick={() => handleSortChange('priority')}>ترتيب حسب الأولوية</MenuItem>
      </Menu>
    </Box>
  );
};

export default ProjectsDashboard; 