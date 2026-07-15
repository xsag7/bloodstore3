import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import type { Product } from '../../types/store';
import { Plus, Edit3, Trash2, Search, X } from 'lucide-react';

export const ProductsView: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, config } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states for creating/editing
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    slug: '',
    name: '',
    tag: 'ROBLOX',
    price: 19.90,
    originalPrice: 29.90,
    description: '',
    features: ['Entrega Rápida via Discord', 'Garantia total Blood Store', 'Suporte VIP'],
    imageUrl: '',
    badge: 'PROMOÇÃO',
    status: 'DISPONÍVEL',
    discordUrl: ''
  });

  const [featuresInput, setFeaturesInput] = useState('');

  const handleOpenCreate = () => {
    setFormData({
      slug: 'novo-item-slug',
      name: 'Novo Produto Blood Store',
      tag: 'ROBLOX',
      price: 25.00,
      originalPrice: 35.00,
      description: 'Descrição detalhada do produto, benefícios e garantias para o cliente.',
      features: ['Entrega em até 24h via Discord', 'Suporte anti-quedas', 'Pelo melhor preço do mercado'],
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
      badge: 'PROMOÇÃO',
      status: 'DISPONÍVEL',
      discordUrl: ''
    });
    setFeaturesInput('Entrega em até 24h via Discord\nSuporte anti-quedas\nPelo melhor preço do mercado');
    setIsCreating(true);
    setEditingProduct(null);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      slug: product.slug,
      name: product.name,
      tag: product.tag,
      price: product.price,
      originalPrice: product.originalPrice,
      description: product.description,
      features: product.features || [],
      imageUrl: product.imageUrl,
      badge: product.badge,
      status: product.status,
      discordUrl: product.discordUrl || ''
    });
    setFeaturesInput((product.features || []).join('\n'));
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const featuresList = featuresInput
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const productData = {
      ...formData,
      features: featuresList,
      price: Number(formData.price) || 0,
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined
    };

    if (isCreating) {
      addProduct(productData);
    } else if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    }

    setEditingProduct(null);
    setIsCreating(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar produtos cadastrados..."
            className="w-full py-2.5 pl-10 pr-4 bg-[#121218] border border-gray-700 focus:border-[#ff003c] text-white font-mono text-sm placeholder-gray-500 focus:outline-none"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-cyber py-2.5 px-5 text-xs flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>ADICIONAR PRODUTO</span>
        </button>
      </div>

      {/* Products Table/Grid */}
      <div className="hud-card overflow-x-auto border border-gray-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#181824] border-b border-[#ff003c]/30 font-mono text-xs text-[#ff003c] uppercase">
              <th className="py-4 px-4">Imagem</th>
              <th className="py-4 px-4">Título & Slug</th>
              <th className="py-4 px-4">Categoria / Tag</th>
              <th className="py-4 px-4">Preço</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/80 font-main text-sm">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-[#14141e]/80 transition-colors">
                <td className="py-3 px-4 w-20">
                  <div className="w-14 h-14 bg-black overflow-hidden border border-gray-800">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop';
                      }}
                    />
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-bold text-white font-display uppercase">{product.name}</div>
                  <div className="font-mono text-xs text-gray-400 mt-0.5">Slug: {product.slug}</div>
                </td>
                <td className="py-3 px-4 font-mono text-xs">
                  <span className="px-2 py-1 bg-[#1c1c28] border border-gray-700 text-gray-200 uppercase">
                    {product.tag}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-white">
                  R$ {product.price.toFixed(2)}
                  {product.originalPrice && (
                    <div className="text-xs text-gray-500 line-through font-normal">
                      R$ {product.originalPrice.toFixed(2)}
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 font-mono text-xs">
                  <span className={`px-2 py-0.5 uppercase ${
                    product.status === 'DISPONÍVEL' ? 'text-green-400 bg-green-950/40 border border-green-600/50' :
                    product.status === 'PROMOÇÃO' ? 'text-[#00f0ff] bg-cyan-950/40 border border-cyan-600/50' :
                    'text-red-400 bg-red-950/40 border border-red-600/50'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => handleOpenEdit(product)}
                    className="py-1.5 px-3 bg-[#1c1c29] border border-gray-700 hover:border-[#ff003c] text-gray-200 hover:text-white transition-all inline-flex items-center gap-1.5 font-mono text-xs"
                    title="Editar imagem, preço e detalhes do produto"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#ff003c]" />
                    <span>Editar Imagem / Preço</span>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Tem certeza que deseja excluir "${product.name}"?`)) {
                        deleteProduct(product.id);
                      }
                    }}
                    className="p-1.5 bg-red-950/40 border border-red-700/50 hover:border-red-500 text-red-400 transition-all inline-flex items-center justify-center"
                    title="Excluir produto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-400 font-mono text-sm">
                  Nenhum produto cadastrado com esse filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal Form */}
      {(isCreating || editingProduct) && (
        <div 
          className="animate-fadeIn" 
          style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'rgba(0, 0, 0, 0.88)', backdropFilter: 'blur(8px)' }}
        >
          <div 
            style={{ position: 'relative', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', background: '#121218', border: '2px solid var(--color-neon-red)', borderRadius: '8px', boxShadow: '0 0 30px rgba(255, 0, 60, 0.35)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 bg-[#191922] border-b border-[#ff003c]/40 sticky top-0 z-10">
              <div className="font-mono text-xs text-[#ff003c] uppercase tracking-widest font-bold">
                {isCreating ? '// ADICIONAR NOVO PRODUTO // ' : '// EDITAR PRODUTO //'}
              </div>
              <button 
                onClick={() => {
                  setIsCreating(false);
                  setEditingProduct(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-gray-300 uppercase mb-1">
                    Nome / Título do Produto
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0b0b0b] border border-gray-700 focus:border-[#ff003c] text-white font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-gray-300 uppercase mb-1">
                    Slug (Identificador curto)
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="ex: robux-r0b6x"
                    className="w-full px-3 py-2 bg-[#0b0b0b] border border-gray-700 focus:border-[#ff003c] text-white font-mono text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-xs text-gray-300 uppercase mb-1">
                    Preço Atual (R$)
                  </label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#0b0b0b] border border-gray-700 focus:border-[#ff003c] text-white font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-gray-300 uppercase mb-1">
                    Preço Antigo (Opcional)
                  </label>
                  <input 
                    type="number"
                    step="0.01"
                    value={formData.originalPrice || ''}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 bg-[#0b0b0b] border border-gray-700 focus:border-[#ff003c] text-white font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-gray-300 uppercase mb-1">
                    Tag / Categoria
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="ex: ROBLOX"
                    className="w-full px-3 py-2 bg-[#0b0b0b] border border-gray-700 focus:border-[#ff003c] text-white font-mono text-sm uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-gray-300 uppercase mb-1">
                    Badge de Destaque
                  </label>
                  <select
                    value={formData.badge || ''}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value ? e.target.value as any : undefined })}
                    className="w-full px-3 py-2 bg-[#0b0b0b] border border-gray-700 focus:border-[#ff003c] text-white font-mono text-sm"
                  >
                    <option value="">Sem Badge</option>
                    <option value="MAIS VENDIDO">MAIS VENDIDO</option>
                    <option value="ENTREGA IMEDIATA">ENTREGA IMEDIATA</option>
                    <option value="PROMOÇÃO">PROMOÇÃO</option>
                    <option value="EM ALTA">EM ALTA</option>
                    <option value="EXCLUSIVO">EXCLUSIVO</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs text-gray-300 uppercase mb-1">
                    Status de Estoque
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#0b0b0b] border border-gray-700 focus:border-[#ff003c] text-white font-mono text-sm"
                  >
                    <option value="DISPONÍVEL">DISPONÍVEL</option>
                    <option value="PROMOÇÃO">PROMOÇÃO</option>
                    <option value="ESGOTADO">ESGOTADO</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-[#0d0d14] border border-gray-800 space-y-3 rounded">
                <label className="block font-mono text-xs text-white uppercase font-bold flex items-center justify-between">
                  <span>URL DA IMAGEM DO PRODUTO (OU ESCOLHA UM PRESET)</span>
                  <span className="text-gray-400 font-normal">Preview Ao Vivo</span>
                </label>

                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ width: '100px', height: '100px', flexShrink: 0, background: '#000000', border: '2px solid var(--color-neon-red)', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {formData.imageUrl ? (
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop';
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: '0.65rem', color: '#666677', textAlign: 'center', padding: '4px', fontFamily: 'var(--font-mono)' }}>Sem Imagem</span>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <input 
                      type="text"
                      required
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="Cole o link da imagem (ex: https://... ou /fotos/...)"
                      className="w-full px-3 py-2 bg-[#0b0b0b] border border-gray-700 focus:border-[#ff003c] text-white font-mono text-xs"
                    />

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop' })}
                        className="px-2 py-1 bg-[#1a1a24] hover:bg-[#ff003c]/20 border border-gray-700 text-[11px] text-gray-300 hover:text-white font-mono transition-all"
                      >
                        🎮 Gamer/Setup
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop' })}
                        className="px-2 py-1 bg-[#1a1a24] hover:bg-[#ff003c]/20 border border-gray-700 text-[11px] text-gray-300 hover:text-white font-mono transition-all"
                      >
                        💬 Nitro/Discord
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop' })}
                        className="px-2 py-1 bg-[#1a1a24] hover:bg-[#ff003c]/20 border border-gray-700 text-[11px] text-gray-300 hover:text-white font-mono transition-all"
                      >
                        🔥 Engajamento/Social
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop' })}
                        className="px-2 py-1 bg-[#1a1a24] hover:bg-[#ff003c]/20 border border-gray-700 text-[11px] text-gray-300 hover:text-white font-mono transition-all"
                      >
                        ⚡ Cyber Tech
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-gray-300 uppercase mb-1">
                  Link Específico de Redirecionamento do Discord (Opcional)
                </label>
                <input 
                  type="text"
                  value={formData.discordUrl || ''}
                  onChange={(e) => setFormData({ ...formData, discordUrl: e.target.value })}
                  placeholder={`Se vazio, usará o link global: ${config.globalDiscordUrl}`}
                  className="w-full px-3 py-2 bg-[#0b0b0b] border border-gray-700 focus:border-[#ff003c] text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-gray-300 uppercase mb-1">
                  Descrição Completa
                </label>
                <textarea 
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0b0b0b] border border-gray-700 focus:border-[#ff003c] text-white font-main text-sm"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-gray-300 uppercase mb-1">
                  Vantagens & Características (1 por linha)
                </label>
                <textarea 
                  rows={3}
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="Entrega Rápida&#10;Garantia de 30 dias&#10;Suporte humanizado no Discord"
                  className="w-full px-3 py-2 bg-[#0b0b0b] border border-gray-700 focus:border-[#ff003c] text-white font-mono text-xs"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingProduct(null);
                  }}
                  className="py-2.5 px-5 bg-[#191922] border border-gray-700 hover:border-gray-500 text-gray-300 font-mono text-xs uppercase"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-cyber py-2.5 px-6 text-xs uppercase"
                >
                  {isCreating ? 'CADASTRAR PRODUTO' : 'SALVAR ALTERAÇÕES'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
