import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'bloodstore_global_state';

// Dados Padrão da Blood Store
const DEFAULT_STATE = {
  config: {
    storeName: "BLOOD STORE",
    slogan: "Sua evolução começa aqui.",
    discordInvite: "https://discord.gg/Gvbg5WYPBP",
    webhookUrl: "", 
    pixKey: "00020126580014br.gov.bcb.pix0136BLOOD-STORE-PIX-EXCLUSIVE5204000053039865802BR5911BLOOD STORE6009SAO PAULO62070503***63041A2B",
    logoUrl: "/fotos e videos/BloodstoreLogo1.png",
    bannerVideoUrl: "/fotos e videos/animation.mp4"
  },
  products: [
    {
      id: "p1",
      slug: "robux (r0b6x)",
      name: "Robux (r0b6x)",
      priceText: "R$ 29,90",
      priceValue: 29.90,
      image: "/fotos e videos/robux.png",
      icon: "fa-solid fa-coins",
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
      benefits: [
        "Godlys, Ancients e Chromas mais raras",
        "Entrega direta via Trade in-game",
        "Itens 100% limpos e legítimos"
      ]
    },
    {
      id: "p5",
      slug: "m1n3cr4ft",
      name: "Minecraft Full Acesso (m1n3cr4ft)",
      priceText: "R$ 39,90",
      priceValue: 39.90,
      image: "/fotos e videos/minecraft.png",
      icon: "fa-solid fa-cube",
      benefits: [
        "Conta original Microsoft Full Acesso",
        "Altere Nickname, Skin e E-mail",
        "Acesso liberado a todos servidores"
      ]
    },
    {
      id: "p6",
      slug: "ot1miz4ç40",
      name: "Otimização FPS (ot1miz4ç40)",
      priceText: "R$ 59,90",
      priceValue: 59.90,
      image: "/fotos e videos/otimizacao.png",
      icon: "fa-solid fa-gauge-high",
      benefits: [
        "Ajuste profissional via AnyDesk",
        "Redução de Input Lag e Ping",
        "Ganho real de 30% a 80% nos FPS"
      ]
    },
    {
      id: "p7",
      slug: "c0nta-n1tr4d4",
      name: "Conta Nitrada (c0nta-n1tr4d4)",
      priceText: "R$ 24,90",
      priceValue: 24.90,
      image: "/fotos e videos/nitro.png",
      icon: "fa-brands fa-discord",
      benefits: [
        "Conta Discord com Nitro Gaming ativo",
        "Acompanha 2 Boosts de servidor",
        "Totalmente Full Acesso para você"
      ]
    },
    {
      id: "p8",
      slug: "s3gu1d0r3s",
      name: "Seguidores (s3gu1d0r3s)",
      priceText: "R$ 14,90",
      priceValue: 14.90,
      image: "/fotos e videos/seguidores.png",
      icon: "fa-solid fa-users",
      benefits: [
        "Crescimento rápido e perfis ativos",
        "Ideal para redes sociais ou servidores",
        "Sem necessidade de informar senha"
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
        return {
          ...DEFAULT_STATE,
          ...parsed,
          config: {
            ...DEFAULT_STATE.config,
            ...(parsed.config || {})
          }
        };
      }
    } catch (e) {
      console.error("Erro ao ler do LocalStorage, restaurando padrão:", e);
    }
    return DEFAULT_STATE;
  });

  // Salvar no LocalStorage sempre que o storeState for modificado
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storeState));
    } catch (e) {
      console.error("Erro ao salvar no LocalStorage:", e);
    }
  }, [storeState]);

  // Funções CRUD de Configurações
  const updateConfig = (newConfig) => {
    setStoreState(prev => ({
      ...prev,
      config: { ...prev.config, ...newConfig }
    }));
  };

  // Funções CRUD de Produtos
  const addProduct = (newProd) => {
    const id = "p_" + Date.now();
    setStoreState(prev => ({
      ...prev,
      products: [...prev.products, { ...newProd, id }]
    }));
  };

  const updateProduct = (id, updatedFields) => {
    setStoreState(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === id ? { ...p, ...updatedFields } : p)
    }));
  };

  const deleteProduct = (id) => {
    setStoreState(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id)
    }));
  };

  // Funções CRUD de Termos
  const updateTerms = (updatedTerms) => {
    setStoreState(prev => ({
      ...prev,
      terms: updatedTerms
    }));
  };

  const resetToDefaults = () => {
    setStoreState(DEFAULT_STATE);
  };

  return (
    <StoreContext.Provider value={{
      storeState,
      config: storeState.config,
      products: storeState.products,
      terms: storeState.terms,
      updateConfig,
      addProduct,
      updateProduct,
      deleteProduct,
      updateTerms,
      resetToDefaults
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
