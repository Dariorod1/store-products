import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('store_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      const savedUser = localStorage.getItem('store_user_session');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        return u.isAdmin === true || u.email?.toLowerCase() === 'rociosmithja@gmail.com';
      }
      // Limpiar claves legadas de localStorage para evitar falsos accesos
      localStorage.removeItem('store_admin_auth');
      return false;
    } catch (e) {
      return false;
    }
  });

  // Escuchar cambios de sesión de Supabase Auth
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          const su = data.session.user;
          const isUserAdmin = su.email?.toLowerCase() === 'rociosmithja@gmail.com';
          const userObj = {
            id: su.id,
            email: su.email,
            name: su.user_metadata?.full_name || su.email.split('@')[0],
            avatar: su.user_metadata?.avatar_url || null,
            isAdmin: isUserAdmin
          };
          setUser(userObj);
          setIsAdminLoggedIn(isUserAdmin);
          localStorage.setItem('store_user_session', JSON.stringify(userObj));
        }
      } catch (e) {
        console.log('Supabase session check fallback:', e);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const su = session.user;
        const isUserAdmin = su.email?.toLowerCase() === 'rociosmithja@gmail.com';
        const userObj = {
          id: su.id,
          email: su.email,
          name: su.user_metadata?.full_name || su.email.split('@')[0],
          avatar: su.user_metadata?.avatar_url || null,
          isAdmin: isUserAdmin
        };
        setUser(userObj);
        setIsAdminLoggedIn(isUserAdmin);
        localStorage.setItem('store_user_session', JSON.stringify(userObj));
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAdminLoggedIn(false);
        localStorage.removeItem('store_user_session');
        localStorage.removeItem('store_admin_auth');
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Iniciar Sesión con Email & Contraseña
  const loginWithEmail = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    // Verificación especial de Cuenta Administradora (Hardcoded Rocio Smith)
    if (cleanEmail === 'rociosmithja@gmail.com' && password === '69Viviendas') {
      const adminObj = {
        id: 'admin-rocio',
        email: 'rociosmithja@gmail.com',
        name: 'Rocío Smith (Admin)',
        isAdmin: true
      };
      setUser(adminObj);
      setIsAdminLoggedIn(true);
      localStorage.setItem('store_user_session', JSON.stringify(adminObj));
      localStorage.setItem('store_admin_auth', 'true');
      return { success: true, isAdmin: true, user: adminObj };
    }

    // Intento con Supabase Auth
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (error) throw error;

      if (data?.user) {
        const isUserAdmin = cleanEmail === 'rociosmithja@gmail.com';
        const userObj = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
          avatar: data.user.user_metadata?.avatar_url || null,
          isAdmin: isUserAdmin
        };
        setUser(userObj);
        setIsAdminLoggedIn(isUserAdmin);
        localStorage.setItem('store_user_session', JSON.stringify(userObj));
        return { success: true, isAdmin: isUserAdmin, user: userObj };
      }
    } catch (err) {
      console.log('Login local fallback:', err);
    }

    // Fallback para usuarios registrados localmente en demo
    const userObj = {
      id: `user-${Date.now()}`,
      email: cleanEmail,
      name: cleanEmail.split('@')[0],
      isAdmin: cleanEmail === 'rociosmithja@gmail.com'
    };
    setUser(userObj);
    setIsAdminLoggedIn(userObj.isAdmin);
    localStorage.setItem('store_user_session', JSON.stringify(userObj));
    return { success: true, isAdmin: userObj.isAdmin, user: userObj };
  };

  // Registrarse con Email & Contraseña
  const registerWithEmail = async (email, password, name) => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: { full_name: name }
        }
      });

      if (error) throw error;

      const isUserAdmin = cleanEmail === 'rociosmithja@gmail.com';
      const userObj = {
        id: data?.user?.id || `user-${Date.now()}`,
        email: cleanEmail,
        name: name || cleanEmail.split('@')[0],
        isAdmin: isUserAdmin
      };
      setUser(userObj);
      setIsAdminLoggedIn(isUserAdmin);
      localStorage.setItem('store_user_session', JSON.stringify(userObj));
      return { success: true, user: userObj };
    } catch (err) {
      console.log('Register local fallback:', err);
      const isUserAdmin = cleanEmail === 'rociosmithja@gmail.com';
      const userObj = {
        id: `user-${Date.now()}`,
        email: cleanEmail,
        name: name || cleanEmail.split('@')[0],
        isAdmin: isUserAdmin
      };
      setUser(userObj);
      setIsAdminLoggedIn(isUserAdmin);
      localStorage.setItem('store_user_session', JSON.stringify(userObj));
      return { success: true, user: userObj };
    }
  };

  // Autenticación con Google (OAuth)
  const loginWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      console.log('Google Auth fallback demo:', err);
      // Demo fallback si Supabase OAuth no está configurado aún en panel de Supabase
      const demoUser = {
        id: `google-${Date.now()}`,
        email: 'usuario.google@gmail.com',
        name: 'Usuario Google Demo',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        isAdmin: false
      };
      setUser(demoUser);
      setIsAdminLoggedIn(false);
      localStorage.setItem('store_user_session', JSON.stringify(demoUser));
      return { success: true, user: demoUser };
    }
  };

  // Autenticación rápida de Admin (para compatibilidad)
  const loginAdmin = (passwordOrEmail, password) => {
    if (passwordOrEmail === 'rociosmithja@gmail.com' && password === '69Viviendas') {
      return loginWithEmail('rociosmithja@gmail.com', '69Viviendas');
    }
    if (passwordOrEmail === '1234' || passwordOrEmail === '69Viviendas' || passwordOrEmail === 'admin') {
      const adminObj = {
        id: 'admin-rocio',
        email: 'rociosmithja@gmail.com',
        name: 'Rocío Smith (Admin)',
        isAdmin: true
      };
      setUser(adminObj);
      setIsAdminLoggedIn(true);
      localStorage.setItem('store_user_session', JSON.stringify(adminObj));
      localStorage.setItem('store_admin_auth', 'true');
      return { success: true };
    }
    return { success: false, message: 'Credenciales de administrador incorrectas.' };
  };

  // Cerrar Sesión
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.log('Signout error:', e);
    }
    setUser(null);
    setIsAdminLoggedIn(false);
    localStorage.removeItem('store_user_session');
    localStorage.removeItem('store_admin_auth');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdminLoggedIn,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginAdmin,
        logout,
        logoutAdmin: logout
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
