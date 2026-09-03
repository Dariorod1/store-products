import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('store_admin_auth') === 'true';
  });

  const [adminUser, setAdminUser] = useState(null);

  const loginAdmin = (passwordOrPin) => {
    // Allows PIN '1234' or password 'admin' by default
    if (passwordOrPin === '1234' || passwordOrPin === 'admin' || passwordOrPin === 'admin123') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('store_admin_auth', 'true');
      setAdminUser({ name: 'Emprendedor Admin', role: 'owner' });
      return { success: true };
    }
    return { success: false, message: 'Contraseña o PIN incorrecto (Prueba con "1234" o "admin")' };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('store_admin_auth');
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAdminLoggedIn,
        adminUser,
        loginAdmin,
        logoutAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
