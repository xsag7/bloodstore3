import React from 'react';
import { useStore } from '../context/StoreContext';

export const Hero = () => {
  const { config } = useStore();
  const bannerUrl = config.bannerVideoUrl || "/fotos e videos/BloodstoreLogo2.png";
  const isVideo = bannerUrl.toLowerCase().endsWith('.mp4') || bannerUrl.toLowerCase().endsWith('.webm') || bannerUrl.startsWith('data:video');

  return (
    <section 
      id="inicio" 
      className="hero" 
      style={!isVideo ? { backgroundImage: `url("${bannerUrl}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      {isVideo && (
        <video 
          key={bannerUrl}
          className="hero-video-bg" 
          autoPlay 
          loop 
          muted 
          playsInline 
          src={bannerUrl}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
      <div className="hero-overlay"></div>

      <div className="container hero-content">
        <span className="hero-badge"><i className="fa-solid fa-bolt"></i> Entrega Rápida & Garantia Total</span>
        <h1 className="hero-title">{config.storeName}</h1>
        <p className="hero-slogan">{config.slogan}</p>
        <a href="#catalogo" className="btn-hero">
          Ver Catálogo <i className="fa-solid fa-arrow-down"></i>
        </a>
      </div>
    </section>
  );
};
