import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { CyberpunkBackground } from './components/ui/CyberpunkBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductsSection } from './components/products/ProductsSection';
import { TermsSection } from './components/terms/TermsSection';
import { DiscordBanner } from './components/DiscordBanner';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import './index.css';

const MainContent: React.FC = () => {
  const { activeView, isAdminLoggedIn } = useStore();
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-between relative selection:bg-[#ff003c] selection:text-white">
      {/* Animated Cyberpunk Grid & Particles Background */}
      <CyberpunkBackground />
      <div className="scanlines" />

      {/* Main Navigation */}
      <Navbar onOpenAdminLogin={() => setAdminLoginOpen(true)} />

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
              /* If not logged in when reaching admin view, prompt modal and show locked banner */
              <div className="py-24 px-4 text-center max-w-lg mx-auto space-y-6">
                <div className="hud-card p-8 border-2 border-[#ff003c] neon-glow">
                  <h2 className="text-2xl font-black text-white font-display uppercase mb-2">
                    Acesso Restrito ao Painel
                  </h2>
                  <p className="text-gray-400 text-sm mb-6">
                    Você precisa estar autenticado como administrador para acessar e modificar o catálogo da Blood Store.
                  </p>
                  <button 
                    onClick={() => setAdminLoginOpen(true)}
                    className="btn-cyber py-3 px-8 text-xs w-full"
                  >
                    DIGITAR SENHA DE ACESSO
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Admin Login Modal */}
      <AdminLoginModal 
        isOpen={adminLoginOpen} 
        onClose={() => setAdminLoginOpen(false)} 
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
