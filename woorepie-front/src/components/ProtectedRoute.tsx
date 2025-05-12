// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default ProtectedRoute;