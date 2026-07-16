import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import type { Product } from '../../types/store';
import { Search, Sparkles, ShoppingBag } from 'lucide-react';

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
    <section id="produtos" className="container-main py-12">
      {/* Section Header */}
      <div className="max-w-3xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#ff003c] uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>• Catálogo de Ativos & Soluções Digitais</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
          Nossos <span className="text-[#ff003c]">Produtos</span> & Serviços
        </h2>
        <p className="text-slate-400 mt-2 text-sm leading-relaxed">
          Selecione os melhores pacotes de infoprodutos, licenças e otimizações. Todos os itens são validados e liberados com suporte corporativo em nosso canal oficial.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-8 pb-6 border-b border-white/10">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome, categoria ou recurso..."
            style={{ backgroundColor: '#141622', color: '#ffffff' }}
            className="w-full pl-10 pr-20 py-2.5 bg-[#141622] border border-white/12 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-[#ff003c] placeholder:text-slate-500 transition-colors shadow-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-400 hover:text-white bg-[#1a1c2e] px-2 py-1 rounded-lg transition-colors"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Tags Category Pills */}
        <div className="flex flex-wrap gap-2 items-center">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedTag === tag 
                  ? 'bg-[#ff003c] text-white shadow-md shadow-[#ff003c]/20 scale-105' 
                  : 'bg-[#141622] border border-white/10 text-slate-400 hover:text-white hover:border-white/25'
              }`}
            >
              {tag === 'TODOS' ? `Todos (${products.length})` : tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Active Filter */}
      <div className="flex justify-between items-center text-xs text-slate-400 mb-6">
        <div>
          Exibindo <strong className="text-white font-bold">{filteredProducts.length}</strong> de <strong className="text-white">{products.length}</strong> itens disponíveis
        </div>
        {selectedTag !== 'TODOS' && (
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-medium">Categoria ativa: {selectedTag}</span>
            <button 
              onClick={() => setSelectedTag('TODOS')}
              className="text-slate-400 hover:text-white underline font-semibold transition-colors"
            >
              Ver todas
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
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
        <div className="py-16 px-6 text-center bg-[#0e1018] border border-dashed border-white/15 rounded-2xl max-w-lg mx-auto shadow-sm">
          <ShoppingBag className="w-12 h-12 text-[#ff003c] mx-auto mb-4 opacity-75" />
          <h3 className="text-lg font-bold text-white font-display mb-2">
            Nenhum produto correspondente
          </h3>
          <p className="text-slate-400 text-xs mb-6 max-w-sm mx-auto leading-relaxed">
            Não encontramos nenhum item para "{searchQuery || selectedTag}". Tente alterar os termos da busca ou selecione a categoria "Todos".
          </p>
          <button 
            onClick={() => {
              setSearchQuery('');
              setSelectedTag('TODOS');
            }}
            className="px-5 py-2.5 bg-[#ff003c] hover:bg-[#d90033] text-white font-bold text-xs rounded-xl shadow transition-all"
          >
            Exibir Todos os Produtos
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
