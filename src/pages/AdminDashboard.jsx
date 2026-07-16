import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const AdminDashboard = ({ onExitAdmin }) => {
  const { 
    config, 
    products, 
    terms, 
    updateConfig, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateTerms,
    resetToDefaults 
  } = useStore();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'config' | 'terms'

  // Form states para Novo Produto
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdImage, setNewProdImage] = useState('/fotos e videos/item.png');
  const [newProdBenefits, setNewProdBenefits] = useState('Entrega ultra rápida\nTotalmente verificado e seguro\nSuporte VIP ao cliente');
  const [newProdIcon, setNewProdIcon] = useState('fa-solid fa-box');

  // Form states para Edição de Produto
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editBenefits, setEditBenefits] = useState('');

  // Form states para Configuração Global
  const [cfgStoreName, setCfgStoreName] = useState(config.storeName);
  const [cfgSlogan, setCfgSlogan] = useState(config.slogan);
  const [cfgDiscordInvite, setCfgDiscordInvite] = useState(config.discordInvite);
  const [cfgWebhookUrl, setCfgWebhookUrl] = useState(config.webhookUrl);
  const [cfgPixKey, setCfgPixKey] = useState(config.pixKey);

  const handleLogin = (e) => {
    e.preventDefault();
    const cleanUser = usernameInput.trim().toLowerCase();
    if ((cleanUser === 'admin' || cleanUser === 'staff') && passwordInput === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Credenciais inválidas.');
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice.trim()) return;

    const benefitsArray = newProdBenefits.split('\n').map(s => s.trim()).filter(Boolean);
    addProduct({
      name: newProdName.trim(),
      slug: newProdName.trim().toLowerCase().replace(/\s+/g, '-'),
      priceText: newProdPrice.trim().startsWith('R$') ? newProdPrice.trim() : `R$ ${newProdPrice.trim()}`,
      image: newProdImage.trim(),
      icon: newProdIcon.trim() || 'fa-solid fa-box',
      benefits: benefitsArray
    });

    setNewProdName('');
    setNewProdPrice('');
    alert('✅ Produto adicionado e vitrine atualizada instantaneamente no LocalStorage!');
  };

  const startEditProduct = (prod) => {
    setEditingId(prod.id);
    setEditName(prod.name);
    setEditPrice(prod.priceText);
    setEditImage(prod.image);
    setEditBenefits(Array.isArray(prod.benefits) ? prod.benefits.join('\n') : prod.benefits);
  };

  const handleSaveEditProduct = (id) => {
    const benefitsArray = editBenefits.split('\n').map(s => s.trim()).filter(Boolean);
    updateProduct(id, {
      name: editName.trim(),
      priceText: editPrice.trim().startsWith('R$') ? editPrice.trim() : `R$ ${editPrice.trim()}`,
      image: editImage.trim(),
      benefits: benefitsArray
    });
    setEditingId(null);
    alert('✅ Produto atualizado!');
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    updateConfig({
      storeName: cfgStoreName.trim(),
      slogan: cfgSlogan.trim(),
      discordInvite: cfgDiscordInvite.trim(),
      webhookUrl: cfgWebhookUrl.trim(),
      pixKey: cfgPixKey.trim()
    });
    alert('✅ Configurações globais salvas com sucesso no LocalStorage!');
  };

  const handleUpdateTermItem = (id, newTitle, newContent) => {
    const updated = terms.map(t => t.id === id ? { ...t, title: newTitle, content: newContent } : t);
    updateTerms(updated);
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
              <label className="form-label">Usuário</label>
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
                placeholder="••••••••" 
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
          <p style={{ fontSize: '0.78rem', color: '#78788c', marginTop: '4px' }}>Modo de Edição em Tempo Real</p>
        </div>

        <nav className="admin-nav">
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
        </nav>

        <div className="admin-sidebar-bottom">
          <button 
            onClick={() => {
              if (window.confirm("Atenção: Deseja restaurar os dados originais da Blood Store no LocalStorage?")) {
                resetToDefaults();
                alert("Dados restaurados!");
              }
            }} 
            className="btn-reset-data"
          >
            <i className="fa-solid fa-rotate"></i> Restaurar Padrão
          </button>
          <button onClick={onExitAdmin} className="btn-exit-admin">
            <i className="fa-solid fa-store"></i> Ver Loja (Vitrine)
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL DE CONTEÚDO */}
      <main className="admin-main-content">
        <header className="admin-topbar">
          <h2>
            {activeTab === 'products' && <><i className="fa-solid fa-boxes-stacked text-red"></i> Gerenciamento de Produtos (CRUD)</>}
            {activeTab === 'config' && <><i className="fa-solid fa-gear text-red"></i> Configurações Globais & Webhook Discord</>}
            {activeTab === 'terms' && <><i className="fa-solid fa-file-contract text-red"></i> Edição dos Termos da Loja</>}
          </h2>
          <span className="admin-badge"><i className="fa-solid fa-circle text-red" style={{ fontSize: '0.6rem' }}></i> LocalStorage Ativo</span>
        </header>

        <div className="admin-body">
          {/* ABA 1: PRODUTOS */}
          {activeTab === 'products' && (
            <div className="admin-products-view">
              {/* Formulário Adicionar Novo */}
              <div className="admin-card">
                <h3><i className="fa-solid fa-plus text-red"></i> Adicionar Novo Produto</h3>
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

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Caminho da Imagem (Pasta Local ou URL externa)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="/fotos e videos/nome.png ou https://imgur.com/..." 
                      value={newProdImage}
                      onChange={(e) => setNewProdImage(e.target.value)}
                    />
                    <small style={{ color: '#78788c', display: 'block', marginTop: '4px' }}>
                      Se o arquivo estiver em `public/fotos e videos/`, digite `/fotos e videos/nome.png`.
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
                        <th>Nome</th>
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
                              <input 
                                type="text" 
                                className="form-input" 
                                value={editName} 
                                onChange={(e) => setEditName(e.target.value)} 
                              />
                            ) : (
                              <strong>{prod.name}</strong>
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
                              <input 
                                type="text" 
                                className="form-input" 
                                value={editImage} 
                                onChange={(e) => setEditImage(e.target.value)} 
                              />
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
                                        deleteProduct(prod.id);
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
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">
                    <i className="fa-brands fa-discord text-red"></i> URL do Webhook do Discord (Para notificações de Venda)
                  </label>
                  <input 
                    type="url" 
                    className="form-input" 
                    placeholder="https://discord.com/api/webhooks/..." 
                    value={cfgWebhookUrl}
                    onChange={(e) => setCfgWebhookUrl(e.target.value)}
                  />
                  <small style={{ color: '#78788c', display: 'block', marginTop: '4px' }}>
                    Sempre que um cliente gerar o PIX no checkout, uma Embed Vermelha será enviada automaticamente para esta URL!
                  </small>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">
                    <i className="fa-solid fa-qrcode text-red"></i> Chave PIX Copia e Cola (Sua conta recebedora)
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
        </div>
      </main>
    </div>
  );
};
