import React from 'react';
import { useStore } from '../context/StoreContext';

export const Footer = () => {
  const { config } = useStore();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src={config.logoUrl || "/fotos e videos/BloodstoreLogo1.png"} 
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }} 
            alt={config.storeName} 
            style={{ maxHeight: '32px' }} 
          />
          <div className="brand-logo-icon" style={{ display: 'none', width: '32px', height: '32px', fontSize: '1rem' }}>
            <i className="fa-solid fa-droplet"></i>
          </div>
          <strong style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.1rem', color: '#fff' }}>
            {config.storeName}
          </strong>
        </div>
        <p className="footer-text">
          &copy; {new Date().getFullYear()} {config.storeName}. Todos os direitos reservados. Design inspirado em servidores profissionais | Powered by Blood Team
        </p>
      </div>
    </footer>
  );
};
