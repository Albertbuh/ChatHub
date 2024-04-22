"use client"
import { createContext, useState } from 'react';

interface ExpandContextProps {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ExpandContext = createContext<ExpandContextProps>({
  isExpanded: false,
  setIsExpanded: () => {},
});

interface ExpandContextProviderProps {
  children: React.ReactNode;
}

export const ExpandContextProvider: React.FC<ExpandContextProviderProps> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <ExpandContext.Provider value={{ isExpanded, setIsExpanded }}>
      {children}
    </ExpandContext.Provider>
  );
};
