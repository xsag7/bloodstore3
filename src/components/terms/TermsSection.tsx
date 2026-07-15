import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Shield, AlertTriangle, Clock, DollarSign, HelpCircle, ChevronDown, Sparkles, Star } from 'lucide-react';

export const TermsSection: React.FC = () => {
  const { terms, config, setActiveView } = useStore();
  const [openAccordionIds, setOpenAccordionIds] = useState<string[]>(() => terms.map(t => t.id)); // Expand all by default for immediate reading

  const toggleAccordion = (id: string) => {
    setOpenAccordionIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PAGAMENTO': return <DollarSign className="w-5 h-5 text-green-400" />;
      case 'ENTREGA': return <Clock className="w-5 h-5 text-[#00f0ff]" />;
      case 'SUPORTE': return <HelpCircle className="w-5 h-5 text-yellow-400" />;
      case 'REGRAS': default: return <Shield className="w-5 h-5 text-[#ff003c]" />;
    }
  };

  return (
    <section className="py-16 px-4 md:px-8 max-w-5xl mx-auto relative z-10 animate-fadeIn">
      {/* Header Banner */}
      <div className="hud-card p-8 md:p-12 mb-12 border-l-4 border-[#ff003c] bg-[#12121c]/90">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#ff003c] uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>// PROTOCOLO DE SEGURANÇA E ACORDO DO CLIENTE //</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-display text-white uppercase tracking-tight">
              TERMOS & <span className="text-[#ff003c] neon-glow-text">CONDIÇÕES</span>
            </h1>
            <p className="text-gray-300 max-w-2xl mt-3 text-sm sm:text-base font-light leading-relaxed">
              Leia atentamente todas as regras de compra, prazos de entrega e deveres da comunidade antes de realizar qualquer pagamento na <strong className="text-white font-bold">{config.storeName}</strong>.
            </p>
          </div>

          <div className="flex flex-col gap-2 flex-shrink-0">
            <button 
              onClick={() => setOpenAccordionIds(openAccordionIds.length === terms.length ? [] : terms.map(t => t.id))}
              className="btn-cyber-outline py-2 px-4 text-xs"
            >
              {openAccordionIds.length === terms.length ? 'RECOLHER TODOS' : 'EXPANDIR TODOS'}
            </button>
            <button 
              onClick={() => setActiveView('home')}
              className="btn-cyber py-2 px-4 text-xs text-center"
            >
              VOLTAR PARA PRODUTOS
            </button>
          </div>
        </div>
      </div>

      {/* Accordion / Cards List */}
      <div className="space-y-4">
        {terms.map((term, index) => {
          const isOpen = openAccordionIds.includes(term.id);
          return (
            <div 
              key={term.id}
              className={`hud-card border transition-all duration-300 ${
                isOpen ? 'border-[#ff003c]/60 bg-[#141420]/90' : 'border-gray-800/80 bg-[#101017]/70 hover:border-[#ff003c]/30'
              }`}
            >
              {/* Accordion Header Button */}
              <button
                onClick={() => toggleAccordion(term.id)}
                className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-[#0b0b0b] border border-gray-800 flex items-center justify-center">
                    {getCategoryIcon(term.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#ff003c] font-bold">
                        #{String(index + 1).padStart(2, '0')}
                      </span>
                      {term.isImportant && (
                        <span className="px-2 py-0.5 bg-[#ff003c]/20 border border-[#ff003c]/50 text-[10px] font-mono text-[#ff003c] uppercase tracking-wider">
                          IMPORTANTE
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-display uppercase tracking-wide mt-0.5">
                      {term.title}
                    </h3>
                  </div>
                </div>

                <div className={`p-1.5 text-[#ff003c] border border-[#ff003c]/30 bg-[#0b0b0b] transition-transform duration-300 ${
                  isOpen ? 'rotate-180 bg-[#ff003c]/15' : ''
                }`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>

              {/* Accordion Content Body */}
              {isOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-gray-800/60 animate-fadeIn text-sm sm:text-base text-gray-200 font-light leading-relaxed">
                  <div className="p-4 bg-[#0b0b0b]/80 border-l-2 border-[#ff003c]">
                    {term.content}
                  </div>
                  {term.title.toLowerCase().includes('avaliação') && (
                    <div className="mt-3 flex items-center gap-2 text-xs font-mono text-yellow-400 bg-yellow-950/30 p-2.5 border border-yellow-500/30">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                      <span>Lembre-se: O canal para feedback no nosso Discord é o <strong>🌟・avaliações</strong>!</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Warning Box at bottom */}
      <div className="mt-12 p-6 bg-[#161214] border-2 border-[#ff003c]/60 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left neon-glow">
        <div className="p-3 bg-[#ff003c]/20 border border-[#ff003c] text-[#ff003c] flex-shrink-0">
          <AlertTriangle className="w-8 h-8 animate-pulse" />
        </div>
        <div className="flex-1">
          <h4 className="text-base font-bold text-white uppercase font-display">
            TERMO DE COMPROMISSO DO COMPRADOR
          </h4>
          <p className="text-xs sm:text-sm text-gray-300 mt-1">
            Ao efetuar qualquer transferência via PIX no fechamento do ticket em nosso servidor do Discord, você declara formalmente que leu, compreendeu e concorda em 100% com os Termos & Condições listados acima.
          </p>
        </div>
        <a 
          href={config.globalDiscordUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-cyber py-3 px-6 text-xs flex-shrink-0"
        >
          CONCORDAR & ENTRAR NO DISCORD
        </a>
      </div>
    </section>
  );
};
