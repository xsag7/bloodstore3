import React, { useState, useEffect } from 'react';
import { StoreProvider } from './context/StoreContext';
import { StoreFront } from './pages/StoreFront';
import { AdminDashboard } from './pages/AdminDashboard';
import { CheckoutPage } from './pages/CheckoutPage';
import { ClientOrdersPage } from './pages/ClientOrdersPage';
import './index.css';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash;
    const path = window.location.pathname;
    if (hash.startsWith('#/staff') || path.startsWith('/staff')) return 'staff';
    if (hash.startsWith('#/checkout') || path.startsWith('/checkout')) return 'checkout';
    if (hash.startsWith('#/pedidos') || path.startsWith('/pedidos')) return 'orders';
    return 'store';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/staff')) {
        setCurrentRoute('staff');
      } else if (hash.startsWith('#/checkout')) {
        setCurrentRoute('checkout');
      } else if (hash.startsWith('#/pedidos')) {
        setCurrentRoute('orders');
      } else {
        setCurrentRoute('store');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToStaff = () => {
    window.location.hash = '#/staff';
    setCurrentRoute('staff');
  };

  const navigateToStore = () => {
    window.location.hash = '#/';
    setCurrentRoute('store');
  };

  const navigateToCheckout = (prod) => {
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
