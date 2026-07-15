import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Shield, Terminal, Lock, Unlock, Menu, X, Flame, Sparkles, ExternalLink } from 'lucide-react';

interface NavbarProps {
  onOpenAdminLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdminLogin }) => {
  const { config, isAdminLoggedIn, activeView, setActiveView, logoutAdmin } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: 'home' | 'terms' | 'admin') => {
    setActiveView(view);
    setMobileMenuOpen(false);
    if (view === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleScrollToProducts = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activeView !== 'home') {
      setActiveView('home');
      setTimeout(() => {
        const el = document.getElementById('produtos');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('produtos');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Ticker / Announcement Bar */}
      {config.announcementBanner && (
        <div className="w-full bg-[#ff003c]/15 border-b border-[#ff003c]/30 py-1.5 px-4 text-center text-xs md:text-sm font-mono text-[#ff003c] font-semibold tracking-wider flex items-center justify-center gap-2 overflow-hidden">
          <Sparkles className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
          <span className="truncate">{config.announcementBanner}</span>
          <Sparkles className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
        </div>
      )}

      {/* Main Header */}
      <nav className="w-full bg-[#0b0b0b]/90 backdrop-blur-md border-b border-[#ff003c]/30 px-4 md:px-8 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 bg-[#121218] border border-[#ff003c] flex items-center justify-center neon-glow group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 text-[#ff003c] animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ff003c] rounded-full animate-ping" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl md:text-2xl font-display tracking-wider text-white group-hover:text-[#ff003c] transition-colors neon-glow-text">
              {config.storeName.toUpperCase()}
            </span>
            <span className="text-[10px] font-mono text-[#ff003c] tracking-widest -mt-1 uppercase">
              // Cyber Gamer Supremacy
            </span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 font-medium text-sm tracking-wide">
          <button 
            onClick={() => handleNavClick('home')}
            className={`transition-colors py-1 relative ${
              activeView === 'home' ? 'text-[#ff003c] font-semibold' : 'text-gray-300 hover:text-white'
            }`}
          >
            INÍCIO
            {activeView === 'home' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ff003c] neon-glow" />
            )}
          </button>

          <a 
            href="#produtos"
            onClick={handleScrollToProducts}
            className="text-gray-300 hover:text-[#ff003c] transition-colors py-1 cursor-pointer"
          >
            PRODUTOS
          </a>

          <button 
            onClick={() => handleNavClick('terms')}
            className={`transition-colors py-1 relative flex items-center gap-1.5 ${
              activeView === 'terms' ? 'text-[#ff003c] font-semibold' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4 text-[#ff003c]" />
            TERMOS E CONDIÇÕES
            {activeView === 'terms' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ff003c] neon-glow" />
            )}
          </button>

          <a 
            href={config.globalDiscordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-[#00f0ff] transition-colors flex items-center gap-1 py-1"
          >
            <span>DISCORD VIP</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Admin & Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-none font-mono text-xs border transition-all ${
                  activeView === 'admin' 
                    ? 'bg-[#ff003c] text-white border-[#ff003c] neon-glow' 
                    : 'bg-[#14141e] text-[#00f0ff] border-[#00f0ff]/50 hover:border-[#00f0ff]'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 animate-pulse" />
                <span>PAINEL ADMIN</span>
              </button>
              <button 
                onClick={logoutAdmin}
                title="Sair do modo Admin"
                className="p-1.5 bg-[#191922] border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <Lock className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAdminLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121218] border border-[#ff003c]/40 text-gray-300 hover:text-white hover:border-[#ff003c] text-xs font-mono tracking-wider transition-all"
            >
              <Unlock className="w-3.5 h-3.5 text-[#ff003c]" />
              <span>ADMIN</span>
            </button>
          )}

          <a 
            href={config.globalDiscordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cyber text-xs py-2 px-4"
          >
            <span>ENTRAR NO DISCORD</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 border border-[#ff003c]/50 text-[#ff003c] bg-[#121218] hover:bg-[#ff003c]/10 transition-colors"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#121218]/95 backdrop-blur-xl border-b border-[#ff003c]/50 px-5 py-6 flex flex-col gap-4 animate-fadeIn shadow-2xl">
          <button 
            onClick={() => handleNavClick('home')}
            className={`text-left text-base font-semibold py-2 border-b border-gray-800 flex items-center justify-between ${
              activeView === 'home' ? 'text-[#ff003c]' : 'text-gray-200'
            }`}
          >
            <span>INÍCIO</span>
            <span className="font-mono text-xs text-[#ff003c]">// 01</span>
          </button>

          <a 
            href="#produtos"
            onClick={handleScrollToProducts}
            className="text-left text-base font-semibold py-2 border-b border-gray-800 text-gray-200 flex items-center justify-between"
          >
            <span>PRODUTOS DA LOJA</span>
            <span className="font-mono text-xs text-[#ff003c]">// 02</span>
          </a>

          <button 
            onClick={() => handleNavClick('terms')}
            className={`text-left text-base font-semibold py-2 border-b border-gray-800 flex items-center justify-between ${
              activeView === 'terms' ? 'text-[#ff003c]' : 'text-gray-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#ff003c]" />
              TERMOS E CONDIÇÕES
            </span>
            <span className="font-mono text-xs text-[#ff003c]">// 03</span>
          </button>

          <a 
            href={config.globalDiscordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-left text-base font-semibold py-2 border-b border-gray-800 text-[#00f0ff] flex items-center justify-between"
          >
            <span>DISCORD OFICIAL</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <div className="pt-3 flex flex-col gap-2.5">
            <a 
              href={config.globalDiscordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cyber w-full py-3 text-center text-sm"
            >
              COMPRAR VIA DISCORD
            </a>

            {isAdminLoggedIn ? (
              <div className="flex gap-2">
                <button 
                  onClick={() => handleNavClick('admin')}
                  className="flex-1 py-2.5 bg-[#ff003c] text-white font-mono text-xs font-bold border border-[#ff003c] neon-glow flex items-center justify-center gap-2"
                >
                  <Terminal className="w-4 h-4" />
                  PAINEL ADMIN
                </button>
                <button 
                  onClick={logoutAdmin}
                  className="px-4 py-2.5 bg-red-950/50 border border-red-500 text-red-300 font-mono text-xs"
                >
                  SAIR
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminLogin();
                }}
                className="w-full py-2.5 bg-[#191922] border border-[#ff003c]/40 text-gray-300 font-mono text-xs flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4 text-[#ff003c]" />
                ACESSO ADMINISTRADOR
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
