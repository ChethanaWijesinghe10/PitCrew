import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserTypeContextType {
  userType: string | null;
  setUserType: (type: string | null) => void;
}

const UserTypeContext = createContext<UserTypeContextType | undefined>(undefined);

interface UserTypeProviderProps {
  children: ReactNode;
}

export const UserTypeProvider: React.FC<UserTypeProviderProps> = ({ children }) => {
  const [userType, setUserType] = useState<string | null>(null);

  return (
    <UserTypeContext.Provider value={{ userType, setUserType }}>
      {children}
    </UserTypeContext.Provider>
  );
};

export const useUserType = () => {
  const context = useContext(UserTypeContext);
  if (!context) {
    throw new Error('useUserType must be used within a UserTypeProvider');
  }
  return context;
};
