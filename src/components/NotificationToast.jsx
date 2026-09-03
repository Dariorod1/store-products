import React from 'react';
import { ShoppingBag, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const NotificationToast = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slideUp">
      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
        <CheckCircle className="w-5 h-5" />
      </div>
      <span className="text-xs font-semibold">{toastMessage}</span>
    </div>
  );
};
