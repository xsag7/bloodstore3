import React from 'react';
import { useStore } from '../context/StoreContext';
import { Zap, ShieldCheck, Clock, ArrowDown, ExternalLink, Sparkles, Activity } from 'lucide-react';

export const Hero: React.FC = () => {
  const { config } = useStore();

  const handleScrollToProducts = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('produtos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full pt-10 pb-20 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Cyber Decorations */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-[#ff003c]/10 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Status Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#12121a] border border-[#ff003c]/50 rounded-none mb-6 font-mono text-xs text-gray-300 neon-border animate-float">
          <span className="w-2 h-2 rounded-full bg-[#ff003c] animate-ping" />
          <span className="text-[#ff003c] font-bold">BLOOD SYSTEM v2.4</span>
          <span className="text-gray-500">//</span>
          <span className="text-white font-medium">SERVIDORES 100% ONLINE</span>
          <Activity className="w-3.5 h-3.5 text-[#ff003c] ml-1" />
        </div>

        {/* Impact Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight text-white uppercase max-w-5xl leading-none mb-6">
          {config.bannerTitle.split(' ').map((word, i) => (
            <span key={i} className={word.toLowerCase().includes('supremacia') || word.toLowerCase().includes('gamer') || i % 3 === 1 ? 'text-[#ff003c] neon-glow-text inline-block mx-1' : 'inline-block mx-1'}>
              {word}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-gray-300 max-w-3xl mb-10 font-light leading-relaxed">
          {config.bannerSubtitle}
        </p>

        {/* Feature Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 w-full max-w-4xl mb-12">
          <div className="hud-card p-3 flex items-center gap-3 text-left">
            <div className="p-2 bg-[#ff003c]/15 text-[#ff003c] border border-[#ff003c]/40">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-mono text-xs text-gray-400 uppercase">Entrega Rápida</div>
              <div className="font-bold text-sm text-white">Em até 24 Horas</div>
            </div>
          </div>

          <div className="hud-card p-3 flex items-center gap-3 text-left">
            <div className="p-2 bg-[#ff003c]/15 text-[#ff003c] border border-[#ff003c]/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-mono text-xs text-gray-400 uppercase">Segurança Total</div>
              <div className="font-bold text-sm text-white">Contas & Itens Reais</div>
            </div>
          </div>

          <div className="hud-card p-3 flex items-center gap-3 text-left">
            <div className="p-2 bg-[#ff003c]/15 text-[#ff003c] border border-[#ff003c]/40">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-mono text-xs text-gray-400 uppercase">Atendimento VIP</div>
              <div className="font-bold text-sm text-white">Fura-fila Booster</div>
            </div>
          </div>

          <div className="hud-card p-3 flex items-center gap-3 text-left">
            <div className="p-2 bg-[#ff003c]/15 text-[#ff003c] border border-[#ff003c]/40">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-mono text-xs text-gray-400 uppercase">Forma de Pagamento</div>
              <div className="font-bold text-sm text-[#ff003c]">PIX Instantâneo</div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-md">
          <a 
            href="#produtos"
            onClick={handleScrollToProducts}
            className="btn-cyber w-full sm:w-auto text-base py-4 px-8 animate-pulse-glow"
          >
            <span>VER PRODUTOS</span>
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </a>

          <a 
            href={config.globalDiscordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cyber-outline w-full sm:w-auto text-base py-4 px-8"
          >
            <span>COMUNIDADE DISCORD</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Stats Counter Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800/80 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl text-center">
          <div>
            <div className="text-2xl md:text-3xl font-black font-mono text-white tracking-wider">
              +{config.stats.totalSales.toLocaleString()}
            </div>
            <div className="text-xs font-mono text-gray-400 mt-1 uppercase tracking-widest">// Vendas Concluídas</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-black font-mono text-[#ff003c] tracking-wider">
              +{config.stats.activeUsers.toLocaleString()}
            </div>
            <div className="text-xs font-mono text-gray-400 mt-1 uppercase tracking-widest">// Membros Ativos</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-black font-mono text-white tracking-wider">
              {config.stats.satisfactionRate}
            </div>
            <div className="text-xs font-mono text-gray-400 mt-1 uppercase tracking-widest">// Satisfação Real</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-black font-mono text-[#00f0ff] tracking-wider">
              ~{config.stats.averageDelivery}
            </div>
            <div className="text-xs font-mono text-gray-400 mt-1 uppercase tracking-widest">// Tempo de Resposta</div>
          </div>
        </div>
      </div>
    </section>
  );
};
