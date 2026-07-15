export interface Product {
  id: string;
  slug: string;
  name: string;
  tag: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  imageUrl: string;
  badge?: 'MAIS VENDIDO' | 'ENTREGA IMEDIATA' | 'PROMOÇÃO' | 'EM ALTA' | 'EXCLUSIVO';
  status: 'DISPONÍVEL' | 'PROMOÇÃO' | 'ESGOTADO';
  discordUrl?: string; // se vazio, usa o globalDiscordUrl da loja
}

export interface TermItem {
  id: string;
  title: string;
  content: string;
  category: 'PAGAMENTO' | 'ENTREGA' | 'SUPORTE' | 'REGRAS';
  isImportant?: boolean;
}

export interface StoreConfig {
  storeName: string;
  bannerTitle: string;
  bannerSubtitle: string;
  announcementBanner: string;
  globalDiscordUrl: string;
  adminPassword: string;
  accentColor: string; // Ex: #ff003c
  stats: {
    totalSales: number;
    activeUsers: number;
    satisfactionRate: string;
    averageDelivery: string;
  };
}

export type ViewTab = 'home' | 'terms' | 'admin';
export type AdminTab = 'overview' | 'products' | 'terms' | 'settings';
