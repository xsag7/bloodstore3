import React from 'react';
import { useStore } from '../context/StoreContext';
import { Shield, Terminal, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { config, setActiveView } = useStore();

  const handleScrollToProducts = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveView('home');
    setTimeout(() => {
      const el = document.getElementById('produtos');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="footer-container">
      <div className="footer-grid">
        {/* Col 1: Brand Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', cursor: 'pointer' }} onClick={() => setActiveView('home')}>
            <div style={{ width: '40px', height: '40px', background: '#121218', border: '1px solid var(--color-neon-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }} className="neon-glow">
              <img 
                src="/fotos/Gemini_Generated_Image_v1yi2kv1yi2kv1yi.png" 
                alt="Blood Crest" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#ffffff', letterSpacing: '1px' }}>
              {config.storeName.toUpperCase()}
            </span>
          </div>
          <p style={{ color: '#a0a0b2', fontSize: '0.86rem', lineHeight: 1.6, fontWeight: 300, marginBottom: '1.25rem' }}>
            A suprema referência em vendas de infoprodutos e serviços do Brasil. Entregas rápidas, seguras e com garantia total em nosso Discord.
          </p>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#666677' }}>
            © {new Date().getFullYear()} {config.storeName}. Todos os direitos reservados.
          </div>
        </div>

        {/* Col 2: Quick Navigation */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-neon-red)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.25rem' }}>
            // NAVEGAÇÃO
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: '#d0d0e0' }}>
            <li>
              <button onClick={() => setActiveView('home')} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontFamily: 'inherit' }}>
                → Página Inicial
              </button>
            </li>
            <li>
              <a href="#produtos" onClick={handleScrollToProducts} style={{ color: 'inherit', textDecoration: 'none' }}>
                → Catálogo de Produtos
              </a>
            </li>
            <li>
              <button onClick={() => setActiveView('terms')} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontFamily: 'inherit' }}>
                → Termos & Garantias
              </button>
            </li>
            <li>
              <a href={config.globalDiscordUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-neon-cyan)', textDecoration: 'none' }}>
                → Servidor Discord VIP
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Security & Trust */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-neon-red)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.25rem' }}>
            // GARANTIA & SEGURANÇA
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.84rem', color: '#a0a0b2', fontWeight: 300 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Shield style={{ width: '16px', height: '16px', color: 'var(--color-neon-red)', flexShrink: 0 }} />
              <span>Transações 100% Verificadas</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Terminal style={{ width: '16px', height: '16px', color: 'var(--color-neon-cyan)', flexShrink: 0 }} />
              <span>Entrega Automatizada & Segura</span>
            </div>
            <div style={{ padding: '0.75rem', background: '#121218', border: '1px solid rgba(255,0,60,0.3)', borderRadius: '6px', marginTop: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#ffffff' }}>
              Kiover developer
            </div>
          </div>
        </div>

        {/* Col 4: Community Call */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-neon-red)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.25rem' }}>
            // ATENDIMENTO
          </h4>
          <p style={{ color: '#a0a0b2', fontSize: '0.86rem', lineHeight: 1.6, fontWeight: 300, marginBottom: '1.25rem' }}>
            Dúvidas no pré-venda ou pós-venda? Abra um ticket em nosso servidor para falar diretamente com nossa equipe.
          </p>
          <a 
            href={config.globalDiscordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cyber-outline"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.78rem', width: '100%' }}
          >
            <span>SUPORTE VIA DISCORD</span>
            <ExternalLink style={{ width: '14px', height: '14px' }} />
          </a>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '3rem auto 0 auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#666677' }}>
        <div>BLOOD STORE </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span>Desenvolvido com excelência por Kioverdll</span>
          <Heart style={{ width: '12px', height: '12px', color: 'var(--color-neon-red)', fill: 'var(--color-neon-red)' }} />
        </div>
      </div>
    </footer>
  );
};
