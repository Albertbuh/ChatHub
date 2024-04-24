"use client"

import { ReactNode, createContext, useState } from 'react';

interface AuthStageContextType {
    authStage: string;
    setAuthStage: React.Dispatch<React.SetStateAction<string>>;
  }

  export const AuthStageContext = createContext<AuthStageContextType>({
    authStage: 'login',
    setAuthStage: () => {},
  });

export const AuthStageProvider = ({ children }: { children: ReactNode }) => {
  const [authStage, setAuthStage] = useState('login');

  return (
    <AuthStageContext.Provider value={{ authStage, setAuthStage }}>
      {children}
    </AuthStageContext.Provider>
  );
};
