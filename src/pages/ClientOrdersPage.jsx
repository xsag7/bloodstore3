import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { compressAndUploadImage } from '../lib/supabase';
import { formatChatMessage } from '../lib/security';

export const ClientOrdersPage = ({ onBackToStore }) => {
  const { config, currentUser, orders, sendOrderProof, addOrderMessage } = useStore();
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadingProof, setUploadingProof] = useState(false);
  const [uploadingChatImg, setUploadingChatImg] = useState(false);
  const chatContainerRef = useRef(null);
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const clientName = currentUser?.username || localStorage.getItem('bloodstore_client_name') || '';
  const savedOrderIds = (() => {
    try {
      return JSON.parse(localStorage.getItem('bloodstore_client_order_ids') || '[]');
    } catch (e) {
      return [];
    }
  })();

  const userOrders = (orders || []).filter(ord => {
    const isOwnerBySavedId = savedOrderIds.includes(ord.id);
    const isOwnerByContact = clientName && (
      (ord.contactValue && ord.contactValue.toLowerCase() === clientName.toLowerCase()) ||
      (ord.buyer?.username && ord.buyer.username.toLowerCase() === clientName.toLowerCase())
    );
    const isOwner = isOwnerBySavedId || isOwnerByContact;

    if (!isOwner) return false;
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      ord.orderNumber?.toLowerCase().includes(query) ||
      ord.product?.name?.toLowerCase().includes(query) ||
      ord.status?.toLowerCase().includes(query)
    );
  });

  const selectedOrder = userOrders.find(o => o.id === selectedOrderId) || userOrders[0];
  const myOrders = userOrders;

  useEffect(() => {
    if (userOrders.length > 0 && !selectedOrderId) {
      setSelectedOrderId(userOrders[0].id);
    }
  }, [userOrders, selectedOrderId]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedOrder?.messages]);

  const handleProofUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedOrder) return;

    setUploadingProof(true);
    try {
      const optimizedUrl = await compressAndUploadImage(file);
      if (optimizedUrl) {
        sendOrderProof(selectedOrder.id, optimizedUrl);
        alert('✅ Comprovante PIX otimizado com sucesso! O status mudou para "Em Análise" e o Staff foi notificado.');
      } else {
        alert('❌ Erro ao processar a imagem. Tente novamente com outro formato.');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Erro ao subir foto: ' + err.message);
    } finally {
      setUploadingProof(false);
    }
  };

  const handleChatFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedOrder) return;

    setUploadingChatImg(true);
    try {
      const optimizedUrl = await compressAndUploadImage(file);
      if (optimizedUrl) {
        const senderName = currentUser?.username || localStorage.getItem('bloodstore_client_name') || selectedOrder.contactValue || 'Cliente';
        addOrderMessage(selectedOrder.id, senderName, 'client', chatInput.trim() || '📎 Imagem / Print enviado', optimizedUrl);
        setChatInput('');
      } else {
        alert('❌ Erro ao processar imagem anexa.');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Erro ao anexar foto: ' + err.message);
    } finally {
      setUploadingChatImg(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedOrder) return;
    const senderName = currentUser?.username || localStorage.getItem('bloodstore_client_name') || selectedOrder.contactValue || 'Cliente';
    addOrderMessage(selectedOrder.id, senderName, 'client', chatInput.trim());
    setChatInput('');
  };

  const handleSaveAccessName = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      localStorage.setItem('bloodstore_client_name', searchQuery.trim());
      setSelectedOrderId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'aguardando_comprovante':
        return <span style={{ background: 'rgba(255, 193, 7, 0.15)', color: '#ffc107', padding: '4px 10px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: '700', border: '1px solid rgba(255, 193, 7, 0.4)' }}><i className="fa-solid fa-clock"></i> Aguardando Comprovante</span>;
      case 'em_analise':
        return <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '4px 10px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: '700', border: '1px solid rgba(56, 189, 248, 0.4)' }}><i className="fa-solid fa-hourglass-half"></i> Em Análise pelo Staff</span>;
      case 'aprovado_entregue':
        return <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', padding: '4px 10px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: '700', border: '1px solid rgba(34, 197, 94, 0.4)' }}><i className="fa-solid fa-check-double"></i> Aprovado & Entregue</span>;
      case 'cancelado':
        return <span style={{ background: 'rgba(204, 0, 0, 0.15)', color: '#ff6b6b', padding: '4px 10px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: '700', border: '1px solid rgba(204, 0, 0, 0.4)' }}><i className="fa-solid fa-xmark"></i> Reprovado / Cancelado</span>;
      default:
        return null;
    }
  };

  // Se não há pedidos listados e o usuário ainda não procurou
  if (myOrders.length === 0 && !searchQuery.trim()) {
    return (
      <div style={{ minHeight: '100vh', background: '#111116', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        <header className="checkout-topbar" style={{ borderBottom: '1px solid #2a0c0c', background: '#14141e' }}>
          <div className="container checkout-topbar-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px' }}>
            <button onClick={onBackToStore} className="btn-checkout-back">
              <i className="fa-solid fa-arrow-left"></i> Voltar à Loja
            </button>
            <div className="checkout-brand">
              <span>{config.storeName} • CENTRAL DE PEDIDOS & ATENDIMENTO</span>
            </div>
          </div>
        </header>

        <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <div style={{ background: '#181822', border: '1px solid #2a0c0c', borderRadius: '12px', padding: '36px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(204,0,0,0.15)', border: '1px solid #cc0000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: '1.8rem', color: '#cc0000' }}>
              <i className="fa-solid fa-box-open"></i>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '700', marginBottom: '8px' }}>Acessar Seus Pedidos & Chat ao Vivo</h2>
            <p style={{ color: '#a0a0b0', fontSize: '0.9rem', marginBottom: '22px', lineHeight: '1.5' }}>
              Digite o número do seu pedido (ex: <strong style={{ color: '#fff' }}>#1234</strong>), seu Nick no Discord, seu E-mail ou Nome utilizado na hora da compra:
            </p>

            <form onSubmit={handleSaveAccessName} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input 
                type="text" 
                placeholder="ex: #1234, fulanogamer ou seu@email.com" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: '#111116', border: '1px solid #333', color: '#fff', padding: '12px 16px', borderRadius: '8px', fontSize: '0.95rem', width: '100%', textAlign: 'center' }}
                autoFocus
                required
              />
              <button 
                type="submit" 
                className="btn-hero"
                style={{ padding: '12px 20px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
              >
                <i className="fa-solid fa-magnifying-glass"></i> Encontrar Meus Pedidos
              </button>
            </form>

            <div style={{ marginTop: '20px', fontSize: '0.82rem', color: '#78788c', borderTop: '1px solid #252535', paddingTop: '16px' }}>
              <i className="fa-solid fa-lock text-red"></i> Sua sala de atendimento e entrega é confidencial e conta com suporte direto da nossa equipe Staff.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#111116', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* TOPO */}
      <header className="checkout-topbar" style={{ borderBottom: '1px solid #2a0c0c', background: '#14141e' }}>
        <div className="container checkout-topbar-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', flexWrap: 'wrap', gap: '12px' }}>
          <button onClick={onBackToStore} className="btn-checkout-back">
            <i className="fa-solid fa-arrow-left"></i> Voltar ao Catálogo
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-box-open text-red" style={{ fontSize: '1.3rem' }}></i>
            <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>CENTRAL DE PEDIDOS & CHAT AO VIVO</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
              type="text"
              placeholder="🔍 Filtrar pedido, nick ou #ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: '#181822', border: '1px solid #2a0c0c', color: '#fff', padding: '6px 12px', borderRadius: '20px', fontSize: '0.82rem', width: '220px' }}
            />
            {clientName && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1a1a26', padding: '4px 12px', borderRadius: '20px', border: '1px solid #333' }}>
                <i className="fa-solid fa-user text-red"></i>
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{clientName}</span>
                <button 
                  onClick={() => { localStorage.removeItem('bloodstore_client_name'); setSearchQuery(''); setSelectedOrderId(null); window.location.reload(); }} 
                  title="Alterar Identificação / Sair" 
                  style={{ background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: '0 4px', fontSize: '0.85rem' }}
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CORPO SPLIT SCREEN ESTILO GGMAX */}
      <div className="container" style={{ flex: 1, display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px', padding: '24px 20px' }}>
        
        {/* COLUNA ESQUERDA: LISTA DE PEDIDOS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: '#181822', padding: '16px', borderRadius: '8px', border: '1px solid #2a0c0c', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-list-check text-red"></i> Meus Pedidos ({myOrders.length})
            </h3>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ background: 'transparent', border: 'none', color: '#a0a0b0', fontSize: '0.78rem', cursor: 'pointer' }}>
                Limpar Busca
              </button>
            )}
          </div>

          {myOrders.length === 0 ? (
            <div style={{ background: '#181822', padding: '30px 20px', borderRadius: '8px', border: '1px solid #2a0c0c', textAlign: 'center', color: '#a0a0b0' }}>
              <i className="fa-solid fa-cart-shopping" style={{ fontSize: '2rem', color: '#3c3c4e', marginBottom: '12px' }}></i>
              <p style={{ fontSize: '0.9rem', marginBottom: '16px' }}>Nenhum pedido encontrado com esta identificação ({searchQuery || clientName}).</p>
              <button onClick={() => { setSearchQuery(''); localStorage.removeItem('bloodstore_client_name'); }} className="btn-checkout-back" style={{ marginBottom: '10px', width: '100%' }}>
                <i className="fa-solid fa-magnifying-glass"></i> Buscar Outro ID / Contato
              </button>
              <button onClick={onBackToStore} className="btn-hero" style={{ padding: '10px 16px', fontSize: '0.85rem', width: '100%' }}>
                Ver Produtos <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: 'calc(100vh - 160px)' }}>
              {myOrders.map(ord => {
                const isSelected = selectedOrder && selectedOrder.id === ord.id;
                return (
                  <div 
                    key={ord.id}
                    onClick={() => setSelectedOrderId(ord.id)}
                    style={{
                      background: isSelected ? '#202030' : '#181822',
                      border: isSelected ? '1px solid #cc0000' : '1px solid #2a0c0c',
                      borderRadius: '8px',
                      padding: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: isSelected ? '0 0 15px rgba(204, 0, 0, 0.25)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '0.88rem', color: isSelected ? '#ff4d4d' : '#fff' }}>
                        {ord.orderNumber}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: '#78788c' }}>
                        {new Date(ord.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.92rem', fontWeight: '600', color: '#fff', marginBottom: '6px' }}>
                      {ord.product?.name || 'Produto'}
                    </div>

                    {ord.contactMethod && (
                      <div style={{ fontSize: '0.75rem', color: '#a0a0b0', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        📬 {ord.contactMethod} ({ord.contactValue})
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                      <span style={{ fontWeight: '700', color: '#cc0000', fontSize: '0.95rem' }}>
                        {ord.product?.priceText}
                      </span>
                      {getStatusBadge(ord.status)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* COLUNA DIREITA: SALA DE ATENDIMENTO DO PEDIDO */}
        {selectedOrder ? (
          <div style={{ background: '#181822', border: '1px solid #2a0c0c', borderRadius: '10px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            
            {/* CABEÇALHO DO PEDIDO SELECIONADO */}
            <div style={{ padding: '18px 22px', background: '#1c1c28', borderBottom: '1px solid #2a0c0c' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#a0a0b0', display: 'block', marginBottom: '2px' }}>
                  SALA DE ATENDIMENTO DO PEDIDO {selectedOrder.orderNumber}
                </span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0, color: '#fff' }}>
                  {selectedOrder.product?.name} <span style={{ color: '#cc0000', fontWeight: '600', marginLeft: '6px' }}>({selectedOrder.product?.priceText})</span>
                </h2>
                {selectedOrder.contactMethod && (
                  <div style={{ fontSize: '0.82rem', color: '#a0a0b0', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span>📬 Meio Escolhido: <strong style={{ color: '#fff' }}>{selectedOrder.contactMethod}</strong></span>
                    {selectedOrder.contactValue && <span>• Contato: <code style={{ background: '#111', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px' }}>{selectedOrder.contactValue}</code></span>}
                  </div>
                )}
              </div>
              <div style={{ marginTop: '12px' }}>
                {getStatusBadge(selectedOrder.status)}
              </div>
            </div>

            {/* ÁREA DO PRODUTO ENTREGUE (SE APROVADO) */}
            {selectedOrder.status === 'aprovado_entregue' && (
              <div style={{ background: 'rgba(34, 197, 94, 0.1)', borderBottom: '1px solid #22c55e', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', animation: 'fadeIn 0.4s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#22c55e', fontWeight: '700', fontSize: '1.05rem' }}>
                  <i className="fa-solid fa-gift" style={{ fontSize: '1.3rem' }}></i>
                  🎉 SEU PRODUTO FOI LIBERADO COM SUCESSO!
                </div>
                <p style={{ fontSize: '0.88rem', color: '#d1fae5', margin: 0 }}>
                  Abaixo estão os dados/conteúdo da sua entrega liberados diretamente pelo nosso Staff:
                </p>
                <div style={{ background: '#0d1a12', border: '1px solid #22c55e', borderRadius: '6px', padding: '14px', fontFamily: 'monospace', fontSize: '0.95rem', color: '#fff', whiteSpace: 'pre-wrap', userSelect: 'all', position: 'relative' }}>
                  {formatChatMessage(selectedOrder.deliveryContent)}
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(selectedOrder.deliveryContent);
                      alert('✅ Conteúdo copiado!');
                    }}
                    style={{ position: 'absolute', top: '10px', right: '10px', background: '#22c55e', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600' }}
                  >
                    <i className="fa-solid fa-copy"></i> Copiar
                  </button>
                </div>
              </div>
            )}

            {/* BARRA DE AÇÕES DO COMPROVANTE (SE AINDA NÃO ENTREGUE) */}
            {selectedOrder.status !== 'aprovado_entregue' && selectedOrder.status !== 'cancelado' && (
              <div style={{ padding: '14px 22px', background: '#161620', borderBottom: '1px solid #2a0c0c', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <i className="fa-solid fa-receipt text-red" style={{ fontSize: '1.4rem' }}></i>
                  <div>
                    <strong style={{ fontSize: '0.9rem', display: 'block', color: '#fff' }}>Comprovante de Pagamento PIX</strong>
                    <span style={{ fontSize: '0.78rem', color: '#a0a0b0' }}>
                      {selectedOrder.proofImage ? '✅ Comprovante enviado e em análise pelo Staff.' : '⚠️ Envie a foto ou print do seu PIX para liberar o produto.'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {selectedOrder.proofImage && (
                    <a href={selectedOrder.proofImage} target="_blank" rel="noopener noreferrer" style={{ padding: '8px 14px', fontSize: '0.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', background: '#38bdf8', color: '#fff', borderRadius: '6px' }}>
                      <i className="fa-solid fa-eye"></i> Ver Foto
                    </a>
                  )}

                  <label style={{ background: uploadingProof ? '#eab308' : '#22c55e', color: '#fff', padding: '9px 16px', borderRadius: '6px', fontWeight: '700', fontSize: '0.85rem', cursor: uploadingProof ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 0 12px rgba(34, 197, 94, 0.3)', opacity: uploadingProof ? 0.8 : 1 }}>
                    <i className={uploadingProof ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-cloud-arrow-up"}></i> {uploadingProof ? 'Otimizando & Enviando...' : (selectedOrder.proofImage ? 'Reenviar Foto' : 'Subir Comprovante')}
                    <input type="file" accept="image/*" style={{ display: 'none' }} disabled={uploadingProof} onChange={handleProofUpload} />
                  </label>
                </div>
              </div>
            )}

            {/* ÁREA DE CHAT EM TEMPO REAL ESTILO GGMAX */}
            <div ref={chatContainerRef} style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', background: '#12121a' }}>
              {selectedOrder.messages && selectedOrder.messages.map((msg) => {
                const isSystem = msg.type === 'system';
                const isStaff = msg.type === 'staff';
                const isClient = msg.type === 'client';

                if (isSystem) {
                  return (
                    <div key={msg.id} style={{ alignSelf: 'center', background: '#1b1b28', border: '1px dashed #3a3a52', borderRadius: '8px', padding: '12px 18px', maxWidth: '85%', textAlign: 'center', fontSize: '0.85rem', color: '#c0c0d0', margin: '6px 0' }}>
                      <span style={{ fontSize: '0.75rem', color: '#78788c', display: 'block', marginBottom: '4px' }}>{msg.timestamp} • Sistema</span>
                      <div style={{ whiteSpace: 'pre-wrap' }}>{formatChatMessage(msg.text)}</div>
                    </div>
                  );
                }

                return (
                  <div 
                    key={msg.id}
                    style={{
                      alignSelf: isClient ? 'flex-end' : 'flex-start',
                      maxWidth: '75%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', alignSelf: isClient ? 'flex-end' : 'flex-start' }}>
                      {isStaff && <span style={{ background: '#cc0000', color: '#fff', fontSize: '0.65rem', fontWeight: '800', padding: '2px 6px', borderRadius: '4px' }}>STAFF</span>}
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: isStaff ? '#ff4d4d' : '#a0a0b0' }}>
                        {msg.sender}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#606070' }}>{msg.timestamp}</span>
                    </div>

                    <div 
                      style={{
                        background: isClient ? '#5865F2' : isStaff ? '#261414' : '#1f1f2e',
                        border: isStaff ? '1px solid #cc0000' : 'none',
                        color: '#fff',
                        padding: '12px 16px',
                        borderRadius: isClient ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                        fontSize: '0.92rem',
                        lineHeight: '1.4',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {formatChatMessage(msg.text)}
                      {msg.attachment && (
                        <div style={{ marginTop: '10px' }}>
                          <a href={msg.attachment} target="_blank" rel="noopener noreferrer">
                            <img 
                              src={msg.attachment} 
                              alt="Anexo" 
                              onLoad={scrollToBottom}
                              style={{ maxWidth: '100%', maxHeight: '220px', borderRadius: '6px', border: '1px solid #3a3a4e', objectFit: 'cover', display: 'block' }} 
                            />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* INPUT DE MENSAGEM DO CHAT */}
            <form onSubmit={handleSendMessage} style={{ padding: '14px 20px', background: '#161620', borderTop: '1px solid #2a0c0c', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <label style={{ background: uploadingChatImg ? '#eab308' : '#262638', color: '#fff', padding: '10px 14px', borderRadius: '6px', cursor: uploadingChatImg ? 'wait' : 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #3e3e5c', whiteSpace: 'nowrap' }}>
                <i className={uploadingChatImg ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-paperclip text-red"}></i> {uploadingChatImg ? 'Enviando...' : 'Anexar Foto'}
                <input type="file" accept="image/*" style={{ display: 'none' }} disabled={uploadingChatImg} onChange={handleChatFileUpload} />
              </label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Digite uma mensagem ou envie print/comprovante para o Staff..." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                style={{ flex: 1, background: '#1a1a26', border: '1px solid #2e2e42' }}
              />
              <button 
                type="submit" 
                className="btn-complete-order" 
                disabled={uploadingChatImg}
                style={{ width: 'auto', padding: '0 22px', background: '#cc0000', border: 'none', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>Enviar</span>
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>

          </div>
        ) : (
          <div style={{ background: '#181822', border: '1px solid #2a0c0c', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            <div style={{ textAlign: 'center', color: '#a0a0b0' }}>
              <i className="fa-solid fa-comments text-red" style={{ fontSize: '3rem', marginBottom: '16px' }}></i>
              <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '8px' }}>Central de Atendimento ao Vivo</h3>
              <p>Selecione um pedido na coluna à esquerda para abrir a sala de chat e enviar seu comprovante.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
