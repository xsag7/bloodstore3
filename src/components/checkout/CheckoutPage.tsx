import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingCart, Trash2, Plus, Minus, Tag, ShieldCheck, QrCode, ExternalLink, Check, AlertCircle, Sparkles, ArrowLeft, Copy, Clock, CheckCircle2 } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, appliedCoupon, applyCoupon, setAppliedCoupon, updateCartQuantity, removeFromCart, clearCart, config, setActiveView } = useStore();
  
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ success: boolean; text: string } | null>(null);
  
  const [discordNick, setDiscordNick] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isInServer, setIsInServer] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'discord'>('pix');
  
  const [pixGenerated, setPixGenerated] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountAmount = (subtotal * appliedCoupon.value) / 100;
    } else {
      discountAmount = appliedCoupon.value;
    }
  }
  const total = Math.max(0, subtotal - discountAmount);

  const pixCopyPasteCode = `00020126580014br.gov.bcb.pix0136bloodstore-cyber-pay-5204000053039865405${total.toFixed(2).replace('.', '')}5802BR5915BLOOD STORE OFC6009SAO PAULO62140510PED-${Date.now().toString().slice(-4)}6304E1D2`;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMessage({ success: res.success, text: res.message });
  };

  const handleValidateBuyer = (): boolean => {
    if (!discordNick.trim() || discordNick.trim().length < 2) {
      setValidationError('Por favor, digite seu Nickname exato do Discord.');
      return false;
    }
    if (!isInServer) {
      setValidationError('Você precisa confirmar que está no servidor do Discord da Blood Store.');
      return false;
    }
    if (cart.length === 0) {
      setValidationError('Seu carrinho está vazio!');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleStartPix = () => {
    if (!handleValidateBuyer()) return;
    setPixGenerated(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCopyPasteCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const buildReceiptText = (method: 'PIX AUTOMÁTICO' | 'TICKET DISCORD') => {
    const itemsList = cart.map(item => `• ${item.quantity}x ${item.product.name} (R$ ${(item.product.price * item.quantity).toFixed(2).replace('.', ',')})`).join('\n');
    return `🔴 **PEDIDO BLOOD STORE // NOVO TICKET** 🔴\n` +
      `👤 **Comprador Discord:** \`${discordNick}\`\n` +
      (contactEmail ? `📧 **Contato:** \`${contactEmail}\`\n` : '') +
      `🛒 **Itens Adquiridos:**\n${itemsList}\n` +
      (appliedCoupon ? `🎟️ **Cupom Aplicado:** \`${appliedCoupon.code}\` (-R$ ${discountAmount.toFixed(2).replace('.', ',')})\n` : '') +
      `💰 **TOTAL DO PEDIDO:** **R$ ${total.toFixed(2).replace('.', ',')}**\n` +
      `💳 **Método de Pagamento:** ${method}\n` +
      `⚡ *Aguardando liberação / atendimento prioritário!*`;
  };

  const handleFinishAndOpenDiscord = (methodTitle: 'PIX AUTOMÁTICO' | 'TICKET DISCORD') => {
    if (!handleValidateBuyer()) return;
    const receipt = buildReceiptText(methodTitle);
    navigator.clipboard.writeText(receipt);
    setOrderCompleted(true);
    clearCart();

    setTimeout(() => {
      window.open(config.globalDiscordUrl, '_blank', 'noopener,noreferrer');
    }, 1500);
  };

  if (cart.length === 0 && !orderCompleted) {
    return (
      <section className="container-main py-16 text-center animate-fadeIn">
        <div className="hud-card max-w-xl mx-auto p-10 flex flex-col items-center gap-5">
          <div className="p-5 bg-[#121218] border border-[#ff003c]/40 rounded-full text-[#ff003c]">
            <ShoppingCart style={{ width: '40px', height: '40px' }} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#ffffff' }}>
            SEU CARRINHO ESTÁ VAZIO
          </h2>
          <p style={{ color: '#a0a0b2', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Você ainda não adicionou nenhum produto da Blood Store. Explore nosso catálogo e adicione pacotes, contas ou otimizações!
          </p>
          <button 
            onClick={() => setActiveView('home')}
            className="btn-cyber mt-2"
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            <span>VOLTAR PARA A LOJA</span>
          </button>
        </div>
      </section>
    );
  }

  if (orderCompleted) {
    return (
      <section className="container-main py-16 text-center animate-fadeIn">
        <div className="hud-card max-w-2xl mx-auto p-10 border-green-500/80 flex flex-col items-center gap-6 neon-glow">
          <div className="p-5 bg-green-500/20 border-2 border-green-500 rounded-full text-green-400 animate-bounce">
            <CheckCircle2 style={{ width: '50px', height: '50px' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#4ade80', letterSpacing: '2px', textTransform: 'uppercase' }}>
            // PEDIDO REGISTRADO COM SUCESSO //
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#ffffff' }}>
            PEDIDO PRONTO PARA ENTREGA!
          </h2>
          <div style={{ background: '#121218', border: '1px dashed rgba(255,255,255,0.2)', padding: '1.25rem', width: '100%', textAlign: 'left', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00f0ff', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 700 }}>
              <Copy style={{ width: '15px', height: '15px' }} />
              <span>O RECIBO FOI COPIADO PARA SUA ÁREA DE TRANSFERÊNCIA!</span>
            </div>
            <p style={{ color: '#d0d0e0', fontSize: '0.85rem', lineHeight: 1.6 }}>
              Estamos abrindo o servidor do Discord em nova aba. Basta ir no canal de **#pedidos / tickets**, abrir seu ticket e **colar (`Ctrl+V` / `Colar`)** o recibo formatado para receber seus produtos instantaneamente!
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', width: '100%' }}>
            <a 
              href={config.globalDiscordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cyber"
              style={{ padding: '0.9rem 2rem' }}
            >
              <span>IR PARA O SERVIDOR DISCORD AGORA</span>
              <ExternalLink style={{ width: '16px', height: '16px' }} />
            </a>
            <button 
              onClick={() => { setOrderCompleted(false); setActiveView('home'); }}
              className="btn-cyber-outline"
            >
              <span>CONTINUAR COMPRANDO</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container-main py-12 animate-fadeIn">
      {/* Top Header Bar */}
      <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid rgba(255,0,60,0.3)', paddingBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-neon-red)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <Sparkles style={{ width: '14px', height: '14px' }} />
            <span>// ÁREA DE CHECKOUT & FINALIZAÇÃO</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#ffffff', textTransform: 'uppercase' }}>
            FINALIZAR <span style={{ color: 'var(--color-neon-red)' }} className="neon-glow-text">COMPRA</span>
          </h1>
        </div>

        <button 
          onClick={() => setActiveView('home')}
          className="btn-cyber-outline"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.78rem' }}
        >
          <ArrowLeft style={{ width: '15px', height: '15px' }} />
          <span>VOLTAR AO CATÁLOGO</span>
        </button>
      </div>

      {/* Error Alert Box */}
      {validationError && (
        <div style={{ marginBottom: '2rem', padding: '1rem 1.5rem', background: 'rgba(255, 0, 60, 0.15)', borderLeft: '4px solid var(--color-neon-red)', display: 'flex', alignItems: 'center', gap: '0.85rem', color: '#ff6b8b', fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }} className="animate-fadeIn">
          <AlertCircle style={{ width: '20px', height: '20px', flexShrink: 0 }} />
          <span style={{ fontWeight: 600 }}>{validationError}</span>
        </div>
      )}

      {/* Main Grid: Left Items + Form, Right Summary & Pay */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2 cols width on desktop): Cart Items & Buyer Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Box 1: Items List */}
          <div className="hud-card p-6">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: '#ffffff', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingCart style={{ width: '18px', height: '18px', color: 'var(--color-neon-red)' }} />
                <span>ITENS DO SEU PEDIDO ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
              </h2>
              <button 
                onClick={clearCart}
                style={{ background: 'transparent', border: 'none', color: '#ff4466', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Trash2 style={{ width: '13px', height: '13px' }} />
                <span>ESVAZIAR</span>
              </button>
            </div>

            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.product.id} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '0.85rem', background: '#121218', border: '1px solid rgba(255,0,60,0.25)', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 250px' }}>
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name} 
                      style={{ width: '60px', height: '60px', objectFit: 'cover', border: '1px solid var(--color-neon-red)' }}
                    />
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-neon-red)', textTransform: 'uppercase' }}>
                        [{item.product.tag}]
                      </div>
                      <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.98rem', fontFamily: 'var(--font-display)' }}>
                        {item.product.name}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#a0a0b2' }}>
                        Unitário: R$ {item.product.price.toFixed(2).replace('.', ',')}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    {/* Quantity Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', background: '#0b0b0b', border: '1px solid rgba(255,255,255,0.2)', padding: '0.2rem' }}>
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        style={{ padding: '0.35rem 0.6rem', background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}
                        title="Diminuir quantidade"
                      >
                        <Minus style={{ width: '13px', height: '13px' }} />
                      </button>
                      <span style={{ padding: '0 0.85rem', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        style={{ padding: '0.35rem 0.6rem', background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}
                        title="Aumentar quantidade"
                      >
                        <Plus style={{ width: '13px', height: '13px' }} />
                      </button>
                    </div>

                    {/* Subtotal & Delete */}
                    <div style={{ textAlign: 'right', minWidth: '95px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, color: '#ffffff', fontSize: '1.05rem' }}>
                        R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                      </div>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      style={{ background: 'transparent', border: 'none', color: '#777788', cursor: 'pointer', padding: '0.3rem' }}
                      title="Remover item"
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Box 2: Coupon & Referral Code Input */}
          <div className="hud-card p-6">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: '#ffffff', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Tag style={{ width: '18px', height: '18px', color: 'var(--color-neon-cyan)' }} />
              <span>CUPOM DE DESCONTO OU INDICAÇÃO</span>
            </h3>

            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
              <input 
                type="text"
                placeholder="Digite o código (ex: BLOOD10, VIP20, INDICACAO)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                style={{ flex: '1 1 240px', padding: '0.75rem 1rem', background: '#121218', border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff', fontFamily: 'var(--font-mono)', fontSize: '0.88rem', outline: 'none', textTransform: 'uppercase' }}
              />
              <button 
                type="submit"
                className="btn-cyber"
                style={{ padding: '0.75rem 1.4rem', fontSize: '0.8rem' }}
              >
                <span>APLICAR</span>
              </button>
            </form>

            {couponMessage && (
              <div style={{ marginTop: '0.85rem', padding: '0.65rem 1rem', background: couponMessage.success ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)', borderLeft: couponMessage.success ? '3px solid #22c55e' : '3px solid #ef4444', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: couponMessage.success ? '#4ade80' : '#ff6b8b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{couponMessage.text}</span>
                {couponMessage.success && appliedCoupon && (
                  <button 
                    type="button"
                    onClick={() => { setAppliedCoupon(null); setCouponMessage(null); setCouponInput(''); }}
                    style={{ background: 'transparent', border: 'none', color: '#ff6b8b', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
                  >
                    Remover Cupom
                  </button>
                )}
              </div>
            )}

            <div style={{ marginTop: '0.85rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#888899' }}>
              💡 Dica de Cupons Ativos: <span style={{ color: '#ffffff', fontWeight: 700 }}>BLOOD10</span> (10% OFF), <span style={{ color: '#ffffff', fontWeight: 700 }}>VIP20</span> (20% OFF), <span style={{ color: '#ffffff', fontWeight: 700 }}>INDICACAO</span> (15% OFF)
            </div>
          </div>

          {/* Box 3: Buyer Nickname & Verification */}
          <div className="hud-card p-6 border-l-4 border-[#ff003c]">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: '#ffffff', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <ShieldCheck style={{ width: '18px', height: '18px', color: 'var(--color-neon-red)' }} />
              <span>DADOS DE ENTREGA & IDENTIFICAÇÃO DISCORD</span>
            </h3>
            <p style={{ color: '#a0a0b2', fontSize: '0.82rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Para receber seus produtos ou contas instantaneamente pelo nosso sistema e equipe, você obrigatoriamente deve estar em nosso servidor e digitar seu Nickname corretamente.
            </p>

            <div className="space-y-4">
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#e0e0e0', marginBottom: '0.4rem', fontWeight: 700 }}>
                  NICKNAME DO DISCORD (OBRIGATÓRIO) *
                </label>
                <input 
                  type="text"
                  placeholder="Ex: guerreiro.gamer ou Guerreiro#1234"
                  value={discordNick}
                  onChange={(e) => setDiscordNick(e.target.value)}
                  style={{ width: '100%', padding: '0.85rem 1rem', background: '#121218', border: discordNick.trim() ? '1px solid var(--color-neon-red)' : '1px solid rgba(255,255,255,0.2)', color: '#ffffff', fontFamily: 'var(--font-mono)', fontSize: '0.92rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#a0a0b2', marginBottom: '0.4rem' }}>
                  E-MAIL OU WHATSAPP PARA RECEBER RECIBO (OPCIONAL)
                </label>
                <input 
                  type="text"
                  placeholder="Ex: seuemail@gmail.com ou (11) 99999-9999"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.85rem 1rem', background: '#121218', border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff', fontFamily: 'var(--font-mono)', fontSize: '0.92rem', outline: 'none' }}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', paddingTop: '0.5rem' }}>
                <input 
                  type="checkbox"
                  checked={isInServer}
                  onChange={(e) => setIsInServer(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--color-neon-red)', marginTop: '0.15rem' }}
                />
                <span style={{ fontSize: '0.85rem', color: '#ffffff', lineHeight: 1.4 }}>
                  Estou no servidor oficial <strong style={{ color: 'var(--color-neon-red)' }}>{config.storeName}</strong> no Discord e confirmo que meu nickname acima está correto para a liberação do ticket.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column (1 col width on desktop): Summary & Payment Selection */}
        <div className="space-y-6 sticky top-24">
          {/* Box 4: Financial Summary */}
          <div className="hud-card p-6">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#ffffff', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              RESUMO DO PEDIDO
            </h3>

            <div className="space-y-3 font-mono text-sm">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a0a0b2' }}>
                <span>Subtotal dos Itens:</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>

              {appliedCoupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4ade80', fontWeight: 700 }}>
                  <span>Desconto ({appliedCoupon.code}):</span>
                  <span>- R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a0a0b2' }}>
                <span>Taxa de Entrega / Ticket:</span>
                <span style={{ color: 'var(--color-neon-cyan)' }}>GRÁTIS (0,00)</span>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,0,60,0.3)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-display)' }}>TOTAL A PAGAR:</span>
                <span style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--color-neon-red)' }} className="neon-glow-text">
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </div>

          {/* Box 5: Choose Payment Method */}
          <div className="hud-card p-6">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: '#ffffff', textTransform: 'uppercase', marginBottom: '1rem' }}>
              ESCOLHA O MÉTODO DE PAGAMENTO
            </h3>

            <div className="space-y-3">
              {/* Option A: PIX Automático */}
              <div 
                onClick={() => { setPaymentMethod('pix'); setPixGenerated(false); }}
                style={{ padding: '1rem', background: paymentMethod === 'pix' ? 'rgba(255,0,60,0.12)' : '#121218', border: paymentMethod === 'pix' ? '2px solid var(--color-neon-red)' : '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.25s ease' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                    <QrCode style={{ width: '18px', height: '18px', color: 'var(--color-neon-red)' }} />
                    <span>PIX INSTANTÂNEO (AUTOMÁTICO)</span>
                  </div>
                  <span style={{ padding: '0.15rem 0.5rem', background: '#22c55e', color: '#000000', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 800, borderRadius: '4px' }}>
                    PREFERIDO
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#a0a0b2', lineHeight: 1.4 }}>
                  Gere o QR Code agora mesmo, pague no seu aplicativo bancário e receba a liberação imediata no Discord.
                </p>
              </div>

              {/* Option B: Ticket no Discord */}
              <div 
                onClick={() => { setPaymentMethod('discord'); setPixGenerated(false); }}
                style={{ padding: '1rem', background: paymentMethod === 'discord' ? 'rgba(0,240,255,0.12)' : '#121218', border: paymentMethod === 'discord' ? '2px solid var(--color-neon-cyan)' : '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.25s ease' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                    <ExternalLink style={{ width: '18px', height: '18px', color: 'var(--color-neon-cyan)' }} />
                    <span>PAGAR COM ATENDENTE NO DISCORD</span>
                  </div>
                  <span style={{ padding: '0.15rem 0.5rem', background: 'rgba(0,240,255,0.2)', border: '1px solid var(--color-neon-cyan)', color: 'var(--color-neon-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, borderRadius: '4px' }}>
                    HUMANIZADO
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#a0a0b2', lineHeight: 1.4 }}>
                  Copie o resumo formatado do pedido com o cupom aplicado e cole direto no ticket de atendimento no servidor.
                </p>
              </div>
            </div>

            {/* Action Buttons based on Payment Method */}
            <div style={{ marginTop: '1.5rem' }}>
              {paymentMethod === 'pix' && !pixGenerated && (
                <button 
                  onClick={handleStartPix}
                  className="btn-cyber w-full py-3.5 text-sm animate-pulse-glow"
                >
                  <QrCode style={{ width: '18px', height: '18px' }} />
                  <span>GERAR QR CODE PIX AGORA</span>
                </button>
              )}

              {paymentMethod === 'discord' && (
                <button 
                  onClick={() => handleFinishAndOpenDiscord('TICKET DISCORD')}
                  className="btn-cyber w-full py-3.5 text-sm"
                  style={{ background: '#00c3cf', borderColor: '#00f0ff', color: '#000000' }}
                >
                  <ExternalLink style={{ width: '18px', height: '18px' }} />
                  <span>ABRIR TICKET COM O RECIBO</span>
                </button>
              )}
            </div>
          </div>

          {/* Box 6: Simulated PIX Terminal (Appears when PIX is generated) */}
          {paymentMethod === 'pix' && pixGenerated && (
            <div className="hud-card p-6 border-2 border-green-500 animate-fadeIn neon-glow">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid rgba(74,222,128,0.3)', paddingBottom: '0.75rem' }}>
                <Clock className="animate-spin" style={{ width: '16px', height: '16px' }} />
                <span>QR CODE PIX GERADO // VÁLIDO POR 15:00</span>
              </div>

              {/* Simulated QR Code Graphic */}
              <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', border: '4px solid #22c55e' }}>
                <div style={{ width: '180px', height: '180px', background: '#000000', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <img 
                    src="/fotos/Gemini_Generated_Image_v1yi2kv1yi2kv1yi.png" 
                    alt="Blood QR Code" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(200%) brightness(120%)' }}
                  />
                  <div style={{ position: 'absolute', inset: '35px', background: 'var(--color-neon-red)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '0.8rem', textAlign: 'center', boxShadow: '0 0 15px rgba(0,0,0,0.8)' }}>
                    PIX OFICIAL<br />R$ {total.toFixed(2)}
                  </div>
                </div>
                <span style={{ marginTop: '0.6rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 800, color: '#0b0b0b' }}>
                  ESCANEIE COM O APP DO BANCO
                </span>
              </div>

              {/* PIX Copia e Cola field */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#a0a0b2', marginBottom: '0.35rem' }}>
                  OU USE O PIX COPIA E COLA:
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    readOnly 
                    value={pixCopyPasteCode} 
                    style={{ flex: 1, padding: '0.65rem 0.85rem', background: '#0b0b0b', border: '1px solid #22c55e', color: '#4ade80', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', outline: 'none' }}
                  />
                  <button 
                    onClick={handleCopyPix}
                    style={{ padding: '0.65rem 1rem', background: '#22c55e', color: '#000000', border: 'none', fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    {copiedPix ? <Check style={{ width: '14px', height: '14px' }} /> : <Copy style={{ width: '14px', height: '14px' }} />}
                    <span>{copiedPix ? 'COPIADO!' : 'COPIAR'}</span>
                  </button>
                </div>
              </div>

              {/* Confirm action */}
              <button 
                onClick={() => handleFinishAndOpenDiscord('PIX AUTOMÁTICO')}
                className="btn-cyber w-full py-3.5 text-sm"
                style={{ background: '#22c55e', borderColor: '#4ade80', color: '#000000', fontWeight: 900 }}
              >
                <CheckCircle2 style={{ width: '18px', height: '18px' }} />
                <span>JÁ REALIZEI O PAGAMENTO VIA PIX!</span>
              </button>
              <div style={{ textAlign: 'center', marginTop: '0.6rem', fontSize: '0.72rem', color: '#888899', fontFamily: 'var(--font-mono)' }}>
                Ao clicar, você será redirecionado para enviar o recibo instantaneamente em nosso Discord.
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
