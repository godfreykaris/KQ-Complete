// AuthContext.js
import React, { ReactNode, createContext, useState } from 'react';

interface AuthContextType {
    authenticated: boolean;
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  }

const AuthContext = createContext<AuthContextType>({
    authenticated: false,
    setAuthenticated: () => {},
  });

interface AuthProviderProps {
    children: ReactNode;
  }

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);
  
    return (
      <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
export default AuthContext;