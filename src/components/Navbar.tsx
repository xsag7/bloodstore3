import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Shield, Menu, X, ExternalLink, Sparkles, ShoppingCart } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { config, activeView, setActiveView, cart } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalQuantity = cart.reduce((a, b) => a + b.quantity, 0);

  const handleNavClick = (view: 'home' | 'terms') => {
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
    <header className="navbar-header">
      {/* Announcement Bar */}
      {config.announcementBanner && (
        <div style={{ width: '100%', background: 'rgba(255, 0, 60, 0.15)', borderBottom: '1px solid rgba(255, 0, 60, 0.3)', padding: '0.45rem 1rem', textAlign: 'center', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--color-neon-red)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
          <img 
            src="/fotos/videos/a_3b92739a0066d125bf473beccfe5bbb1.gif" 
            alt="Status" 
            style={{ width: '16px', height: '16px', objectFit: 'contain', borderRadius: '50%', border: '1px solid var(--color-neon-red)' }}
          />
          <span>{config.announcementBanner}</span>
          <Sparkles style={{ width: '14px', height: '14px' }} />
        </div>
      )}

      {/* Main Bar */}
      <nav className="navbar-bar">
        {/* Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          className="navbar-brand"
        >
          <div className="navbar-logo-box neon-glow">
            <img 
              src="/fotos/Gemini_Generated_Image_v1yi2kv1yi2kv1yi.png" 
              alt="Blood Crest" 
            />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#ffffff', letterSpacing: '1px' }}>
              {config.storeName.toUpperCase()}
            </div>
            <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--color-neon-red)', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '-2px' }}>
              // 
            </div>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="navbar-links">
          <button 
            onClick={() => handleNavClick('home')}
            style={{ background: 'transparent', border: 'none', color: activeView === 'home' ? 'var(--color-neon-red)' : '#d0d0e0', fontWeight: activeView === 'home' ? 700 : 500, cursor: 'pointer', fontFamily: 'var(--font-main)', fontSize: '0.9rem', position: 'relative', padding: '0.3rem 0' }}
          >
            INÍCIO
            {activeView === 'home' && (
              <span style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '2px', background: 'var(--color-neon-red)' }} className="neon-glow" />
            )}
          </button>

          <a 
            href="#produtos"
            onClick={handleScrollToProducts}
            style={{ color: '#d0d0e0', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}
          >
            PRODUTOS
          </a>

          <button 
            onClick={() => handleNavClick('terms')}
            style={{ background: 'transparent', border: 'none', color: activeView === 'terms' ? 'var(--color-neon-red)' : '#d0d0e0', fontWeight: activeView === 'terms' ? 700 : 500, cursor: 'pointer', fontFamily: 'var(--font-main)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', position: 'relative', padding: '0.3rem 0' }}
          >
            <Shield style={{ width: '15px', height: '15px', color: 'var(--color-neon-red)' }} />
            TERMOS E CONDIÇÕES
            {activeView === 'terms' && (
              <span style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '2px', background: 'var(--color-neon-red)' }} className="neon-glow" />
            )}
          </button>

          <a 
            href={config.globalDiscordUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#d0d0e0', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <span>DISCORD VIP</span>
            <ExternalLink style={{ width: '14px', height: '14px' }} />
          </a>
        </div>

        {/* Desktop CTA & Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="hidden md:flex">
          <button 
            onClick={() => setActiveView('checkout')}
            className="btn-cyber-outline"
            style={{ padding: '0.6rem 1.1rem', fontSize: '0.78rem', position: 'relative' }}
          >
            <ShoppingCart style={{ width: '16px', height: '16px', color: 'var(--color-neon-red)' }} />
            <span>CARRINHO</span>
            {totalQuantity > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--color-neon-red)', color: '#ffffff', borderRadius: '50%', padding: '0.15rem 0.45rem', fontSize: '0.68rem', fontWeight: 900, boxShadow: '0 0 10px var(--color-neon-red)' }}>
                {totalQuantity}
              </span>
            )}
          </button>

          <a 
            href={config.globalDiscordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cyber"
            style={{ padding: '0.65rem 1.4rem', fontSize: '0.8rem' }}
          >
            <span>ENTRAR NO DISCORD</span>
          </a>
        </div>

        {/* Mobile Buttons (Cart + Menu Toggle) */}
        <div className="md:hidden" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button 
            onClick={() => setActiveView('checkout')}
            style={{ padding: '0.45rem 0.75rem', background: '#121218', border: '1px solid var(--color-neon-red)', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', position: 'relative' }}
          >
            <ShoppingCart style={{ width: '18px', height: '18px', color: 'var(--color-neon-red)' }} />
            {totalQuantity > 0 && (
              <span style={{ background: 'var(--color-neon-red)', color: '#ffffff', borderRadius: '50%', padding: '0.1rem 0.4rem', fontSize: '0.68rem', fontWeight: 900 }}>
                {totalQuantity}
              </span>
            )}
          </button>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ padding: '0.5rem', background: '#121218', border: '1px solid rgba(255,0,60,0.5)', color: 'var(--color-neon-red)', cursor: 'pointer', display: 'block' }}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X style={{ width: '24px', height: '24px' }} /> : <Menu style={{ width: '24px', height: '24px' }} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{ background: 'rgba(18,18,24,0.98)', borderBottom: '1px solid var(--color-neon-red)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} className="md:hidden">
          <button 
            onClick={() => handleNavClick('home')}
            style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', textAlign: 'left', color: activeView === 'home' ? 'var(--color-neon-red)' : '#ffffff', fontWeight: 700, fontSize: '1rem', display: 'flex', justifyContent: 'space-between' }}
          >
            <span>INÍCIO</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-neon-red)' }}>// 01</span>
          </button>

          <a 
            href="#produtos"
            onClick={handleScrollToProducts}
            style={{ textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', color: '#ffffff', fontWeight: 700, fontSize: '1rem', display: 'flex', justifyContent: 'space-between' }}
          >
            <span>PRODUTOS DA LOJA</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-neon-red)' }}>// 02</span>
          </a>

          <button 
            onClick={() => handleNavClick('terms')}
            style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', textAlign: 'left', color: activeView === 'terms' ? 'var(--color-neon-red)' : '#ffffff', fontWeight: 700, fontSize: '1rem', display: 'flex', justifyContent: 'space-between' }}
          >
            <span>TERMOS E CONDIÇÕES</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-neon-red)' }}>// 03</span>
          </button>

          <button 
            onClick={() => { setActiveView('checkout'); setMobileMenuOpen(false); }}
            style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', textAlign: 'left', color: activeView === 'checkout' ? 'var(--color-neon-red)' : '#ffffff', fontWeight: 700, fontSize: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingCart style={{ width: '18px', height: '18px', color: 'var(--color-neon-red)' }} />
              <span>CARRINHO DE COMPRAS ({totalQuantity})</span>
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-neon-red)' }}>// CART</span>
          </button>

          <a 
            href={config.globalDiscordUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: 'var(--color-neon-cyan)', fontWeight: 700, fontSize: '1rem', display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem' }}
          >
            <span>DISCORD OFICIAL</span>
            <ExternalLink style={{ width: '16px', height: '16px' }} />
          </a>
        </div>
      )}
    </header>
  );
};
