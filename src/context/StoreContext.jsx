import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { sanitizeString, canSubmitOrder, canSendMessage, validateOrderPayload } from '../lib/security';

const STORAGE_KEY = 'bloodstore_global_state';

// Dados Padrão da Blood Store
const DEFAULT_STATE = {
  config: {
    storeName: "BLOOD STORE",
    slogan: "Sua evolução começa aqui.",
    discordInvite: "https://discord.gg/Gvbg5WYPBP",
    webhookUrl: "", 
    pixKey: "00020126580014br.gov.bcb.pix0136BLOOD-STORE-PIX-EXCLUSIVE5204000053039865802BR5911BLOOD STORE6009SAO PAULO62070503***63041A2B",
    logoUrl: "/fotos e videos/Bloodstore.png",
    bannerVideoUrl: "/fotos e videos/BloodstoreLogo2.png", // Wallpaper de fundo BloodstoreLogo2.png
    qrCodeUrl: "/fotos e videos/qrcode.png"
  },
  staffUsers: [
    {
      id: "owner-xsag",
      username: "xsag",
      password: "penismurcho",
      role: "owner",
      name: "Dono Supremo (xsag)",
      permissions: {
        manageStaff: true,
        manageProducts: true,
        manageOrders: true,
        manageConfig: true,
        manageTerms: true
      }
    }
  ],
  currentUser: null,
  orders: [],
  products: [
    {
      id: "p1",
      slug: "robux (r0b6x)",
      name: "Robux (r0b6x)",
      priceText: "R$ 29,90",
      priceValue: 29.90,
      image: "/fotos e videos/robux.png",
      icon: "fa-solid fa-coins",
      pixKey: "",
      qrCodeUrl: "",
      benefits: [
        "Entrega rápida via Gamepass ou Grupo",
        "Sem risco de punição ou banimento",
        "Taxa de 30% da plataforma coberta"
      ]
    },
    {
      id: "p2",
      slug: "conta-18v (c0nta-18v)",
      name: "Conta 18v (c0nta-18v)",
      priceText: "R$ 49,90",
      priceValue: 49.90,
      image: "/fotos e videos/conta18v.png",
      icon: "fa-solid fa-user-shield",
      pixKey: "",
      qrCodeUrl: "",
      benefits: [
        "Conta verificada 18 anos de registro",
        "Full Acesso (Altere e-mail e senha)",
        "Histórico limpo e raridade elevada"
      ]
    },
    {
      id: "p3",
      slug: "j0g0s-st34m",
      name: "Jogos Steam (j0g0s-st34m)",
      priceText: "R$ 34,90",
      priceValue: 34.90,
      image: "/fotos e videos/steam.png",
      icon: "fa-brands fa-steam",
      pixKey: "",
      qrCodeUrl: "",
      benefits: [
        "Chaves originais (CD-Keys) ou Gift",
        "Ativação oficial em sua conta Steam",
        "Jogos AAA e Indies em promoção"
      ]
    },
    {
      id: "p4",
      slug: "murd3r-myst3ry",
      name: "Murder Mystery 2 (murd3r-myst3ry)",
      priceText: "R$ 19,90",
      priceValue: 19.90,
      image: "/fotos e videos/murder.png",
      icon: "fa-solid fa-wand-magic-sparkles",
      pixKey: "",
      qrCodeUrl: "",
      benefits: [
        "Godlys, Ancients e Chromas mais raras",
        "Entrega direta via Trade in-game",
        "Itens 100% limpos e legítimos"
      ]
    },
    {
      id: "p5",
      slug: "bloxfru1ts-g0d-human",
      name: "Blox Fruits - God Human + Cursed Dual Katana",
      priceText: "R$ 39,90",
      priceValue: 39.90,
      image: "/fotos e videos/blox.png",
      icon: "fa-solid fa-khanda",
      pixKey: "",
      qrCodeUrl: "",
      benefits: [
        "Conta nível máximo (Max Level 2550)",
        "God Human + Cursed Dual Katana e Soul Guitar",
        "Fruta mítica no inventário ou comida"
      ]
    },
    {
      id: "p6",
      slug: "d1sc0rd-n1tr0",
      name: "Discord Nitro Gaming (3 Meses + 2 Boosts)",
      priceText: "R$ 14,90",
      priceValue: 14.90,
      image: "/fotos e videos/discord.png",
      icon: "fa-brands fa-discord",
      pixKey: "",
      qrCodeUrl: "",
      benefits: [
        "Link de ativação oficial e instantâneo",
        "Acesso a 2 Boosts para seu servidor preferido",
        "Garantia contra quedas ou revogações"
      ]
    }
  ],
  terms: [
    {
      id: "t1",
      icon: "fa-solid fa-money-bill-transfer",
      title: "1. Forma de Pagamento",
      content: "Aceitamos exclusivamente pagamento via PIX. Ao finalizar no site, a chave Copia e Cola e o QR Code são disponibilizados instantaneamente para validação ágil."
    },
    {
      id: "t2",
      icon: "fa-solid fa-rotate-left",
      title: "2. Reembolso",
      content: "Sem reembolso após a entrega do produto (exceto em caso de falha técnica comprovada no ato do envio por parte da loja)."
    },
    {
      id: "t3",
      icon: "fa-solid fa-box-fast",
      title: "3. Prazo de Entrega",
      content: "O prazo de entrega garantido é de até 24 horas. Pedimos para evitar pressões desnecessárias na equipe de suporte. Reembolso 100% garantido caso o prazo expire."
    },
    {
      id: "t4",
      icon: "fa-solid fa-user-shield",
      title: "4. Pós-Entrega",
      content: "A loja não possui responsabilidade sobre a conta ou produto após o recebimento e validação por parte do cliente. Recomendamos alterar imediatamente suas senhas para máxima segurança."
    },
    {
      id: "t5",
      icon: "fa-solid fa-headset",
      title: "5. Atendimento e Prioridade",
      content: "O suporte funciona por ordem de fila em nosso Discord. Usuários Boosters no servidor têm prioridade no atendimento e liberação de itens."
    },
    {
      id: "t6",
      icon: "fa-solid fa-star",
      title: "6. Avaliação Obrigatória",
      content: "É obrigatório deixar feedback com print da entrega no canal 🌟・avaliações sob pena de receber a tag @proibido de comprar."
    }
  ]
};

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [storeState, setStoreState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const logo = (parsed.config?.logoUrl === "/fotos e videos/BloodstoreLogo1.png" || !parsed.config?.logoUrl) 
          ? "/fotos e videos/Bloodstore.png" 
          : parsed.config.logoUrl;
        
        const bannerVideo = (!parsed.config?.bannerVideoUrl || parsed.config?.bannerVideoUrl === "/fotos e videos/animation.mp4" || parsed.config?.bannerVideoUrl === "")
          ? "/fotos e videos/BloodstoreLogo2.png"
          : parsed.config.bannerVideoUrl;

        return {
          ...DEFAULT_STATE,
          ...parsed,
          config: {
            ...DEFAULT_STATE.config,
            ...(parsed.config || {}),
            logoUrl: logo,
            bannerVideoUrl: bannerVideo
          },
          staffUsers: Array.isArray(parsed.staffUsers) && parsed.staffUsers.length > 0 
            ? parsed.staffUsers 
            : DEFAULT_STATE.staffUsers,
          currentUser: parsed.currentUser || null,
          orders: Array.isArray(parsed.orders) ? parsed.orders : []
        };
      }
    } catch (e) {
      console.error("Erro ao ler do LocalStorage, restaurando padrão:", e);
    }
    return DEFAULT_STATE;
  });

  const isLocalChangeRef = useRef(false);
  const lastLocalUpdateRef = useRef(0);

  const markLocalUpdate = () => {
    isLocalChangeRef.current = true;
    lastLocalUpdateRef.current = Date.now();
  };

  // --- Sincronização Inicial & Tempo Real (Sem F5) ---
  useEffect(() => {
    const applyCloudData = (data) => {
      if (!data) return;
      // Blindagem Anti-Flicker: Se houve modificação local no chat/pedidos nos últimos 3.5 segundos,
      // IGNORAR dados da nuvem temporariamente para não piscar a tela nem remover mensagens recém-enviadas!
      if (Date.now() - lastLocalUpdateRef.current < 3500) {
        return;
      }

      setStoreState(prev => {
        const mergedConfig = {
          ...DEFAULT_STATE.config,
          ...(data.config || {}),
          logoUrl: data.config?.logoUrl || prev.config?.logoUrl || "/fotos e videos/Bloodstore.png",
          bannerVideoUrl: (!data.config?.bannerVideoUrl || data.config?.bannerVideoUrl === "/fotos e videos/animation.mp4")
            ? "/fotos e videos/BloodstoreLogo2.png"
            : data.config.bannerVideoUrl
        };
        const mergedStaff = Array.isArray(data.staff_users) && data.staff_users.length > 0
          ? data.staff_users
          : (prev.staffUsers || DEFAULT_STATE.staffUsers);
        const mergedOrders = Array.isArray(data.orders) ? data.orders : (prev.orders || []);
        const mergedProducts = Array.isArray(data.products) && data.products.length > 0 ? data.products : prev.products;
        const mergedTerms = Array.isArray(data.terms) && data.terms.length > 0 ? data.terms : prev.terms;

        const cloudState = {
          ...prev,
          config: mergedConfig,
          products: mergedProducts,
          terms: mergedTerms,
          orders: mergedOrders,
          staffUsers: mergedStaff
        };

        // Comparação profunda total: se o estado da nuvem for idêntico ao estado atual, NÃO atualizar
        // (evita que o React re-renderize o chat em loop e faça a página piscar/flicker)
        if (JSON.stringify(prev) === JSON.stringify(cloudState)) {
          return prev;
        }

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudState));
        } catch (e) {}
        return cloudState;
      });
    };

    const loadFromCloud = async () => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from('store_state')
          .select('*')
          .eq('id', 'global_state')
          .single();

        if (error && error.code !== 'PGRST116') {
          return;
        }

        if (data) {
          applyCloudData(data);
        }
      } catch (err) {
        console.error('❌ Erro na consulta Supabase:', err.message);
      }
    };

    // 1. Carregamento instantâneo no boot
    loadFromCloud();

    // 2. Assinatura Real-Time via WebSocket (Supabase Realtime + Broadcast de Chat)
    let channel = null;
    let broadcastChannel = null;
    if (supabase) {
      // Canal de mudanças no banco PostgreSQL (postgres_changes)
      channel = supabase
        .channel('public:store_state_realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'store_state' }, (payload) => {
          if (payload.new && payload.new.id === 'global_state') {
            applyCloudData(payload.new);
          } else {
            loadFromCloud();
          }
        })
        .subscribe();

      // Canal de Broadcast WebSocket direto para Chat instantâneo (latência ~50ms entre computadores/celulares)
      broadcastChannel = supabase
        .channel('bloodstore_live_sync')
        .on('broadcast', { event: 'STATE_CHANGED' }, (payload) => {
          if (payload.payload && payload.payload.state) {
            if (Date.now() - lastLocalUpdateRef.current < 3500) return;
            setStoreState(prev => {
              if (JSON.stringify(prev) === JSON.stringify(payload.payload.state)) return prev;
              return payload.payload.state;
            });
          } else {
            loadFromCloud();
          }
        })
        .subscribe();
    }

    // 3. Sincronização entre abas no mesmo navegador (BroadcastChannel local 0ms)
    let bc = null;
    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      bc = new BroadcastChannel('bloodstore_sync_channel');
      bc.onmessage = (event) => {
        if (event.data && event.data.type === 'STATE_UPDATE' && event.data.state) {
          if (Date.now() - lastLocalUpdateRef.current < 3500) return;
          setStoreState(prev => {
            if (JSON.stringify(prev) === JSON.stringify(event.data.state)) return prev;
            return event.data.state;
          });
        }
      };
    }

    // 4. Polling seguro e calmo de 5 segundos como garantia de backup (evitando sobrecarga e piscadas)
    const interval = setInterval(() => {
      loadFromCloud();
    }, 5000);

    return () => {
      if (channel && supabase) supabase.removeChannel(channel);
      if (broadcastChannel && supabase) supabase.removeChannel(broadcastChannel);
      if (bc) bc.close();
      clearInterval(interval);
    };
  }, []);

  // Salvar no LocalStorage + Nuvem (Supabase) + Broadcast sempre que o storeState for modificado
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storeState));
    } catch (e) {
      console.error("Erro ao salvar no LocalStorage:", e);
    }

    // Se a alteração no storeState NÃO veio de uma ação local do usuário (ou seja, veio de uma sincronização de nuvem),
    // NÃO reenviar para o servidor e NÃO disparar broadcast em loop infinito!
    if (!isLocalChangeRef.current) {
      return;
    }
    isLocalChangeRef.current = false;

    // Broadcast para outras abas abertas no mesmo PC (0ms latency sem F5)
    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      try {
        const bc = new BroadcastChannel('bloodstore_sync_channel');
        bc.postMessage({ type: 'STATE_UPDATE', state: storeState });
        bc.close();
      } catch (e) {}
    }

    // Broadcast via Supabase WebSocket para outros computadores e celulares conectados instantaneamente (~50ms)
    if (supabase) {
      try {
        supabase.channel('bloodstore_live_sync').send({
          type: 'broadcast',
          event: 'STATE_CHANGED',
          payload: { timestamp: Date.now(), state: storeState }
        });
      } catch (e) {}
    }

    // Sincronização automática na nuvem (Supabase Upsert)
    const syncToCloud = async () => {
      if (!supabase) return;
      try {
        await supabase.from('store_state').upsert({
          id: 'global_state',
          config: storeState.config,
          products: storeState.products,
          terms: storeState.terms,
          orders: storeState.orders || [],
          staff_users: storeState.staffUsers || [],
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.error("❌ Erro ao sincronizar com Supabase na nuvem:", err.message);
      }
    };

    syncToCloud();
  }, [storeState]);

  // Funções CRUD de Configurações
  const updateConfig = (newConfig) => {
    const sanitized = { ...newConfig };
    if (sanitized.storeName) sanitized.storeName = sanitizeString(sanitized.storeName, 100);
    if (sanitized.slogan) sanitized.slogan = sanitizeString(sanitized.slogan, 200);
    if (sanitized.discordInvite) sanitized.discordInvite = sanitizeString(sanitized.discordInvite, 300);

    markLocalUpdate();
    setStoreState(prev => ({
      ...prev,
      config: { ...prev.config, ...sanitized }
    }));
  };

  // Funções CRUD de Sub-Administradores (Equipe Staff)
  const addStaffUser = (newUser) => {
    const id = "staff_" + Date.now();
    const cleanUser = {
      ...newUser,
      username: sanitizeString(newUser.username || '', 50),
      name: sanitizeString(newUser.name || '', 100)
    };
    markLocalUpdate();
    setStoreState(prev => ({
      ...prev,
      staffUsers: [...(prev.staffUsers || DEFAULT_STATE.staffUsers), { ...cleanUser, id }]
    }));
  };

  const updateStaffUser = (id, updatedFields) => {
    const cleanFields = { ...updatedFields };
    if (cleanFields.username) cleanFields.username = sanitizeString(cleanFields.username, 50);
    if (cleanFields.name) cleanFields.name = sanitizeString(cleanFields.name, 100);

    markLocalUpdate();
    setStoreState(prev => ({
      ...prev,
      staffUsers: (prev.staffUsers || DEFAULT_STATE.staffUsers).map(u => u.id === id ? { ...u, ...cleanFields } : u)
    }));
  };

  const deleteStaffUser = (id) => {
    markLocalUpdate();
    setStoreState(prev => ({
      ...prev,
      staffUsers: (prev.staffUsers || DEFAULT_STATE.staffUsers).filter(u => u.id !== id && u.username !== 'xsag')
    }));
  };

  // Funções CRUD de Produtos
  const addProduct = (newProd) => {
    const id = "p_" + Date.now();
    const cleanProd = {
      ...newProd,
      name: sanitizeString(newProd.name || '', 150),
      priceText: sanitizeString(newProd.priceText || '', 30)
    };
    markLocalUpdate();
    setStoreState(prev => ({
      ...prev,
      products: [...prev.products, { ...cleanProd, id }]
    }));
  };

  const updateProduct = (id, updatedFields) => {
    const cleanFields = { ...updatedFields };
    if (cleanFields.name) cleanFields.name = sanitizeString(cleanFields.name, 150);
    if (cleanFields.priceText) cleanFields.priceText = sanitizeString(cleanFields.priceText, 30);

    markLocalUpdate();
    setStoreState(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === id ? { ...p, ...cleanFields } : p)
    }));
  };

  const deleteProduct = (id) => {
    markLocalUpdate();
    setStoreState(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id)
    }));
  };

  // Funções CRUD de Termos
  const updateTerms = (updatedTerms) => {
    markLocalUpdate();
    setStoreState(prev => ({
      ...prev,
      terms: updatedTerms
    }));
  };

  const resetToDefaults = () => {
    markLocalUpdate();
    setStoreState(DEFAULT_STATE);
  };

  // --- Autenticação Discord (Simulada/Persistida) ---
  const loginWithDiscord = (userData) => {
    markLocalUpdate();
    setStoreState(prev => ({
      ...prev,
      currentUser: userData
    }));
  };

  const logout = () => {
    markLocalUpdate();
    setStoreState(prev => ({
      ...prev,
      currentUser: null
    }));
  };

  // --- Central de Notificações Webhook do Discord ---
  const notifyDiscordWebhook = async (embedData) => {
    const url = storeState?.config?.webhookUrl || '';
    if (!url || typeof url !== 'string' || !url.includes('discord')) return;

    const payload = {
      username: `${storeState?.config?.storeName || 'Blood Store'} • Sistema Ao Vivo`,
      avatar_url: "https://i.imgur.com/8N40WzN.png",
      embeds: [{
        ...embedData,
        footer: { text: `${storeState?.config?.storeName || 'Blood Store'} • Sistema Estilo GGMAX` },
        timestamp: new Date().toISOString()
      }]
    };

    try {
      await fetch(url.trim(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error("❌ Erro ao enviar notificação para o Webhook do Discord:", err);
    }
  };

  // --- Pedidos & Chat ao Vivo Estilo GGMAX com Blindagem Anti-Hacking ---
  const createOrder = ({ product, discordUser, pixCode, qrCodeUrl, contactMethod, contactValue }) => {
    // Validação de Rate Limiting (Anti-Spam)
    const rateCheck = canSubmitOrder();
    if (!rateCheck.allowed) {
      alert(rateCheck.reason);
      return null;
    }

    const cleanContactValue = sanitizeString(contactValue || discordUser?.username || "Não informado", 200);
    const cleanContactMethod = sanitizeString(contactMethod || "Chat do Site / Discord", 100);

    const payloadCheck = validateOrderPayload({ product, contactValue: cleanContactValue });
    if (!payloadCheck.valid) {
      alert(payloadCheck.error);
      return null;
    }

    const orderId = "ord_" + Date.now();
    const orderNumber = "#" + Math.floor(1000 + Math.random() * 9000);
    const nowStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    const activePixCode = pixCode || product?.pixKey || storeState.config.pixKey;
    const activeQrCode = qrCodeUrl || product?.qrCodeUrl || storeState.config.qrCodeUrl || "/fotos e videos/qrcode.png";

    const newOrder = {
      id: orderId,
      orderNumber,
      createdAt: new Date().toISOString(),
      product: { ...product },
      buyer: { ...discordUser },
      contactMethod: cleanContactMethod,
      contactValue: cleanContactValue,
      pixCode: activePixCode,
      qrCodeUrl: activeQrCode,
      status: "aguardando_comprovante",
      proofImage: "",
      deliveryContent: "",
      rejectReason: "",
      messages: [
        {
          id: "msg_init_" + Date.now(),
          sender: "Sistema Blood Store",
          type: "system",
          text: `🎯 Pedido ${orderNumber} criado para **${product.name}** (${product.priceText}).\n📬 **Meio de Contato/Entrega Solicitado:** ${cleanContactMethod} (${cleanContactValue})\n\n⚡ **Como liberar seu produto agora:**\n1. Faça o pagamento do PIX Copia e Cola.\n2. Clique no botão "Subir Comprovante PIX" ou envie a foto no chat abaixo.\n3. Nosso Administrador verificará e entregará seu item diretamente aqui no chat ou pelo meio escolhido!`,
          timestamp: nowStr
        }
      ]
    };

    markLocalUpdate();
    setStoreState(prev => ({
      ...prev,
      orders: [newOrder, ...(prev.orders || [])]
    }));

    // Notificar Webhook do Discord de Novo Pedido
    notifyDiscordWebhook({
      title: `🩸 NOVO PEDIDO CONFIRMADO • ${orderNumber}`,
      description: `Um cliente iniciou o processo de compra do produto **${product.name}**.`,
      color: 13369344,
      fields: [
        { name: "📬 Meio de Contato", value: `**${cleanContactMethod}**`, inline: false },
        { name: "👤 Identificação do Cliente", value: `\`${cleanContactValue}\``, inline: true },
        { name: "📦 Produto", value: `**${product.name}**`, inline: true },
        { name: "💰 Valor", value: `**${product.priceText}**`, inline: true },
        { name: "🔔 Próximo Passo", value: "Aguardando o cliente anexar o comprovante PIX na sala de chat (`/#/pedidos`).", inline: false }
      ]
    });

    return newOrder;
  };

  const sendOrderProof = (orderId, proofImageUrl) => {
    const nowStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    markLocalUpdate();
    setStoreState(prev => {
      const updatedOrders = (prev.orders || []).map(ord => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          status: "em_analise",
          proofImage: proofImageUrl,
          messages: [
            ...ord.messages,
            {
              id: "msg_" + Date.now(),
              sender: ord.buyer.username || "Cliente",
              type: "client",
              text: "📎 **Comprovante de Pagamento PIX enviado!** Por favor, verifique e libere meu produto.",
              attachment: proofImageUrl,
              timestamp: nowStr
            }
          ]
        };
      });
      return { ...prev, orders: updatedOrders };
    });

    const targetOrd = (storeState.orders || []).find(o => o.id === orderId);
    if (targetOrd) {
      notifyDiscordWebhook({
        title: `📎 [NOVO COMPROVANTE PIX] • Pedido ${targetOrd.orderNumber}`,
        description: `O cliente **${targetOrd.buyer?.username || 'Cliente'}** anexou o comprovante de pagamento para **${targetOrd.product?.name}**!`,
        color: 16766720,
        fields: [
          { name: "📦 Produto", value: `**${targetOrd.product?.name}** (${targetOrd.product?.priceText})`, inline: true },
          { name: "📬 Contato do Cliente", value: `\`${targetOrd.contactMethod}: ${targetOrd.contactValue}\``, inline: true },
          { name: "🔔 Status", value: "⚠️ **O pedido mudou para Em Análise. Acesse o Painel Staff (`/#/staff`) para conferir o print e aprovar.**", inline: false }
        ],
        image: { url: proofImageUrl }
      });
    }
  };

  const addOrderMessage = (orderId, senderName, senderType, text, attachmentUrl = null) => {
    // Proteção Anti-Spam (Rate Limit no Chat)
    if (senderType === 'client') {
      const msgCheck = canSendMessage();
      if (!msgCheck.allowed) {
        alert(msgCheck.reason);
        return;
      }
    }

    const cleanText = sanitizeString(text || '', 1500);
    const cleanSender = sanitizeString(senderName || 'Usuário', 100);

    if (!cleanText && !attachmentUrl) return;

    const nowStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    markLocalUpdate();
    setStoreState(prev => {
      const updatedOrders = (prev.orders || []).map(ord => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          messages: [
            ...ord.messages,
            {
              id: "msg_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
              sender: cleanSender,
              type: senderType, // 'client' | 'staff' | 'system'
              text: cleanText,
              attachment: attachmentUrl,
              timestamp: nowStr
            }
          ]
        };
      });
      return { ...prev, orders: updatedOrders };
    });

    const targetOrd = (storeState.orders || []).find(o => o.id === orderId);
    if (targetOrd) {
      const isStaff = senderType === 'staff';
      notifyDiscordWebhook({
        title: isStaff ? `💬 [STAFF RESPONDENDO NO CHAT] • Pedido ${targetOrd.orderNumber}` : `💬 [MENSAGEM DO CLIENTE] • Pedido ${targetOrd.orderNumber}`,
        description: `**De:** ${cleanSender} (${isStaff ? 'Equipe Staff' : 'Cliente'})\n**Mensagem:**\n\`\`\`\n${cleanText || 'Anexo enviado'}\n\`\`\``,
        color: isStaff ? 16731136 : 3717080,
        fields: [
          { name: "📦 Produto", value: `**${targetOrd.product?.name || 'Produto'}**`, inline: true },
          { name: "👤 Cliente", value: `\`${targetOrd.buyer?.username || 'Usuário'}\``, inline: true },
          ...(attachmentUrl ? [{ name: "📎 Anexo", value: `[Clique para visualizar o anexo](${attachmentUrl})`, inline: false }] : [])
        ],
        ...(attachmentUrl ? { image: { url: attachmentUrl } } : {})
      });
    }
  };

  const approveAndDeliverOrder = (orderId, deliveryContent, staffName = "Staff Blood Store") => {
    const cleanDelivery = sanitizeString(deliveryContent || '', 3000);
    const cleanStaff = sanitizeString(staffName || "Staff Blood Store", 100);
    const nowStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    markLocalUpdate();
    setStoreState(prev => {
      const updatedOrders = (prev.orders || []).map(ord => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          status: "aprovado_entregue",
          deliveryContent: cleanDelivery,
          messages: [
            ...ord.messages,
            {
              id: "msg_delivery_" + Date.now(),
              sender: cleanStaff,
              type: "staff",
              text: `✅ **PAGAMENTO APROVADO & PRODUTO ENTREGUE!**\nO item foi liberado na caixa secreta de **"Entrega do Produto"** acima. Muito obrigado por comprar na Blood Store!`,
              timestamp: nowStr
            }
          ]
        };
      });
      return { ...prev, orders: updatedOrders };
    });

    const targetOrd = (storeState.orders || []).find(o => o.id === orderId);
    if (targetOrd) {
      notifyDiscordWebhook({
        title: `✅ [PAGAMENTO APROVADO & PRODUTO ENTREGUE] • Pedido ${targetOrd.orderNumber}`,
        description: `O Staff **${cleanStaff}** confirmou o pagamento de **${targetOrd.product?.name}** e liberou o produto na caixa secreta do cliente no chat!`,
        color: 2278690,
        fields: [
          { name: "📦 Produto", value: `**${targetOrd.product?.name}** (${targetOrd.product?.priceText})`, inline: true },
          { name: "👤 Cliente", value: `\`${targetOrd.buyer?.username}\``, inline: true }
        ]
      });
    }
  };

  const rejectOrder = (orderId, reason, staffName = "Staff Blood Store") => {
    const cleanReason = sanitizeString(reason || "Pagamento não identificado ou print inválido.", 500);
    const cleanStaff = sanitizeString(staffName || "Staff Blood Store", 100);
    const nowStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    markLocalUpdate();
    setStoreState(prev => {
      const updatedOrders = (prev.orders || []).map(ord => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          status: "cancelado",
          rejectReason: cleanReason,
          messages: [
            ...ord.messages,
            {
              id: "msg_reject_" + Date.now(),
              sender: cleanStaff,
              type: "staff",
              text: `❌ **COMPROVANTE / PEDIDO REPROVADO**\n**Motivo:** ${cleanReason}\n\nSe houver algum engano, envie um novo comprovante no chat.`,
              timestamp: nowStr
            }
          ]
        };
      });
      return { ...prev, orders: updatedOrders };
    });

    const targetOrd = (storeState.orders || []).find(o => o.id === orderId);
    if (targetOrd) {
      notifyDiscordWebhook({
        title: `❌ [PEDIDO REPROVADO / CANCELADO] • Pedido ${targetOrd.orderNumber}`,
        description: `O Staff **${cleanStaff}** reprovou o comprovante / pedido.`,
        color: 13369344,
        fields: [
          { name: "📦 Produto", value: `**${targetOrd.product?.name}**`, inline: true },
          { name: "👤 Cliente", value: `\`${targetOrd.buyer?.username}\``, inline: true },
          { name: "⚠️ Motivo", value: `\`${cleanReason}\``, inline: false }
        ]
      });
    }
  };

  return (
    <StoreContext.Provider value={{
      storeState,
      config: storeState.config,
      products: storeState.products,
      terms: storeState.terms,
      staffUsers: storeState.staffUsers || DEFAULT_STATE.staffUsers,
      currentUser: storeState.currentUser,
      orders: storeState.orders || [],
      updateConfig,
      addStaffUser,
      updateStaffUser,
      deleteStaffUser,
      addProduct,
      updateProduct,
      deleteProduct,
      updateTerms,
      resetToDefaults,
      loginWithDiscord,
      logout,
      createOrder,
      sendOrderProof,
      addOrderMessage,
      approveAndDeliverOrder,
      rejectOrder
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);

