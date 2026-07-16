import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, TermItem, StoreConfig, ViewTab, AdminTab, CartItem, Coupon, DiscordUser, Order } from '../types/store';
import { sendDiscordDeliveryNotification } from '../services/discordWebhook';

interface StoreContextType {
  products: Product[];
  terms: TermItem[];
  config: StoreConfig;
  cart: CartItem[];
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  orders: Order[];
  isAdminLoggedIn: boolean;
  activeView: ViewTab;
  adminTab: AdminTab;
  searchQuery: string;
  selectedTag: string;
  setActiveView: (view: ViewTab) => void;
  setAdminTab: (tab: AdminTab) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string; coupon?: Coupon };
  setAppliedCoupon: (coupon: Coupon | null) => void;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateProductStock: (productId: string, stockItems: string[]) => void;
  addTerm: (term: Omit<TermItem, 'id'>) => void;
  updateTerm: (id: string, term: Partial<TermItem>) => void;
  deleteTerm: (id: string) => void;
  updateConfig: (newConfig: Partial<StoreConfig>) => void;
  resetToDefault: () => void;
  exportBackup: () => string;
  importBackup: (jsonString: string) => boolean;
  currentUser: DiscordUser | null;
  loginDiscord: (user: DiscordUser) => void;
  logoutDiscord: () => void;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order;
  approveOrder: (orderId: string) => Promise<{ success: boolean; message: string }>;
  rejectOrder: (orderId: string) => void;
}

const DEFAULT_COUPONS: Coupon[] = [
  { code: 'BLOOD10', type: 'percentage', value: 10, description: '10% de desconto em qualquer item na Blood Store!' },
  { code: 'VIP20', type: 'percentage', value: 20, description: '20% de desconto exclusivo para membros VIP!' },
  { code: 'KIOVER', type: 'percentage', value: 15, description: '15% de desconto especial por indicação de parceiro!' }
];

