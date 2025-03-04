import React, { useState } from 'react';
import styled from 'styled-components';
import {
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { motion } from 'framer-motion';

const AddColumnButton = styled(Paper)`
    width: 300px;
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f4f5f7;
    margin: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background: #e3e6eb;
    }
`;

function AddColumn({ onAdd }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim()) {
            onAdd({ title: title.trim() });
            setTitle('');
            setOpen(false);
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                <AddColumnButton
                    elevation={0}
                    onClick={() => setOpen(true)}
                >
                    <Button
                        startIcon={<Add />}
                        color="primary"
                    >
                        إضافة قائمة جديدة
                    </Button>
                </AddColumnButton>
            </motion.div>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <form onSubmit={handleSubmit}>
                    <DialogTitle>إضافة قائمة جديدة</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="عنوان القائمة"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>
                            إلغاء
                        </Button>
                        <Button type="submit" variant="contained" color="primary">
                            إضافة
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}

export default AddColumn; 