import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button
} from '@mui/material';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const StatCard = styled(motion(Paper))`
    padding: 20px;
    text-align: center;
    height: 100%;
`;

function AnalyticsDashboard() {
    const [timeRange, setTimeRange] = useState('week');
    const [data, setData] = useState({
        taskCompletion: [],
        teamPerformance: [],
        projectProgress: [],
        timeDistribution: []
    });

    useEffect(() => {
        fetchAnalyticsData();
    }, [timeRange]);

    const fetchAnalyticsData = async () => {
        try {
            const response = await api.get(`/analytics?range=${timeRange}`);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h4">لوحة التحليلات</Typography>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>الفترة الزمنية</InputLabel>
                    <Select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        label="الفترة الزمنية"
                    >
                        <MenuItem value="week">أسبوع</MenuItem>
                        <MenuItem value="month">شهر</MenuItem>
                        <MenuItem value="quarter">ربع سنوي</MenuItem>
                        <MenuItem value="year">سنة</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={3}>
                {/* إحصائيات سريعة */}
                <Grid item xs={12} md={3}>
                    <StatCard elevation={2}>
                        <Typography variant="h6">معدل إنجاز المهام</Typography>
                        <Typography variant="h3" color="primary">
                            85%
                        </Typography>
                    </StatCard>
                </Grid>
                {/* ... المزيد من الإحصائيات */}

                {/* رسم بياني للمهام المكتملة */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6" gutterBottom>
                            تقدم المهام عبر الزمن
                        </Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <LineChart data={data.taskCompletion}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="completed" 
                                    stroke="#8884d8" 
                                    name="المهام المكتملة"
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="total" 
                                    stroke="#82ca9d" 
                                    name="إجمالي المهام"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* توزيع الوقت */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6" gutterBottom>
                            توزيع الوقت حسب الحالة
                        </Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <PieChart>
                                <Pie
                                    data={data.timeDistribution}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    label
                                />
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* أداء الفريق */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            أداء أعضاء الفريق
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.teamPerformance}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="completed" fill="#8884d8" name="المهام المكتملة" />
                                <Bar dataKey="inProgress" fill="#82ca9d" name="قيد التنفيذ" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default AnalyticsDashboard; 