import React, { useState, useEffect } from 'react';
import type { SecurityLogEntry } from '../../types/store';
import { SecurityGuard } from '../../services/SecurityGuard';
import { useStore } from '../../context/StoreContext';
import { ShieldAlert, ShieldCheck, Trash2, RefreshCw, AlertTriangle, Lock, Activity, Terminal } from 'lucide-react';

export const SecurityView: React.FC = () => {
  const { logoutAdmin } = useStore();
  const [logs, setLogs] = useState<SecurityLogEntry[]>([]);
  const [lockStatus, setLockStatus] = useState(SecurityGuard.checkLockoutStatus());

  const refreshData = () => {
    setLogs(SecurityGuard.getLogs());
    setLockStatus(SecurityGuard.checkLockoutStatus());
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleClearLogs = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o histórico de logs de auditoria?')) {
      SecurityGuard.clearLogs();
      refreshData();
    }
  };

  const handleResetLockout = () => {
    if (window.confirm('Deseja destravar o sistema e zerar as tentativas falhas registradas?')) {
      SecurityGuard.resetLockout();
      refreshData();
    }
  };

  const handlePanicLock = () => {
    if (window.confirm('🚨 ATENÇÃO: O Modo Pânico irá encerrar imediatamente sua sessão atual e travar o terminal por segurança. Deseja prosseguir?')) {
      SecurityGuard.triggerPanicLock();
      logoutAdmin();
    }
  };

  const getLogTypeBadge = (type: SecurityLogEntry['type']) => {
    switch (type) {
      case 'LOGIN_SUCCESS':
        return <span className="px-2 py-0.5 bg-green-950/60 border border-green-500 text-green-300 font-mono text-[10px]">ACESSO AUTORIZADO</span>;
      case 'LOGIN_FAILED':
        return <span className="px-2 py-0.5 bg-yellow-950/60 border border-yellow-500 text-yellow-300 font-mono text-[10px]">FALHA DE ACESSO</span>;
      case 'LOCKOUT_TRIGGERED':
        return <span className="px-2 py-0.5 bg-red-950/80 border border-red-500 text-red-400 font-mono text-[10px] animate-pulse">TRAVA ATIVADA</span>;
      case 'HONEYPOT_TRAPPED':
        return <span className="px-2 py-0.5 bg-purple-950/80 border border-purple-500 text-purple-300 font-mono text-[10px] animate-pulse">INTRUSÃO DETECTADA</span>;
      case 'IDLE_TIMEOUT':
        return <span className="px-2 py-0.5 bg-blue-950/60 border border-blue-500 text-blue-300 font-mono text-[10px]">TIMEOUT INATIVIDADE</span>;
      case 'PANIC_LOCK':
        return <span className="px-2 py-0.5 bg-red-950 border-2 border-red-500 text-red-300 font-mono text-[10px] animate-bounce">MODO PÂNICO</span>;
      default:
        return <span className="px-2 py-0.5 bg-gray-800 text-gray-300 font-mono text-[10px]">LOG</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl">
      {/* Top Banner */}
      <div className="hud-card p-6 sm:p-8 border-l-4 border-[#ff003c] bg-[#141420]/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#ff003c] uppercase tracking-widest mb-1">
            <Terminal className="w-4 h-4 animate-pulse" />
            <span>// BLOOD SHIELD : BLINDAGEM & AUDITORIA //</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display uppercase">
            CONTROLE DE SEGURANÇA E INTRUSÃO
          </h2>
          <p className="text-gray-400 text-sm mt-1 font-light">
            Monitore tentativas maliciosas de login, travas de proteção ativas e logs de conexões no endpoint secreto <strong className="text-white">/admin</strong>.
          </p>
        </div>

        <div className="flex gap-3 flex-shrink-0">
          <button 
            onClick={refreshData}
            className="btn-cyber-outline py-2.5 px-4 text-xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            ATUALIZAR LOGS
          </button>
        </div>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="hud-card p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs text-gray-400 uppercase">Status do Rate Limit</span>
            <div className="p-2 bg-[#ff003c]/20 text-[#ff003c]">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {lockStatus.isLocked ? (
              <span className="text-red-500 animate-pulse">TRAVADO ({lockStatus.remainingSeconds}s)</span>
            ) : (
              <span className="text-green-400">OPERACIONAL (OK)</span>
            )}
          </div>
          <div className="text-xs font-mono text-gray-400 mt-2">
            Tentativas incorretas cadastradas: <strong className="text-white">{lockStatus.attempts} / 3</strong>
          </div>
          {lockStatus.attempts > 0 && (
            <button
              onClick={handleResetLockout}
              className="mt-3 w-full py-2 bg-[#191922] border border-gray-700 hover:border-[#00f0ff] text-xs font-mono text-[#00f0ff] uppercase transition-all"
            >
              Destravar / Zerar Tentativas
            </button>
          )}
        </div>

        <div className="hud-card p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs text-gray-400 uppercase">Trava Honeypot & URL</span>
            <div className="p-2 bg-purple-500/20 text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-white">
            ROTA SECRETA <span className="text-[#ff003c]">/admin</span>
          </div>
          <p className="text-xs font-mono text-gray-400 mt-2">
            Armadilha Honeypot ativa contra robôs de força bruta. Botões públicos ocultados na interface.
          </p>
        </div>

        <div className="hud-card p-6 border border-red-800/60 bg-red-950/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-red-400 font-bold uppercase">Emergência / Modo Pânico</span>
              <AlertTriangle className="w-5 h-5 text-red-500 animate-bounce" />
            </div>
            <p className="text-xs text-gray-300 font-light">
              Revoga todas as sessões instantaneamente e trava a página administrativa contra invasores.
            </p>
          </div>
          <button
            onClick={handlePanicLock}
            className="mt-3 w-full py-2.5 bg-red-600 hover:bg-red-700 font-mono text-xs font-bold text-white uppercase tracking-wider shadow-[0_0_15px_rgba(255,0,0,0.6)] transition-all flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            ATIVAR MODO PÂNICO
          </button>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="hud-card border border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-[#181824] border-b border-[#ff003c]/40">
          <div className="flex items-center gap-2 font-mono text-xs text-white uppercase tracking-wider font-bold">
            <ShieldAlert className="w-4 h-4 text-[#ff003c]" />
            <span>// HISTÓRICO DE AUDITORIA & REGISTROS DE SEGURANÇA ({logs.length})</span>
          </div>
          {logs.length > 0 && (
            <button
              onClick={handleClearLogs}
              className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1.5 py-1 px-3 bg-[#121218] border border-red-900/60"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Registros</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto max-h-[450px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#12121c] border-b border-gray-800 font-mono text-[11px] text-[#ff003c] uppercase sticky top-0">
                <th className="py-3 px-4">Data/Hora</th>
                <th className="py-3 px-4">Evento / Status</th>
                <th className="py-3 px-4">Origem / Assinatura IP</th>
                <th className="py-3 px-4">Detalhes do Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono text-xs">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#161622] transition-colors">
                  <td className="py-3 px-4 text-gray-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString('pt-BR')} 
                    <span className="text-[10px] text-gray-600 ml-1">
                      ({new Date(log.timestamp).toLocaleDateString('pt-BR')})
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {getLogTypeBadge(log.type)}
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    <div className="font-bold">{log.ipSignature}</div>
                    <div className="text-[10px] text-gray-500 truncate max-w-xs" title={log.userAgent}>{log.userAgent}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-200 font-main">
                    {log.details}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-500">
                    Nenhum evento de segurança registrado no momento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
