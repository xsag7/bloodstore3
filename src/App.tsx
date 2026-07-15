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
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
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
        setAdminLoginOpen(false);
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
              <AdminLoginPage />
            )}
          </div>
        )}

        {activeView === 'checkout' && (
          <div className="animate-fadeIn">
            <CheckoutPage />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Admin Security Login Modal (Only used if triggered outside of /admin route) */}
      <AdminLoginModal 
        isOpen={adminLoginOpen && activeView !== 'admin'} 
        onClose={() => {
          setAdminLoginOpen(false);
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
