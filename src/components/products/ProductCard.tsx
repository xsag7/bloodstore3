import React, { useState } from 'react';
import type { Product } from '../../types/store';
import { useStore } from '../../context/StoreContext';
import { ShoppingCart, Check, Sparkles, Tag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { config } = useStore();
  const [copied, setCopied] = useState(false);

  const discordUrl = product.discordUrl || config.globalDiscordUrl;

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`Quero comprar: ${product.name} (R$ ${product.price.toFixed(2)})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    window.open(discordUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      onClick={() => onSelectProduct && onSelectProduct(product)}
      className="product-card hud-card"
    >
      {/* Top Banner & Badges */}
      <div className="product-img-wrapper">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop';
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #121218, transparent)', opacity: 0.85 }} />

        {/* Tag Pill */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', padding: '0.25rem 0.65rem', background: 'rgba(11,11,11,0.9)', border: '1px solid var(--color-neon-red)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#ffffff', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Tag style={{ width: '12px', height: '12px', color: 'var(--color-neon-red)' }} />
          <span>{product.tag}</span>
        </div>

        {/* Promotional Badge */}
        {product.badge && (
          <div style={{ position: 'absolute', top: '12px', right: '12px', padding: '0.25rem 0.65rem', background: 'var(--color-neon-red)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.68rem', color: '#ffffff', textTransform: 'uppercase', boxShadow: '0 0 10px rgba(255,0,60,0.6)' }}>
            {product.badge}
          </div>
        )}

        {/* Status Pill */}
        <div style={{ position: 'absolute', bottom: '12px', right: '12px', display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.15rem 0.55rem', background: 'rgba(11,11,11,0.85)', border: '1px solid rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#e0e0e0', textTransform: 'uppercase' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: product.status === 'DISPONÍVEL' ? '#22c55e' : product.status === 'PROMOÇÃO' ? '#00f0ff' : '#ef4444' }} />
          <span>{product.status}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="product-body">
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-neon-red)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            // ID: {product.slug.toUpperCase()}
          </div>
          
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-display)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
            {product.name}
          </h3>

          <p style={{ fontSize: '0.86rem', color: '#a0a0b2', marginBottom: '1.25rem', lineHeight: 1.5, fontWeight: 300 }}>
            {product.description}
          </p>

          {/* Bullet Features */}
          {product.features && product.features.length > 0 && (
            <ul style={{ marginBottom: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.85rem', listStyle: 'none' }}>
              {product.features.slice(0, 3).map((feat, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#d0d0e0', marginBottom: '0.4rem' }}>
                  <Sparkles style={{ width: '13px', height: '13px', color: 'var(--color-neon-red)', flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{feat}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Price & Action Area */}
        <div className="product-price-row">
          <div>
            <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#888899', textTransform: 'uppercase' }}>A partir de</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              {product.originalPrice && (
                <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: '#777788', textDecoration: 'line-through' }}>
                  R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>
          </div>

          <button 
            onClick={handleBuyClick}
            disabled={product.status === 'ESGOTADO'}
            className="btn-cyber"
            style={{ padding: '0.6rem 1.1rem', fontSize: '0.78rem', opacity: product.status === 'ESGOTADO' ? 0.5 : 1 }}
            title="Ao clicar, você será redirecionado para o nosso Discord e o nome do item será copiado"
          >
            {copied ? (
              <>
                <Check style={{ width: '16px', height: '16px', color: '#4ade80' }} />
                <span>COPIADO!</span>
              </>
            ) : (
              <>
                <ShoppingCart style={{ width: '16px', height: '16px' }} />
                <span>COMPRAR</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
