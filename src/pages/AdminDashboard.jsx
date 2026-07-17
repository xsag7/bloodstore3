import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { compressAndUploadImage } from '../lib/supabase';
import { formatChatMessage } from '../lib/security';

export const AdminDashboard = ({ onExitAdmin }) => {
  const { 
    config, 
    products, 
    terms, 
    orders,
    staffUsers,
    addStaffUser,
    updateStaffUser,
    deleteStaffUser,
    addOrderMessage,
    approveAndDeliverOrder,
    rejectOrder,
    updateConfig, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateTerms,
    resetToDefaults,
    notifyStaffStatus,
    testDiscordWebhook
  } = useStore();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'config' | 'terms' | 'staff'

  const adminChatContainerRef = useRef(null);
  const scrollToAdminBottom = () => {
    if (adminChatContainerRef.current) {
      adminChatContainerRef.current.scrollTop = adminChatContainerRef.current.scrollHeight;
    }
  };
  // Estados da aba de Gestão de Pedidos / Chat ao Vivo
  const [selectedAdminOrderId, setSelectedAdminOrderId] = useState(null);
  const [adminChatInput, setAdminChatInput] = useState('');
  const [uploadingAdminChatImg, setUploadingAdminChatImg] = useState(false);
  const [deliveryInput, setDeliveryInput] = useState('');
  const [rejectReasonInput, setRejectReasonInput] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');

  useEffect(() => {
    scrollToAdminBottom();
  }, [orders, selectedAdminOrderId]);

  const handleAdminChatFileUpload = async (e, selOrd) => {
    const file = e.target.files[0];
    if (!file || !selOrd) return;

    setUploadingAdminChatImg(true);
    try {
      const optimizedUrl = await compressAndUploadImage(file);
      if (optimizedUrl) {
        addOrderMessage(selOrd.id, currentStaff?.username || "Staff Blood Store", "staff", adminChatInput.trim() || "📎 Imagem anexa pelo Staff", optimizedUrl);
        setAdminChatInput('');
      } else {
        alert('❌ Erro ao processar anexo de imagem do Staff.');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Erro ao anexar foto: ' + err.message);
    } finally {
      setUploadingAdminChatImg(false);
    }
  };

  // Form states para Novo Produto
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdImage, setNewProdImage] = useState('/fotos e videos/item.png');
  const [newProdBenefits, setNewProdBenefits] = useState('Entrega ultra rápida\nTotalmente verificado e seguro\nSuporte VIP ao cliente');
  const [newProdIcon, setNewProdIcon] = useState('fa-solid fa-box');
  const [newProdPixKey, setNewProdPixKey] = useState('');
  const [newProdQrCodeUrl, setNewProdQrCodeUrl] = useState('');

  // Form states para Edição de Produto
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editBenefits, setEditBenefits] = useState('');
  const [editPixKey, setEditPixKey] = useState('');
  const [editQrCodeUrl, setEditQrCodeUrl] = useState('');

  // Form states para Gestão de Sub-Admins / Equipe Staff
  const [newStaffUser, setNewStaffUser] = useState('');
  const [newStaffPass, setNewStaffPass] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Suporte / Moderador');
  const [newStaffPerms, setNewStaffPerms] = useState({
    canManageProducts: false,
    canManageOrders: true,
    canManageConfig: false,
    canManageStaff: false
  });

  const PRESET_MEDIA_FILES = [
    { label: "-- Escolha um arquivo da pasta fotos e videos/ --", value: "" },
    { label: "Bloodstore Logo 1 (PNG)", value: "/fotos e videos/BloodstoreLogo1.png" },
    { label: "Bloodstore Logo 2 (PNG)", value: "/fotos e videos/BloodstoreLogo2.png" },
    { label: "Bloodstore Logo Geral (PNG)", value: "/fotos e videos/Bloodstore.png" },
    { label: "Logo Antiga (logo.png)", value: "/fotos e videos/logo.png" },
    { label: "Animação de Fundo (animation.mp4)", value: "/fotos e videos/animation.mp4" },
    { label: "Banner Vídeo (banner.mp4)", value: "/fotos e videos/banner.mp4" },
    { label: "Imagem 232 (232.png)", value: "/fotos e videos/232.png" },
    { label: "Produto Robux (robux.png)", value: "/fotos e videos/robux.png" },
    { label: "Produto Conta 18v (conta18v.png)", value: "/fotos e videos/conta18v.png" },
    { label: "Produto Minecraft (minecraft.png)", value: "/fotos e videos/minecraft.png" },
    { label: "Produto Discord Nitro (discord.png)", value: "/fotos e videos/discord.png" },
    { label: "QR Code PIX (qrcode.png)", value: "/fotos e videos/qrcode.png" }
  ];

  // Form states para Configuração Global
  const [cfgStoreName, setCfgStoreName] = useState(config.storeName);
  const [cfgSlogan, setCfgSlogan] = useState(config.slogan);
  const [cfgDiscordInvite, setCfgDiscordInvite] = useState(config.discordInvite);
  const [cfgWebhookUrl, setCfgWebhookUrl] = useState(config.webhookUrl || '');
  const [cfgWebhookApprovalUrl, setCfgWebhookApprovalUrl] = useState(config.webhookApprovalUrl || '');
  const [cfgWebhookRejectedUrl, setCfgWebhookRejectedUrl] = useState(config.webhookRejectedUrl || '');
  const [cfgWebhookLogsUrl, setCfgWebhookLogsUrl] = useState(config.webhookLogsUrl || '');
  const [cfgWebhookMsgLogsUrl, setCfgWebhookMsgLogsUrl] = useState(config.webhookMsgLogsUrl || '');
  const [cfgWebhookStaffJoinUrl, setCfgWebhookStaffJoinUrl] = useState(config.webhookStaffJoinUrl || '');
  const [cfgPixKey, setCfgPixKey] = useState(config.pixKey || '');
  const [cfgLogoUrl, setCfgLogoUrl] = useState(config.logoUrl || '/fotos e videos/BloodstoreLogo1.png');
  const [cfgBannerVideoUrl, setCfgBannerVideoUrl] = useState(config.bannerVideoUrl || '/fotos e videos/BloodstoreLogo2.png');

  useEffect(() => {
    if (config) {
      if (config.storeName) setCfgStoreName(config.storeName);
      if (config.slogan) setCfgSlogan(config.slogan);
      if (config.discordInvite) setCfgDiscordInvite(config.discordInvite);
      if (config.webhookUrl) setCfgWebhookUrl(config.webhookUrl);
      if (config.webhookApprovalUrl) setCfgWebhookApprovalUrl(config.webhookApprovalUrl);
      if (config.webhookRejectedUrl) setCfgWebhookRejectedUrl(config.webhookRejectedUrl);
      if (config.webhookLogsUrl) setCfgWebhookLogsUrl(config.webhookLogsUrl);
      if (config.webhookMsgLogsUrl) setCfgWebhookMsgLogsUrl(config.webhookMsgLogsUrl);
      if (config.webhookStaffJoinUrl) setCfgWebhookStaffJoinUrl(config.webhookStaffJoinUrl);
      if (config.pixKey) setCfgPixKey(config.pixKey);
      if (config.logoUrl) setCfgLogoUrl(config.logoUrl);
      if (config.bannerVideoUrl) setCfgBannerVideoUrl(config.bannerVideoUrl);
    }
  }, [config]);

  const handleFileUpload = (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setter(event.target.result);
      alert(`✅ Arquivo "${file.name}" carregado! A imagem/vídeo está pronta para uso.`);
    };
    reader.readAsDataURL(file);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const cleanUser = usernameInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    // 1. Procura na lista de staffUsers (banco/localStorage)
    const foundStaff = staffUsers?.find(u => u.username.toLowerCase() === cleanUser && u.password === cleanPass);

    if (foundStaff) {
      setCurrentStaff(foundStaff);
      setIsAuthenticated(true);
      notifyStaffStatus(foundStaff, 'login');
    } else if ((cleanUser === 'xsag' && cleanPass === '2368*09783@#87678923bl0d778604') || ((cleanUser === 'admin' || cleanUser === 'staff') && cleanPass === 'admin123')) {
      // 2. Fallback fixo de dono (xsag / penismurcho ou admin123)
      const fallbackStaff = {
        id: 'owner_session',
        username: cleanUser,
        role: cleanUser === 'xsag' ? 'Dono (Owner)' : 'Administrador Geral',
        canManageProducts: true,
        canManageOrders: true,
        canManageConfig: true,
        canManageStaff: true
      };
      setCurrentStaff(fallbackStaff);
      setIsAuthenticated(true);
      notifyStaffStatus(fallbackStaff, 'login');
    } else {
      alert('⚠️ Credenciais inválidas. Verifique usuário e senha.');
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice.trim()) return;

    const benefitsArray = newProdBenefits.split('\n').map(s => s.trim()).filter(Boolean);
    const staffName = currentStaff?.name || currentStaff?.username || "Administrador";
    addProduct({
      name: newProdName.trim(),
      slug: newProdName.trim().toLowerCase().replace(/\s+/g, '-'),
      priceText: newProdPrice.trim().startsWith('R$') ? newProdPrice.trim() : `R$ ${newProdPrice.trim()}`,
      image: newProdImage.trim(),
      icon: newProdIcon.trim() || 'fa-solid fa-box',
      benefits: benefitsArray,
      pixKey: newProdPixKey.trim() || undefined,
      qrCodeUrl: newProdQrCodeUrl.trim() || undefined
    }, staffName);

    setNewProdName('');
    setNewProdPrice('');
    setNewProdPixKey('');
    setNewProdQrCodeUrl('');
    alert('✅ Produto adicionado e vitrine atualizada instantaneamente no LocalStorage!');
  };

  const startEditProduct = (prod) => {
    setEditingId(prod.id);
    setEditName(prod.name);
    setEditPrice(prod.priceText);
    setEditImage(prod.image);
    setEditBenefits(Array.isArray(prod.benefits) ? prod.benefits.join('\n') : prod.benefits);
    setEditPixKey(prod.pixKey || '');
    setEditQrCodeUrl(prod.qrCodeUrl || '');
  };

  const handleSaveEditProduct = (id) => {
    const benefitsArray = editBenefits.split('\n').map(s => s.trim()).filter(Boolean);
    const staffName = currentStaff?.name || currentStaff?.username || "Administrador";
    updateProduct(id, {
      name: editName.trim(),
      priceText: editPrice.trim().startsWith('R$') ? editPrice.trim() : `R$ ${editPrice.trim()}`,
      image: editImage.trim(),
      benefits: benefitsArray,
      pixKey: editPixKey.trim() || undefined,
      qrCodeUrl: editQrCodeUrl.trim() || undefined
    }, staffName);
    setEditingId(null);
    alert('✅ Produto atualizado!');
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    const staffName = currentStaff?.name || currentStaff?.username || "Administrador";
    updateConfig({
      storeName: cfgStoreName.trim(),
      slogan: cfgSlogan.trim(),
      discordInvite: cfgDiscordInvite.trim(),
      webhookUrl: cfgWebhookUrl.trim(),
      webhookApprovalUrl: cfgWebhookApprovalUrl.trim(),
      webhookRejectedUrl: cfgWebhookRejectedUrl.trim(),
      webhookLogsUrl: cfgWebhookLogsUrl.trim(),
      webhookMsgLogsUrl: cfgWebhookMsgLogsUrl.trim(),
      webhookStaffJoinUrl: cfgWebhookStaffJoinUrl.trim(),
      pixKey: cfgPixKey.trim(),
      logoUrl: cfgLogoUrl.trim(),
      bannerVideoUrl: cfgBannerVideoUrl.trim()
    }, staffName);
    alert('✅ Configurações e todos os 6 links de Webhook salvos com sucesso!');
  };

  const handleUpdateTermItem = (id, newTitle, newContent) => {
    const staffName = currentStaff?.name || currentStaff?.username || "Administrador";
    const updated = terms.map(t => t.id === id ? { ...t, title: newTitle, content: newContent } : t);
    updateTerms(updated, staffName);
  };

  const handleAddStaffUser = (e) => {
    e.preventDefault();
    if (!newStaffUser.trim() || !newStaffPass.trim()) return;

    if (staffUsers?.some(u => u.username.toLowerCase() === newStaffUser.trim().toLowerCase())) {
      alert('⚠️ Já existe um usuário com este nome!');
      return;
    }

    const staffName = currentStaff?.name || currentStaff?.username || "Administrador";
    addStaffUser({
      username: newStaffUser.trim(),
      password: newStaffPass.trim(),
      role: newStaffRole,
      ...newStaffPerms
    }, staffName);

    setNewStaffUser('');
    setNewStaffPass('');
    alert('✅ Novo membro da equipe Staff criado com sucesso!');
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-screen">
        <div className="admin-login-box">
          <div className="admin-login-header">
            <i className="fa-solid fa-droplet text-red" style={{ fontSize: '2.4rem', marginBottom: '12px' }}></i>
            <h2>Área da Equipe</h2>
            <p>Painel Operacional • Blood Store</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label">Usuário / Dono</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="ex: staff" 
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required 
                autoComplete="off"
              />
            </div>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label">Senha</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="ex: staff123" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required 
              />
            </div>
            <button type="submit" className="btn-complete-order" style={{ marginTop: '6px' }}>
              <i className="fa-solid fa-arrow-right-to-bracket"></i> Acessar Painel
            </button>
          </form>
          <button onClick={onExitAdmin} className="btn-back-home" style={{ marginTop: '16px' }}>
            <i className="fa-solid fa-arrow-left"></i> Voltar à Loja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* SIDEBAR LATERAL */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <div className="navbar-brand" style={{ fontSize: '1.3rem' }}>
            <i className="fa-solid fa-shield-halved text-red"></i>
            <span>BLOOD STAFF</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#78788c', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ background: '#202030', color: '#fff', padding: '2px 8px', borderRadius: '4px', border: '1px solid #333' }}>
              👤 {currentStaff?.username || 'xsag'} ({currentStaff?.role || 'Admin'})
            </span>
          </div>
        </div>

        <nav className="admin-nav">
          <button 
            className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
            style={{ fontWeight: activeTab === 'orders' ? '700' : '500', color: activeTab === 'orders' ? '#22c55e' : '' }}
          >
            <i className="fa-solid fa-comments text-red"></i> Chats e Pedidos ({orders.filter(o => o.status !== 'aprovado_entregue' && o.status !== 'cancelado').length} pendentes)
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <i className="fa-solid fa-boxes-stacked"></i> Produtos ({products.length})
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'config' ? 'active' : ''}`}
            onClick={() => setActiveTab('config')}
          >
            <i className="fa-solid fa-gear"></i> Webhook & Configs
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'terms' ? 'active' : ''}`}
            onClick={() => setActiveTab('terms')}
          >
            <i className="fa-solid fa-file-contract"></i> Termos e Condições
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'staff' ? 'active' : ''}`}
            onClick={() => setActiveTab('staff')}
            style={{ fontWeight: activeTab === 'staff' ? '700' : '500', color: activeTab === 'staff' ? '#38bdf8' : '' }}
          >
            <i className="fa-solid fa-user-shield"></i> Equipe & Sub-Admins ({staffUsers?.length || 1})
          </button>
        </nav>

        <div className="admin-sidebar-bottom">
          <button 
            onClick={() => {
              if (window.confirm("Atenção: Deseja restaurar os dados originais da Blood Store no LocalStorage?")) {
                const staffName = currentStaff?.name || currentStaff?.username || "Administrador";
                resetToDefaults(staffName);
                alert("Dados restaurados!");
              }
            }} 
            className="btn-reset-data"
          >
            <i className="fa-solid fa-rotate"></i> Restaurar Padrão
          </button>
          <button 
            onClick={() => {
              if (currentStaff) {
                notifyStaffStatus(currentStaff, 'logout', `O membro da equipe saiu do painel administrativo e encerrou o turno.`);
              }
              setIsAuthenticated(false);
              setCurrentStaff(null);
            }} 
            className="btn-logout-staff"
            style={{ background: '#221414', border: '1px solid #cc0000', color: '#ff6b6b', padding: '10px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}
          >
            <i className="fa-solid fa-right-from-bracket"></i> Sair / Encerrar Turno (Log Off)
          </button>
          <button 
            onClick={() => {
              if (currentStaff) {
                notifyStaffStatus(currentStaff, 'logout', `O membro da equipe saiu da área de administração e voltou para a vitrine da loja.`);
              }
              onExitAdmin();
            }} 
            className="btn-exit-admin"
          >
            <i className="fa-solid fa-store"></i> Ver Loja (Vitrine)
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL DE CONTEÚDO */}
      <main className="admin-main-content">
        <header className="admin-topbar">
          <h2>
            {activeTab === 'orders' && <><i className="fa-solid fa-comments text-red"></i> Chats e Pedidos (Atendimento em Tempo Real)</>}
            {activeTab === 'products' && <><i className="fa-solid fa-boxes-stacked text-red"></i> Gerenciamento de Produtos (CRUD & PIX)</>}
            {activeTab === 'config' && <><i className="fa-solid fa-gear text-red"></i> Configurações Globais & Webhook Discord</>}
            {activeTab === 'terms' && <><i className="fa-solid fa-file-contract text-red"></i> Edição de Termos e Políticas</>}
            {activeTab === 'staff' && <><i className="fa-solid fa-user-shield text-red"></i> Gestão de Usuários da Equipe Staff & Sub-Admins</>}
          </h2>
          <div className="admin-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '0.85rem', color: '#22c55e', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }}></span>
              Online: @{currentStaff?.username || 'Staff'}
            </span>
            <button
              type="button"
              onClick={() => notifyStaffStatus(currentStaff, 'login', `O staff **@${currentStaff?.username}** clicou no botão "Disparar Presença Online" no topo do painel e confirmou que está ativo no atendimento!`)}
              style={{ background: '#0e2a18', border: '1px solid #22c55e', color: '#4ade80', padding: '6px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Disparar aviso de que você está ativo no Webhook STAFF JOIN / ON"
            >
              <i className="fa-solid fa-satellite-dish"></i> Disparar Presença Online
            </button>
          </div>
        </header>

        <div className="admin-content-inner">
          {/* ABA 0: GESTÃO DE PEDIDOS / CHAT EM TEMPO REAL ESTILO GGMAX */}
          {activeTab === 'orders' && (
            <div className="admin-orders-view">
              {/* BARRA DE FILTROS DO STAFF */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', background: '#181822', padding: '14px 18px', borderRadius: '8px', border: '1px solid #2a0c0c', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => { setOrderFilter('all'); setSelectedAdminOrderId(null); }} 
                    style={{ background: orderFilter === 'all' ? '#cc0000' : '#202030', color: '#fff', border: '1px solid #3c3c4e', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem' }}
                  >
                    Todos ({orders.length})
                  </button>
                  <button 
                    onClick={() => { setOrderFilter('aguardando_comprovante'); setSelectedAdminOrderId(null); }} 
                    style={{ background: orderFilter === 'aguardando_comprovante' ? '#ffc107' : '#202030', color: orderFilter === 'aguardando_comprovante' ? '#000' : '#fff', border: '1px solid #3c3c4e', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem' }}
                  >
                    Aguardando Comprovante ({orders.filter(o => o.status === 'aguardando_comprovante').length})
                  </button>
                  <button 
                    onClick={() => { setOrderFilter('em_analise'); setSelectedAdminOrderId(null); }} 
                    style={{ background: orderFilter === 'em_analise' ? '#38bdf8' : '#202030', color: orderFilter === 'em_analise' ? '#000' : '#fff', border: '1px solid #3c3c4e', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem' }}
                  >
                    Em Análise 📎 ({orders.filter(o => o.status === 'em_analise').length})
                  </button>
                  <button 
                    onClick={() => { setOrderFilter('aprovado_entregue'); setSelectedAdminOrderId(null); }} 
                    style={{ background: orderFilter === 'aprovado_entregue' ? '#22c55e' : '#202030', color: '#fff', border: '1px solid #3c3c4e', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem' }}
                  >
                    Entregues ✅ ({orders.filter(o => o.status === 'aprovado_entregue').length})
                  </button>
                  <button 
                    onClick={() => { setOrderFilter('cancelado'); setSelectedAdminOrderId(null); }} 
                    style={{ background: orderFilter === 'cancelado' ? '#ff6b6b' : '#202030', color: '#fff', border: '1px solid #3c3c4e', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem' }}
                  >
                    Cancelados ❌ ({orders.filter(o => o.status === 'cancelado').length})
                  </button>
                </div>
                <small style={{ color: '#78788c' }}>Clique em um pedido para atender no chat ao vivo ou liberar entrega.</small>
              </div>

              {orders.length === 0 ? (
                <div style={{ background: '#181822', padding: '50px 20px', borderRadius: '8px', border: '1px solid #2a0c0c', textAlign: 'center', color: '#a0a0b0' }}>
                  <i className="fa-solid fa-box-open" style={{ fontSize: '3rem', color: '#3c3c4e', marginBottom: '16px' }}></i>
                  <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '8px' }}>Nenhum pedido registrado no sistema ainda</h3>
                  <p style={{ fontSize: '0.9rem' }}>Quando os clientes gerarem PIX no checkout, os pedidos e comprovantes aparecerão em tempo real aqui.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '20px' }}>
                  {(() => {
                    const filteredOrders = orders.filter(o => orderFilter === 'all' || o.status === orderFilter);
                    const activeSelId = (selectedAdminOrderId && filteredOrders.some(o => o.id === selectedAdminOrderId))
                      ? selectedAdminOrderId
                      : (filteredOrders[0]?.id || orders[0]?.id || null);

                    return (
                      <>
                        {/* LISTA DE PEDIDOS FILTRADOS */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '720px' }}>
                          {filteredOrders.map(ord => {
                            const isSelected = (ord.id === activeSelId);
                            return (
                              <div 
                                key={ord.id}
                                onClick={() => {
                                  setSelectedAdminOrderId(ord.id);
                                  setDeliveryInput(ord.deliveryContent || '');
                                  setRejectReasonInput(ord.rejectReason || '');
                                }}
                                style={{
                                  background: isSelected ? '#202030' : '#181822',
                                  border: isSelected ? '1px solid #22c55e' : '1px solid #2a0c0c',
                                  borderRadius: '8px',
                                  padding: '14px',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s',
                                  boxShadow: isSelected ? '0 0 16px rgba(34, 197, 94, 0.2)' : 'none'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                  <strong style={{ color: '#fff', fontSize: '0.88rem' }}>{ord.orderNumber}</strong>
                                  <span style={{ fontSize: '0.75rem', color: '#78788c' }}>{new Date(ord.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                  <img src={ord.buyer?.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'} alt="Buyer" style={{ width: '22px', height: '22px', borderRadius: '50%' }} />
                                  <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: '600' }}>{ord.buyer?.username}</span>
                                </div>

                                <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
                                  {ord.product?.name} ({ord.product?.priceText})
                                </div>

                                {ord.contactMethod && (
                                  <div style={{ fontSize: '0.74rem', color: '#a0a0b0', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    📬 {ord.contactMethod} ({ord.contactValue})
                                  </div>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  {ord.status === 'aguardando_comprovante' && <span style={{ color: '#ffc107', fontSize: '0.76rem', fontWeight: '700' }}>⏳ Aguardando Comprovante</span>}
                                  {ord.status === 'em_analise' && <span style={{ color: '#38bdf8', fontSize: '0.76rem', fontWeight: '700' }}>📎 Comprovante Anexado!</span>}
                                  {ord.status === 'aprovado_entregue' && <span style={{ color: '#22c55e', fontSize: '0.76rem', fontWeight: '700' }}>✅ Entregue ao Cliente</span>}
                                  {ord.status === 'cancelado' && <span style={{ color: '#ff6b6b', fontSize: '0.76rem', fontWeight: '700' }}>❌ Cancelado/Reprovado</span>}
                                  
                                  <span style={{ fontSize: '0.75rem', color: '#a0a0b0' }}>{ord.messages?.length || 0} msgs</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* SALA DO ATENDIMENTO / ENTREGA */}
                        {(() => {
                          const selOrd = orders.find(o => o.id === activeSelId);
                          if (!selOrd) return null;

                    return (
                      <div style={{ background: '#181822', border: '1px solid #2a0c0c', borderRadius: '10px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        
                        {/* HEADER DO PEDIDO NO STAFF */}
                        <div style={{ padding: '16px 20px', background: '#1c1c28', borderBottom: '1px solid #2a0c0c', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={selOrd.buyer?.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'} alt="Buyer" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #5865F2' }} />
                            <div>
                              <span style={{ fontSize: '0.78rem', color: '#a0a0b0' }}>ATENDIMENTO • PEDIDO {selOrd.orderNumber}</span>
                              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fff', fontWeight: '700' }}>
                                Cliente: <span style={{ color: '#5865F2' }}>{selOrd.buyer?.username}</span> | {selOrd.product?.name} ({selOrd.product?.priceText})
                              </h3>
                              {selOrd.contactMethod && (
                                <div style={{ fontSize: '0.82rem', color: '#a0a0b0', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                  <span style={{ background: '#202030', padding: '2px 8px', borderRadius: '4px', border: '1px solid #333' }}>📬 Canal de Contato: <strong style={{ color: '#fff' }}>{selOrd.contactMethod}</strong></span>
                                  {selOrd.contactValue && <span style={{ background: '#202030', padding: '2px 8px', borderRadius: '4px', border: '1px solid #333' }}>👤 Contato: <strong style={{ color: '#38bdf8' }}>{selOrd.contactValue}</strong></span>}
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            {selOrd.proofImage && (
                              <a href={selOrd.proofImage} target="_blank" rel="noopener noreferrer" className="btn-hero" style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#38bdf8', color: '#000', textDecoration: 'none' }}>
                                <i className="fa-solid fa-receipt"></i> Ver Comprovante PIX
                              </a>
                            )}
                          </div>
                        </div>

                        {/* AÇÕES DE APROVAÇÃO / REPROVAÇÃO NO STAFF */}
                        {selOrd.status !== 'aprovado_entregue' && selOrd.status !== 'cancelado' && (
                          <div style={{ padding: '16px 20px', background: '#14141c', borderBottom: '1px solid #2a0c0c', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ background: '#101e14', border: '1px solid #22c55e', borderRadius: '8px', padding: '14px' }}>
                              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#22c55e', display: 'block', marginBottom: '8px' }}>
                                <i className="fa-solid fa-gift"></i> Aprovar Pagamento & Entregar Produto:
                              </label>
                              <textarea 
                                className="form-input" 
                                rows={2} 
                                placeholder="Digite aqui o login/senha, código gift ou instruções da entrega..."
                                value={deliveryInput}
                                onChange={(e) => setDeliveryInput(e.target.value)}
                                style={{ fontSize: '0.85rem', background: '#162b1d', border: '1px solid #22c55e', color: '#fff', marginBottom: '10px' }}
                              />
                              <button 
                                onClick={() => {
                                  if (!deliveryInput.trim()) {
                                    alert('Digite o conteúdo da entrega no campo acima antes de aprovar!');
                                    return;
                                  }
                                  const staffName = currentStaff?.name || currentStaff?.username || "Staff Blood Store";
                                  approveAndDeliverOrder(selOrd.id, deliveryInput.trim(), staffName);
                                  alert('✅ Produto entregue e notificado no Webhook de Aprovação da Staff!');
                                }}
                                className="btn-complete-order"
                                style={{ background: '#22c55e', border: 'none', padding: '10px', fontSize: '0.88rem', fontWeight: '700', color: '#fff' }}
                              >
                                <i className="fa-solid fa-check"></i> Liberar Entrega & Aprovar
                              </button>
                            </div>

                            <div style={{ background: '#221414', border: '1px solid #cc0000', borderRadius: '8px', padding: '14px' }}>
                              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ff6b6b', display: 'block', marginBottom: '8px' }}>
                                <i className="fa-solid fa-xmark"></i> Reprovar Comprovante / Pedido:
                              </label>
                              <input 
                                type="text" 
                                className="form-input" 
                                placeholder="Motivo: Comprovante ilegível, valor incorreto..."
                                value={rejectReasonInput}
                                onChange={(e) => setRejectReasonInput(e.target.value)}
                                style={{ fontSize: '0.85rem', background: '#2e1818', border: '1px solid #cc0000', color: '#fff', marginBottom: '10px' }}
                              />
                              <button 
                                onClick={() => {
                                  if (!rejectReasonInput.trim()) {
                                    alert('Digite o motivo da reprovação!');
                                    return;
                                  }
                                  const staffName = currentStaff?.name || currentStaff?.username || "Staff Blood Store";
                                  rejectOrder(selOrd.id, rejectReasonInput.trim(), staffName);
                                  alert('❌ Pedido reprovado e notificado no Webhook da Staff.');
                                }}
                                className="btn-complete-order"
                                style={{ background: '#cc0000', border: 'none', padding: '10px', fontSize: '0.88rem', fontWeight: '700', color: '#fff' }}
                              >
                                <i className="fa-solid fa-ban"></i> Reprovar Comprovante
                              </button>
                            </div>
                          </div>
                        )}

                        {/* ÁREA MENSAGENS E CHAT DO STAFF COM O CLIENTE */}
                        <div ref={adminChatContainerRef} style={{ flex: 1, padding: '18px 20px', overflowY: 'auto', maxHeight: '380px', display: 'flex', flexDirection: 'column', gap: '10px', background: '#12121a' }}>
                          {selOrd.messages && selOrd.messages.map((msg) => {
                            const isSystem = msg.type === 'system';
                            const isStaff = msg.type === 'staff';

                            if (isSystem) {
                              return (
                                <div key={msg.id} style={{ alignSelf: 'center', background: '#1a1a28', border: '1px dashed #3c3c54', borderRadius: '6px', padding: '8px 14px', maxWidth: '80%', textAlign: 'center', fontSize: '0.82rem', color: '#a0a0b0' }}>
                                  <span style={{ fontSize: '0.72rem', color: '#78788c', display: 'block', marginBottom: '2px' }}>{msg.timestamp} • Sistema</span>
                                  {formatChatMessage(msg.text)}
                                </div>
                              );
                            }

                            return (
                              <div key={msg.id} style={{ alignSelf: isStaff ? 'flex-end' : 'flex-start', maxWidth: '75%', display: 'flex', flexDirection: 'column', alignItems: isStaff ? 'flex-end' : 'flex-start' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                                  <strong style={{ fontSize: '0.8rem', color: isStaff ? '#ff4d4d' : '#38bdf8' }}>{msg.sender} ({isStaff ? 'STAFF' : 'CLIENTE'})</strong>
                                  <span style={{ fontSize: '0.7rem', color: '#78788c' }}>{msg.timestamp}</span>
                                </div>
                                <div style={{ background: isStaff ? '#261414' : '#1c1e30', border: isStaff ? '1px solid #6b1d1d' : '1px solid #3c3e62', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                                  {formatChatMessage(msg.text)}
                                  {msg.attachment && (
                                    <div style={{ marginTop: '8px' }}>
                                      <a href={msg.attachment} target="_blank" rel="noopener noreferrer">
                                        <img 
                                          src={msg.attachment} 
                                          alt="Anexo" 
                                          onLoad={scrollToAdminBottom}
                                          style={{ maxWidth: '100%', maxHeight: '180px', borderRadius: '6px', border: '1px solid #3a3a4e', display: 'block' }} 
                                        />
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* INPUT PARA STAFF RESPONDER NO CHAT */}
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!adminChatInput.trim() || !selOrd) return;
                            addOrderMessage(selOrd.id, currentStaff?.username || "Staff Blood Store", "staff", adminChatInput.trim());
                            setAdminChatInput('');
                          }} 
                          style={{ padding: '12px 18px', background: '#161620', borderTop: '1px solid #2a0c0c', display: 'flex', gap: '10px', alignItems: 'center' }}
                        >
                          <label style={{ background: uploadingAdminChatImg ? '#eab308' : '#262638', color: '#fff', padding: '10px 14px', borderRadius: '6px', cursor: uploadingAdminChatImg ? 'wait' : 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #3e3e5c', whiteSpace: 'nowrap' }}>
                            <i className={uploadingAdminChatImg ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-paperclip text-red"}></i> {uploadingAdminChatImg ? 'Enviando...' : 'Anexar Foto'}
                            <input type="file" accept="image/*" style={{ display: 'none' }} disabled={uploadingAdminChatImg} onChange={(e) => handleAdminChatFileUpload(e, selOrd)} />
                          </label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder={`Responder para ${selOrd.buyer?.username} no chat ao vivo...`}
                            value={adminChatInput}
                            onChange={(e) => setAdminChatInput(e.target.value)}
                            style={{ flex: 1, background: '#1a1a26' }}
                          />
                          <button type="submit" disabled={uploadingAdminChatImg} className="btn-complete-order" style={{ width: 'auto', padding: '0 20px', background: '#cc0000', border: 'none', borderRadius: '6px' }}>
                            <i className="fa-solid fa-paper-plane"></i> Enviar
                          </button>
                        </form>
                      </div>
                    );
                  })()}
                </>
              );
            })()}
          </div>
        )}
      </div>
    )}

          {/* ABA 1: PRODUTOS */}
          {activeTab === 'products' && (
            <div className="admin-products-view">
              {/* Formulário Adicionar Novo */}
              <div className="admin-card">
                <h3><i className="fa-solid fa-plus text-red"></i> Adicionar Novo Produto & Configurar PIX Exclusivo</h3>
                <form onSubmit={handleAddProduct} className="admin-grid-form">
                  <div className="form-group">
                    <label className="form-label">Nome do Produto</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="ex: Robux 1.000 ou VIP Ouro" 
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preço</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="ex: R$ 39,90" 
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Chave PIX Específica do Produto (Opcional)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Se preenchida, substitui a chave PIX global para este item" 
                      value={newProdPixKey}
                      onChange={(e) => setNewProdPixKey(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">QR Code PIX do Produto (Opcional)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="/fotos e videos/qrcode.png ou URL da imagem do QR Code" 
                      value={newProdQrCodeUrl}
                      onChange={(e) => setNewProdQrCodeUrl(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Imagem do Produto (Selecione da pasta, envie do PC ou cole um link)</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', marginBottom: '8px' }}>
                      <select 
                        className="form-input" 
                        value={PRESET_MEDIA_FILES.some(f => f.value === newProdImage) ? newProdImage : ""}
                        onChange={(e) => { if (e.target.value) setNewProdImage(e.target.value); }}
                      >
                        {PRESET_MEDIA_FILES.map(f => (
                          <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                      </select>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="/fotos e videos/robux.png ou https://..." 
                        value={newProdImage}
                        onChange={(e) => setNewProdImage(e.target.value)}
                      />
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '0 16px', background: '#22c55e', borderRadius: '6px', color: '#fff', fontWeight: '600', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                        <i className="fa-solid fa-cloud-arrow-up"></i> Enviar do PC
                        <input 
                          type="file" 
                          accept="image/*" 
                          style={{ display: 'none' }} 
                          onChange={(e) => handleFileUpload(e, setNewProdImage)} 
                        />
                      </label>
                    </div>
                    <small style={{ color: '#78788c', display: 'block' }}>
                      Você pode escolher um arquivo da pasta <code>fotos e videos/</code>, carregar uma foto do seu computador ou colar qualquer link da internet.
                    </small>
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Lista de Benefícios / Destaques (Uma linha para cada benefício)</label>
                    <textarea 
                      className="form-input" 
                      rows={3}
                      placeholder="Benefício 1&#10;Benefício 2&#10;Benefício 3" 
                      value={newProdBenefits}
                      onChange={(e) => setNewProdBenefits(e.target.value)}
                    ></textarea>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <button type="submit" className="btn-complete-order" style={{ width: 'auto' }}>
                      <i className="fa-solid fa-plus-circle"></i> Adicionar ao Catálogo
                    </button>
                  </div>
                </form>
              </div>

              {/* Tabela de Produtos Ativos */}
              <div className="admin-card" style={{ marginTop: '24px' }}>
                <h3><i className="fa-solid fa-list text-red"></i> Produtos Ativos no Site ({products.length})</h3>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Imagem</th>
                        <th>Nome & PIX Exclusivo</th>
                        <th>Preço</th>
                        <th>Caminho</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(prod => (
                        <tr key={prod.id}>
                          <td>
                            <img 
                              src={prod.image || "/fotos e videos/robux.png"} 
                              onError={(e) => { e.target.style.display = 'none'; }}
                              alt={prod.name} 
                              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} 
                            />
                          </td>
                          <td>
                            {editingId === prod.id ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <input 
                                  type="text" 
                                  className="form-input" 
                                  placeholder="Nome"
                                  value={editName} 
                                  onChange={(e) => setEditName(e.target.value)} 
                                />
                                <input 
                                  type="text" 
                                  className="form-input" 
                                  placeholder="Chave PIX Específica (Opcional)"
                                  value={editPixKey} 
                                  onChange={(e) => setEditPixKey(e.target.value)} 
                                />
                                <input 
                                  type="text" 
                                  className="form-input" 
                                  placeholder="URL QR Code (Opcional)"
                                  value={editQrCodeUrl} 
                                  onChange={(e) => setEditQrCodeUrl(e.target.value)} 
                                />
                              </div>
                            ) : (
                              <div>
                                <strong style={{ display: 'block' }}>{prod.name}</strong>
                                {prod.pixKey && <small style={{ color: '#38bdf8', fontSize: '0.75rem' }}>PIX: {prod.pixKey}</small>}
                              </div>
                            )}
                          </td>
                          <td>
                            {editingId === prod.id ? (
                              <input 
                                type="text" 
                                className="form-input" 
                                value={editPrice} 
                                onChange={(e) => setEditPrice(e.target.value)} 
                              />
                            ) : (
                              <span style={{ color: '#cc0000', fontWeight: '700' }}>{prod.priceText}</span>
                            )}
                          </td>
                          <td>
                            {editingId === prod.id ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <select 
                                  className="form-input" 
                                  style={{ fontSize: '0.8rem', padding: '6px' }}
                                  value={PRESET_MEDIA_FILES.some(f => f.value === editImage) ? editImage : ""}
                                  onChange={(e) => { if (e.target.value) setEditImage(e.target.value); }}
                                >
                                  {PRESET_MEDIA_FILES.map(f => (
                                    <option key={f.value} value={f.value}>{f.label}</option>
                                  ))}
                                </select>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                  <input 
                                    type="text" 
                                    className="form-input" 
                                    style={{ fontSize: '0.8rem', padding: '6px' }}
                                    value={editImage} 
                                    onChange={(e) => setEditImage(e.target.value)} 
                                  />
                                  <label className="btn-action-save" title="Subir do PC" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '0 10px', background: '#22c55e', borderRadius: '4px', color: '#fff' }}>
                                    <i className="fa-solid fa-upload"></i>
                                    <input 
                                      type="file" 
                                      accept="image/*" 
                                      style={{ display: 'none' }} 
                                      onChange={(e) => handleFileUpload(e, setEditImage)} 
                                    />
                                  </label>
                                </div>
                              </div>
                            ) : (
                              <code style={{ fontSize: '0.78rem', color: '#a0a0b0' }}>{prod.image}</code>
                            )}
                          </td>
                          <td>
                            <div className="admin-actions-cell">
                              {editingId === prod.id ? (
                                <>
                                  <button onClick={() => handleSaveEditProduct(prod.id)} className="btn-action-save" title="Salvar">
                                    <i className="fa-solid fa-check"></i>
                                  </button>
                                  <button onClick={() => setEditingId(null)} className="btn-action-cancel" title="Cancelar">
                                    <i className="fa-solid fa-xmark"></i>
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => startEditProduct(prod)} className="btn-action-edit" title="Editar">
                                    <i className="fa-solid fa-pen"></i>
                                  </button>
                                  <button 
                                    onClick={() => {
                                      if (window.confirm(`Excluir o produto "${prod.name}" da loja?`)) {
                                        const staffName = currentStaff?.name || currentStaff?.username || "Administrador";
                                        deleteProduct(prod.id, staffName);
                                      }
                                    }} 
                                    className="btn-action-delete" 
                                    title="Excluir"
                                  >
                                    <i className="fa-solid fa-trash"></i>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ABA 2: WEBHOOK & CONFIGS GLOBAIS */}
          {activeTab === 'config' && (
            <div className="admin-card">
              <h3><i className="fa-solid fa-gears text-red"></i> Configurações Vitais da Loja</h3>
              <p style={{ color: '#a0a0b0', fontSize: '0.9rem', marginBottom: '20px' }}>
                Altere aqui as configurações de Webhook, PIX e textos da página sem tocar no código-fonte!
              </p>

              <form onSubmit={handleSaveConfig} className="admin-grid-form">
                <div className="form-group" style={{ gridColumn: '1 / -1', background: '#12121a', padding: '16px', borderRadius: '8px', border: '1px solid #2a0c0c' }}>
                  <label className="form-label">
                    <i className="fa-solid fa-image text-red"></i> Logo Oficial da Loja (Barra do Topo, Rodapé e Checkout)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', marginBottom: '8px' }}>
                    <select 
                      className="form-input" 
                      value={PRESET_MEDIA_FILES.some(f => f.value === cfgLogoUrl) ? cfgLogoUrl : ""}
                      onChange={(e) => { if (e.target.value) setCfgLogoUrl(e.target.value); }}
                    >
                      {PRESET_MEDIA_FILES.map(f => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="/fotos e videos/BloodstoreLogo1.png" 
                      value={cfgLogoUrl}
                      onChange={(e) => setCfgLogoUrl(e.target.value)}
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '0 16px', background: '#22c55e', borderRadius: '6px', color: '#fff', fontWeight: '600', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      <i className="fa-solid fa-cloud-arrow-up"></i> Enviar do PC
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        onChange={(e) => handleFileUpload(e, setCfgLogoUrl)} 
                      />
                    </label>
                  </div>
                  <small style={{ color: '#78788c', display: 'block' }}>
                    A logo selecionada aparece automaticamente no topo da loja, no rodapé e na tela de checkout. Padrão sugerido: <code>/fotos e videos/Bloodstore.png</code>.
                  </small>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1', background: '#12121a', padding: '16px', borderRadius: '8px', border: '1px solid #2a0c0c', marginBottom: '8px' }}>
                  <label className="form-label">
                    <i className="fa-solid fa-video text-red"></i> Vídeo / Imagem de Fundo do Banner Principal (Hero)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', marginBottom: '8px' }}>
                    <select 
                      className="form-input" 
                      value={PRESET_MEDIA_FILES.some(f => f.value === cfgBannerVideoUrl) ? cfgBannerVideoUrl : ""}
                      onChange={(e) => { if (e.target.value) setCfgBannerVideoUrl(e.target.value); }}
                    >
                      {PRESET_MEDIA_FILES.map(f => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="/fotos e videos/animation.mp4" 
                      value={cfgBannerVideoUrl}
                      onChange={(e) => setCfgBannerVideoUrl(e.target.value)}
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '0 16px', background: '#22c55e', borderRadius: '6px', color: '#fff', fontWeight: '600', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      <i className="fa-solid fa-cloud-arrow-up"></i> Enviar do PC
                      <input 
                        type="file" 
                        accept="image/*,video/*" 
                        style={{ display: 'none' }} 
                        onChange={(e) => handleFileUpload(e, setCfgBannerVideoUrl)} 
                      />
                    </label>
                  </div>
                  <small style={{ color: '#78788c', display: 'block' }}>
                    Escolha um vídeo da pasta (ex: <code>animation.mp4</code> ou <code>banner.mp4</code>), faça upload do seu computador ou cole um link de imagem/vídeo.
                  </small>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">
                    <i className="fa-brands fa-discord text-red"></i> 1. Webhook de Vendas & Avisos de Compra (Pedidos/PIX dos Clientes)
                  </label>
                  <input 
                    type="url" 
                    className="form-input" 
                    placeholder="https://discord.com/api/webhooks/..." 
                    value={cfgWebhookUrl}
                    onChange={(e) => setCfgWebhookUrl(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button 
                      type="button"
                      onClick={() => testDiscordWebhook(cfgWebhookUrl, 'sales')}
                      style={{ background: '#5865F2', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#4752C4'}
                      onMouseOut={(e) => e.currentTarget.style.background = '#5865F2'}
                    >
                      <i className="fa-brands fa-discord"></i> Testar Webhook de Vendas
                    </button>
                    <small style={{ color: '#78788c', flex: 1, minWidth: '240px' }}>
                      Enviado quando um cliente inicia uma compra e gera o PIX no checkout.
                    </small>
                  </div>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label" style={{ color: '#facc15' }}>
                    <i className="fa-brands fa-discord"></i> 2. Webhook de MNSG LOGS (Chat em Tempo Real dos Pedidos)
                  </label>
                  <input 
                    type="url" 
                    className="form-input" 
                    placeholder="https://discord.com/api/webhooks/..." 
                    value={cfgWebhookMsgLogsUrl}
                    onChange={(e) => setCfgWebhookMsgLogsUrl(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button 
                      type="button"
                      onClick={() => testDiscordWebhook(cfgWebhookMsgLogsUrl, 'msgLogs')}
                      style={{ background: '#ca8a04', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#a16207'}
                      onMouseOut={(e) => e.currentTarget.style.background = '#ca8a04'}
                    >
                      <i className="fa-solid fa-comments"></i> Testar Webhook de MNSG LOGS
                    </button>
                    <small style={{ color: '#78788c', flex: 1, minWidth: '240px' }}>
                      Enviado com cópia de todas as mensagens e anexos trocados no chat ao vivo entre cliente e equipe.
                    </small>
                  </div>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label" style={{ color: '#4ade80' }}>
                    <i className="fa-brands fa-discord"></i> 3. Webhook de APROVADOS (Entrega & Confirmação pela Staff)
                  </label>
                  <input 
                    type="url" 
                    className="form-input" 
                    placeholder="https://discord.com/api/webhooks/..." 
                    value={cfgWebhookApprovalUrl}
                    onChange={(e) => setCfgWebhookApprovalUrl(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button 
                      type="button"
                      onClick={() => testDiscordWebhook(cfgWebhookApprovalUrl, 'approval')}
                      style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#15803d'}
                      onMouseOut={(e) => e.currentTarget.style.background = '#16a34a'}
                    >
                      <i className="fa-solid fa-check"></i> Testar Webhook de Aprovação
                    </button>
                    <small style={{ color: '#78788c', flex: 1, minWidth: '240px' }}>
                      Enviado com o nome do Staff quando um pedido é confirmado e o produto é entregue.
                    </small>
                  </div>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label" style={{ color: '#f87171' }}>
                    <i className="fa-brands fa-discord"></i> 4. Webhook de RECUSADO LOGS (Reprovação de Comprovantes / Pedidos)
                  </label>
                  <input 
                    type="url" 
                    className="form-input" 
                    placeholder="https://discord.com/api/webhooks/..." 
                    value={cfgWebhookRejectedUrl}
                    onChange={(e) => setCfgWebhookRejectedUrl(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button 
                      type="button"
                      onClick={() => testDiscordWebhook(cfgWebhookRejectedUrl, 'rejected')}
                      style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#b91c1c'}
                      onMouseOut={(e) => e.currentTarget.style.background = '#dc2626'}
                    >
                      <i className="fa-solid fa-xmark"></i> Testar Webhook de Recusados
                    </button>
                    <small style={{ color: '#78788c', flex: 1, minWidth: '240px' }}>
                      Enviado quando algum Staff reprova um pedido ou comprovante PIX com o motivo digitado.
                    </small>
                  </div>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label" style={{ color: '#2dd4bf' }}>
                    <i className="fa-brands fa-discord"></i> 5. Webhook de STAFF JOIN LOGS (Monitoramento de Staff Online / Turno)
                  </label>
                  <input 
                    type="url" 
                    className="form-input" 
                    placeholder="https://discord.com/api/webhooks/..." 
                    value={cfgWebhookStaffJoinUrl}
                    onChange={(e) => setCfgWebhookStaffJoinUrl(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button 
                      type="button"
                      onClick={() => testDiscordWebhook(cfgWebhookStaffJoinUrl, 'staffJoin')}
                      style={{ background: '#0d9488', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#0f766e'}
                      onMouseOut={(e) => e.currentTarget.style.background = '#0d9488'}
                    >
                      <i className="fa-solid fa-user-clock"></i> Testar Webhook Staff Join / Online
                    </button>
                    <small style={{ color: '#78788c', flex: 1, minWidth: '240px' }}>
                      Monitora em tempo real quando os membros da Staff entram (login), marcam presença ou encerram o turno (logout).
                    </small>
                  </div>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label" style={{ color: '#60a5fa' }}>
                    <i className="fa-brands fa-discord"></i> 6. Webhook de LOGS de Alterações no Site (Auditoria Administrativa)
                  </label>
                  <input 
                    type="url" 
                    className="form-input" 
                    placeholder="https://discord.com/api/webhooks/..." 
                    value={cfgWebhookLogsUrl}
                    onChange={(e) => setCfgWebhookLogsUrl(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button 
                      type="button"
                      onClick={() => testDiscordWebhook(cfgWebhookLogsUrl, 'logs')}
                      style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#1d4ed8'}
                      onMouseOut={(e) => e.currentTarget.style.background = '#2563eb'}
                    >
                      <i className="fa-solid fa-shield-halved"></i> Testar Webhook de Logs do Site
                    </button>
                    <small style={{ color: '#78788c', flex: 1, minWidth: '240px' }}>
                      Enviado quando algum Staff modifica produtos, configurações, membros da equipe ou termos no painel.
                    </small>
                  </div>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">
                    <i className="fa-solid fa-qrcode text-red"></i> Chave PIX Copia e Cola Geral (Sua conta recebedora padrão)
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Cole sua chave PIX Copia e Cola aqui..." 
                    value={cfgPixKey}
                    onChange={(e) => setCfgPixKey(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nome da Loja</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={cfgStoreName}
                    onChange={(e) => setCfgStoreName(e.target.value)}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Slogan do Banner Principal</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={cfgSlogan}
                    onChange={(e) => setCfgSlogan(e.target.value)}
                    required 
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Link de Convite do Discord (Botão no Topo e Rodapé)</label>
                  <input 
                    type="url" 
                    className="form-input" 
                    value={cfgDiscordInvite}
                    onChange={(e) => setCfgDiscordInvite(e.target.value)}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" className="btn-complete-order" style={{ width: 'auto' }}>
                    <i className="fa-solid fa-floppy-disk"></i> Salvar Todas Alterações no LocalStorage
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ABA 3: EDIÇÃO DOS TERMOS E CONDIÇÕES */}
          {activeTab === 'terms' && (
            <div className="admin-card">
              <h3><i className="fa-solid fa-file-contract text-red"></i> Editar Termos e Políticas da Loja</h3>
              <p style={{ color: '#a0a0b0', fontSize: '0.9rem', marginBottom: '20px' }}>
                Edite os textos de cada regra. As mudanças aparecem instantaneamente no acordeão de Termos da vitrine.
              </p>

              <div className="admin-terms-editor-list">
                {terms.map((item) => (
                  <div key={item.id} className="admin-term-edit-box">
                    <div className="form-group">
                      <label className="form-label">Título da Regra</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={item.title} 
                        onChange={(e) => handleUpdateTermItem(item.id, e.target.value, item.content)} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Conteúdo Detalhado</label>
                      <textarea 
                        className="form-input" 
                        rows={3} 
                        value={item.content} 
                        onChange={(e) => handleUpdateTermItem(item.id, item.title, e.target.value)} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABA 4: GESTÃO DE EQUIPE / SUB-ADMINS */}
          {activeTab === 'staff' && (
            <div className="admin-card">
              <h3><i className="fa-solid fa-user-shield text-red"></i> Criar & Gerenciar Sub-Administradores da Equipe</h3>
              <p style={{ color: '#a0a0b0', fontSize: '0.9rem', marginBottom: '20px' }}>
                O dono (<b>xsag</b>) pode criar contas de acesso para moderadores e suporte, definindo permissões específicas para cada membro da equipe.
              </p>

              {/* Formulário de Novo Membro */}
              <form onSubmit={handleAddStaffUser} className="admin-grid-form" style={{ background: '#12121a', padding: '20px', borderRadius: '8px', border: '1px solid #2a0c0c', marginBottom: '24px' }}>
                <div className="form-group">
                  <label className="form-label">Nome de Usuário (Login)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="ex: moderador_lucas" 
                    value={newStaffUser}
                    onChange={(e) => setNewStaffUser(e.target.value)}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Senha de Acesso</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="ex: staff2026" 
                    value={newStaffPass}
                    onChange={(e) => setNewStaffPass(e.target.value)}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cargo / Função</label>
                  <select 
                    className="form-input" 
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value)}
                  >
                    <option value="Suporte / Moderador">Suporte / Moderador</option>
                    <option value="Gerente de Pedidos">Gerente de Pedidos</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label" style={{ marginBottom: '10px' }}>Permissões Concedidas</label>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#fff', fontSize: '0.9rem' }}>
                      <input 
                        type="checkbox" 
                        checked={newStaffPerms.canManageOrders} 
                        onChange={(e) => setNewStaffPerms({ ...newStaffPerms, canManageOrders: e.target.checked })} 
                      />
                      Atender e Entregar Pedidos
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#fff', fontSize: '0.9rem' }}>
                      <input 
                        type="checkbox" 
                        checked={newStaffPerms.canManageProducts} 
                        onChange={(e) => setNewStaffPerms({ ...newStaffPerms, canManageProducts: e.target.checked })} 
                      />
                      Adicionar/Editar Produtos (CRUD)
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#fff', fontSize: '0.9rem' }}>
                      <input 
                        type="checkbox" 
                        checked={newStaffPerms.canManageConfig} 
                        onChange={(e) => setNewStaffPerms({ ...newStaffPerms, canManageConfig: e.target.checked })} 
                      />
                      Editar Mídias / Webhook / Configs Globais
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#fff', fontSize: '0.9rem' }}>
                      <input 
                        type="checkbox" 
                        checked={newStaffPerms.canManageStaff} 
                        onChange={(e) => setNewStaffPerms({ ...newStaffPerms, canManageStaff: e.target.checked })} 
                      />
                      Gerenciar Equipe / Sub-Admins
                    </label>
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" className="btn-complete-order" style={{ width: 'auto' }}>
                    <i className="fa-solid fa-user-plus"></i> Criar Sub-Admin da Equipe
                  </button>
                </div>
              </form>

              {/* Tabela de Membros */}
              <h3><i className="fa-solid fa-users text-red"></i> Membros Atuais da Equipe Staff</h3>
              <div className="admin-table-wrap" style={{ marginTop: '12px' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Usuário</th>
                      <th>Cargo</th>
                      <th>Permissões</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffUsers?.map(user => (
                      <tr key={user.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#cc0000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <strong style={{ color: '#fff', display: 'block' }}>{user.username}</strong>
                              <small style={{ color: '#78788c' }}>{user.id === 'staff_owner' ? 'Dono Principal' : 'Membro Staff'}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ background: '#202030', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '600' }}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {user.canManageOrders && <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>✅ Pedidos</span>}
                            {user.canManageProducts && <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>📦 Produtos</span>}
                            {user.canManageConfig && <span style={{ background: 'rgba(255, 193, 7, 0.15)', color: '#ffc107', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>⚙️ Configs</span>}
                            {user.canManageStaff && <span style={{ background: 'rgba(204, 0, 0, 0.15)', color: '#ff6b6b', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>🛡️ Equipe</span>}
                          </div>
                        </td>
                        <td>
                          {user.username.toLowerCase() === 'xsag' ? (
                            <span style={{ fontSize: '0.8rem', color: '#78788c' }}>Protegido (Dono)</span>
                          ) : (
                            <button 
                              onClick={() => {
                                if (window.confirm(`Remover o acesso de "${user.username}" da equipe Staff?`)) {
                                  const staffName = currentStaff?.name || currentStaff?.username || "Administrador";
                                  deleteStaffUser(user.id, staffName);
                                }
                              }} 
                              className="btn-action-delete"
                              title="Remover Acesso"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
