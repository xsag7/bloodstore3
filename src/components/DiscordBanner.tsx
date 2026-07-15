import React from 'react';
import { useStore } from '../context/StoreContext';
import { ExternalLink, Users, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export const DiscordBanner: React.FC = () => {
  const { config } = useStore();

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
      <div className="hud-card p-8 sm:p-14 bg-gradient-to-r from-[#141016] via-[#1c1218] to-[#141016] border-2 border-[#ff003c] neon-glow-lg overflow-hidden relative">
        {/* Ambient Glows */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#ff003c]/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-[#ff003c]/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ff003c]/20 border border-[#ff003c] font-mono text-xs text-[#ff003c] tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>// COMUNIDADE OFICIAL GAMER //</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight uppercase leading-none">
              JUNTE-SE AO COMANDO <span className="text-[#ff003c] neon-glow-text">BLOOD STORE</span> NO DISCORD
            </h2>

            <p className="text-gray-300 text-sm sm:text-base font-light leading-relaxed">
              Nosso servidor é a base central de todas as operações, suporte em tempo real, entregas garantidas, sorteios exclusivos e atendimento prioritário para Boosters e clientes VIP.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-mono text-gray-300 bg-[#0b0b0b]/80 px-3 py-2 border border-gray-800">
                <Users className="w-4 h-4 text-[#00f0ff]" />
                <span>Atendimento Humanizado</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-gray-300 bg-[#0b0b0b]/80 px-3 py-2 border border-gray-800">
                <Zap className="w-4 h-4 text-[#ff003c]" />
                <span>Fila VIP p/ Boosters</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-gray-300 bg-[#0b0b0b]/80 px-3 py-2 border border-gray-800">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span>Canal de Avaliações Reais</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
            <a 
              href={config.globalDiscordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cyber w-full sm:w-80 py-5 text-base text-center animate-pulse-glow flex items-center justify-center gap-3"
            >
              <span>ACESSAR SERVIDOR AGORA</span>
              <ExternalLink className="w-5 h-5" />
            </a>

            <span className="font-mono text-xs text-gray-400">
              Link de Convite: <strong className="text-[#ff003c]">discord.gg/Gvbg5WYPBP</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
