import React, { useState } from 'react';
import type { Product } from '../../types/store';
import { useStore } from '../../context/StoreContext';
import { ShoppingCart, Check, Sparkles, Tag, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { addToCart, setActiveView } = useStore();
  const [addedToast, setAddedToast] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.status === 'ESGOTADO') return;
    addToCart(product, 1);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.status === 'ESGOTADO') return;
    addToCart(product, 1);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      onClick={() => onSelectProduct && onSelectProduct(product)}
      className="product-card hud-card"
    >
      {/* Top Banner & Badges (Compact 135px height) */}
      <div className="product-img-wrapper">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop';
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #121218 5%, transparent 90%)', opacity: 0.9 }} />

        {/* Tag Pill */}
        <div style={{ position: 'absolute', top: '8px', left: '8px', padding: '0.2rem 0.55rem', background: 'rgba(11,11,11,0.9)', border: '1px solid var(--color-neon-red)', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#ffffff', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Tag style={{ width: '10px', height: '10px', color: 'var(--color-neon-red)' }} />
          <span>{product.tag}</span>
        </div>

        {/* Promotional Badge */}
        {product.badge && (
          <div style={{ position: 'absolute', top: '8px', right: '8px', padding: '0.2rem 0.55rem', background: 'var(--color-neon-red)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.62rem', color: '#ffffff', textTransform: 'uppercase', boxShadow: '0 0 10px rgba(255,0,60,0.6)' }}>
            {product.badge}
          </div>
        )}

        {/* Status Pill */}
        <div style={{ position: 'absolute', bottom: '6px', right: '8px', display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.12rem 0.45rem', background: 'rgba(11,11,11,0.85)', border: '1px solid rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#e0e0e0', textTransform: 'uppercase' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: product.status === 'DISPONÍVEL' ? '#22c55e' : product.status === 'PROMOÇÃO' ? '#00f0ff' : '#ef4444' }} />
          <span>{product.status}</span>
        </div>
      </div>

      {/* Card Content (Compact Padding & Fonts) */}
      <div className="product-body">
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-neon-red)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            // ID: {product.slug.toUpperCase()}
          </div>
          
          <h3 className="line-clamp-1" style={{ fontSize: '1.02rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-display)', marginBottom: '0.35rem', lineHeight: 1.2 }}>
            {product.name}
          </h3>

          <p className="line-clamp-2" style={{ fontSize: '0.78rem', color: '#a0a0b2', marginBottom: '0.65rem', lineHeight: 1.4, fontWeight: 300 }}>
            {product.description}
          </p>

          {/* 1 Compact Highlight Feature */}
          {product.features && product.features.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: '#d0d0e0', marginBottom: '0.8rem', background: 'rgba(255,0,60,0.06)', padding: '0.35rem 0.5rem', borderLeft: '2px solid var(--color-neon-red)' }}>
              <Sparkles style={{ width: '12px', height: '12px', color: 'var(--color-neon-red)', flexShrink: 0 }} />
              <span className="truncate">{product.features[0]}</span>
            </div>
          )}
        </div>

        {/* Price & Action Area (Compact Buttons) */}
        <div className="product-price-row">
          <div>
            <div style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: '#888899', textTransform: 'uppercase' }}>A partir de</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              {product.originalPrice && (
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#777788', textDecoration: 'line-through' }}>
                  R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {/* Quick Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              disabled={product.status === 'ESGOTADO'}
              className="btn-cyber-outline"
              style={{ padding: '0.45rem 0.65rem', fontSize: '0.75rem', opacity: product.status === 'ESGOTADO' ? 0.5 : 1 }}
              title="Adicionar ao Carrinho"
            >
              {addedToast ? <Check style={{ width: '14px', height: '14px', color: '#4ade80' }} /> : <Plus style={{ width: '14px', height: '14px', color: 'var(--color-neon-red)' }} />}
            </button>

            {/* Buy Now Button (Goes right to Checkout or opens Modal) */}
            <button 
              onClick={handleBuyNow}
              disabled={product.status === 'ESGOTADO'}
              className="btn-cyber"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.72rem', opacity: product.status === 'ESGOTADO' ? 0.5 : 1 }}
              title="Finalizar compra no Carrinho / Checkout"
            >
              <ShoppingCart style={{ width: '13px', height: '13px' }} />
              <span>COMPRAR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
