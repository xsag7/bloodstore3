import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import type { Product } from '../../types/store';
import { Search, Terminal, ShoppingBag } from 'lucide-react';

export const ProductsSection: React.FC = () => {
  const { products, searchQuery, setSearchQuery, selectedTag, setSelectedTag } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Extract all unique tags
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    tags.add('TODOS');
    products.forEach(p => {
      if (p.tag) tags.add(p.tag.toUpperCase());
    });
    return Array.from(tags);
  }, [products]);

  // Filter products by search query and tag
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tag.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTag = selectedTag === 'TODOS' || product.tag.toUpperCase() === selectedTag;

      return matchesSearch && matchesTag;
    });
  }, [products, searchQuery, selectedTag]);

  return (
    <section id="produtos" className="py-16 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="flex items-center gap-2 font-mono text-xs text-[#ff003c] uppercase tracking-widest mb-2">
          <Terminal className="w-4 h-4 animate-pulse" />
          <span>// CATALOG MODULE : ACCESS GRANTED //</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display text-white uppercase tracking-tight">
          CATÁLOGO DE <span className="text-[#ff003c] neon-glow-text">PRODUTOS</span> & SERVIÇOS
        </h2>
        <p className="text-gray-400 max-w-2xl mt-3 text-sm sm:text-base font-light">
          Selecione os melhores pacotes de infoprodutos, contas premium e boosts. Todos os itens são entregues no nosso servidor do Discord com garantia e suporte anti-quedas.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-10 space-y-5">
        {/* Search Input Box */}
        <div className="relative max-w-xl mx-auto">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por jogo, conta, robux ou serviço..."
            className="w-full py-3.5 pl-12 pr-4 bg-[#121218] border border-[#ff003c]/40 focus:border-[#ff003c] text-white font-mono text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#ff003c] transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ff003c]" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-400 hover:text-white uppercase"
            >
              [ LIMPAR ]
            </button>
          )}
        </div>

        {/* Tags Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 font-mono text-xs font-bold uppercase transition-all tracking-wider ${
                selectedTag === tag 
                  ? 'bg-[#ff003c] text-white border border-[#ff003c] neon-glow' 
                  : 'bg-[#14141d] text-gray-300 border border-gray-800 hover:border-[#ff003c]/60 hover:text-white'
              }`}
            >
              {tag === 'TODOS' ? `🔥 ${tag}` : tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Filter Status */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-800 text-xs font-mono text-gray-400">
        <div>
          Exibindo <span className="text-[#ff003c] font-bold">{filteredProducts.length}</span> de <span className="text-white">{products.length}</span> produtos
        </div>
        {selectedTag !== 'TODOS' && (
          <div className="flex items-center gap-2 text-[#00f0ff]">
            <span>Filtro ativo: {selectedTag}</span>
            <button 
              onClick={() => setSelectedTag('TODOS')}
              className="underline hover:text-white"
            >
              Limpar filtro
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onSelectProduct={setSelectedProduct}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 px-6 text-center bg-[#12121a] border border-dashed border-[#ff003c]/40 max-w-2xl mx-auto">
          <ShoppingBag className="w-12 h-12 text-[#ff003c] mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-white font-display uppercase mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-400 text-sm font-light mb-6">
            Não encontramos nenhum item correspondente a "{searchQuery || selectedTag}". Tente mudar sua busca ou selecionar a categoria "TODOS".
          </p>
          <button 
            onClick={() => {
              setSearchQuery('');
              setSelectedTag('TODOS');
            }}
            className="btn-cyber py-2 px-6 text-xs"
          >
            VER TODOS OS PRODUTOS
          </button>
        </div>
      )}

      {/* Product Details Modal */}
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </section>
  );
};
