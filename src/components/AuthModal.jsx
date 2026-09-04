import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBackHandler } from '../hooks/useBackHandler';

export const AuthModal = ({ isOpen, onClose, onOpenAdmin }) => {
  const { user, loginWithEmail, registerWithEmail, loginWithGoogle, logout, isAdminLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useBackHandler(isOpen, onClose);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (activeTab === 'login') {
        const res = await loginWithEmail(formData.email, formData.password);
        if (res.success) {
          if (res.isAdmin) {
            setSuccessMsg('¡Bienvenida Rocío Smith! Acceso de Administradora concedido.');
            setTimeout(() => {
              onClose();
              if (onOpenAdmin) onOpenAdmin();
            }, 1200);
          } else {
            setSuccessMsg('¡Sesión iniciada correctamente!');
            setTimeout(() => onClose(), 1000);
          }
        }
      } else {
        const res = await registerWithEmail(formData.email, formData.password, formData.name);
        if (res.success) {
          setSuccessMsg('¡Cuenta creada e iniciada exitosamente!');
          setTimeout(() => onClose(), 1000);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Ocurrió un error al procesar tu solicitud.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        setSuccessMsg('¡Conectado con Google!');
        setTimeout(() => onClose(), 1000);
      }
    } catch (err) {
      setErrorMsg('No se pudo conectar con Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-[#FFFDF9] border border-[#F0E2DC] rounded-3xl shadow-2xl overflow-hidden text-[#3D2B2E] my-auto animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#FAF0EA] p-5 border-b border-[#F0E2DC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#C8747D] flex items-center justify-center text-white shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#3D2B2E]">
                {user ? 'Mi Cuenta' : activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </h3>
              <p className="text-xs text-[#7A6266]">
                {user ? user.email : 'Ingresá a tu cuenta de Tienda Rooh'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white border border-[#E8D5CD] text-[#7A6266] hover:text-[#3D2B2E] hover:bg-[#F3E2DA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* USER LOGGED IN VIEW */}
          {user ? (
            <div className="space-y-4 text-center py-2">
              <div className="w-16 h-16 rounded-full bg-[#FAF0EA] border-2 border-[#C8747D] flex items-center justify-center text-[#C8747D] mx-auto text-xl font-bold font-serif shadow-xs overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>

              <div>
                <h4 className="font-serif font-bold text-lg text-[#3D2B2E]">{user.name}</h4>
                <p className="text-xs text-[#7A6266] font-mono">{user.email}</p>
                {isAdminLoggedIn && (
                  <span className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EBF5ED] text-[#2D6A3B] border border-[#C2E0C8] text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Administradora de la Tienda
                  </span>
                )}
              </div>

              <div className="pt-4 border-t border-[#F0E2DC] space-y-2">
                {isAdminLoggedIn && (
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenAdmin) onOpenAdmin();
                    }}
                    className="w-full py-3 px-4 rounded-2xl bg-[#2D6A3B] hover:bg-[#23542E] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
                  >
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>Ir al Panel de Administración</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-rose-50 border border-[#E8D5CD] text-rose-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          ) : (
            /* LOGIN / REGISTER FORM */
            <>
              {/* Tab Selector */}
              <div className="flex bg-[#FAF0EA] p-1 rounded-2xl border border-[#F0E2DC]">
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'login'
                      ? 'bg-white text-[#C8747D] shadow-xs'
                      : 'text-[#8C7276] hover:text-[#3D2B2E]'
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'register'
                      ? 'bg-white text-[#C8747D] shadow-xs'
                      : 'text-[#8C7276] hover:text-[#3D2B2E]'
                  }`}
                >
                  Crear Cuenta
                </button>
              </div>

              {/* Error & Success Notifications */}
              {errorMsg && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-2xl bg-[#EBF5ED] border border-[#C2E0C8] text-[#2D6A3B] text-xs flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#2D6A3B] shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* GOOGLE OAUTH BUTTON */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-[#FAF7F5] border border-[#E8D5CD] text-[#3D2B2E] font-bold text-xs flex items-center justify-center gap-2.5 shadow-xs transition-all hover:border-[#C8747D]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{activeTab === 'login' ? 'Iniciar Sesión con Google' : 'Registrarse con Google'}</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-[#F0E2DC] w-full" />
                <span className="bg-[#FFFDF9] px-3 text-[10px] uppercase font-bold text-[#A88C90] shrink-0">
                  o con email
                </span>
              </div>

              {/* EMAIL & PASSWORD FORM */}
              <form onSubmit={handleSubmit} className="space-y-3">
                
                {activeTab === 'register' && (
                  <div>
                    <label className="text-[11px] font-semibold text-[#6E5458] block mb-1">
                      Nombre Completo:
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A88C90]" />
                      <input
                        type="text"
                        required
                        placeholder="Ej: Laura Pérez"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-[#E8D5CD] text-xs text-[#3D2B2E] placeholder-[#A88C90] focus:outline-none focus:border-[#C8747D]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-semibold text-[#6E5458] block mb-1">
                    Correo Electrónico:
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A88C90]" />
                    <input
                      type="email"
                      required
                      placeholder="ejemplo@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-[#E8D5CD] text-xs text-[#3D2B2E] placeholder-[#A88C90] focus:outline-none focus:border-[#C8747D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#6E5458] block mb-1">
                    Contraseña:
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A88C90]" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-[#E8D5CD] text-xs text-[#3D2B2E] placeholder-[#A88C90] focus:outline-none focus:border-[#C8747D]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#C8747D] hover:bg-[#B85B65] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.01] mt-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <span>{activeTab === 'login' ? 'Ingresar a mi Cuenta' : 'Crear mi Cuenta'}</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
