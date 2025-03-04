import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>جاري التحميل...</div>; // يمكنك إضافة مكون تحميل هنا
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute; 