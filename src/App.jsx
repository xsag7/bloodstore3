import React, { useState, useEffect } from 'react';
import { StoreProvider } from './context/StoreContext';
import { StoreFront } from './pages/StoreFront';
import { AdminDashboard } from './pages/AdminDashboard';
import { CheckoutPage } from './pages/CheckoutPage';
import { ClientOrdersPage } from './pages/ClientOrdersPage';
import './index.css';

export default function App() {
  const resolveRoute = () => {
    const hash = window.location.hash;
    const path = window.location.pathname;
    
    if (hash.startsWith('#/staff')) return 'staff';
    if (hash.startsWith('#/checkout')) return 'checkout';
    if (hash.startsWith('#/pedidos')) return 'orders';
    if (hash === '#/' || hash.startsWith('#/inicio') || hash.startsWith('#/catalogo') || hash.startsWith('#/termos')) return 'store';

    if (path.startsWith('/staff')) return 'staff';
    if (path.startsWith('/checkout')) return 'checkout';
    if (path.startsWith('/pedidos')) return 'orders';
    return 'store';
  };

  const [currentRoute, setCurrentRoute] = useState(resolveRoute);

  useEffect(() => {
    const handleRouteUpdate = () => {
      setCurrentRoute(resolveRoute());
    };

    window.addEventListener('hashchange', handleRouteUpdate);
    window.addEventListener('popstate', handleRouteUpdate);
    return () => {
      window.removeEventListener('hashchange', handleRouteUpdate);
      window.removeEventListener('popstate', handleRouteUpdate);
    };
  }, []);

  const navigateToStaff = () => {
    if (window.location.pathname !== '/') window.history.pushState(null, '', '/');
    window.location.hash = '#/staff';
    setCurrentRoute('staff');
  };

  const navigateToStore = () => {
    if (window.location.pathname !== '/') window.history.pushState(null, '', '/');
    window.location.hash = '#/';
    setCurrentRoute('store');
  };

  const navigateToCheckout = (prod) => {
    if (window.location.pathname !== '/') window.history.pushState(null, '', '/');
    window.location.hash = `#/checkout?id=${prod.id}`;
    setCurrentRoute('checkout');
  };

  return (
    <StoreProvider>
      <div className="app-main-wrap">
        {currentRoute === 'staff' && (
          <AdminDashboard onExitAdmin={navigateToStore} />
        )}
        {currentRoute === 'checkout' && (
          <CheckoutPage onBackToStore={navigateToStore} />
        )}
        {currentRoute === 'orders' && (
          <ClientOrdersPage onBackToStore={navigateToStore} />
        )}
        {currentRoute === 'store' && (
          <StoreFront onOpenAdmin={navigateToStaff} onOpenCheckout={navigateToCheckout} />
        )}
      </div>
    </StoreProvider>
  );
}
