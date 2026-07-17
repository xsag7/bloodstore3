import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

export const CheckoutPage = ({ onBackToStore }) => {
  const { config, products, currentUser, createOrder } = useStore();
  const [product, setProduct] = useState(null);
  const [contactMethod, setContactMethod] = useState('💬 Chat ao Vivo no Site (Aqui no Pedido)');
  const [contactValue, setContactValue] = useState(currentUser?.username || localStorage.getItem('bloodstore_client_name') || '');
  const [customerNote, setCustomerNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    if (currentUser && !contactValue) {
      setContactValue(currentUser.username);
    }
  }, [currentUser]);

  useEffect(() => {
    const hashParts = window.location.hash.split('?');
    if (hashParts.length > 1) {
      const params = new URLSearchParams(hashParts[1]);
      const prodId = params.get('id');
      if (prodId && products) {
        const found = products.find(p => p.id === prodId || p.slug === prodId);
        if (found) {
          setProduct(found);
          return;
        }
      }
    }
    try {
      const savedProd = sessionStorage.getItem('bloodstore_checkout_item');
      if (savedProd) {
        setProduct(JSON.parse(savedProd));
      } else if (products && products.length > 0) {
        setProduct(products[0]);
      }
    } catch (e) {
      if (products && products.length > 0) setProduct(products[0]);
    }
  }, [products]);

  if (!product) {
    return (
      <div className="checkout-loading-screen">
        <i className="fa-solid fa-spinner fa-spin text-red" style={{ fontSize: '2.5rem' }}></i>
        <p style={{ marginTop: '16px', color: '#a0a0b0' }}>Carregando dados do produto...</p>
        <button onClick={onBackToStore} className="btn-back-home" style={{ maxWidth: '220px', marginTop: '20px' }}>
          Voltar ao Catálogo
        </button>
      </div>
    );
  }

  const benefits = Array.isArray(product.benefits) 
    ? product.benefits 
    : (typeof product.benefits === 'string' ? product.benefits.split('\n') : []);

  const activePixKey = product.pixKey || config.pixKey;
  const activeQrCodeUrl = product.qrCodeUrl || config.qrCodeUrl || "/fotos e videos/qrcode.png";

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!contactValue.trim()) return;

    setLoading(true);
    
    const buyerObj = currentUser || {
      username: contactValue.trim(),
      avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
      connectedAt: new Date().toISOString()
    };

    localStorage.setItem('bloodstore_client_name', contactValue.trim());

    const newOrder = createOrder({
      product,
      discordUser: buyerObj,
      pixCode: activePixKey,
      qrCodeUrl: activeQrCodeUrl,
      contactMethod,
      contactValue: contactValue.trim()
    });

    try {
      const savedIds = JSON.parse(localStorage.getItem('bloodstore_client_order_ids') || '[]');
      if (!savedIds.includes(newOrder.id)) {
        savedIds.push(newOrder.id);
        localStorage.setItem('bloodstore_client_order_ids', JSON.stringify(savedIds));
      }
    } catch (err) {
      console.log('Erro ao salvar no localStorage:', err);
    }

    const generatedId = newOrder.orderNumber;
    setOrderId(generatedId);

    if (config.webhookUrl) {
      const payload = {
        username: `${config.storeName} • Vendas`,
        avatar_url: "https://i.imgur.com/8N40WzN.png",
        embeds: [{
          title: `🩸 NOVO PEDIDO CONFIRMADO • ${generatedId}`,
          description: `Um cliente iniciou o processo de compra do produto **${product.name}**.`,
          color: 13369344,
          fields: [
            { name: "📬 Meio de Contato", value: `**${contactMethod}**`, inline: false },
            { name: "👤 Identificação do Cliente", value: `\`${contactValue.trim()}\``, inline: true },
            { name: "📦 Produto", value: `**${product.name}**`, inline: true },
            { name: "💰 Valor", value: `**${product.priceText}**`, inline: true },
            { name: "📝 Observação", value: customerNote ? `\`${customerNote}\`` : "Nenhuma", inline: false },
            { name: "📅 Data e Hora", value: new Date().toLocaleString("pt-BR"), inline: false },
            { name: "🔔 Próximo Passo", value: "Aguardando o cliente anexar o comprovante PIX na sala de chat (`/#/pedidos`).", inline: false }
          ],
          footer: { text: `${config.storeName} • Sistema de Entrega Estilo GGMAX` },
          timestamp: new Date().toISOString()
        }]
      };

      try {
        await fetch(config.webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.log("Aviso: Erro ao notificar Webhook:", err);
      }
    }

    setLoading(false);
    setOrderSuccess(true);
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(activePixKey).then(() => {
      alert("Chave PIX copiada com sucesso para a área de transferência!");
    }).catch(() => {
      alert("Copie manualmente: " + activePixKey);
    });
  };

  return (
    <div className="checkout-page">
      <header className="checkout-topbar">
        <div className="container checkout-topbar-inner">
          <button onClick={onBackToStore} className="btn-checkout-back">
            <i className="fa-solid fa-arrow-left"></i> Voltar à Vitrine
          </button>
          
          <div className="checkout-brand">
            <img 
              src={config.logoUrl || "/fotos e videos/Bloodstore.png"} 
              onError={(e) => { e.target.style.display = 'none'; }} 
              alt={config.storeName} 
              style={{ maxHeight: '36px' }} 
            />
            <span>{config.storeName} • CHECKOUT PIX</span>
          </div>

          <div className="checkout-security-badge">
            <i className="fa-solid fa-lock text-red"></i> 100% Protegido & Criptografado
          </div>
        </div>
      </header>

      <div className="container checkout-container">
        {orderSuccess ? (
          <div className="checkout-success-screen">
            <div className="success-icon-box">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h1 className="success-title">PEDIDO REGISTRADO COM SUCESSO!</h1>
            <p className="success-subtitle">
              Número do Pedido: <strong className="text-red">{orderId}</strong>
            </p>
            <div className="success-details-card">
              <p>
                Sua compra para <strong>{product.name}</strong> ({product.priceText}) foi iniciada.<br />
                Meio de Contato Selecionado: <strong style={{ color: '#fff' }}>{contactMethod} ({contactValue})</strong>
              </p>
              <div className="pix-instruction-alert">
                <i className="fa-solid fa-bell text-red"></i>
                <span>
                  Faça o pagamento na chave PIX informada e clique no botão abaixo para acessar sua <strong>Sala Exclusiva de Pedido e Chat ao Vivo</strong> para enviar seu comprovante e receber o produto!
                </span>
              </div>
            </div>

            <div className="success-actions" style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center', marginTop: '24px' }}>
              <a 
                href="#/pedidos" 
                className="btn-complete-order" 
                style={{ textDecoration: 'none', maxWidth: '420px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              >
                <i className="fa-solid fa-comments"></i> IR PARA SALA DO PEDIDO & CHAT DE ENTREGA
              </a>

              <button 
                onClick={onBackToStore} 
                className="btn-checkout-back" 
                style={{ background: 'transparent', border: '1px solid #333', padding: '12px 24px', borderRadius: '8px', color: '#a0a0b0' }}
              >
                <i className="fa-solid fa-cart-shopping"></i> Comprar Outro Produto
              </button>
            </div>
          </div>
        ) : (
          <div className="checkout-grid">
            <aside className="checkout-sidebar-product">
              <div className="sidebar-product-card">
                <div className="sidebar-product-badge">
                  <i className="fa-solid fa-bolt text-red"></i> ENTREGA AUTOMÁTICA OU AO VIVO
                </div>
                
                <div className="sidebar-product-image-wrap">
                  <img 
                    src={product.image || "/fotos e videos/robux.png"} 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }} 
                    alt={product.name} 
                    className="sidebar-product-img" 
                  />
                  <div className="product-icon-fallback" style={{ display: 'none', width: '80px', height: '80px', fontSize: '2.5rem' }}>
                    <i className={product.icon || "fa-solid fa-box"}></i>
                  </div>
                </div>

                <h2 className="sidebar-product-title">{product.name}</h2>
                <div className="sidebar-product-price">{product.priceText}</div>

                <div className="sidebar-highlights-section">
                  <h4>Vantagens e Garantias inclusas:</h4>
                  <ul className="sidebar-highlights-list">
                    {benefits.map((benefit, idx) => (
                      <li key={idx}>
                        <i className="fa-solid fa-check text-red"></i> {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="sidebar-trust-box">
                  <i className="fa-solid fa-headset text-red"></i>
                  <div>
                    <strong>Suporte Dedicado & Entrega Ágil</strong>
                    <p>Entrega 100% assegurada pela equipe da Blood Store. Atendimento prioritário e seguro.</p>
                  </div>
                </div>
              </div>
            </aside>

            <main className="checkout-main-content">
              <div className="checkout-box-card">
                
                <div className="checkout-steps-banner">
                  <div className="step-item active">
                    <span className="step-num">1</span>
                    <span className="step-label">Meio de Contato</span>
                  </div>
                  <div className="step-divider"><i className="fa-solid fa-chevron-right"></i></div>
                  <div className="step-item active">
                    <span className="step-num">2</span>
                    <span className="step-label">Pagamento PIX</span>
                  </div>
                </div>

                <form onSubmit={handleOrderSubmit} className="checkout-form">
                  <h3 className="form-section-title">
                    <i className="fa-solid fa-address-book text-red"></i> Onde ou Como Deseja Receber Seu Produto?
                  </h3>
                  <p className="form-section-subtitle">
                    Selecione o canal de preferência para nossa equipe liberar sua compra com rapidez e segurança.
                  </p>

                  <div className="form-group">
                    <label className="form-label" htmlFor="chk-method">
                      Canal de Entrega / Atendimento <span className="text-red">*</span>
                    </label>
                    <select 
                      id="chk-method" 
                      className="form-input" 
                      style={{ background: '#181822', color: '#fff', border: '1px solid #2a0c0c', padding: '12px', borderRadius: '8px', width: '100%' }}
                      value={contactMethod}
                      onChange={(e) => setContactMethod(e.target.value)}
                    >
                      <option value="💬 Chat ao Vivo no Site (Aqui no Pedido)">💬 Chat ao Vivo no Site (Direto em Meus Pedidos)</option>
                      <option value="🎮 Nick / Tag no Discord">🎮 Nick / Tag no Discord</option>
                      <option value="📧 E-mail para Envio">📧 E-mail para Envio</option>
                      <option value="🎟️ Ticket em nosso Servidor Discord">🎟️ Ticket em nosso Servidor Discord</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="chk-value">
                      {contactMethod.includes('E-mail') ? 'Seu E-mail *' : contactMethod.includes('Discord') ? 'Seu Nick ou Tag no Discord *' : 'Seu Nome / Apelido para Identificação *'}
                    </label>
                    <div className="input-with-icon">
                      <i className={contactMethod.includes('E-mail') ? "fa-solid fa-envelope input-icon" : contactMethod.includes('Discord') ? "fa-brands fa-discord input-icon" : "fa-solid fa-user input-icon"}></i>
                      <input 
                        type="text" 
                        id="chk-value" 
                        className="form-input has-icon" 
                        placeholder={contactMethod.includes('E-mail') ? "seu@email.com" : contactMethod.includes('Discord') ? "ex: fulanogamer ou usuario#0000" : "Seu nome ou apelido aqui..."} 
                        value={contactValue}
                        onChange={(e) => setContactValue(e.target.value)}
                        required 
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="chk-note">
                      Observação Adicional (Opcional)
                    </label>
                    <input 
                      type="text" 
                      id="chk-note" 
                      className="form-input" 
                      placeholder="ex: Preferência por item específico / horário..." 
                      value={customerNote}
                      onChange={(e) => setCustomerNote(e.target.value)}
                    />
                  </div>

                  <hr className="checkout-sep" />

                  <h3 className="form-section-title">
                    <i className="fa-solid fa-qrcode text-red"></i> Pagamento PIX Instantâneo
                  </h3>
                  <p className="form-section-subtitle">
                    Abra o app do seu banco, escolha a opção PIX Copia e Cola ou escaneie o QR Code abaixo:
                  </p>

                  <div className="checkout-pix-box">
                    <div className="pix-qr-area">
                      <img 
                        src={activeQrCodeUrl} 
                        onError={(e) => {
                          e.target.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(activePixKey) + '&color=111116&bgcolor=FFFFFF';
                        }} 
                        alt="QR Code PIX" 
                      />
                      <span>Escaneie com o celular</span>
                    </div>

                    <div className="pix-info-area">
                      <div className="pix-badge-instant"><i className="fa-solid fa-bolt"></i> Aprovação em Segundos</div>
                      <label className="pix-code-title">Código PIX Copia e Cola (Exclusivo deste Item):</label>
                      <div className="pix-code-field">
                        <input type="text" readOnly value={activePixKey} />
                      </div>
                      <button type="button" onClick={copyPixCode} className="btn-copy-pix-large">
                        <i className="fa-solid fa-copy"></i> COPIAR CHAVE PIX AGORA
                      </button>
                    </div>
                  </div>

                  <div className="checkout-final-action">
                    <button type="submit" className="btn-submit-order" disabled={loading}>
                      {loading ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i> REGISTRANDO PEDIDO NO SISTEMA...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-check-double"></i> JÁ REALIZEI O PIX • GERAR MEU ATENDIMENTO
                        </>
                      )}
                    </button>
                    <small className="checkout-disclaimer">
                      Ao clicar no botão acima, você concorda com nossos Termos e Políticas de Entrega e Reembolso.
                    </small>
                  </div>
                </form>
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
};
