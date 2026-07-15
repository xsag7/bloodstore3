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
    // Copy product name to clipboard so user can easily paste in Discord ticket
    navigator.clipboard.writeText(`Quero comprar: ${product.name} (R$ ${product.price.toFixed(2)})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);

    // Open Discord in new tab
    window.open(discordUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      onClick={() => onSelectProduct && onSelectProduct(product)}
      className="hud-card flex flex-col justify-between h-full group cursor-pointer overflow-hidden transition-all duration-300"
    >
      {/* Top Banner & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-[#16161c]">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          onError={(e) => {
            // Fallback image if external URL fails
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121218] via-transparent to-transparent opacity-90" />

        {/* Tag Pill */}
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#0b0b0b]/90 border border-[#ff003c] font-mono text-[11px] text-white tracking-wider uppercase flex items-center gap-1.5">
          <Tag className="w-3 h-3 text-[#ff003c]" />
          <span>{product.tag}</span>
        </div>

        {/* Status or Promotional Badge */}
        {product.badge && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#ff003c] font-display font-bold text-[11px] text-white tracking-wide uppercase shadow-lg animate-pulse">
            {product.badge}
          </div>
        )}

        {/* Status Indicator Pill */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-0.5 bg-[#0b0b0b]/80 border border-gray-700/60 font-mono text-[10px]">
          <span className={`w-2 h-2 rounded-full ${
            product.status === 'DISPONÍVEL' ? 'bg-green-500 animate-ping' :
            product.status === 'PROMOÇÃO' ? 'bg-[#00f0ff]' : 'bg-red-500'
          }`} />
          <span className="text-gray-200 uppercase">{product.status}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="font-mono text-xs text-[#ff003c] mb-1 uppercase tracking-widest flex items-center gap-1">
            <span>// ID: {product.slug.toUpperCase()}</span>
          </div>
          
          <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-[#ff003c] transition-colors line-clamp-1 mb-2 font-display">
            {product.name}
          </h3>

          <p className="text-sm text-gray-300 line-clamp-2 font-light mb-4 leading-relaxed">
            {product.description}
          </p>

          {/* Bullet Features */}
          {product.features && product.features.length > 0 && (
            <ul className="mb-5 space-y-1.5 border-t border-gray-800/80 pt-3">
              {product.features.slice(0, 3).map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                  <Sparkles className="w-3 h-3 text-[#ff003c] flex-shrink-0" />
                  <span className="truncate">{feat}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Price & Action Area */}
        <div className="pt-3 border-t border-[#ff003c]/20 flex items-center justify-between gap-3 mt-auto">
          <div>
            <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">A partir de</div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl md:text-2xl font-black font-mono text-white tracking-tight">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              {product.originalPrice && (
                <span className="text-xs font-mono text-gray-500 line-through">
                  R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>
          </div>

          <button 
            onClick={handleBuyClick}
            disabled={product.status === 'ESGOTADO'}
            className={`btn-cyber py-2.5 px-4 text-xs font-bold tracking-wider flex items-center gap-1.5 ${
              product.status === 'ESGOTADO' ? 'opacity-50 cursor-not-allowed bg-gray-800 border-gray-700 shadow-none' : ''
            }`}
            title="Ao clicar, você será redirecionado para o nosso Discord e o nome do item será copiado"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span>COPIADO!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>COMPRAR</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
