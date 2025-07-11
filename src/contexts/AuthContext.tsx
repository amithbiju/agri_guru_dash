import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FarmerProfile } from '../types';

interface AuthContextType {
  farmer: FarmerProfile | null;
  isAdmin: boolean;
  login: (farmer: FarmerProfile) => void;
  loginAsAdmin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [farmer, setFarmer] = useState<FarmerProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check localStorage for saved session
    const savedFarmer = localStorage.getItem('farmer');
    const savedAdmin = localStorage.getItem('isAdmin');
    
    if (savedFarmer) {
      setFarmer(JSON.parse(savedFarmer));
    }
    
    if (savedAdmin === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const login = (farmerProfile: FarmerProfile) => {
    setFarmer(farmerProfile);
    setIsAdmin(false);
    localStorage.setItem('farmer', JSON.stringify(farmerProfile));
    localStorage.removeItem('isAdmin');
  };

  const loginAsAdmin = () => {
    setIsAdmin(true);
    setFarmer(null);
    localStorage.setItem('isAdmin', 'true');
    localStorage.removeItem('farmer');
  };

  const logout = () => {
    setFarmer(null);
    setIsAdmin(false);
    localStorage.removeItem('farmer');
    localStorage.removeItem('isAdmin');
  };

  return (
    <AuthContext.Provider value={{ farmer, isAdmin, login, loginAsAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};