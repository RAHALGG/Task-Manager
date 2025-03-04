import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import {
    FileDownload,
    Print,
    Email,
    PictureAsPdf
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { motion } from 'framer-motion';
import api from '../../utils/api';

function ReportGenerator() {
    const [reportType, setReportType] = useState('task');
    const [dateRange, setDateRange] = useState([null, null]);
    const [filters, setFilters] = useState({
        users: [],
        status: [],
        priority: []
    });
    const [reportData, setReportData] = useState(null);

    const generateReport = async () => {
        try {
            const response = await api.post('/reports/generate', {
                type: reportType,
                startDate: dateRange[0],
                endDate: dateRange[1],
                filters
            });
            setReportData(response.data);
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };

    const exportReport = (format) => {
        // تصدير التقرير بالتنسيق المطلوب
        window.open(`/api/reports/export?format=${format}&data=${JSON.stringify(reportData)}`);
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                إنشاء التقارير
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            إعدادات التقرير
                        </Typography>
                        
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>نوع التقرير</InputLabel>
                            <Select
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                            >
                                <MenuItem value="task">تقرير المهام</MenuItem>
                                <MenuItem value="user">تقرير المستخدمين</MenuItem>
                                <MenuItem value="performance">تقرير الأداء</MenuItem>
                                <MenuItem value="timeline">تقرير الجدول الزمني</MenuItem>
                            </Select>
                        </FormControl>

                        <DatePicker
                            label="من تاريخ"
                            value={dateRange[0]}
                            onChange={(date) => setDateRange([date, dateRange[1]])}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />

                        <Box sx={{ mt: 2 }}>
                            <DatePicker
                                label="إلى تاريخ"
                                value={dateRange[1]}
                                onChange={(date) => setDateRange([dateRange[0], date])}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                الفلاتر
                            </Typography>
                            {/* فلاتر إضافية حسب نوع التقرير */}
                        </Box>

                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={generateReport}
                        >
                            إنشاء التقرير
                        </Button>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    {reportData && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Paper sx={{ p: 2 }}>
                                <Box display="flex" justifyContent="space-between" mb={2}>
                                    <Typography variant="h6">
                                        نتائج التقرير
                                    </Typography>
                                    <Box>
                                        <Button
                                            startIcon={<PictureAsPdf />}
                                            onClick={() => exportReport('pdf')}
                                        >
                                            PDF
                                        </Button>
                                        <Button
                                            startIcon={<FileDownload />}
                                            onClick={() => exportReport('excel')}
                                        >
                                            Excel
                                        </Button>
                                        <Button
                                            startIcon={<Print />}
                                            onClick={() => window.print()}
                                        >
                                            طباعة
                                        </Button>
                                        <Button
                                            startIcon={<Email />}
                                            onClick={() => {/* إرسال بالبريد */}}
                                        >
                                            إرسال
                                        </Button>
                                    </Box>
                                </Box>

                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                {/* رؤوس الجدول حسب نوع التقرير */}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {/* بيانات التقرير */}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </motion.div>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}

export default ReportGenerator; 