import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { SecurityGuard } from '../../services/SecurityGuard';
import { Unlock, Terminal, X, AlertCircle, CheckCircle2, ShieldAlert, Timer } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper to generate a synthesized cyberpunk error/lockout tone
const playAlarmBeep = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    // Audio synthesis not allowed before interaction or muted
  }
};

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { loginAdmin, setActiveView } = useStore();
  const [password, setPassword] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Acesso Negado! Senha incorreta.');
  const [success, setSuccess] = useState(false);
  
  // Rate limiting / Lockout state
  const [lockout, setLockout] = useState<{ isLocked: boolean; remainingSeconds: number; attempts: number }>({
    isLocked: false,
    remainingSeconds: 0,
    attempts: 0
  });

  useEffect(() => {
    if (isOpen) {
      const currentStatus = SecurityGuard.checkLockoutStatus();
      setLockout(currentStatus);
    }
  }, [isOpen]);

  // Countdown interval when locked out
  useEffect(() => {
    if (!lockout.isLocked || lockout.remainingSeconds <= 0) return;
    const timer = setInterval(() => {
      const st = SecurityGuard.checkLockoutStatus();
      setLockout(st);
    }, 1000);
    return () => clearInterval(timer);
  }, [lockout.isLocked, lockout.remainingSeconds]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if locked
    const currentStatus = SecurityGuard.checkLockoutStatus();
    if (currentStatus.isLocked) {
      playAlarmBeep();
      setLockout(currentStatus);
      return;
    }

    // Check Honeypot trap (if filled by automated scripts/bots)
    if (honeypot.trim() !== '') {
      playAlarmBeep();
      SecurityGuard.registerHoneypotTrigger(honeypot);
      const st = SecurityGuard.checkLockoutStatus();
      setLockout(st);
      setPassword('');
      return;
    }

    const isOk = loginAdmin(password);
    if (isOk) {
      SecurityGuard.registerSuccessLogin();
      setSuccess(true);
      setError(false);
      setTimeout(() => {
        setSuccess(false);
        setPassword('');
        onClose();
        setActiveView('admin');
      }, 700);
    } else {
      playAlarmBeep();
      const st = SecurityGuard.registerFailedLogin(password);
      setLockout(st);
      setError(true);
      if (st.isLocked) {
        setErrorMessage(`ALERTA DE INTRUSÃO: Terminal travado por ${st.remainingSeconds}s após múltiplas tentativas falhas.`);
      } else {
        setErrorMessage(`Senha incorreta (Tentativa ${st.attempts}/3 antes de bloqueio temporário).`);
      }
      setTimeout(() => setError(false), 3500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className={`relative w-full max-w-md bg-[#121218] border-2 transition-all p-6 sm:p-8 ${
          lockout.isLocked ? 'border-red-600 shadow-[0_0_40px_rgba(255,0,0,0.6)] animate-pulse' : 'border-[#ff003c] neon-glow'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#ff003c]/40">
          <div className="flex items-center gap-2 font-mono text-xs text-[#ff003c] uppercase tracking-widest">
            <Terminal className="w-4 h-4 animate-pulse" />
            <span>// BLOOD CORE SECURITY BLADE //</span>
          </div>
          <button 
            onClick={() => {
              setPassword('');
              onClose();
            }}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Header with animated GIF or Status */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#1a141a] border border-[#ff003c] mx-auto flex items-center justify-center mb-4 neon-glow relative overflow-hidden">
            {lockout.isLocked ? (
              <ShieldAlert className="w-8 h-8 text-red-500 animate-bounce" />
            ) : success ? (
              <Unlock className="w-8 h-8 text-green-400 animate-bounce" />
            ) : (
              <img 
                src="/fotos/videos/a_3b92739a0066d125bf473beccfe5bbb1.gif" 
                alt="Security Lock" 
                className="w-10 h-10 object-contain"
              />
            )}
          </div>
          <h3 className="text-xl font-bold font-display text-white uppercase tracking-wider">
            TERMINAL DE ACESSO RESTRITO
          </h3>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Sistema blindado com proteção Anti-Bruteforce & Honeypot ativa.
          </p>
        </div>

        {/* Lockout Countdown Screen */}
        {lockout.isLocked ? (
          <div className="p-5 bg-red-950/80 border-2 border-red-500 text-center space-y-3 animate-fadeIn">
            <div className="flex items-center justify-center gap-2 text-red-400 font-bold uppercase font-mono text-sm">
              <Timer className="w-5 h-5 animate-spin" />
              <span>TERMINAL TRAVADO POR SEGURANÇA</span>
            </div>
            <div className="text-3xl font-black font-mono text-white tracking-widest bg-black/60 py-3 border border-red-600/50">
              {Math.floor(lockout.remainingSeconds / 60).toString().padStart(2, '0')}:{(lockout.remainingSeconds % 60).toString().padStart(2, '0')}
            </div>
            <p className="text-[11px] font-mono text-red-300 leading-relaxed">
              Múltiplas tentativas incorretas ou atividade suspeita foram detectadas. Seu IP simulado foi registrado nos logs de auditoria da Blood Store.
            </p>
          </div>
        ) : (
          /* Normal Login Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot hidden input - Bots trying to fill all forms will trigger instant lockout */}
            <div style={{ opacity: 0, position: 'absolute', height: 0, width: 0, overflow: 'hidden', pointerEvents: 'none' }}>
              <label htmlFor="security_token_trap">Token Verificação</label>
              <input 
                type="text" 
                id="security_token_trap" 
                name="security_token_trap" 
                tabIndex={-1} 
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-[#ff003c] uppercase mb-1.5">
                PASSCODE DE COMANDO
              </label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha de comando..."
                autoFocus
                disabled={lockout.isLocked}
                className="w-full px-4 py-3 bg-[#0b0b0b] border border-[#ff003c]/50 focus:border-[#ff003c] text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#ff003c] disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-950/70 border border-red-500 text-red-300 font-mono text-xs animate-shake">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-950/70 border border-green-500 text-green-300 font-mono text-xs">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>Acesso Autorizado! Descriptografando Painel...</span>
              </div>
            )}

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setPassword('');
                  onClose();
                }}
                className="flex-1 py-3 px-4 bg-[#191922] border border-gray-700 hover:border-gray-500 text-gray-300 font-mono text-xs uppercase"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={lockout.isLocked}
                className="flex-1 btn-cyber py-3 px-4 text-xs disabled:opacity-40"
              >
                AUTENTICAR
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