const DEFAULT_CONFIG: StoreConfig = {
  storeName: 'Blood Store',
  bannerTitle: 'EXCELÊNCIA EM SOLUÇÕES DIGITAIS & LICENÇAS',
  bannerSubtitle: 'Catálogo oficial de ativos digitais, licenças verificadas, otimização de sistemas e contas com garantia de autenticidade e entrega imediata.',
  announcementBanner: '',
  globalDiscordUrl: 'https://discord.gg/Gvbg5WYPBP',
  discordWebhookUrl: 'https://discord.com/api/webhooks/1527312578898956409/u0DEYy-liGUA9w-e6fHjwlHNPDQmPzXoPR5lu5_jUGhcGheslAmBY2YDWOQF7k58O3Xm',
  pixKey: '14f35f4f-9255-496b-bd0e-2fce7d60af92',
  adminPassword: 'admin',
  accentColor: '#ff003c',
  stats: {
    totalSales: 4890,
    activeUsers: 1420,
    satisfactionRate: '99.8%',
    averageDelivery: '12m'
  }
};

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    slug: 'pacotes-moedas-virtuais',
    name: 'Pacotes de Moedas Virtuais Premium',
    tag: 'ROBLOX',
    price: 35.90,
    originalPrice: 49.90,
    description: 'Créditos virtuais seguros para sua conta com o melhor custo-benefício do mercado e entrega limpa com garantia de conformidade.',
    features: [
      'Entrega oficial via sistema corporativo',
      'Taxas administrativas totalmente cobertas',
      'Atendimento técnico no portal oficial',
      'Garantia integral de autenticidade do ativo'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?q=80&w=800&auto=format&fit=crop',
    badge: 'DESTAQUE',
    status: 'DISPONÍVEL',
    stockItems: [
      'Licença Ativação #1049 - Código de Acesso: CFG-9988-1122',
      'Licença Ativação #1050 - Código de Acesso: CFG-7766-3344',
      'Licença Ativação #1051 - Código de Acesso: CFG-5544-2211'
    ]
  },
  {
    id: 'prod-2',
    slug: 'conta-verificada-acesso-completo',
    name: 'Conta Verificada • Acesso Completo',
    tag: 'CONTAS',
    price: 24.99,
    originalPrice: 39.99,
    description: 'Contas verificadas com autenticação aprovada no sistema. Perfeitas para comunicação por voz, desenvolvimento de comunidades e total exclusividade.',
    features: [
      'Recurso de áudio e comunicação habilitados',
      'Dados de recuperação integralmente transferíveis',
      'Sem histórico de penalidades administrativas',
      'Acesso completo integral (Full Access)'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    badge: 'ENTREGA IMEDIATA',
    status: 'DISPONÍVEL',
    stockItems: [
      'Login: acc_verified_01 | Senha: pass#alpha | E-mail: rec1@bloodstore.gg',
      'Login: acc_verified_02 | Senha: pass#beta | E-mail: rec2@bloodstore.gg',
      'Login: acc_verified_03 | Senha: pass#gamma | E-mail: rec3@bloodstore.gg'
    ]
  },
  {
    id: 'prod-3',
    slug: 'licencas-digitais-steam',
    name: 'Chaves de Ativação CD-Key Global',
    tag: 'LICENÇAS',
    price: 49.90,
    originalPrice: 89.90,
    description: 'Chaves originais de ativação global e contas de acesso com licenças digitais autênticas para expansão da sua biblioteca de software.',
    features: [
      'Ativação global compatível com todas as regiões',
      'Ativos digitais permanentes e autenticados',
      'Suporte técnico à ativação assistida',
      'Disponibilização imediata após validação'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    badge: 'PROMOÇÃO',
    status: 'PROMOÇÃO',
    stockItems: [
      'CD-KEY Global Autenticada: 88XX-99YY-11ZZ-LIC',
      'CD-KEY Global Autenticada: 77AA-33BB-55CC-LIC'
    ]
  },
  {
    id: 'prod-4',
    slug: 'itens-virtuais-colecionador',
    name: 'Itens Virtuais Raros de Colecionador',
    tag: 'ITENS RAROS',
    price: 15.00,
    originalPrice: 25.00,
    description: 'Coleção de ativos digitais exclusivos, raridades e pacotes de colecionador com transferência direta e segura via plataforma.',
    features: [
      'Itens raros catalogados com verificação de origem',
      'Transferência monitorada por analista do portal',
      'Combos corporativos com descontos progressivos',
      'Segurança total em todas as transações'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop',
    badge: 'EM ALTA',
    status: 'DISPONÍVEL',
    stockItems: [
      'Voucher Colecionador #01 - Validar com o terminal de atendimento para transferência imediata'
    ]
  },
  {
    id: 'prod-5',
    slug: 'licenca-completa-software',
    name: 'Licença de Software • Acesso Integral',
    tag: 'SOFTWARE',
    price: 39.90,
    originalPrice: 75.00,
    description: 'Contas originais microsoft com acesso total a servidores. Altere e-mail, senha e credenciais com autonomia e garantia vitalícia de funcionamento.',
    features: [
      'Acesso irrestrito a todos os recursos da plataforma',
      'Transferência definitiva de e-mail e credenciais',
      'Garantia corporativa de conformidade e uso',
      'Suporte técnico contínuo pela equipe de atendimento'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=800&auto=format&fit=crop',
    badge: 'DESTAQUE',
    status: 'DISPONÍVEL',
    stockItems: [
      'Licença Oficial #1 | Email: lic_alpha@outlook.com | Senha: Sys#Auth2026',
      'Licença Oficial #2 | Email: lic_beta@outlook.com | Senha: Sys#Auth2026'
    ]
  },
  {
    id: 'prod-6',
    slug: 'otimizacao-sistema-computacional',
    name: 'Otimização e Sintonização de Sistema',
    tag: 'SERVIÇOS',
    price: 59.90,
    originalPrice: 120.00,
    description: 'Serviço profissional de otimização remota conduzido por analista técnico. Ajustes no registro do Windows, eliminação de latência de rede e ganho de estabilidade.',
    features: [
      'Ganho substancial de estabilidade e taxa de quadros',
      'Redução do tempo de resposta e otimização de rede',
      'Atendimento remoto assistido agendado no portal',
      'Sintonização sob medida para as especificações do hardware'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop',
    badge: 'ESPECIALIZADO',
    status: 'DISPONÍVEL',
    stockItems: [
      'Voucher Agendamento Técnico #01 - Acesse o canal #agendar-boost no Discord com o código BOOST-01'
    ]
  },
  {
    id: 'prod-7',
    slug: 'contas-nitro-c0nta-n1tr4d4',
    name: 'Contas Discord com Nitro Gaming/Boost (c0nta-n1tr4d4)',
    tag: 'DISCORD',
    price: 29.90,
    originalPrice: 55.00,
    description: 'Contas do Discord com Nitro Gaming ativo de 1 a 12 meses + 2 Impulsos de Servidor (Boosts) incluídos. Ou receba o token de ativação/gift no seu próprio perfil.',
    features: [
      'Nitro Gaming 100% original sem risco de queda',
      '2 Boosts de servidor para você impulsionar sua comunidade',
      'Acesso a emojis animados, banners em 4K e uploads grandes',
      'Entrega ultra rápida pelo nosso bot de auto-atendimento'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    badge: 'PROMOÇÃO',
    status: 'PROMOÇÃO',
    stockItems: [
      'Token/Gift Nitro #1: https://discord.gift/XyZ987AbC123Blood',
      'Token/Gift Nitro #2: https://discord.gift/QWe456RtY789Blood'
    ]
  },
  {
    id: 'prod-8',
    slug: 'seguidores-engajamento-s3gu1d0r3s',
    name: 'Seguidores & Engajamento Real (s3gu1d0r3s)',
    tag: 'ENGAJAMENTO',
    price: 19.90,
    originalPrice: 35.00,
    description: 'Pacotes de seguidores de alta retenção, curtidas e visualizações para Instagram, TikTok, Twitch ou YouTube. Cresça a autoridade da sua marca ou perfil de forma rápida e segura.',
    features: [
      'Perfis reais com fotos, bio e publicações no feed',
      'Início imediato após confirmação do pagamento',
      'Sem necessidade de informar senha (apenas @ ou link)',
      'Garantia de reposição automática de 30 a 60 dias'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop',
    badge: 'ENTREGA IMEDIATA',
    status: 'DISPONÍVEL',
    stockItems: [
      'Voucher Painel de SMM #01 - Crédito de R$ 19,90 liberado no painel automático'
    ]
  }
];

const DEFAULT_TERMS: TermItem[] = [
  {
    id: 'term-1',
    title: 'Forma de pagamento',
    content: 'Apenas PIX. Nossa chave de pagamento e QRCode são fornecidos exclusivamente no momento do fechamento do ticket em nosso servidor do Discord ou no sistema automático.',
    category: 'PAGAMENTO',
    isImportant: true
  },
  {
    id: 'term-2',
    title: 'Reembolso',
    content: 'Não fazemos reembolso após a entrega, a menos que aconteça um erro por nossa parte. Todos os produtos e contas são pré-testados e entregues em perfeito funcionamento.',
    category: 'REGRAS',
    isImportant: true
  },
  {
    id: 'term-3',
    title: 'Prazo de entrega',
    content: 'Em até 24h (esse prazo pode mudar para reservas ou alta demanda). Não fiquem perturbando o dono ou a equipe para entregar, não temos somente um cliente para atender, então é só aguardar. Caso não seja entregue dentro do prazo, fazemos o reembolso integral no seu PIX.',
    category: 'ENTREGA',
    isImportant: true
  },
  {
    id: 'term-4',
    title: 'Pós entrega',
    content: 'Não nos responsabilizamos mais depois da entrega do produto/serviço. Ao receber seus dados ou itens, faça a alteração imediata de senhas, e-mails de recuperação e verificações de segurança conforme nossas instruções.',
    category: 'REGRAS'
  },
  {
    id: 'term-5',
    title: 'Atendimento e Prioridade Booster',
    content: 'Nós atendemos por ordem de chegada no Discord, então infelizmente nem sempre podemos responder de imediato, ainda mais se a demanda estiver alta. Se você for Booster do servidor (e dependendo da demanda), você tem direito de furar a fila e ganha prioridade especial no atendimento com nossa equipe de suporte VIP.',
    category: 'SUPORTE',
    isImportant: true
  },
  {
    id: 'term-6',
    title: 'Avaliação Obrigatória no Discord',
    content: 'Após todas as compras, é obrigatório deixar uma avaliação no canal "🌟・avaliações" do Discord. Somos muito gratos por quaisquer feedbacks. Caso contrário, o cliente receberá o cargo @proibido de comprar no servidor e perderá benefícios de fidelidade em futuras aquisições.',
    category: 'REGRAS',
    isImportant: true
  },
  {
    id: 'term-7',
    title: 'Observação Geral sobre Mudança de Termos',
    content: 'Os termos podem mudar sem aviso prévio. Antes de realizar qualquer compra na Blood Store, certifique-se de que está totalmente ciente e de acordo com os termos e condições descritos acima.',
    category: 'REGRAS'
  }
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bloodstore_products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  const [terms, setTerms] = useState<TermItem[]>(() => {
    const saved = localStorage.getItem('bloodstore_terms');
    return saved ? JSON.parse(saved) : DEFAULT_TERMS;
  });

  const [config, setConfig] = useState<StoreConfig>(() => {
    const saved = localStorage.getItem('bloodstore_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        discordWebhookUrl: parsed.discordWebhookUrl || DEFAULT_CONFIG.discordWebhookUrl,
        pixKey: parsed.pixKey || DEFAULT_CONFIG.pixKey
      };
    }
    return DEFAULT_CONFIG;
  });

  const [currentUser, setCurrentUser] = useState<DiscordUser | null>(() => {
    const saved = localStorage.getItem('bloodstore_discord_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bloodstore_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('bloodstore_admin_auth') === 'true';
  });

  const [activeView, setActiveView] = useState<ViewTab>('home');
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('TODOS');

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bloodstore_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupons] = useState<Coupon[]>(DEFAULT_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    localStorage.setItem('bloodstore_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bloodstore_terms', JSON.stringify(terms));
  }, [terms]);

  useEffect(() => {
    localStorage.setItem('bloodstore_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('bloodstore_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bloodstore_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bloodstore_discord_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bloodstore_discord_user');
    }
  }, [currentUser]);

  const loginDiscord = (user: DiscordUser) => {
    setCurrentUser(user);
  };

  const logoutDiscord = () => {
    setCurrentUser(null);
    localStorage.removeItem('bloodstore_discord_user');
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prev =>
        prev.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find(c => c.code === cleanCode);
    if (!found) {
      return { success: false, message: 'Cupom inválido ou expirado!' };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Cupom [${found.code}] aplicado com sucesso!`, coupon: found };
  };

  const loginAdmin = (password: string): boolean => {
    if (password === config.adminPassword) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('bloodstore_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('bloodstore_admin_auth');
    if (activeView === 'admin') {
      setActiveView('home');
    }
  };

  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    setProducts(prev => [ { ...newProd, id, stockItems: newProd.stockItems || [] }, ...prev ]);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateProductStock = (productId: string, stockItems: string[]) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stockItems } : p));
  };

  const addTerm = (newTerm: Omit<TermItem, 'id'>) => {
    const id = `term-${Date.now()}`;
    setTerms(prev => [ ...prev, { ...newTerm, id } ]);
  };

  const updateTerm = (id: string, updated: Partial<TermItem>) => {
    setTerms(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
  };

  const deleteTerm = (id: string) => {
    setTerms(prev => prev.filter(t => t.id !== id));
  };

  const updateConfig = (newConfig: Partial<StoreConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const resetToDefault = () => {
    setProducts(DEFAULT_PRODUCTS);
    setTerms(DEFAULT_TERMS);
    setConfig(DEFAULT_CONFIG);
    setOrders([]);
    localStorage.removeItem('bloodstore_products');
    localStorage.removeItem('bloodstore_terms');
    localStorage.removeItem('bloodstore_config');
    localStorage.removeItem('bloodstore_orders');
    localStorage.removeItem('bloodstore_discord_user');
    setCurrentUser(null);
  };

  const exportBackup = (): string => {
    const data = {
      products,
      terms,
      config,
      orders,
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const importBackup = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
      }
      if (data.terms && Array.isArray(data.terms)) {
        setTerms(data.terms);
      }
      if (data.config && typeof data.config === 'object') {
        setConfig(data.config);
      }
      if (data.orders && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
      return true;
    } catch (e) {
      console.error('Falha ao importar backup JSON', e);
      return false;
    }
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Order => {
    const id = `PED-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const approveOrder = async (orderId: string): Promise<{ success: boolean; message: string }> => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) {
      return { success: false, message: 'Pedido não encontrado.' };
    }

    if (targetOrder.status === 'approved') {
      return { success: false, message: 'O pedido já está aprovado.' };
    }

    // Processar entrega automática retirando do estoque (stockItems)
    const updatedProducts = [...products];
    const updatedItems = targetOrder.items.map(item => {
      const productIndex = updatedProducts.findIndex(p => p.id === item.productId);
      if (productIndex !== -1) {
        const prod = updatedProducts[productIndex];
        const stock = prod.stockItems || [];
        const delivered: string[] = [];
        
        for (let i = 0; i < item.quantity; i++) {
          if (stock.length > 0) {
            delivered.push(stock.shift()!);
          } else {
            delivered.push(`[ENTREGA MANUAL VIA DISCORD] - Item aguardando reposição de estoque.`);
          }
        }
        updatedProducts[productIndex] = { ...prod, stockItems: stock };
        return { ...item, deliveredItems: delivered };
      }
      return item;
    });

    setProducts(updatedProducts);

    const approvedOrder: Order = {
      ...targetOrder,
      items: updatedItems,
      status: 'approved',
      deliveredAt: new Date().toISOString(),
      emailSent: !!targetOrder.buyerEmail
    };

    setOrders(prev => prev.map(o => o.id === orderId ? approvedOrder : o));

    // Disparar Webhook no Discord informando aprovação e entrega automática
    try {
      await sendDiscordDeliveryNotification(approvedOrder, config.discordWebhookUrl);
    } catch (err) {
      console.error('Erro ao enviar notificação de entrega no Discord:', err);
    }

    return { 
      success: true, 
      message: `Pedido #${approvedOrder.id} APROVADO com sucesso! ${approvedOrder.buyerEmail ? `E-mail de entrega disparado para ${approvedOrder.buyerEmail}` : 'Estoque entregue no painel do usuário.'}` 
    };
  };

  const rejectOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'rejected' } : o));
  };

  return (
    <StoreContext.Provider value={{
      products,
      terms,
      config,
      cart,
      coupons,
      appliedCoupon,
      orders,
      isAdminLoggedIn,
      activeView,
      adminTab,
      searchQuery,
      selectedTag,
      setActiveView,
      setAdminTab,
      setSearchQuery,
      setSelectedTag,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      applyCoupon,
      setAppliedCoupon,
      loginAdmin,
      logoutAdmin,
      addProduct,
      updateProduct,
      deleteProduct,
      updateProductStock,
      addTerm,
      updateTerm,
      deleteTerm,
      updateConfig,
      resetToDefault,
      exportBackup,
      importBackup,
      currentUser,
      loginDiscord,
      logoutDiscord,
      createOrder,
      approveOrder,
      rejectOrder
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore deve ser usado dentro de um StoreProvider');
  }
  return context;
};
