'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { isLoggedIn, getUserInfo, UserInfo } from '@/util/auth';

interface AuthContextType {
  loggedIn: boolean;
  userInfo: UserInfo | null;
  updateAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const updateAuth = async () => {
    const loggedInStatus = await isLoggedIn();
    setLoggedIn(loggedInStatus);

    if (loggedInStatus) {
      const userInfoData = await getUserInfo();
      setUserInfo(userInfoData);
    } else {
      setUserInfo(null);
    }
  };

  useEffect(() => {
    updateAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, userInfo, updateAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
