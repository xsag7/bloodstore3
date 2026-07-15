import React from 'react';
import { useStore } from '../context/StoreContext';
import { Zap, ShieldCheck, Clock, ArrowDown, ExternalLink, Sparkles, Activity } from 'lucide-react';

export const Hero: React.FC = () => {
  const { config } = useStore();

  const handleScrollToProducts = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('produtos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      {/* Background Cyber Video & Overlay */}
      <div className="hero-video-bg">
        <video autoPlay loop muted playsInline>
          <source src="/fotos/videos/animation.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-overlay" />
      </div>

      {/* Decorative Ambient Glow */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', maxWidth: '900px', height: '280px', background: 'rgba(255, 0, 60, 0.16)', filter: 'blur(130px)', pointerEvents: 'none', borderRadius: '50%' }} />
      
      <div className="hero-content">
        {/* Status Pill Badge with Animated GIF */}
        <div className="status-pill animate-float">
          <img 
            src="/fotos/videos/a_3b92739a0066d125bf473beccfe5bbb1.gif" 
            alt="Pulse" 
            style={{ width: '16px', height: '16px', objectFit: 'contain' }}
          />
          <span style={{ color: 'var(--color-neon-red)', fontWeight: 700 }}>BLOOD </span>
          <span style={{ color: '#666677' }}>//</span>
          <span>SERVIDOR ONLINE </span>
          <Activity style={{ width: '14px', height: '14px', color: 'var(--color-neon-red)', marginLeft: '4px' }} />
        </div>

        {/* Brand Crest Circle */}
        <div className="brand-crest-box">
          <div className="brand-crest-circle neon-glow">
            <img 
              src="/fotos/Gemini_Generated_Image_v1yi2kv1yi2kv1yi (1).png" 
              alt="Blood Store Official Crest" 
            />
          </div>
          <div className="brand-crest-badge">
            STORE Blood
          </div>
        </div>

        {/* Perfectly Spaced Title */}
        <h1 className="hero-title">
          {config.bannerTitle.split(' ').map((word, i) => (
            <span 
              key={i} 
              className={`word-item ${
                word.toLowerCase().includes('supremacia') || word.toLowerCase().includes('gamer') || i % 3 === 1 
                  ? 'neon-glow-text' 
                  : ''
              }`}
              style={{ color: word.toLowerCase().includes('supremacia') || word.toLowerCase().includes('gamer') || i % 3 === 1 ? 'var(--color-neon-red)' : '#ffffff' }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          {config.bannerSubtitle}
        </p>

        {/* 4 Feature Badges Grid */}
        <div className="hero-badges-grid">
          <div className="badge-card hud-card">
            <div className="badge-icon">
              <Zap style={{ width: '22px', height: '22px' }} />
            </div>
            <div>
              <div className="badge-text-label">Entrega Rápida</div>
              <div className="badge-text-value">Em até 24 Horas</div>
            </div>
          </div>

          <div className="badge-card hud-card">
            <div className="badge-icon">
              <ShieldCheck style={{ width: '22px', height: '22px' }} />
            </div>
            <div>
              <div className="badge-text-label">Segurança Total</div>
              <div className="badge-text-value">Contas & Itens Reais</div>
            </div>
          </div>

          <div className="badge-card hud-card">
            <div className="badge-icon">
              <Clock style={{ width: '22px', height: '22px' }} />
            </div>
            <div>
              <div className="badge-text-label">Atendimento VIP</div>
              <div className="badge-text-value">Fura-fila Booster</div>
            </div>
          </div>

          <div className="badge-card hud-card">
            <div className="badge-icon">
              <Sparkles style={{ width: '22px', height: '22px' }} />
            </div>
            <div>
              <div className="badge-text-label">Forma de Pagamento</div>
              <div className="badge-text-value" style={{ color: 'var(--color-neon-red)' }}>PIX Instantâneo</div>
            </div>
          </div>
        </div>

        {/* Centered CTA Buttons */}
        <div className="hero-cta-group">
          <a 
            href="#produtos"
            onClick={handleScrollToProducts}
            className="btn-cyber animate-pulse-glow"
          >
            <span>VER PRODUTOS</span>
            <ArrowDown style={{ width: '18px', height: '18px' }} />
          </a>

          <a 
            href={config.globalDiscordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cyber-outline"
          >
            <span>COMUNIDADE DISCORD</span>
            <ExternalLink style={{ width: '16px', height: '16px' }} />
          </a>
        </div>

        {/* Centered 4-Column Stats Grid */}
        <div className="stats-grid">
          <div>
            <div className="stat-number">
              +{config.stats.totalSales.toLocaleString()}
            </div>
            <div className="stat-label">// Vendas Concluídas</div>
          </div>
          <div>
            <div className="stat-number" style={{ color: 'var(--color-neon-red)' }}>
              +{config.stats.activeUsers.toLocaleString()}
            </div>
            <div className="stat-label">// Membros Ativos</div>
          </div>
          <div>
            <div className="stat-number">
              {config.stats.satisfactionRate}
            </div>
            <div className="stat-label">// Satisfação Real</div>
          </div>
          <div>
            <div className="stat-number" style={{ color: 'var(--color-neon-cyan)' }}>
              ~{config.stats.averageDelivery}
            </div>
            <div className="stat-label">// Tempo de Resposta</div>
          </div>
        </div>
      </div>
    </section>
  );
};
