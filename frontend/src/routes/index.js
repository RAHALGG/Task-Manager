import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MainLayout from '../components/Layout/MainLayout';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Dashboard from '../pages/Dashboard';
import ProjectsDashboard from '../pages/Projects/ProjectsDashboard';
import ProjectDetails from '../pages/Projects/ProjectDetails';
import TeamDashboard from '../pages/TeamManagement/TeamDashboard';
import UserProfile from '../pages/Profile/UserProfile';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';
import Layout from '../components/Layout';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Replace with proper loading component
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <MainLayout>{children}</MainLayout>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectsDashboard />} />
        <Route path="/projects/:id/*" element={<ProjectDetails />} />
        <Route path="/team" element={<PrivateRoute><TeamDashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; 