import React from 'react';
import { useStore } from '../../context/StoreContext';
import { OverviewView } from './OverviewView';
import { ProductsView } from './ProductsView';
import { TermsView } from './TermsView';
import { SettingsView } from './SettingsView';
import { Terminal, ShoppingBag, ShieldCheck, Settings, LogOut, Activity, ExternalLink } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { adminTab, setAdminTab, logoutAdmin, setActiveView } = useStore();

  return (
    <section className="py-10 px-4 md:px-8 max-w-7xl mx-auto relative z-10 min-h-screen">
      {/* Top Admin Header Bar */}
      <div className="hud-card p-4 sm:p-6 mb-8 bg-[#121218] border-2 border-[#ff003c] neon-glow flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1a141c] border border-[#ff003c] flex items-center justify-center neon-glow">
            <Terminal className="w-5 h-5 text-[#ff003c]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold font-display text-white uppercase tracking-wider">
                PAINEL DE GERENCIAMENTO <span className="text-[#ff003c]">BLOOD STORE</span>
              </h1>
              <span className="px-2 py-0.5 bg-green-950/60 border border-green-500 font-mono text-[10px] text-green-400 uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                ADMIN LOGADO
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              Alterações aplicadas aqui são refletidas na loja instantaneamente sem precisar recarregar a página.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => setActiveView('home')}
            className="btn-cyber-outline py-2 px-4 text-xs flex items-center gap-1.5"
          >
            <span>IR PARA A LOJA</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={logoutAdmin}
            className="py-2 px-4 bg-red-950/60 border border-red-500 hover:bg-red-900/60 text-red-300 font-mono text-xs flex items-center gap-1.5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>SAIR DO PAINEL</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-800 mb-8 pb-2 gap-2 sm:gap-4 select-none">
        <button
          onClick={() => setAdminTab('overview')}
          className={`px-4 sm:px-6 py-3 font-mono text-xs sm:text-sm font-bold uppercase transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            adminTab === 'overview'
              ? 'text-[#ff003c] border-[#ff003c] bg-[#ff003c]/10'
              : 'text-gray-400 border-transparent hover:text-white hover:bg-gray-900/40'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Visão Geral</span>
        </button>

        <button
          onClick={() => setAdminTab('products')}
          className={`px-4 sm:px-6 py-3 font-mono text-xs sm:text-sm font-bold uppercase transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            adminTab === 'products'
              ? 'text-[#ff003c] border-[#ff003c] bg-[#ff003c]/10'
              : 'text-gray-400 border-transparent hover:text-white hover:bg-gray-900/40'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Gerenciar Produtos</span>
        </button>

        <button
          onClick={() => setAdminTab('terms')}
          className={`px-4 sm:px-6 py-3 font-mono text-xs sm:text-sm font-bold uppercase transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            adminTab === 'terms'
              ? 'text-[#ff003c] border-[#ff003c] bg-[#ff003c]/10'
              : 'text-gray-400 border-transparent hover:text-white hover:bg-gray-900/40'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Regras e Termos</span>
        </button>

        <button
          onClick={() => setAdminTab('settings')}
          className={`px-4 sm:px-6 py-3 font-mono text-xs sm:text-sm font-bold uppercase transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            adminTab === 'settings'
              ? 'text-[#ff003c] border-[#ff003c] bg-[#ff003c]/10'
              : 'text-gray-400 border-transparent hover:text-white hover:bg-gray-900/40'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Configurações Globais</span>
        </button>
      </div>

      {/* Tab Content Render */}
      <div className="pb-12">
        {adminTab === 'overview' && <OverviewView />}
        {adminTab === 'products' && <ProductsView />}
        {adminTab === 'terms' && <TermsView />}
        {adminTab === 'settings' && <SettingsView />}
      </div>
    </section>
  );
};
