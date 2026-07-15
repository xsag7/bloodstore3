import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, ShieldCheck, Activity, Users, Plus, ExternalLink, RefreshCw, Sparkles } from 'lucide-react';

export const OverviewView: React.FC = () => {
  const { products, terms, config, setAdminTab, setActiveView, resetToDefault } = useStore();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="hud-card p-6 sm:p-8 border-l-4 border-[#ff003c] bg-[#141420]/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#ff003c] uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>// BLOOD OS : ADMIN CORE v2.4 //</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display uppercase">
            BEM-VINDO AO COMANDO CENTRAL
          </h2>
          <p className="text-gray-400 text-sm mt-1 font-light">
            Gerencie todo o catálogo da loja, termos de serviço, integrações com Discord e identidade visual em tempo real.
          </p>
        </div>

        <div className="flex gap-3 flex-shrink-0">
          <button 
            onClick={() => setAdminTab('products')}
            className="btn-cyber py-2.5 px-4 text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            NOVO PRODUTO
          </button>
          <button 
            onClick={() => setActiveView('home')}
            className="btn-cyber-outline py-2.5 px-4 text-xs flex items-center gap-2"
          >
            VER LOJA
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setAdminTab('products')}
          className="hud-card p-6 cursor-pointer hover:border-[#ff003c] transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs text-gray-400 uppercase tracking-wider">Produtos Ativos</span>
            <div className="p-2 bg-[#ff003c]/20 text-[#ff003c]">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-white">{products.length}</div>
          <div className="text-xs font-mono text-green-400 mt-2 flex items-center gap-1">
            <span>+{products.filter(p => p.status === 'DISPONÍVEL').length} Disponíveis para compra</span>
          </div>
        </div>

        <div 
          onClick={() => setAdminTab('terms')}
          className="hud-card p-6 cursor-pointer hover:border-[#ff003c] transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs text-gray-400 uppercase tracking-wider">Regras & Termos</span>
            <div className="p-2 bg-[#ff003c]/20 text-[#ff003c]">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-white">{terms.length}</div>
          <div className="text-xs font-mono text-[#00f0ff] mt-2 flex items-center gap-1">
            <span>Termos sincronizados no sistema</span>
          </div>
        </div>

        <div 
          onClick={() => setAdminTab('settings')}
          className="hud-card p-6 cursor-pointer hover:border-[#ff003c] transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs text-gray-400 uppercase tracking-wider">Servidor Discord</span>
            <div className="p-2 bg-[#ff003c]/20 text-[#ff003c]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-lg font-bold font-mono text-white truncate">{config.globalDiscordUrl.replace('https://', '')}</div>
          <div className="text-xs font-mono text-[#ff003c] mt-2 uppercase">
            [ LINK GLOBAL ATIVO ]
          </div>
        </div>

        <div className="hud-card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs text-gray-400 uppercase tracking-wider">Status do Sistema</span>
            <div className="p-2 bg-green-500/20 text-green-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-green-400">ONLINE 100%</div>
          <div className="text-xs font-mono text-gray-400 mt-2">
            Latência Local: 0ms (LocalStorage)
          </div>
        </div>
      </div>

      {/* Quick Shortcuts & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="hud-card p-6 space-y-4">
          <h3 className="text-lg font-bold text-white font-display uppercase tracking-wide border-b border-gray-800 pb-3">
            Ações Rápidas do Painel
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setAdminTab('products')}
              className="p-4 bg-[#161622] border border-gray-800 hover:border-[#ff003c] text-left transition-all group"
            >
              <div className="font-bold text-sm text-white group-hover:text-[#ff003c] mb-1">
                Adicionar ou Editar Produtos
              </div>
              <div className="text-xs text-gray-400">
                Altere preços, descrições ou links de venda do Discord.
              </div>
            </button>

            <button
              onClick={() => setAdminTab('terms')}
              className="p-4 bg-[#161622] border border-gray-800 hover:border-[#ff003c] text-left transition-all group"
            >
              <div className="font-bold text-sm text-white group-hover:text-[#ff003c] mb-1">
                Atualizar Termos do Site
              </div>
              <div className="text-xs text-gray-400">
                Altere prazos, regras de PIX e políticas de reembolso.
              </div>
            </button>

            <button
              onClick={() => setAdminTab('settings')}
              className="p-4 bg-[#161622] border border-gray-800 hover:border-[#ff003c] text-left transition-all group"
            >
              <div className="font-bold text-sm text-white group-hover:text-[#ff003c] mb-1">
                Trocar Link do Discord / Título
              </div>
              <div className="text-xs text-gray-400">
                Altere o nome da loja, convite do Discord ou aviso do topo.
              </div>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Atenção: Deseja restaurar os produtos e termos originais de fábrica da Blood Store?')) {
                  resetToDefault();
                  alert('Dados originais restaurados com sucesso!');
                }
              }}
              className="p-4 bg-red-950/30 border border-red-500/40 hover:border-red-500 text-left transition-all group"
            >
              <div className="font-bold text-sm text-red-300 flex items-center gap-1.5 mb-1">
                <RefreshCw className="w-4 h-4" />
                Restaurar Fábrica
              </div>
              <div className="text-xs text-gray-400">
                Recarrega os 8 produtos iniciais e todos os termos originais.
              </div>
            </button>
          </div>
        </div>

        {/* System Information Box */}
        <div className="hud-card p-6 space-y-4">
          <h3 className="text-lg font-bold text-white font-display uppercase tracking-wide border-b border-gray-800 pb-3">
            Especificações de Armazenamento
          </h3>
          <p className="text-sm text-gray-300 font-light leading-relaxed">
            Sua loja <strong className="text-white">{config.storeName}</strong> opera com o sistema de persistência local otimizado (LocalStorage). Todas as alterações efetuadas nas abas do painel são salvas e refletidas instantaneamente na interface pública para os clientes.
          </p>
          <div className="p-4 bg-[#0b0b0b] border border-gray-800 font-mono text-xs space-y-2 text-gray-400">
            <div className="flex justify-between">
              <span>Banco de Produtos:</span>
              <span className="text-green-400">OK ({products.length} itens)</span>
            </div>
            <div className="flex justify-between">
              <span>Banco de Termos:</span>
              <span className="text-green-400">OK ({terms.length} itens)</span>
            </div>
            <div className="flex justify-between">
              <span>Configurações Globais:</span>
              <span className="text-green-400">Sincronizado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
