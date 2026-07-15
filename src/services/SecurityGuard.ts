import type { SecurityLogEntry } from '../types/store';

const LOGS_STORAGE_KEY = 'bloodstore_security_logs';
const FAILED_ATTEMPTS_KEY = 'bloodstore_failed_attempts';
const LOCKOUT_UNTIL_KEY = 'bloodstore_lockout_until';
const LAST_ACTIVITY_KEY = 'bloodstore_last_activity';
const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

// Generate a realistic simulated IP & browser fingerprint for tracking
const getSimulatedSignature = (): { ip: string; userAgent: string } => {
  let fingerprint = localStorage.getItem('bloodstore_browser_fp');
  if (!fingerprint) {
    const randomOctet1 = Math.floor(Math.random() * (192 - 170 + 1)) + 170;
    const randomOctet2 = Math.floor(Math.random() * 254) + 1;
    const randomOctet3 = Math.floor(Math.random() * 254) + 1;
    fingerprint = `${randomOctet1}.${randomOctet2}.${randomOctet3}.X [BR-CyberNode-${Math.floor(Math.random() * 9000) + 1000}]`;
    localStorage.setItem('bloodstore_browser_fp', fingerprint);
  }
  return {
    ip: fingerprint,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 80) + '...' : 'Unknown Terminal'
  };
};

