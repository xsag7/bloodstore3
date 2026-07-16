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
      className="bg-[#0e1018] border border-white/10 hover:border-[#ff003c]/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col justify-between group cursor-pointer"
    >
      {/* Image Banner Section */}
      <div className="h-44 w-full relative overflow-hidden bg-[#141622]">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1018] via-transparent to-transparent opacity-80" />

        {/* Category Pill (Top Left) */}
        <div className="absolute top-3 left-3 bg-[#090a0f]/85 backdrop-blur-md border border-white/15 text-slate-200 text-[10px] px-2.5 py-1 rounded-full font-bold tracking-wide uppercase flex items-center gap-1.5 shadow-sm">
          <Tag className="w-3 h-3 text-[#ff003c]" />
          <span>{product.tag}</span>
        </div>

        {/* Status Badge (Top Right) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-[#090a0f]/85 backdrop-blur-md border border-white/15 rounded-full text-[10px] font-bold uppercase shadow-sm">
          <span className={`w-2 h-2 rounded-full ${
            product.status === 'DISPONÍVEL' ? 'bg-emerald-400' : 
            product.status === 'PROMOÇÃO' ? 'bg-[#ff003c]' : 'bg-amber-400'
          }`} />
          <span className="text-slate-200">{product.status}</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-extrabold text-white font-display group-hover:text-[#ff003c] transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed font-normal">
            {product.description}
          </p>

          {/* Highlight Feature Pill */}
          {product.features && product.features.length > 0 && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#161828] border border-white/10 rounded-xl text-[11px] text-slate-300 max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-[#ff003c] flex-shrink-0" />
              <span className="truncate font-medium">{product.features[0]}</span>
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-3.5 border-t border-white/10 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">A partir de</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-white font-mono">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-500 line-through font-mono">
                  R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Add Button */}
            <button 
              onClick={handleAddToCart}
              disabled={product.status === 'ESGOTADO'}
              className="p-2 bg-[#161828] hover:bg-[#ff003c] border border-white/12 hover:border-[#ff003c] text-white rounded-xl transition-all shadow-sm flex items-center justify-center"
              title="Adicionar ao Carrinho"
            >
              {addedToast ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
            </button>

            {/* Buy Now / Comprar Button */}
            <button 
              onClick={handleBuyNow}
              disabled={product.status === 'ESGOTADO'}
              className="px-4 py-2 bg-[#ff003c] hover:bg-[#d90033] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
              title="Comprar Agora"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Comprar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
