import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  LinearProgress,
  Grid,
  Menu,
  MenuItem,
  Dialog,
  Button,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import { motion, AnimatePresence } from 'framer-motion';

const DropZone = styled(Paper)(({ theme, isDragging }) => ({
  padding: theme.spacing(3),
  border: `2px dashed ${isDragging ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: 12,
  backgroundColor: isDragging ? theme.palette.action.hover : theme.palette.background.paper,
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
}));

const FilePreview = styled(Paper)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(2),
  borderRadius: 8,
  height: '100%',
  '&:hover': {
    boxShadow: theme.shadows[4]
  }
}));

const PreviewImage = styled('img')({
  width: '100%',
  height: 150,
  objectFit: 'cover',
  borderRadius: 4
});

const FileIcon = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 150,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[100],
  borderRadius: 4,
  '& svg': {
    fontSize: 64,
    color: theme.palette.grey[500]
  }
}));

function AttachmentSystem() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      id: `file-${Date.now()}-${file.name}`,
      file,
      name: file.name,
      type: file.type,
      size: file.size,
      progress: 0,
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(file)
    }));

    setFiles(prev => [...prev, ...newFiles]);
    newFiles.forEach(fileData => uploadFile(fileData));
  }, []);

  const uploadFile = async (fileData) => {
    setUploading(prev => ({ ...prev, [fileData.id]: true }));
    
    // محاكاة التحميل
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setFiles(prev => 
        prev.map(f => 
          f.id === fileData.id ? { ...f, progress } : f
        )
      );
    }

    setUploading(prev => ({ ...prev, [fileData.id]: false }));
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setPreviewOpen(true);
  };

  const handleMenuOpen = (event, file) => {
    setSelectedFile(file);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFile(null);
  };

  const handleDelete = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    handleMenuClose();
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <ImageIcon />;
    if (type === 'application/pdf') return <PictureAsPdfIcon />;
    return <InsertDriveFileIcon />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      <DropZone
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          اسحب وأفلت الملفات هنا
        </Typography>
        <Typography variant="body2" color="text.secondary">
          أو انقر لاختيار الملفات
        </Typography>
      </DropZone>

      <Box mt={4}>
        <Grid container spacing={2}>
          <AnimatePresence>
            {files.map((file) => (
              <Grid item xs={12} sm={6} md={4} key={file.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <FilePreview>
                    <Box onClick={() => handleFileClick(file)} sx={{ cursor: 'pointer' }}>
                      {file.type.startsWith('image/') ? (
                        <PreviewImage src={file.url} alt={file.name} />
                      ) : (
                        <FileIcon>{getFileIcon(file.type)}</FileIcon>
                      )}
                    </Box>

                    <Box mt={2}>
                      <Typography variant="subtitle2" noWrap>
                        {file.name}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                        <Chip
                          size="small"
                          label={formatFileSize(file.size)}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(file.uploadedAt).toLocaleDateString('ar-SA')}
                        </Typography>
                      </Box>
                    </Box>

                    {uploading[file.id] && (
                      <Box mt={1}>
                        <LinearProgress variant="determinate" value={file.progress} />
                      </Box>
                    )}

                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={(e) => handleMenuOpen(e, file)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </FilePreview>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          window.open(selectedFile?.url);
          handleMenuClose();
        }}>
          <DownloadIcon sx={{ mr: 1 }} /> تحميل
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ShareIcon sx={{ mr: 1 }} /> مشاركة
        </MenuItem>
        <MenuItem onClick={() => handleDelete(selectedFile?.id)}>
          <DeleteIcon sx={{ mr: 1 }} /> حذف
        </MenuItem>
      </Menu>

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedFile?.type.startsWith('image/') ? (
          <img
            src={selectedFile?.url}
            alt={selectedFile?.name}
            style={{ width: '100%', height: 'auto' }}
          />
        ) : (
          <Box p={3} textAlign="center">
            <Typography variant="h6">
              لا يمكن معاينة هذا النوع من الملفات
            </Typography>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => window.open(selectedFile?.url)}
              sx={{ mt: 2 }}
            >
              تحميل الملف
            </Button>
          </Box>
        )}
      </Dialog>
    </Box>
  );
}

export default AttachmentSystem; 