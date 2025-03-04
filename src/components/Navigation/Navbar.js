import { Search as SearchIcon } from '@mui/icons-material';
import { TextField, Menu } from '@mui/material';

// استخدم TextField بدلاً من SearchBar
<TextField
  placeholder="بحث..."
  variant="outlined"
  size="small"
  InputProps={{
    startAdornment: <SearchIcon />
  }}
/>

// استخدم Menu بدلاً من QuickActions
<Menu>
  {/* محتوى القائمة */}
</Menu>