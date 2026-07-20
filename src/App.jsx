import React, { useState, useEffect } from 'react';
import { StoreProvider } from './context/StoreContext';
import { StoreFront } from './pages/StoreFront';
import { AdminDashboard } from './pages/AdminDashboard';
import { CheckoutPage } from './pages/CheckoutPage';
import { ClientOrdersPage } from './pages/ClientOrdersPage';
import './index.css';

export default function App() {
  const resolveRoute = () => {
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    
    if (hash.startsWith('#/administracao') || hash.startsWith('#/admin') || hash.startsWith('#/staff')) return 'admin';
    if (path.startsWith('/administracao') || path.startsWith('/admin') || path.startsWith('/staff')) return 'admin';
    
    if (hash.startsWith('#/checkout') || path.startsWith('/checkout')) return 'checkout';
    if (hash.startsWith('#/pedidos') || path.startsWith('/pedidos')) return 'orders';
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

  const navigateToAdmin = () => {
    if (window.location.pathname !== '/') window.history.pushState(null, '', '/');
    window.location.hash = '#/administracao';
    setCurrentRoute('admin');
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
        {currentRoute === 'admin' && (
          <AdminDashboard onExitAdmin={navigateToStore} />
        )}
        {currentRoute === 'checkout' && (
          <CheckoutPage onBackToStore={navigateToStore} />
        )}
        {currentRoute === 'orders' && (
          <ClientOrdersPage onBackToStore={navigateToStore} />
        )}
        {currentRoute === 'store' && (
          <StoreFront onOpenAdmin={navigateToAdmin} onOpenCheckout={navigateToCheckout} />
        )}
      </div>
    </StoreProvider>
  );
}
