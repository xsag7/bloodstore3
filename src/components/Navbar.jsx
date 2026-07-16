import React from 'react';
import { useStore } from '../context/StoreContext';

export const Navbar = ({ onOpenAdmin }) => {
  const { config } = useStore();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <a href="#inicio" className="navbar-brand">
          <img 
            src={config.logoUrl || "/fotos e videos/BloodstoreLogo1.png"} 
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
          <a href="#termos" className="nav-link">Termos</a>
        </nav>

        <div className="navbar-actions">
          <a 
            href={config.discordInvite || "https://discord.gg/Gvbg5WYPBP"} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-discord-nav"
          >
            <i className="fa-brands fa-discord"></i> Entrar no Discord
          </a>
        </div>
      </div>
    </header>
  );
};
