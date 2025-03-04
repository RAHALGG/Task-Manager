import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import ProjectPage from './pages/Projects/ProjectPage';
import PrivateRoute from './components/PrivateRoute';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import './styles/App.css';

// إنشاء الثيم
const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#1976d2'
    },
    background: {
      default: '#f5f5f5'
    }
  }
});

// مكون خاص للمسارات المحمية
const PrivateRouteComponent = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <div className="app">
            <Navbar />
            <div className="main-container">
              <Sidebar />
              <main className="content">
                <Routes>
                  {/* المسارات العامة */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/project/:id" element={<ProjectPage />} />
                  <Route path="/not-found" element={<NotFound />} />
                  
                  {/* المسارات المحمية */}
                  <Route path="/dashboard" element={
                    <PrivateRouteComponent>
                      <Dashboard />
                    </PrivateRouteComponent>
                  } />
                  <Route path="/projects" element={
                    <PrivateRouteComponent>
                      <Projects />
                    </PrivateRouteComponent>
                  } />
                  <Route path="/tasks" element={
                    <PrivateRoute>
                      <Tasks />
                    </PrivateRoute>
                  } />
                  
                  {/* التوجيه الافتراضي */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 