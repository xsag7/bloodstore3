import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { SecurityGuard } from '../../services/SecurityGuard';
import { Unlock, Terminal, X, AlertCircle, CheckCircle2, ShieldAlert, Timer, Lock, ArrowLeft } from 'lucide-react';

// Helper to generate a synthesized alert tone
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
    // Audio synthesis not allowed before interaction
  }
};

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, setActiveView } = useStore();
  const [password, setPassword] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Senha incorreta.');
  const [success, setSuccess] = useState(false);
  
  // Rate limiting / Lockout state
  const [lockout, setLockout] = useState<{ isLocked: boolean; remainingSeconds: number; attempts: number }>({
    isLocked: false,
    remainingSeconds: 0,
    attempts: 0
  });

  useEffect(() => {
    const currentStatus = SecurityGuard.checkLockoutStatus();
    setLockout(currentStatus);
  }, []);

  // Countdown interval when locked out
  useEffect(() => {
    if (!lockout.isLocked || lockout.remainingSeconds <= 0) return;
    const timer = setInterval(() => {
      const st = SecurityGuard.checkLockoutStatus();
      setLockout(st);
    }, 1000);
    return () => clearInterval(timer);
  }, [lockout.isLocked, lockout.remainingSeconds]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if locked
    const currentStatus = SecurityGuard.checkLockoutStatus();
    if (currentStatus.isLocked) {
      playAlarmBeep();
      setLockout(currentStatus);
      return;
    }

    // Check Honeypot trap
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
        setActiveView('admin');
      }, 600);
    } else {
      playAlarmBeep();
      const st = SecurityGuard.registerFailedLogin(password);
      setLockout(st);
      setError(true);
      if (st.isLocked) {
        setErrorMessage(`Acesso suspenso por ${st.remainingSeconds}s após múltiplas tentativas incorretas.`);
      } else {
        setErrorMessage(`Senha incorreta (Tentativa ${st.attempts}/3).`);
      }
      setTimeout(() => setError(false), 3500);
    }
  };

  const handleReturnHome = () => {
    setPassword('');
    setActiveView('home');
    window.history.pushState({}, '', '/');
  };

  return (
    <div className="py-16 px-4 min-h-[85vh] flex items-center justify-center relative z-10 animate-fadeIn">
      <div className={`w-full max-w-md bg-[#121218] border-2 transition-all p-6 sm:p-8 rounded-lg ${
        lockout.isLocked ? 'border-red-600 shadow-[0_0_40px_rgba(255,0,0,0.6)] animate-pulse' : 'border-[#ff003c] neon-glow'
      }`}>
        {/* Top bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#ff003c]/40">
          <div className="flex items-center gap-2 font-mono text-xs text-[#ff003c] uppercase tracking-widest font-bold">
            <Terminal className="w-4 h-4" />
            <span>// ACESSO ADMINISTRATIVO //</span>
          </div>
          <button 
            onClick={handleReturnHome}
            className="text-gray-400 hover:text-white transition-colors"
            title="Voltar para a loja"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Header Icon & Title */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#1a141a] border border-[#ff003c] rounded-full mx-auto flex items-center justify-center mb-4 neon-glow relative">
            {lockout.isLocked ? (
              <ShieldAlert className="w-8 h-8 text-red-500 animate-bounce" />
            ) : success ? (
              <Unlock className="w-8 h-8 text-green-400 animate-bounce" />
            ) : (
              <Lock className="w-8 h-8 text-[#ff003c]" />
            )}
          </div>
          <h1 className="text-2xl font-black font-display text-white uppercase tracking-wider">
            PAINEL DO ADMINISTRADOR
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1.5">
            Área restrita à equipe de gerenciamento da Blood Store.
          </p>
        </div>

        {/* Lockout Countdown Screen */}
        {lockout.isLocked ? (
          <div className="p-5 bg-red-950/80 border-2 border-red-500 text-center space-y-3 animate-fadeIn rounded">
            <div className="flex items-center justify-center gap-2 text-red-400 font-bold uppercase font-mono text-sm">
              <Timer className="w-5 h-5 animate-spin" />
              <span>ACESSO BLOQUEADO TEMPORARIAMENTE</span>
            </div>
            <div className="text-3xl font-black font-mono text-white tracking-widest bg-black/60 py-3 border border-red-600/50 rounded">
              {Math.floor(lockout.remainingSeconds / 60).toString().padStart(2, '0')}:{(lockout.remainingSeconds % 60).toString().padStart(2, '0')}
            </div>
            <p className="text-xs font-mono text-red-300 leading-relaxed">
              Múltiplas tentativas incorretas detectadas. Por favor, aguarde o término do cronômetro para tentar novamente.
            </p>
          </div>
        ) : (
          /* Normal Login Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot hidden input */}
            <div style={{ opacity: 0, position: 'absolute', height: 0, width: 0, overflow: 'hidden', pointerEvents: 'none' }}>
              <label htmlFor="security_token_trap_pg">Token Verificação</label>
              <input 
                type="text" 
                id="security_token_trap_pg" 
                name="security_token_trap_pg" 
                tabIndex={-1} 
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-[#ff003c] uppercase mb-2 font-bold">
                PASSCODE DE COMANDO
              </label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha (padrão: admin)"
                autoFocus
                disabled={lockout.isLocked}
                className="w-full px-4 py-3 bg-[#0b0b0b] border border-[#ff003c]/50 focus:border-[#ff003c] text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#ff003c] rounded disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-950/70 border border-red-500 rounded text-red-300 font-mono text-xs animate-shake">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-950/70 border border-green-500 rounded text-green-300 font-mono text-xs">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>Autenticado! Carregando Painel...</span>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleReturnHome}
                className="py-3 px-4 bg-[#191922] border border-gray-700 hover:border-gray-500 text-gray-300 font-mono text-xs uppercase flex items-center justify-center gap-1.5 rounded transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar à Loja</span>
              </button>
              <button
                type="submit"
                disabled={lockout.isLocked}
                className="flex-1 btn-cyber py-3 px-6 text-xs font-bold uppercase rounded disabled:opacity-40"
              >
                ENTRAR NO PAINEL
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
