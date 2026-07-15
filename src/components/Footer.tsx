import React from 'react';
import { useStore } from '../context/StoreContext';
import { Flame, Terminal, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { config, setActiveView } = useStore();

  return (
    <footer className="w-full bg-[#0b0b0b] border-t border-[#ff003c]/30 pt-16 pb-12 px-4 md:px-8 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Brand Col */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#121218] border border-[#ff003c] flex items-center justify-center neon-glow">
              <Flame className="w-5 h-5 text-[#ff003c]" />
            </div>
            <span className="font-extrabold text-xl font-display tracking-wider text-white uppercase">
              {config.storeName}
            </span>
          </div>
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            Sua referência máxima em infoprodutos, otimização gamer extrema, robux, contas premium e engajamento. Entrega rápida via Discord.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-[#ff003c]">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            <span>SISTEMA PIX EXCLUSIVO // 100% SEGURO</span>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="space-y-3">
          <h4 className="font-mono text-xs text-[#ff003c] uppercase tracking-widest font-bold">
            // NAVEGAÇÃO RÁPIDA
          </h4>
          <ul className="space-y-2 text-sm text-gray-400 font-light">
            <li>
              <button onClick={() => setActiveView('home')} className="hover:text-[#ff003c] transition-colors">
                Página Inicial (Home)
              </button>
            </li>
            <li>
              <a href="#produtos" onClick={(e) => {
                e.preventDefault();
                setActiveView('home');
                setTimeout(() => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }} className="hover:text-[#ff003c] transition-colors">
                Catálogo de Produtos
              </a>
            </li>
            <li>
              <button onClick={() => setActiveView('terms')} className="hover:text-[#ff003c] transition-colors">
                Termos & Condições
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('admin')} className="hover:text-[#ff003c] transition-colors flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-[#ff003c]" />
                <span>Painel Administrativo</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Products Highlights */}
        <div className="space-y-3">
          <h4 className="font-mono text-xs text-[#ff003c] uppercase tracking-widest font-bold">
            // DESTAQUES DA LOJA
          </h4>
          <ul className="space-y-2 text-sm text-gray-400 font-light">
            <li className="hover:text-white transition-colors cursor-pointer">Pacotes Robux (r0b6x)</li>
            <li className="hover:text-white transition-colors cursor-pointer">Contas Verificadas 18+</li>
            <li className="hover:text-white transition-colors cursor-pointer">Chaves & Contas Steam</li>
            <li className="hover:text-white transition-colors cursor-pointer">Godlys Murder Mystery (MM2)</li>
            <li className="hover:text-white transition-colors cursor-pointer">Otimização Extrema FPS Boost</li>
          </ul>
        </div>

        {/* Discord & Support */}
        <div className="space-y-3">
          <h4 className="font-mono text-xs text-[#ff003c] uppercase tracking-widest font-bold">
            // SUPORTE & DISCORD
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed font-light">
            O atendimento humanizado, suporte técnico e a entrega de todos os pedidos ocorrem exclusivamente no nosso Discord.
          </p>
          <a 
            href={config.globalDiscordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#14141e] border border-[#ff003c]/60 text-white hover:border-[#ff003c] hover:bg-[#ff003c]/20 text-xs font-mono transition-all w-full justify-center"
          >
            <span>ENTRAR NO SERVIDOR VIP</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} {config.storeName}. TODOS OS DIREITOS RESERVADOS.</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1 text-gray-400">
            ENGINE: <strong className="text-white">BLOOD CORE v2.4</strong>
          </span>
          <span className="text-[#ff003c]">// CYBERPUNK EDITION</span>
        </div>
      </div>
    </footer>
  );
};
