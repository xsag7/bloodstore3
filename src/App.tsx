import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { SecurityGuard } from './services/SecurityGuard';
import { CyberpunkBackground } from './components/ui/CyberpunkBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductsSection } from './components/products/ProductsSection';
import { TermsSection } from './components/terms/TermsSection';
import { DiscordBanner } from './components/DiscordBanner';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { Lock, ShieldAlert, Terminal } from 'lucide-react';
import './index.css';

const MainContent: React.FC = () => {
  const { activeView, setActiveView, isAdminLoggedIn, logoutAdmin } = useStore();
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);

  // Initialize DevTools Guard & check secret /admin route
  useEffect(() => {
    SecurityGuard.initDevToolsGuard();

    const checkAdminRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      
      if (path === '/admin' || hash === '#admin' || search.includes('view=admin')) {
        setActiveView('admin');
        if (!isAdminLoggedIn) {
          setAdminLoginOpen(true);
        }
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    return () => window.removeEventListener('popstate', checkAdminRoute);
  }, [isAdminLoggedIn, setActiveView]);

  // Activity tracking for Admin Session Inactivity Timeout (15 mins)
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    const recordActivity = () => {
      SecurityGuard.updateLastActivity();
    };

    window.addEventListener('mousemove', recordActivity, { passive: true });
    window.addEventListener('keydown', recordActivity, { passive: true });
    window.addEventListener('click', recordActivity, { passive: true });

    // Interval to check if idle timeout happened
    const idleTimer = setInterval(() => {
      const expired = SecurityGuard.checkIdleTimeout();
      if (expired) {
        logoutAdmin();
        setActiveView('home');
        setAdminLoginOpen(false);
        alert('🚨 SESSÃO ENCERRADA: Sua sessão de administrador expirou devido a mais de 15 minutos de inatividade.');
      }
    }, 15000);

    return () => {
      window.removeEventListener('mousemove', recordActivity);
      window.removeEventListener('keydown', recordActivity);
      window.removeEventListener('click', recordActivity);
      clearInterval(idleTimer);
    };
  }, [isAdminLoggedIn, logoutAdmin, setActiveView]);

  return (
    <div className="min-h-screen flex flex-col justify-between relative selection:bg-[#ff003c] selection:text-white">
      {/* Animated Cyberpunk Grid & Particles Background */}
      <CyberpunkBackground />
      <div className="scanlines" />

      {/* Main Navigation (No Admin Button visible for normal users) */}
      <Navbar />

      {/* Main Content Area based on View state */}
      <main className="flex-1 w-full relative z-10">
        {activeView === 'home' && (
          <div className="space-y-4 animate-fadeIn">
            <Hero />
            <ProductsSection />
            <DiscordBanner />
          </div>
        )}

        {activeView === 'terms' && (
          <div className="space-y-4 animate-fadeIn">
            <TermsSection />
            <DiscordBanner />
          </div>
        )}

        {activeView === 'admin' && (
          <div className="animate-fadeIn">
            {isAdminLoggedIn ? (
              <AdminDashboard />
            ) : (
              /* Secret Route Locked Banner when visited without active auth */
              <div className="py-24 px-4 text-center max-w-lg mx-auto space-y-6">
                <div className="hud-card p-8 sm:p-10 border-2 border-[#ff003c] neon-glow bg-[#121218] relative overflow-hidden">
                  <div className="w-16 h-16 bg-[#1a141a] border border-[#ff003c] mx-auto flex items-center justify-center mb-5 neon-glow">
                    <Lock className="w-8 h-8 text-[#ff003c] animate-pulse" />
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/80 border border-red-500 font-mono text-[11px] text-red-400 uppercase tracking-widest mb-3">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>ENDPOINT DE COMANDO SECRETO</span>
                  </div>
                  <h2 className="text-2xl font-black text-white font-display uppercase mb-2">
                    ROTA DE ACESSO RESTRITO
                  </h2>
                  <p className="text-gray-400 text-sm mb-6 font-light leading-relaxed">
                    Você acessou a URL secreta de comando (<strong className="text-white">/admin</strong>). Para gerenciar os produtos, termos e configurações, insira a palavra-passe de segurança.
                  </p>
                  <button 
                    onClick={() => setAdminLoginOpen(true)}
                    className="btn-cyber py-3.5 px-8 text-xs w-full flex items-center justify-center gap-2"
                  >
                    <Terminal className="w-4 h-4" />
                    <span>DIGITAR PASSCODE DE COMANDO</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Admin Security Login Modal */}
      <AdminLoginModal 
        isOpen={adminLoginOpen} 
        onClose={() => {
          setAdminLoginOpen(false);
          if (!isAdminLoggedIn && activeView === 'admin') {
            // If they cancel modal while on /admin without logging in, return to home
            setActiveView('home');
            window.history.pushState({}, '', '/');
          }
        }} 
      />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}

export default App;
