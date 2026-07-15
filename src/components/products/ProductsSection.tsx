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
    <section id="produtos" className="container-main" style={{ paddingBottom: '6rem' }}>
      {/* Section Header */}
      <div className="catalog-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-neon-red)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.6rem' }}>
          <Terminal style={{ width: '16px', height: '16px' }} />
          <span>// CATALOG MODULE : ACCESS GRANTED //</span>
        </div>
        <h2 className="catalog-title">
          CATÁLOGO DE <span style={{ color: 'var(--color-neon-red)' }} className="neon-glow-text">PRODUTOS</span> & SERVIÇOS
        </h2>
        <p style={{ color: '#a0a0b2', marginTop: '0.75rem', fontSize: '1rem', fontWeight: 300, lineHeight: 1.6 }}>
          Selecione os melhores pacotes de infoprodutos, contas premium e boosts. Todos os itens são entregues no nosso servidor do Discord com garantia e suporte anti-quedas.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="search-box-container">
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por jogo, conta, robux ou serviço..."
          className="search-input"
        />
        <Search className="search-icon-pos" style={{ width: '20px', height: '20px' }} />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="search-clear-pos"
          >
            [ LIMPAR ]
          </button>
        )}
      </div>

      {/* Tags Category Pills */}
      <div className="tags-bar">
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`tag-btn ${selectedTag === tag ? 'active' : 'inactive'}`}
          >
            {tag === 'TODOS' ? `🔥 ${tag}` : tag}
          </button>
        ))}
      </div>

      {/* Results Count & Filter Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,0,60,0.2)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#a0a0b2' }}>
        <div>
          Exibindo <strong style={{ color: 'var(--color-neon-red)' }}>{filteredProducts.length}</strong> de <strong style={{ color: '#ffffff' }}>{products.length}</strong> produtos
        </div>
        {selectedTag !== 'TODOS' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-neon-cyan)' }}>
            <span>Filtro ativo: {selectedTag}</span>
            <button 
              onClick={() => setSelectedTag('TODOS')}
              style={{ textDecoration: 'underline', color: '#ffffff', cursor: 'pointer', background: 'transparent', border: 'none' }}
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
        <div style={{ padding: '5rem 1.5rem', textAlign: 'center', background: '#121218', border: '1px dashed rgba(255,0,60,0.4)', maxWidth: '650px', margin: '0 auto' }}>
          <ShoppingBag style={{ width: '48px', height: '48px', color: 'var(--color-neon-red)', margin: '0 auto 1rem auto', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-display)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Nenhum produto encontrado
          </h3>
          <p style={{ color: '#a0a0b2', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 300 }}>
            Não encontramos nenhum item correspondente a "{searchQuery || selectedTag}". Tente mudar sua busca ou selecionar a categoria "TODOS".
          </p>
          <button 
            onClick={() => {
              setSearchQuery('');
              setSelectedTag('TODOS');
            }}
            className="btn-cyber"
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
