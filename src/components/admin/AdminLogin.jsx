import React, { useState } from 'react';
import { ShieldCheck, Key, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBackHandler } from '../../hooks/useBackHandler';

export const AdminLogin = ({ onClose }) => {
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { loginAdmin } = useAuth();

  useBackHandler(true, onClose);

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = loginAdmin(pin);
    if (!result.success) {
      setErrorMessage(result.message);
    } else {
      setErrorMessage('');
    }
  };

  const handleQuickDemoAccess = () => {
    loginAdmin('1234');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#F0E2DC] rounded-3xl p-8 shadow-xl space-y-6 relative overflow-hidden text-[#3D2B2E]">
        
        {/* Back button */}
        <button
          onClick={onClose}
          className="text-xs text-[#7A6266] hover:text-[#3D2B2E] flex items-center gap-1 transition-colors font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a la Tienda
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E8A5AC] to-[#C8747D] flex items-center justify-center mx-auto shadow-md shadow-[#D88A92]/20 text-white">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#3D2B2E] tracking-tight">
            Panel del Emprendedor
          </h2>
          <p className="text-xs text-[#7A6266]">
            Ingresa tu clave de administración para gestionar productos y stock
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-[#5C4246] uppercase tracking-wider block mb-1.5">
              Contraseña de Administradora (Rocío Smith):
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A88C90]" />
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Ingresa tu contraseña admin"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FDF6F0] border border-[#E8D5CD] text-[#3D2B2E] font-mono text-sm placeholder-[#A88C90] focus:outline-none focus:border-[#C8747D]"
              />
            </div>
            <p className="text-[11px] text-[#8C7276] mt-1">
              * Administradora: <strong className="text-[#C8747D]">rociosmithja@gmail.com</strong>
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#D88A92] to-[#C8747D] hover:from-[#C8747D] hover:to-[#B85B65] text-white font-bold text-xs shadow-md shadow-[#D88A92]/20 transition-all hover:scale-[1.02]"
          >
            Ingresar al Panel Admin
          </button>
        </form>

        {/* Demo Fast Entry */}
        <div className="pt-4 border-t border-[#F0E2DC] text-center">
          <button
            onClick={handleQuickDemoAccess}
            className="w-full py-2.5 px-4 rounded-2xl bg-[#FAF0EA] hover:bg-[#F3E2DA] text-[#4A3538] text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-[#E8D5CD]"
          >
            <Lock className="w-3.5 h-3.5 text-[#2D6A3B]" />
            Acceso Rápido de Prueba (Demo 1-Clic)
          </button>
        </div>

      </div>
    </div>
  );
};
