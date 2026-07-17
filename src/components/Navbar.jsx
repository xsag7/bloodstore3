import React from 'react';
import { useStore } from '../context/StoreContext';

export const Navbar = ({ onOpenAdmin }) => {
  const { config, currentUser, logout, orders } = useStore();

  const myOrdersCount = orders ? orders.length : 0;

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <a href="#inicio" className="navbar-brand">
          <img 
            src={config.logoUrl || "/fotos e videos/Bloodstore.png"} 
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }} 
            alt={config.storeName} 
            className="brand-logo-img" 
          />
          <div className="brand-logo-icon" style={{ display: 'none' }}>
            <i className="fa-solid fa-droplet"></i>
          </div>
          <span>{config.storeName}</span>
        </a>

        <nav className="navbar-links">
          <a href="#inicio" className="nav-link">Início</a>
          <a href="#catalogo" className="nav-link">Produtos</a>
          <a href="#/pedidos" className="nav-link" style={{ color: '#ff4d4d', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="fa-solid fa-box-open"></i> Meus Pedidos & Chat
          </a>
          <a href="#termos" className="nav-link">Termos</a>
        </nav>

        <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => {
              if (onOpenAdmin) onOpenAdmin();
              else window.location.hash = '#/staff';
            }} 
            className="btn-admin-nav"
            title="Acessar Painel Staff"
          >
            <i className="fa-solid fa-user-shield"></i> Staff
          </button>

          <a 
            href={config.discordInvite || "https://discord.gg/Gvbg5WYPBP"} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-discord-nav"
          >
            <i className="fa-brands fa-discord"></i> Comunidade
          </a>

          {currentUser && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1a1a26', padding: '4px 10px 4px 6px', borderRadius: '24px', border: '1px solid #2a2a3e' }}>
              <a href="#/pedidos" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#fff' }}>
                <img src={currentUser.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'} alt={currentUser.username} style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: '600', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.username}
                </span>
              </a>
              <button 
                onClick={logout} 
                title="Sair" 
                style={{ background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: '2px 4px', fontSize: '0.85rem' }}
              >
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
