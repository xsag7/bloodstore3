import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const SplitCheckoutModal = ({ product, onClose }) => {
  const { config, currentUser, createOrder } = useStore();
  const [contactMethod, setContactMethod] = useState('💬 Chat do Site (Entrega Direta no Pedido)');
  const [contactValue, setContactValue] = useState(currentUser?.username || localStorage.getItem('bloodstore_client_name') || '');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!product) return null;

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
        username: `${config.storeName} • Pedidos`,
        avatar_url: "https://i.imgur.com/8N40WzN.png",
        embeds: [{
          title: `🩸 NOVO PEDIDO - ${config.storeName} • ${generatedId}`,
          description: "O cliente concluiu o checkout no modal e gerou a chave de pagamento PIX.",
          color: 13369344, // #cc0000 vermelho
          fields: [
            { name: "📬 Meio de Contato", value: `**${contactMethod}**`, inline: false },
            { name: "👤 Identificação do Cliente", value: `\`${contactValue.trim()}\``, inline: true },
            { name: "📦 Produto Escolhido", value: `**${product.name}**`, inline: true },
            { name: "💰 Valor do Produto", value: `**${product.priceText}**`, inline: true },
            { name: "📅 Data e Hora", value: new Date().toLocaleString("pt-BR"), inline: false },
            { name: "🔔 Status", value: "⚠️ **Aguardando confirmação e envio de comprovante no chat ao vivo (`/#/pedidos`)**", inline: false }
          ],
          footer: { text: `${config.storeName} • Sistema de Vendas Automático` },
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
    <div className="modal-overlay active" onClick={(e) => { if (e.target.classList.contains('modal-overlay')) onClose(); }}>
      <div className="modal-split-box">
        {/* COLUNA DA ESQUERDA: RESUMO DO PEDIDO */}
        <div className="checkout-summary-col">
          <div>
            <div className="summary-header-badge">
              <i className="fa-solid fa-shield-check"></i> Resumo do Pedido • {config.storeName}
            </div>
            <h3 className="summary-prod-name">{product.name}</h3>

            <div className="summary-img-wrap">
              <img 
                src={product.image || "/fotos e videos/robux.png"} 
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }} 
                alt={product.name} 
                className="summary-img" 
              />
              <div className="product-icon-fallback" style={{ display: 'none', width: '56px', height: '56px', fontSize: '1.6rem' }}>
                <i className={product.icon || "fa-solid fa-box"}></i>
              </div>
            </div>

            <div className="summary-total-price">
              <span>Total a Pagar</span>
              {product.priceText}
            </div>

            <ul className="summary-highlights">
              {benefits.map((b, idx) => (
                <li key={idx}>
                  <i className="fa-solid fa-check"></i> {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="summary-warning-box">
            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '1.1rem', marginTop: '2px' }}></i>
            <span><strong>Aviso Importante:</strong> Ao finalizar, você poderá enviar o comprovante PIX na sala do pedido ou via ticket.</span>
          </div>
        </div>

        {/* COLUNA DA DIREITA: DADOS DO CLIENTE E PAGAMENTO PIX */}
        <div className="checkout-action-col">
          <button className="modal-close-split" onClick={onClose} title="Fechar"><i className="fa-solid fa-xmark"></i></button>

          <div>
            <div className="action-col-header">
              <h4>Dados & Pagamento</h4>
              <p>Escolha o meio que preferir para receber seu produto com rapidez.</p>
            </div>

            <form onSubmit={handleOrderSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="split-method-input">
                  Canal de Entrega / Contato <span className="text-red">*</span>
                </label>
                <select 
                  id="split-method-input" 
                  className="form-input" 
                  style={{ background: '#111116', color: '#fff', border: '1px solid #2a0c0c', padding: '10px', borderRadius: '6px', width: '100%', marginBottom: '10px' }}
                  value={contactMethod}
                  onChange={(e) => setContactMethod(e.target.value)}
                  disabled={orderSuccess}
                >
                  <option value="💬 Chat ao Vivo no Site (Aqui no Pedido)">💬 Chat ao Vivo no Site (Em Meus Pedidos)</option>
                  <option value="🎮 Nick / Tag no Discord">🎮 Nick / Tag no Discord</option>
                  <option value="📧 E-mail para Envio">📧 E-mail para Envio</option>
                  <option value="🎟️ Ticket no Servidor Discord">🎟️ Ticket no Servidor Discord</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="split-contact-input">
                  {contactMethod.includes('E-mail') ? 'Seu E-mail *' : contactMethod.includes('Discord') ? 'Seu Nick no Discord *' : 'Seu Nome / Identificação *'}
                </label>
                <input 
                  type="text" 
                  id="split-contact-input" 
                  className="form-input" 
                  placeholder={contactMethod.includes('E-mail') ? "seu@email.com" : contactMethod.includes('Discord') ? "ex: usuario#0000 ou fulano" : "Seu nome ou apelido..."} 
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  required 
                  autoComplete="off"
                  disabled={orderSuccess}
                />
              </div>

              {/* Área do PIX e QR Code */}
              <div className="pix-display-area">
                <div className="pix-qr-compact">
                  <img 
                    src={activeQrCodeUrl} 
                    onError={(e) => {
                      e.target.src = 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=' + encodeURIComponent(activePixKey) + '&color=111116&bgcolor=FFFFFF';
                    }} 
                    alt="QR Code PIX" 
                  />
                </div>

                <div className="pix-code-info">
                  <div className="pix-code-label"><i className="fa-solid fa-qrcode text-red"></i> PIX Copia e Cola</div>
                  <div className="pix-code-string" title={activePixKey}>{activePixKey}</div>
                  <button type="button" onClick={copyPixCode} className="btn-copy-pix">
                    <i className="fa-solid fa-copy"></i> Copiar Código
                  </button>
                </div>
              </div>

              {!orderSuccess && (
                <button type="submit" className="btn-complete-order" disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i> Registrando Pedido...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-check-to-slot"></i> CONCLUIR PEDIDO E GERAR ATENDIMENTO
                    </>
                  )}
                </button>
              )}
            </form>
          </div>

          {orderSuccess && (
            <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.12)', border: '1px solid #22c55e', borderRadius: '8px', padding: '14px', marginTop: '12px', fontSize: '0.88rem', color: '#4ade80', textAlign: 'center' }}>
              <i className="fa-solid fa-circle-check" style={{ fontSize: '1.2rem', marginBottom: '6px' }}></i>
              <strong style={{ display: 'block' }}>Pedido Registrado (#{orderId})!</strong>
              Obrigado, <code style={{ color: '#fff', background: '#111', padding: '2px 6px', borderRadius: '4px' }}>{contactValue}</code>.<br />
              Copie a chave PIX acima e envie o comprovante na sala do pedido ou via ticket.
              <div style={{ marginTop: '12px' }}>
                <a 
                  href="#/pedidos" 
                  onClick={onClose} 
                  style={{ display: 'inline-block', background: '#22c55e', color: '#fff', padding: '8px 14px', borderRadius: '6px', fontWeight: '700', textDecoration: 'none', fontSize: '0.85rem' }}
                >
                  <i className="fa-solid fa-comments"></i> Acessar Sala do Pedido
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
