import React, { useState } from 'react';
import type { Product } from '../../types/store';
import { useStore } from '../../context/StoreContext';
import { X, Check, ShoppingCart, ExternalLink, Sparkles, ShieldCheck, MessageSquare, Plus } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { config, addToCart, setActiveView } = useStore();
  const [addedToast, setAddedToast] = useState(false);

  if (!product) return null;

  const discordUrl = product.discordUrl || config.globalDiscordUrl;
  const orderMessage = `Olá equipe Blood Store! Quero adquirir o produto:\n👉 Item: ${product.name}\n💰 Valor: R$ ${product.price.toFixed(2)}\n🏷️ Tag: ${product.tag}`;

  const handleProceedToDiscord = () => {
    navigator.clipboard.writeText(orderMessage);
    window.open(discordUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#0e1018] border border-white/12 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#141622] border-b border-white/10 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#ff003c] uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>• Detalhes & Especificações do Ativo</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Image & Price Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="relative h-56 w-full overflow-hidden rounded-xl border border-white/10 bg-[#141622]">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop';
                }}
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#090a0f]/85 backdrop-blur-md border border-white/15 rounded-full text-[10px] font-bold text-slate-200 uppercase tracking-wide">
                {product.tag}
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Código do Item: {product.slug}</span>
              <h2 className="text-2xl font-black text-white font-display leading-tight">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-3xl font-black font-mono text-[#ff003c]">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                {product.originalPrice && (
                  <span className="text-sm font-mono text-slate-500 line-through">
                    R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Suporte Garantido & Entrega Oficial</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Descrição & Detalhes</h4>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed bg-[#141622] p-4 rounded-xl border border-white/10 font-normal">
              {product.description}
            </p>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Inclusões e Recursos</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 bg-[#141622] border border-white/10 rounded-xl text-xs text-slate-200">
                    <Sparkles className="w-3.5 h-3.5 text-[#ff003c] flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How to Buy Step-by-Step Box */}
          <div className="p-4 bg-[#141622] border-l-4 border-[#ff003c] rounded-r-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase font-display">
              <MessageSquare className="w-4 h-4 text-[#ff003c]" />
              <span>Processo de Liberação & Entrega</span>
            </div>
            <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
              <li>Clique no botão de compra abaixo ou adicione o item ao seu carrinho.</li>
              <li>No checkout, informe seu nickname do Discord ou pague via PIX instantâneo.</li>
              <li>A liberação é registrada em tempo real no servidor com recibo de transação.</li>
            </ol>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 bg-[#141622] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 sticky bottom-0 rounded-b-2xl">
          <button 
            onClick={() => {
              addToCart(product, 1);
              setAddedToast(true);
              setTimeout(() => { setAddedToast(false); onClose(); }, 1200);
            }}
            className="px-5 py-2.5 bg-[#1a1d2e] hover:bg-[#ff003c] border border-white/12 hover:border-[#ff003c] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {addedToast ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
            <span>{addedToast ? 'Adicionado ao Carrinho!' : 'Adicionar ao Carrinho'}</span>
          </button>

          <div className="flex items-center gap-3 flex-1 justify-end">
            <button 
              onClick={handleProceedToDiscord}
              className="px-4 py-2.5 bg-[#1a1d2e] hover:bg-[#252a42] border border-white/12 text-slate-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
              title="Acessar suporte direto"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span>Atendimento Discord</span>
            </button>

            <button 
              onClick={() => {
                addToCart(product, 1);
                setActiveView('checkout');
                onClose();
              }}
              className="px-6 py-2.5 bg-[#ff003c] hover:bg-[#d90033] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#ff003c]/20 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Comprar / Ir para o Checkout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
