import React, { useState } from 'react';
import type { Product } from '../../types/store';
import { useStore } from '../../context/StoreContext';
import { X, Check, ShoppingCart, ExternalLink, Sparkles, ShieldCheck, Copy, MessageSquare } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { config } = useStore();
  const [copiedText, setCopiedText] = useState(false);

  if (!product) return null;

  const discordUrl = product.discordUrl || config.globalDiscordUrl;
  const orderMessage = `Olá equipe Blood Store! Quero adquirir o produto:\n👉 Item: ${product.name}\n💰 Valor: R$ ${product.price.toFixed(2)}\n🏷️ Tag: ${product.tag}`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(orderMessage);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 3000);
  };

  const handleProceedToDiscord = () => {
    navigator.clipboard.writeText(orderMessage);
    window.open(discordUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#121218] border-2 border-[#ff003c] neon-glow-lg max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#191922] border-b border-[#ff003c]/40 sticky top-0 z-10">
          <div className="flex items-center gap-2 font-mono text-xs text-[#ff003c] uppercase tracking-widest">
            <img 
              src="/fotos/videos/a_3b92739a0066d125bf473beccfe5bbb1.gif" 
              alt="Verified" 
              className="w-4 h-4 object-contain rounded-full border border-[#ff003c]"
            />
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>// BLOOD STORE : ESPECIFICAÇÃO DE PRODUTO //</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#ff003c]/20 border border-transparent hover:border-[#ff003c] transition-all"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Image & Price Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="relative h-56 w-full overflow-hidden border border-[#ff003c]/50 bg-[#0b0b0b]">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop';
                }}
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#0b0b0b]/90 border border-[#ff003c] text-xs font-mono text-[#ff003c] uppercase">
                {product.tag}
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-3">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">// CÓDIGO: {product.slug}</span>
              <h2 className="text-2xl font-black text-white font-display leading-tight">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl font-black font-mono text-[#ff003c]">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                {product.originalPrice && (
                  <span className="text-sm font-mono text-gray-500 line-through">
                    R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#ff003c]/10 border border-[#ff003c]/40 text-xs text-gray-200">
                <ShieldCheck className="w-4 h-4 text-[#ff003c]" />
                <span>Garantia de Entrega Blood Store</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-mono text-[#ff003c] uppercase tracking-wider mb-2">// DESCRIÇÃO DO PRODUTO</h4>
            <p className="text-gray-300 text-sm leading-relaxed font-light bg-[#0b0b0b]/80 p-4 border border-gray-800">
              {product.description}
            </p>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div>
              <h4 className="text-xs font-mono text-[#ff003c] uppercase tracking-wider mb-2">// VANTAGENS & INCLUSÕES</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 bg-[#16161f] border border-[#ff003c]/20 text-xs text-gray-200">
                    <Sparkles className="w-3.5 h-3.5 text-[#ff003c] flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How to Buy Step-by-Step Box */}
          <div className="p-4 bg-[#14141d] border-l-4 border-[#ff003c] space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase font-display">
              <MessageSquare className="w-4 h-4 text-[#ff003c]" />
              <span>COMO FINALIZAR SUA COMPRA VIA DISCORD</span>
            </div>
            <ol className="text-xs text-gray-300 space-y-1.5 list-decimal list-inside font-mono">
              <li>Clique no botão abaixo para entrar em nosso servidor do Discord.</li>
              <li>Abra um Ticket de Atendimento na categoria de compras.</li>
              <li>Sua mensagem com o produto será copiada automaticamente. Cole no ticket!</li>
              <li>Realize o pagamento via PIX com nosso atendente e receba seu produto em até 24h.</li>
            </ol>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 bg-[#161620] border-t border-[#ff003c]/40 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0">
          <button 
            onClick={handleCopyMessage}
            className="w-full sm:w-auto px-4 py-3 bg-[#191922] border border-[#ff003c]/50 hover:border-[#ff003c] text-white font-mono text-xs flex items-center justify-center gap-2 transition-all"
          >
            {copiedText ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span>MENSAGEM COPIADA COM SUCESSO!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#ff003c]" />
                <span>COPIAR PEDIDO PARA ABRIR NO DISCORD</span>
              </>
            )}
          </button>

          <button 
            onClick={handleProceedToDiscord}
            className="btn-cyber w-full sm:w-auto py-3 px-6 text-sm flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>COMPRAR AGORA NO DISCORD</span>
            <ExternalLink className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
