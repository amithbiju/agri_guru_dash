import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import FarmerDashboard from './components/FarmerDashboard';
import AdminDashboard from './components/AdminDashboard';

const AppContent: React.FC = () => {
  const { farmer, isAdmin } = useAuth();

  if (isAdmin) {
    return <AdminDashboard />;
  }

  if (farmer) {
    return <FarmerDashboard />;
  }

  return <Login />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;