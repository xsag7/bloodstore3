import React from 'react';
import { useStore } from '../context/StoreContext';
import { ExternalLink, Users, ShieldCheck, Zap } from 'lucide-react';

export const DiscordBanner: React.FC = () => {
  const { config } = useStore();

  return (
    <section className="container-main">
      <div className="discord-banner-box neon-glow-lg">
        {/* Background Ambient Glow */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', background: 'rgba(255, 0, 60, 0.2)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }} />

        {/* Left Content */}
        <div style={{ maxWidth: '600px', zIndex: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.35rem 0.9rem', background: 'rgba(255, 0, 60, 0.15)', border: '1px solid var(--color-neon-red)', color: 'var(--color-neon-red)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.2rem' }}>
            <img 
              src="/fotos/videos/a_3b92739a0066d125bf473beccfe5bbb1.gif" 
              alt="Pulse" 
              style={{ width: '14px', height: '14px', objectFit: 'contain' }}
            />
            <span>// COMUNIDADE DISCORD BLINDADA</span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#ffffff', textTransform: 'uppercase', lineHeight: 1.15, marginBottom: '1rem' }}>
            JUNTE-SE À ELITE DA <span style={{ color: 'var(--color-neon-red)' }} className="neon-glow-text">{config.storeName}</span>
          </h2>

          <p style={{ color: '#c0c0d0', fontSize: '1rem', fontWeight: 300, lineHeight: 1.6, marginBottom: '1.8rem' }}>
            Entre agora no nosso Discord oficial para retirar seus produtos, participar de sorteios exclusivos de contas/infoprodutos e conversar com milhares de membros ativos todos os dias.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#e0e0e0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users style={{ width: '18px', height: '18px', color: 'var(--color-neon-red)' }} />
              <span>+{config.stats.activeUsers.toLocaleString()} Membros Ativos</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck style={{ width: '18px', height: '18px', color: 'var(--color-neon-cyan)' }} />
              <span>Suporte Anti-Quedas</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap style={{ width: '18px', height: '18px', color: '#ffee00' }} />
              <span>Entrega Imediata no Ticket</span>
            </div>
          </div>
        </div>

        {/* Right CTA */}
        <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' }}>
          <div style={{ width: '90px', height: '90px', borderRadius: '50%', border: '2px solid var(--color-neon-red)', overflow: 'hidden', background: '#121218', boxShadow: '0 0 20px rgba(255,0,60,0.5)' }}>
            <img 
              src="/fotos/Gemini_Generated_Image_v1yi2kv1yi2kv1yi.png" 
              alt="Crest" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <a 
            href={config.globalDiscordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cyber animate-pulse-glow"
            style={{ padding: '1rem 2.2rem', fontSize: '1rem', whiteSpace: 'nowrap' }}
          >
            <span>ENTRAR NO SERVIDOR VIP</span>
            <ExternalLink style={{ width: '18px', height: '18px' }} />
          </a>

          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#888899', textTransform: 'uppercase' }}>
            ⚡ Acesso Imediato & Gratuito
          </span>
        </div>
      </div>
    </section>
  );
};
