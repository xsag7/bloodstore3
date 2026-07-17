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
    webhookUrl: "https://discord.com/api/webhooks/1527709858521022597/yQu3kvsRc9GblhZZBma4361FjEtWrGB5OwZHxpz-arXiGqMNDUJQmVUiG--VOTLKsj8g", 
    webhookLogsUrl: "https://discord.com/api/webhooks/1527709756414754876/XS2Q5993ommq4E-F48F1xz_NoSlbMj3vz-OSwLNRvzmPgI5NhG678jM3cTT0S0zMtceu",
    webhookMsgLogsUrl: "https://discord.com/api/webhooks/1527709858521022597/yQu3kvsRc9GblhZZBma4361FjEtWrGB5OwZHxpz-arXiGqMNDUJQmVUiG--VOTLKsj8g",
    webhookApprovalUrl: "https://discord.com/api/webhooks/1527709968927559681/X9-22J4ASWXACKl8U7EaaMwNnFmc8l_uxQi0v94jbDOxfYuWrB6dTltMNXH3p1OZYvql",
    webhookRejectedUrl: "https://discord.com/api/webhooks/1527710112922210475/5lZrqHBXbQ55rEUGljSfW4ONimIVNTGpoG7zMkYxxU_qje8wYK9JD7nJCDXfPCspmfWS",
    webhookStaffJoinUrl: "https://discord.com/api/webhooks/1527710186087649481/4k7PDV2bjuFPsLQ9F2pn1kFRp4HYv2TgqPes_xiOtssSCaVNFqgAn53_U9elJ9we1NA0",
    pixKey: "00020126580014br.gov.bcb.pix0136BLOOD-STORE-PIX-EXCLUSIVE5204000053039865802BR5911BLOOD STORE6009SAO PAULO62070503***63041A2B",
    logoUrl: "/fotos e videos/Bloodstore.png",
    bannerVideoUrl: "/fotos e videos/BloodstoreLogo2.png", // Wallpaper de fundo BloodstoreLogo2.png
    qrCodeUrl: "/fotos e videos/qrcode.png"
  },
  staffUsers: [
    {
      id: "owner-xsag",
      username: "xsag",
      password: "2368*09783@#87678923bl0d778604",
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
            bannerVideoUrl: bannerVideo,
            webhookUrl: parsed.config?.webhookUrl?.trim() || DEFAULT_STATE.config.webhookUrl,
            webhookLogsUrl: parsed.config?.webhookLogsUrl?.trim() || DEFAULT_STATE.config.webhookLogsUrl,
            webhookMsgLogsUrl: parsed.config?.webhookMsgLogsUrl?.trim() || DEFAULT_STATE.config.webhookMsgLogsUrl,
            webhookApprovalUrl: parsed.config?.webhookApprovalUrl?.trim() || DEFAULT_STATE.config.webhookApprovalUrl,
            webhookRejectedUrl: parsed.config?.webhookRejectedUrl?.trim() || DEFAULT_STATE.config.webhookRejectedUrl,
            webhookStaffJoinUrl: parsed.config?.webhookStaffJoinUrl?.trim() || DEFAULT_STATE.config.webhookStaffJoinUrl
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

  const storeStateRef = useRef(storeState);
  storeStateRef.current = storeState;

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
            : data.config.bannerVideoUrl,
          webhookUrl: data.config?.webhookUrl?.trim() || prev.config?.webhookUrl?.trim() || DEFAULT_STATE.config.webhookUrl,
          webhookLogsUrl: data.config?.webhookLogsUrl?.trim() || prev.config?.webhookLogsUrl?.trim() || DEFAULT_STATE.config.webhookLogsUrl,
          webhookMsgLogsUrl: data.config?.webhookMsgLogsUrl?.trim() || prev.config?.webhookMsgLogsUrl?.trim() || DEFAULT_STATE.config.webhookMsgLogsUrl,
          webhookApprovalUrl: data.config?.webhookApprovalUrl?.trim() || prev.config?.webhookApprovalUrl?.trim() || DEFAULT_STATE.config.webhookApprovalUrl,
          webhookRejectedUrl: data.config?.webhookRejectedUrl?.trim() || prev.config?.webhookRejectedUrl?.trim() || DEFAULT_STATE.config.webhookRejectedUrl,
          webhookStaffJoinUrl: data.config?.webhookStaffJoinUrl?.trim() || prev.config?.webhookStaffJoinUrl?.trim() || DEFAULT_STATE.config.webhookStaffJoinUrl
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
  const updateConfig = (newConfig, staffName = "Admin / Staff") => {
    const sanitized = { ...newConfig };
    if (sanitized.storeName) sanitized.storeName = sanitizeString(sanitized.storeName, 100);
    if (sanitized.slogan) sanitized.slogan = sanitizeString(sanitized.slogan, 200);
    if (sanitized.discordInvite) sanitized.discordInvite = sanitizeString(sanitized.discordInvite, 300);

    markLocalUpdate();
    setStoreState(prev => {
      const next = {
        ...prev,
        config: { ...prev.config, ...sanitized }
      };
      storeStateRef.current = next;
      return next;
    });
    notifyDiscordLogs("Configurações & Webhooks Atualizados", `O usuário @${staffName} atualizou as configurações gerais ou links de Webhook da loja.`, staffName);
  };

  // Sincronização explícita e direta no banco Supabase (para exclusão de senhas e confirmação visual)
  const forceSyncToCloud = async (customState = null) => {
    const targetState = customState || storeStateRef.current;
    if (!supabase) return { success: false, error: 'Supabase não inicializado.' };
    try {
      const { data, error } = await supabase.from('store_state').upsert({
        id: 'global_state',
        config: targetState.config,
        products: targetState.products,
        terms: targetState.terms,
        orders: targetState.orders || [],
        staff_users: targetState.staffUsers || [],
        updated_at: new Date().toISOString()
      }).select();
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateAllStaffUsers = async (newStaffList, staffName = "Admin / Staff") => {
    markLocalUpdate();
    let nextState;
    setStoreState(prev => {
      nextState = {
        ...prev,
        staffUsers: newStaffList
      };
      storeStateRef.current = nextState;
      return nextState;
    });
    const syncRes = await forceSyncToCloud(nextState);
    notifyDiscordLogs("Lista de Senhas / Equipe Atualizada no Banco", `As senhas e dados da equipe Staff foram atualizados ou purgados no banco de dados na nuvem por @${staffName}.`, staffName);
    return syncRes;
  };

  // Funções CRUD de Sub-Administradores (Equipe Staff)
  const addStaffUser = (newUser, staffName = "Admin / Staff") => {
    const id = "staff_" + Date.now();
    const cleanUser = {
      ...newUser,
      username: sanitizeString(newUser.username || '', 50),
      name: sanitizeString(newUser.name || '', 100)
    };
    markLocalUpdate();
    let nextState;
    setStoreState(prev => {
      nextState = {
        ...prev,
        staffUsers: [...(prev.staffUsers || DEFAULT_STATE.staffUsers), { ...cleanUser, id }]
      };
      storeStateRef.current = nextState;
      return nextState;
    });
    forceSyncToCloud(nextState);
    notifyDiscordLogs("Membro Staff Criado", `Novo membro cadastrado: @${cleanUser.username} (${cleanUser.name}) - Cargo: ${cleanUser.role || 'staff'}`, staffName);
  };

  const updateStaffUser = (id, updatedFields, staffName = "Admin / Staff") => {
    const cleanFields = { ...updatedFields };
    if (cleanFields.username) cleanFields.username = sanitizeString(cleanFields.username, 50);
    if (cleanFields.name) cleanFields.name = sanitizeString(cleanFields.name, 100);

    markLocalUpdate();
    let nextState;
    setStoreState(prev => {
      nextState = {
        ...prev,
        staffUsers: (prev.staffUsers || DEFAULT_STATE.staffUsers).map(u => u.id === id ? { ...u, ...cleanFields } : u)
      };
      storeStateRef.current = nextState;
      return nextState;
    });
    forceSyncToCloud(nextState);
    notifyDiscordLogs("Membro Staff Editado / Senha Alterada", `O membro Staff com ID ${id} teve seus dados ou senha modificados por @${staffName}.`, staffName);
  };

  const deleteStaffUser = (id, staffName = "Admin / Staff") => {
    const target = (storeStateRef.current.staffUsers || []).find(u => u.id === id);
    markLocalUpdate();
    let nextState;
    setStoreState(prev => {
      nextState = {
        ...prev,
        staffUsers: (prev.staffUsers || DEFAULT_STATE.staffUsers).filter(u => u.id !== id && u.username !== 'xsag')
      };
      storeStateRef.current = nextState;
      return nextState;
    });
    forceSyncToCloud(nextState);
    notifyDiscordLogs("Membro Staff Removido", `O membro Staff "@${target?.username || id}" (${target?.name || ''}) foi removido da equipe.`, staffName);
  };

  // Funções CRUD de Produtos
  const addProduct = (newProd, staffName = "Admin / Staff") => {
    const id = "p_" + Date.now();
    const cleanProd = {
      ...newProd,
      name: sanitizeString(newProd.name || '', 150),
      priceText: sanitizeString(newProd.priceText || '', 30)
    };
    markLocalUpdate();
    setStoreState(prev => {
      const next = {
        ...prev,
        products: [...prev.products, { ...cleanProd, id }]
      };
      storeStateRef.current = next;
      return next;
    });
    notifyDiscordLogs("Novo Produto Cadastrado", `Produto criado: "${cleanProd.name}" com valor estabelecido de ${cleanProd.priceText}.`, staffName);
  };

  const updateProduct = (id, updatedFields, staffName = "Admin / Staff") => {
    const cleanFields = { ...updatedFields };
    if (cleanFields.name) cleanFields.name = sanitizeString(cleanFields.name, 150);
    if (cleanFields.priceText) cleanFields.priceText = sanitizeString(cleanFields.priceText, 30);

    markLocalUpdate();
    setStoreState(prev => {
      const next = {
        ...prev,
        products: prev.products.map(p => p.id === id ? { ...p, ...cleanFields } : p)
      };
      storeStateRef.current = next;
      return next;
    });
    notifyDiscordLogs("Produto Atualizado no Catálogo", `O produto (ID: ${id}) "${cleanFields.name || 'Modificado'}" foi atualizado na loja.`, staffName);
  };

  const deleteProduct = (id, staffName = "Admin / Staff") => {
    const target = (storeStateRef.current.products || []).find(p => p.id === id);
    markLocalUpdate();
    setStoreState(prev => {
      const next = {
        ...prev,
        products: prev.products.filter(p => p.id !== id)
      };
      storeStateRef.current = next;
      return next;
    });
    notifyDiscordLogs("Produto Excluído", `O produto "${target?.name || id}" foi excluído permanentemente do catálogo.`, staffName);
  };

  // Funções CRUD de Termos
  const updateTerms = (updatedTerms, staffName = "Admin / Staff") => {
    markLocalUpdate();
    setStoreState(prev => {
      const next = {
        ...prev,
        terms: updatedTerms
      };
      storeStateRef.current = next;
      return next;
    });
    notifyDiscordLogs("Termos e Diretrizes Editados", `As políticas, regras ou termos da loja foram alterados no painel.`, staffName);
  };

  const resetToDefaults = (staffName = "Admin / Staff") => {
    markLocalUpdate();
    setStoreState(DEFAULT_STATE);
    storeStateRef.current = DEFAULT_STATE;
    notifyDiscordLogs("Restauração Geral (Reset Padrão)", `A loja inteira foi restaurada para as configurações e produtos de fábrica por @${staffName}.`, staffName);
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

  // --- Central de Notificações Webhook do Discord (Blindado contra Network Exposure via Proxy) ---
  const notifyDiscordWebhook = async (embedData, overrideUrl = null, contentText = null, webhookType = 'sales') => {
    const storeName = storeStateRef.current?.config?.storeName || 'Blood Store';
    const payload = {
      username: `${storeName.substring(0, 60)} • Sistema Ao Vivo`,
      avatar_url: "https://i.imgur.com/8N40WzN.png",
      ...(contentText ? { content: contentText } : {}),
      embeds: [{
        ...embedData,
        footer: { text: `${storeName} • Sistema Estilo GGMAX` },
        timestamp: new Date().toISOString()
      }]
    };

    const getDirectDiscordUrl = () => {
      if (overrideUrl && typeof overrideUrl === 'string' && (overrideUrl.includes('discord.com/api/webhooks/') || overrideUrl.includes('discordapp.com/api/webhooks/'))) {
        return overrideUrl.trim();
      }
      const cfg = storeStateRef.current?.config || DEFAULT_STATE.config;
      if (webhookType === 'approval') return cfg.webhookApprovalUrl || DEFAULT_STATE.config.webhookApprovalUrl;
      if (webhookType === 'rejected') return cfg.webhookRejectedUrl || DEFAULT_STATE.config.webhookRejectedUrl;
      if (webhookType === 'logs') return cfg.webhookLogsUrl || DEFAULT_STATE.config.webhookLogsUrl;
      if (webhookType === 'msgLogs') return cfg.webhookMsgLogsUrl || DEFAULT_STATE.config.webhookMsgLogsUrl;
      if (webhookType === 'staffJoin') return cfg.webhookStaffJoinUrl || DEFAULT_STATE.config.webhookStaffJoinUrl;
      return cfg.webhookUrl || DEFAULT_STATE.config.webhookUrl;
    };

    try {
      // PROXY BLINDADO: Envia para o backend (/api/webhook-proxy) preservando as URLs no servidor. Nenhuma URL do Discord é exposta na aba Network!
      const res = await fetch('/api/webhook-proxy', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: webhookType,
          payload,
          contentText,
          ...(overrideUrl ? { overrideUrl } : {})
        })
      });

      if (!res.ok) {
        if (res.status === 404 || res.status === 502 || res.status === 503) {
          console.warn(`⚠️ Proxy de Webhook (${res.status}) não disponível. Realizando failover seguro ao Discord...`);
          const directUrl = getDirectDiscordUrl();
          if (directUrl && directUrl.includes('discord')) {
            const directRes = await fetch(directUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });
            if (directRes.ok || directRes.status === 204) return { success: true, mode: 'direct_fallback' };
            const directErr = await directRes.text().catch(() => "");
            return { success: false, status: directRes.status, error: directErr || "Falha no envio direto ao Discord" };
          }
        }
        const errText = await res.text().catch(() => "");
        console.error(`❌ Erro no Webhook do Discord (HTTP ${res.status}):`, errText);
        return { success: false, status: res.status, error: errText };
      }
      return { success: true, mode: 'proxy' };
    } catch (err) {
      console.warn("⚠️ Erro de conexão com o Proxy (/api/webhook-proxy):", err.message, "• Ativando failover direto...");
      try {
        const directUrl = getDirectDiscordUrl();
        if (directUrl && directUrl.includes('discord')) {
          const directRes = await fetch(directUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          if (directRes.ok || directRes.status === 204) return { success: true, mode: 'direct_fallback' };
          const directErr = await directRes.text().catch(() => "");
          return { success: false, status: directRes.status, error: directErr || "O Discord rejeitou a requisição direta." };
        }
      } catch (directCatchErr) {
        console.error("❌ Falha tanto no Proxy quanto no envio direto ao Discord:", directCatchErr);
        return { success: false, status: 0, error: `Verifique sua conexão com a internet ou adblock (${directCatchErr.message})` };
      }
      return { success: false, status: 0, error: err.message };
    }
  };

  const notifyDiscordLogs = async (action, details, staffName = "Staff / Admin") => {
    return await notifyDiscordWebhook({
      title: `🛠️ [LOG DE ALTERAÇÃO NO SITE] • ${action}`,
      description: `Uma modificação administrativa foi registrada no painel da **Blood Store**.`,
      color: 3447003,
      fields: [
        { name: "👮 Staff / Administrador Responsável", value: `**${staffName}**`, inline: true },
        { name: "📋 Ação Executada", value: `\`${action}\``, inline: true },
        { name: "🕒 Horário do Registro", value: new Date().toLocaleTimeString('pt-BR'), inline: true },
        { name: "📝 Detalhes da Modificação", value: `\`\`\`\n${details}\n\`\`\``, inline: false }
      ]
    }, null, null, 'logs');
  };

  const notifyStaffStatus = async (staffUser, statusType = 'login', customMessage = null) => {
    const isLogin = statusType === 'login';
    const staffName = staffUser?.name || staffUser?.username || 'Staff Desconhecido';
    const staffUserTag = staffUser?.username || 'user';
    const role = staffUser?.role || 'Membro da Equipe';

    return await notifyDiscordWebhook({
      title: isLogin ? `🟢 [STAFF ONLINE / ACESSO] • @${staffUserTag}` : `🔴 [STAFF OFFLINE / TURNO ENCERRADO] • @${staffUserTag}`,
      description: customMessage || (isLogin 
        ? `O membro da equipe **${staffName}** acabou de fazer login no painel de administração (\`/staff\`) e está **ONLINE** e ativo no atendimento!` 
        : `O membro da equipe **${staffName}** encerrou sua sessão no painel administrativo e está **OFFLINE**.`),
      color: isLogin ? 3066993 : 15158332,
      fields: [
        { name: "👮 Membro Staff", value: `**${staffName}** (\`${staffUserTag}\`)`, inline: true },
        { name: "🛡️ Cargo / Função", value: `\`${role}\``, inline: true },
        { name: "🕒 Horário de Registro", value: new Date().toLocaleTimeString('pt-BR'), inline: true }
      ]
    }, null, null, 'staffJoin');
  };

  const testDiscordWebhook = async (testUrl, type = 'sales') => {
    let targetUrl = testUrl?.trim();
    if (!targetUrl) {
      if (type === 'approval') targetUrl = storeStateRef.current?.config?.webhookApprovalUrl || DEFAULT_STATE.config.webhookApprovalUrl;
      else if (type === 'rejected') targetUrl = storeStateRef.current?.config?.webhookRejectedUrl || DEFAULT_STATE.config.webhookRejectedUrl;
      else if (type === 'logs') targetUrl = storeStateRef.current?.config?.webhookLogsUrl || DEFAULT_STATE.config.webhookLogsUrl;
      else if (type === 'msgLogs') targetUrl = storeStateRef.current?.config?.webhookMsgLogsUrl || DEFAULT_STATE.config.webhookMsgLogsUrl;
      else if (type === 'staffJoin') targetUrl = storeStateRef.current?.config?.webhookStaffJoinUrl || DEFAULT_STATE.config.webhookStaffJoinUrl;
      else targetUrl = storeStateRef.current?.config?.webhookUrl || DEFAULT_STATE.config.webhookUrl;
    }
    targetUrl = (targetUrl || '').trim();
    if (!targetUrl) {
      alert("⚠️ Insira primeiro a URL do Webhook no campo e tente novamente!");
      return false;
    }

    let title, description, color, fields;
    if (type === 'approval') {
      title = "✅ [TESTE DE DISPARO] • Webhook de Pedidos Aprovados";
      description = "Este canal receberá alertas em tempo real sempre que um membro da **Staff** aprovar e entregar um pedido, exibindo o nome exato do staff responsável no topo!";
      color = 2278690;
      fields = [
        { name: "👮 Staff Responsável (Aprovador)", value: "**Dono Supremo (xsag)**", inline: true },
        { name: "📦 Produto Exemplo", value: "**Robux 10.000 (R$ 99,90)**", inline: true },
        { name: "🕒 Horário do Teste", value: new Date().toLocaleTimeString('pt-BR'), inline: true }
      ];
    } else if (type === 'rejected') {
      title = "❌ [TESTE DE DISPARO] • Webhook de Pedidos Recusados / Reprovados";
      description = "Este canal receberá alertas sempre que um comprovante ou pedido for reprovado, exibindo o motivo e quem reprovou.";
      color = 13369344;
      fields = [
        { name: "👮 Staff Responsável (Reprovador)", value: "**Dono Supremo (xsag)**", inline: true },
        { name: "⚠️ Motivo Exemplo", value: "`Comprovante ilegível ou PIX divergente`", inline: true },
        { name: "🕒 Horário do Teste", value: new Date().toLocaleTimeString('pt-BR'), inline: true }
      ];
    } else if (type === 'logs') {
      title = "🛠️ [TESTE DE DISPARO] • Webhook de Logs de Alterações no Site";
      description = "Este canal registrará um histórico contínuo (audit logs) de todas as modificações no site e painel administrativo (produtos, configs e equipe)!";
      color = 3447003;
      fields = [
        { name: "👮 Administrador / Staff", value: "**Sistema de Auditoria Blood Store**", inline: true },
        { name: "📋 Ação Simulada", value: "`Teste de Conexão do Webhook de Logs`", inline: true },
        { name: "🕒 Horário do Teste", value: new Date().toLocaleTimeString('pt-BR'), inline: true }
      ];
    } else if (type === 'msgLogs') {
      title = "💬 [TESTE DE DISPARO] • Webhook de MNSG LOGS (Chat de Pedidos)";
      description = "Este canal receberá uma cópia de **todas as mensagens no chat ao vivo** entre o cliente e a equipe Staff nos pedidos em andamento!";
      color = 3717080;
      fields = [
        { name: "💬 Remetente Exemplo", value: "**Staff Blood Store**", inline: true },
        { name: "📦 Produto Exemplo", value: "**Robux 10.000**", inline: true },
        { name: "🕒 Horário do Teste", value: new Date().toLocaleTimeString('pt-BR'), inline: true }
      ];
    } else if (type === 'staffJoin') {
      title = "🟢 [TESTE DE DISPARO] • Webhook de Monitoramento STAFF JOIN / ON";
      description = "Este canal monitorará em tempo real todas as entradas (logins) e saídas (logouts) dos membros da Staff na área administrativa da loja!";
      color = 3066993;
      fields = [
        { name: "👮 Staff Simulado", value: "**Dono Supremo (xsag)**", inline: true },
        { name: "⚡ Status Simulado", value: "✅ **ONLINE NO PAINEL**", inline: true },
        { name: "🕒 Horário do Teste", value: new Date().toLocaleTimeString('pt-BR'), inline: true }
      ];
    } else {
      title = "🔔 [TESTE DE DISPARO] • Webhook de Vendas & Pedidos";
      description = "Se você está lendo esta mensagem no seu servidor do Discord, o sistema de avisos de compra da **Blood Store** está configurado e disparando em tempo real via Proxy Blindado!";
      color = 3845591;
      fields = [
        { name: "⚡ Status", value: "✅ Conexão proxy estabelecida com sucesso!", inline: true },
        { name: "🕒 Horário do Teste", value: new Date().toLocaleTimeString('pt-BR'), inline: true }
      ];
    }

    const result = await notifyDiscordWebhook({ title, description, color, fields }, targetUrl, null, type);

    if (result && result.success) {
      const modeMsg = result.mode === 'direct_fallback' ? 'através do canal direto (modo fallback ativo)' : 'através do Proxy Blindado no servidor';
      alert(`✅ Teste disparado com sucesso (${modeMsg})! Verifique o canal no seu Discord agora.`);
      return true;
    } else {
      const errMsg = result?.error ? (typeof result.error === 'string' ? result.error : JSON.stringify(result.error)) : 'Verifique se a URL copiada do Discord está correta';
      alert(`❌ Erro ao disparar Webhook (${result?.status || 'Conexão/CORS'}): ${errMsg}`);
      return false;
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

    // Notificar Webhook do Discord de Novo Pedido (MNSG LOGS) via Proxy Blindado
    notifyDiscordWebhook({
      title: `🩸 NOVO PEDIDO CONFIRMADO • ${orderNumber}`,
      description: `Um cliente iniciou o processo de compra do produto **${product.name}**.`,
      color: 13369344,
      fields: [
        { name: "📬 Meio de Contato", value: `**${cleanContactMethod}**`, inline: false },
        { name: "👤 Identificação do Cliente", value: `\`${cleanContactValue}\``, inline: true },
        { name: "📦 Produto", value: `**${product.name}**`, inline: true },
        { name: "💰 Valor", value: `**${product.priceText}**`, inline: true },
        { name: "🔔 Próximo Passo", value: "Aguardando o cliente anexar o comprovante PIX na sala de chat (`/#/pedidos`).", inline: false },
        { name: "📢 Notificação", value: "@everyone", inline: false }
      ]
    }, null, "@everyone 🚨 **NOVO PEDIDO CONFIRMADO E INICIADO NA BLOOD STORE! ACOMPANHE O CHAT AGORA!**", 'msgLogs');

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
      }, null, null, 'msgLogs');
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
      const next = { ...prev, orders: updatedOrders };
      storeStateRef.current = next;
      return next;
    });

    const targetOrd = (storeStateRef.current.orders || []).find(o => o.id === orderId);
    if (targetOrd) {
      const isStaff = senderType === 'staff';

      notifyDiscordWebhook({
        title: isStaff ? `💬 [STAFF RESPONDENDO NO CHAT] • Pedido ${targetOrd.orderNumber}` : `💬 [MENSAGEM DO CLIENTE NO CHAT] • Pedido ${targetOrd.orderNumber}`,
        description: `**De:** ${cleanSender} (${isStaff ? 'Equipe Staff' : 'Cliente'})\n**Mensagem:**\n\`\`\`\n${cleanText || 'Anexo enviado'}\n\`\`\``,
        color: isStaff ? 16731136 : 3717080,
        fields: [
          { name: "👮 Autor / Remetente", value: `**${cleanSender}**`, inline: true },
          { name: "📦 Produto do Pedido", value: `**${targetOrd.product?.name || 'Produto'}**`, inline: true },
          { name: "👤 Cliente do Pedido", value: `\`${targetOrd.buyer?.username || 'Usuário'}\``, inline: true },
          ...(attachmentUrl ? [{ name: "📎 Anexo", value: `[Clique para visualizar o anexo](${attachmentUrl})`, inline: false }] : [])
        ],
        ...(attachmentUrl ? { image: { url: attachmentUrl } } : {})
      }, null, null, 'msgLogs');
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
      const next = { ...prev, orders: updatedOrders };
      storeStateRef.current = next;
      return next;
    });

    const targetOrd = (storeStateRef.current.orders || []).find(o => o.id === orderId);
    if (targetOrd) {
      notifyDiscordWebhook({
        title: `✅ [PEDIDO APROVADO & ENTREGUE]  • Pedido ${targetOrd.orderNumber}`,
        description: `O Staff **${cleanStaff}** confirmou o pagamento de **${targetOrd.product?.name}** e liberou a entrega no chat secreto do pedido!`,
        color: 2278690,
        fields: [
          { name: "👮 Staff Responsável (Aprovou & Entregou)", value: `**${cleanStaff}**`, inline: true },
          { name: "📦 Produto", value: `**${targetOrd.product?.name}** (${targetOrd.product?.priceText})`, inline: true },
          { name: "👤 Cliente", value: `\`${targetOrd.buyer?.username || 'Usuário'}\``, inline: true },
          { name: "📬 Contato do Cliente", value: `\`${targetOrd.contactMethod || 'Chat'}: ${targetOrd.contactValue || ''}\``, inline: false },
          { name: "🎁 Conteúdo da Entrega", value: "✅ Liberado na sala de chat e caixa secreta do comprador.", inline: false },
          { name: "📢 Notificação", value: "@everyone", inline: true }
        ]
      }, null, `@everyone 🎉 **PEDIDO APROVADO E PRODUTO ENTREGUE COM SUCESSO PELA STAFF (${cleanStaff})!**`, 'approval');
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
      const next = { ...prev, orders: updatedOrders };
      storeStateRef.current = next;
      return next;
    });

    const targetOrd = (storeStateRef.current.orders || []).find(o => o.id === orderId);
    if (targetOrd) {
      notifyDiscordWebhook({
        title: `❌ [PEDIDO / COMPROVANTE REPROVADO] • Pedido ${targetOrd.orderNumber}`,
        description: `O Staff **${cleanStaff}** reprovou o comprovante / pedido.`,
        color: 13369344,
        fields: [
          { name: "👮 Staff Responsável (Reprovou)", value: `**${cleanStaff}**`, inline: true },
          { name: "📦 Produto", value: `**${targetOrd.product?.name}** (${targetOrd.product?.priceText})`, inline: true },
          { name: "👤 Cliente", value: `\`${targetOrd.buyer?.username}\``, inline: true },
          { name: "⚠️ Motivo da Reprovação", value: `\`\`\`\n${cleanReason}\n\`\`\``, inline: false }
        ]
      }, null, null, 'rejected');
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
      updateAllStaffUsers,
      forceSyncToCloud,
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
      rejectOrder,
      notifyStaffStatus,
      testDiscordWebhook
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);

