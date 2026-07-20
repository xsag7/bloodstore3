import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const ProductGrid = ({ onSelectProduct }) => {
  const { products, categories } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');

  const activeCategories = categories && categories.length > 0 
    ? categories 
    : [
        { id: "cat_contas", name: "Contas & Perfis", icon: "fa-solid fa-user-shield" },
        { id: "cat_moedas", name: "Moedas & Gold", icon: "fa-solid fa-coins" },
        { id: "cat_itens", name: "Itens & Godlys", icon: "fa-solid fa-wand-magic-sparkles" },
        { id: "cat_servicos", name: "Serviços & Nitro", icon: "fa-brands fa-discord" },
        { id: "cat_geral", name: "Outros / Diversos", icon: "fa-solid fa-box" }
      ];

  const filterAndSort = (prodList = []) => {
    let filtered = prodList.filter(p => {
      const matchSearch = searchTerm.trim() === '' || 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(p.benefits) && p.benefits.some(b => b?.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchCategory = selectedCategory === 'all' || 
        p.category === selectedCategory || 
        (!p.category && selectedCategory === 'Outros / Diversos');

      return matchSearch && matchCategory;
    });

    if (sortOrder === 'price-asc') {
      filtered.sort((a, b) => (a.priceValue || 0) - (b.priceValue || 0));
    } else if (sortOrder === 'price-desc') {
      filtered.sort((a, b) => (b.priceValue || 0) - (a.priceValue || 0));
    } else if (sortOrder === 'name-asc') {
      filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortOrder === 'name-desc') {
      filtered.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    }
    return filtered;
  };

  const allFiltered = filterAndSort(products || []);

  return (
    <section id="catalogo" className="section-products">
      <div className="container">
        <div className="section-header">
          <h2>Catálogo de Produtos</h2>
          <p>Selecione o item desejado para iniciar seu atendimento e gerar o PIX.</p>
        </div>

        {/* Barra de Busca e Ordenação */}
        <div className="catalog-filter-bar">
          <div className="catalog-search-wrapper">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input 
              type="text" 
              placeholder="Pesquisar produto, jogo, godlys ou benefício..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="catalog-search-input"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="catalog-search-clear" title="Limpar busca">
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          <div className="catalog-sort-wrapper">
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              className="catalog-sort-select"
            >
              <option value="default">⚡ Ordem Padrão</option>
              <option value="price-asc">💰 Menor Preço Primeiro</option>
              <option value="price-desc">💎 Maior Preço Primeiro</option>
              <option value="name-asc">🔤 Nome (A a Z)</option>
              <option value="name-desc">🔠 Nome (Z a A)</option>
            </select>
          </div>
        </div>

        {/* Pills / Abas das Categorias */}
        <div className="catalog-category-pills">
          <button 
            className={`cat-pill ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            <i className="fa-solid fa-layer-group"></i> Todas as Categorias ({products?.length || 0})
          </button>
          {activeCategories.map((cat) => {
            const count = (products || []).filter(p => p.category === cat.name || (!p.category && cat.name === 'Outros / Diversos')).length;
            if (count === 0 && selectedCategory !== cat.name) return null;
            return (
              <button 
                key={cat.id || cat.name}
                className={`cat-pill ${selectedCategory === cat.name ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                <i className={cat.icon || "fa-solid fa-tag"}></i> {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Exibição em Cascata (Categorias uma embaixo da outra) quando "Todas" selecionado */}
        {selectedCategory === 'all' ? (
          <div>
            {allFiltered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#151520', borderRadius: '12px', border: '1px dashed #331515' }}>
                <i className="fa-solid fa-box-open" style={{ fontSize: '2.5rem', color: '#78788c', marginBottom: '16px' }}></i>
                <p style={{ color: '#a0a0b0', fontSize: '1.1rem' }}>Nenhum produto encontrado para a sua pesquisa.</p>
              </div>
            ) : (
              activeCategories.map((cat) => {
                const catProducts = allFiltered.filter(p => p.category === cat.name || (!p.category && cat.name === 'Outros / Diversos'));
                if (catProducts.length === 0) return null;

                return (
                  <div key={cat.id || cat.name} className="category-section">
                    <div className="category-section-header">
                      <div className="category-section-title-box">
                        <span className="category-section-title">
                          <i className={cat.icon || "fa-solid fa-tag"}></i> {cat.name}
                        </span>
                        <span className="category-count-badge">{catProducts.length} {catProducts.length === 1 ? 'item' : 'itens'}</span>
                      </div>
                    </div>

                    <div className="products-grid">
                      {catProducts.map((prod) => (
                        <ProductCard key={prod.id} product={prod} onSelectProduct={onSelectProduct} />
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Exibição de categoria específica selecionada */
          <div className="products-grid">
            {allFiltered.length > 0 ? (
              allFiltered.map((prod) => (
                <ProductCard key={prod.id} product={prod} onSelectProduct={onSelectProduct} />
              ))
            ) : (
              <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '60px 20px', background: '#151520', borderRadius: '12px', border: '1px dashed #331515' }}>
                <i className="fa-solid fa-box-open" style={{ fontSize: '2.5rem', color: '#78788c', marginBottom: '16px' }}></i>
                <p style={{ color: '#a0a0b0', fontSize: '1.1rem' }}>Nenhum item disponível nesta categoria com os filtros atuais.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
