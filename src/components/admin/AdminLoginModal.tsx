import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Lock, Unlock, Terminal, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { loginAdmin, setActiveView } = useStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isOk = loginAdmin(password);
    if (isOk) {
      setSuccess(true);
      setError(false);
      setTimeout(() => {
        setSuccess(false);
        setPassword('');
        onClose();
        setActiveView('admin');
      }, 700);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-[#121218] border-2 border-[#ff003c] neon-glow p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#ff003c]/40">
          <div className="flex items-center gap-2 font-mono text-xs text-[#ff003c] uppercase tracking-widest">
            <Terminal className="w-4 h-4 animate-pulse" />
            <span>// SECURITY ACCESS TERMINAL //</span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-[#1a141a] border border-[#ff003c] mx-auto flex items-center justify-center mb-4 neon-glow">
            {success ? (
              <Unlock className="w-7 h-7 text-green-400 animate-bounce" />
            ) : (
              <Lock className="w-7 h-7 text-[#ff003c]" />
            )}
          </div>
          <h3 className="text-xl font-bold font-display text-white uppercase tracking-wider">
            AUTENTICAÇÃO DO ADMINISTRADOR
          </h3>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Insira a senha de comando para gerenciar produtos, termos e configurações.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-xs text-[#ff003c] uppercase mb-1.5">
              PASSCODE DE ACESSO
            </label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha (padrão: admin)..."
              autoFocus
              className="w-full px-4 py-3 bg-[#0b0b0b] border border-[#ff003c]/50 focus:border-[#ff003c] text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#ff003c]"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-950/60 border border-red-500 text-red-300 font-mono text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>Acesso Negado! Senha incorreta. Tente novamente.</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-950/60 border border-green-500 text-green-300 font-mono text-xs">
              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span>Acesso Concedido! Carregando Painel Admin...</span>
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-[#191922] border border-gray-700 hover:border-gray-500 text-gray-300 font-mono text-xs uppercase"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 btn-cyber py-3 px-4 text-xs"
            >
              AUTENTICAR
            </button>
          </div>

          <div className="text-center pt-2">
            <span className="text-[11px] font-mono text-gray-500">
              Dica: A senha padrão de teste é <strong className="text-[#ff003c]">admin</strong>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