export const SecurityGuard = {
  recordLog(type: SecurityLogEntry['type'], details: string): SecurityLogEntry {
    const logs = this.getLogs();
    const sig = getSimulatedSignature();
    const newEntry: SecurityLogEntry = {
      id: `sec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      type,
      ipSignature: sig.ip,
      userAgent: sig.userAgent,
      details
    };
    const updated = [newEntry, ...logs].slice(0, 100); // Keep last 100 events
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(updated));
    return newEntry;
  },

  getLogs(): SecurityLogEntry[] {
    const data = localStorage.getItem(LOGS_STORAGE_KEY);
    if (!data) {
      // Seed an initial system initialization log
      return [
        {
          id: 'sec-init',
          timestamp: new Date().toISOString(),
          type: 'LOGIN_SUCCESS',
          ipSignature: '127.0.0.1 [LOCAL-BLOOD-OS]',
          userAgent: 'Blood Core Security Daemon v2.4',
          details: 'Sistema de Proteção Anti-Hacker e Auditoria de Sessão Ativado.'
        }
      ];
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  clearLogs(): void {
    localStorage.removeItem(LOGS_STORAGE_KEY);
    this.recordLog('LOGIN_SUCCESS', 'Logs de auditoria foram limpos pelo Administrador Principal.');
  },

  checkLockoutStatus(): { isLocked: boolean; remainingSeconds: number; attempts: number } {
    const attemptsStr = localStorage.getItem(FAILED_ATTEMPTS_KEY);
    const lockoutStr = localStorage.getItem(LOCKOUT_UNTIL_KEY);
    const attempts = attemptsStr ? parseInt(attemptsStr, 10) : 0;
    const lockoutUntil = lockoutStr ? parseInt(lockoutStr, 10) : 0;

    const now = Date.now();
    if (lockoutUntil > now) {
      const remainingSeconds = Math.ceil((lockoutUntil - now) / 1000);
      return { isLocked: true, remainingSeconds, attempts };
    } else if (lockoutUntil !== 0 && lockoutUntil <= now) {
      // Lockout period expired
      localStorage.removeItem(LOCKOUT_UNTIL_KEY);
    }

    return { isLocked: false, remainingSeconds: 0, attempts };
  },

  registerFailedLogin(attemptedPass: string): { isLocked: boolean; remainingSeconds: number; attempts: number } {
    const attemptsStr = localStorage.getItem(FAILED_ATTEMPTS_KEY);
    const attempts = (attemptsStr ? parseInt(attemptsStr, 10) : 0) + 1;
    localStorage.setItem(FAILED_ATTEMPTS_KEY, attempts.toString());

    this.recordLog('LOGIN_FAILED', `Tentativa de acesso negado. Palavra-passe rejeitada (${attemptedPass.slice(0, 3)}***). Tentativa #${attempts}`);

    if (attempts >= 3) {
      // Exponential rate limit penalty
      let lockoutDurationSec = 60; // 1 min for 3rd attempt
      if (attempts === 4) lockoutDurationSec = 300; // 5 mins for 4th
      if (attempts >= 5) lockoutDurationSec = 1800; // 30 mins for 5th+

      const lockoutUntil = Date.now() + lockoutDurationSec * 1000;
      localStorage.setItem(LOCKOUT_UNTIL_KEY, lockoutUntil.toString());

      this.recordLog('LOCKOUT_TRIGGERED', `SISTEMA BLOQUEADO POR TRAVA ANTI-BRUTEFORCE: Terminal travado por ${lockoutDurationSec} segundos após ${attempts} tentativas consecutivas falhas.`);

      return { isLocked: true, remainingSeconds: lockoutDurationSec, attempts };
    }

    return { isLocked: false, remainingSeconds: 0, attempts };
  },

  registerSuccessLogin(): void {
    localStorage.removeItem(FAILED_ATTEMPTS_KEY);
    localStorage.removeItem(LOCKOUT_UNTIL_KEY);
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    this.recordLog('LOGIN_SUCCESS', 'Autenticação bem-sucedida. Sessão de administrador autorizada no Terminal.');
  },

  registerHoneypotTrigger(trapValue: string): void {
    const lockoutUntil = Date.now() + 3600 * 1000; // 1 hour lockout
    localStorage.setItem(LOCKOUT_UNTIL_KEY, lockoutUntil.toString());
    localStorage.setItem(FAILED_ATTEMPTS_KEY, '99');
    this.recordLog('HONEYPOT_TRAPPED', `🚨 ALERTA CRÍTICO: Robô ou injeção detectada no campo Honeypot ("${trapValue}"). IP e Assinatura banidos temporariamente por 3600 segundos.`);
  },

  updateLastActivity(): void {
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  },

  checkIdleTimeout(): boolean {
    const lastStr = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (!lastStr) return false;
    const lastActivity = parseInt(lastStr, 10);
    const now = Date.now();
    if (now - lastActivity > IDLE_TIMEOUT_MS) {
      this.recordLog('IDLE_TIMEOUT', 'Sessão de administrador encerrada automaticamente devido a mais de 15 minutos de inatividade.');
      localStorage.removeItem(LAST_ACTIVITY_KEY);
      return true;
    }
    return false;
  },

  triggerPanicLock(): void {
    const lockoutUntil = Date.now() + 300 * 1000; // 5 min panic lockout
    localStorage.setItem(LOCKOUT_UNTIL_KEY, lockoutUntil.toString());
    localStorage.setItem(FAILED_ATTEMPTS_KEY, '5');
    this.recordLog('PANIC_LOCK', '⚡ MODO PÂNICO ATIVADO PELO ADMIN: Sessões revogadas e terminal de acesso trancado emergencialmente.');
  },

  resetLockout(): void {
    localStorage.removeItem(FAILED_ATTEMPTS_KEY);
    localStorage.removeItem(LOCKOUT_UNTIL_KEY);
    this.recordLog('LOGIN_SUCCESS', 'Trava de segurança foi redefinida manualmente no Painel de Auditoria.');
  },

  initDevToolsGuard(): void {
    if (typeof window === 'undefined') return;

    const banner = `
██████╗ ██╗      ██████╗  ██████╗ ██████╗     ███████╗████████╗██████╗ ██████╗ ███████╗
██╔══██╗██║     ██╔═══██╗██╔═══██╗██╔══██╗    ██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██╔════╝
██████╔╝██║     ██║   ██║██║   ██║██║  ██║    ███████╗   ██║   ██████╔╝██████╔╝█████╗  
██╔══██╗██║     ██║   ██║██║   ██║██║  ██║    ╚════██║   ██║   ██╔═══╝ ██╔══██╗██╔══╝  
██████╔╝███████╗╚██████╔╝╚██████╔╝██████╔╝    ███████║   ██║   ██║     ██║  ██║███████╗
╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝ ╚═════╝     ╚══════╝   ╚═╝   ╚═╝     ╚═╝  ╚═╝╚══════╝

[ 🚨 ALERTA DE SEGURANÇA BLOOD CORE : PROTOCOLO ANTI-INTRUSÃO ATIVO 🚨 ]
Acesso não autorizado, engenharia reversa, ou manipulação de scripts/console nos terminais da Blood Store são monitorados e contidos automaticamente.
`;
    console.log(`%c${banner}`, 'color: #ff003c; font-weight: bold; font-family: monospace; background: #0b0b0b; padding: 10px;');
  }
};
