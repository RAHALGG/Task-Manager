import React from 'react';
import { 
    Grid, 
    Paper, 
    Box,
    Typography,
    LinearProgress,
    Card,
    CardContent
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, color, icon: Icon }) => (
    <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
    >
        <Card>
            <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                        <Typography color="textSecondary" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h4" component="div">
                            {value}
                        </Typography>
                    </Box>
                    <Icon style={{ fontSize: 40, color }} />
                </Box>
                <LinearProgress 
                    variant="determinate" 
                    value={70} 
                    sx={{ 
                        mt: 2,
                        backgroundColor: `${color}22`,
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: color
                        }
                    }} 
                />
            </CardContent>
        </Card>
    </motion.div>
);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function Dashboard() {
    const taskData = [
        { name: 'المهام الجديدة', value: 20 },
        { name: 'قيد التنفيذ', value: 15 },
        { name: 'قيد المراجعة', value: 8 },
        { name: 'مكتمل', value: 30 }
    ];

    const teamPerformance = [
        { name: 'أحمد', tasks: 12, completed: 10 },
        { name: 'محمد', tasks: 15, completed: 13 },
        { name: 'سارة', tasks: 8, completed: 8 },
        { name: 'ليلى', tasks: 10, completed: 7 }
    ];

    return (
        <Box p={3}>
            <Grid container spacing={3}>
                {/* إحصائيات سريعة */}
                <Grid item xs={12} md={3}>
                    <StatsCard 
                        title="إجمالي المهام"
                        value="73"
                        color="#2196f3"
                        icon={AssignmentIcon}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatsCard 
                        title="المهام المكتملة"
                        value="30"
                        color="#4caf50"
                        icon={CheckCircleIcon}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatsCard 
                        title="المهام المتأخرة"
                        value="5"
                        color="#f44336"
                        icon={WarningIcon}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatsCard 
                        title="أعضاء الفريق"
                        value="8"
                        color="#9c27b0"
                        icon={GroupIcon}
                    />
                </Grid>

                {/* رسم بياني للمهام */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6" gutterBottom>
                            أداء الفريق
                        </Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={teamPerformance}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="tasks" fill="#8884d8" name="المهام" />
                                <Bar dataKey="completed" fill="#82ca9d" name="المكتملة" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* رسم دائري لتوزيع المهام */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6" gutterBottom>
                            توزيع المهام
                        </Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <PieChart>
                                <Pie
                                    data={taskData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => 
                                        `${name} ${(percent * 100).toFixed(0)}%`
                                    }
                                >
                                    {taskData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={COLORS[index % COLORS.length]} 
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Dashboard; 