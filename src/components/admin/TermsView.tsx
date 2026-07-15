import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import type { TermItem } from '../../types/store';
import { Plus, Edit3, Trash2, X } from 'lucide-react';

export const TermsView: React.FC = () => {
  const { terms, addTerm, updateTerm, deleteTerm } = useStore();
  const [editingTerm, setEditingTerm] = useState<TermItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState<Omit<TermItem, 'id'>>({
    title: '',
    content: '',
    category: 'REGRAS',
    isImportant: false
  });

  const handleOpenCreate = () => {
    setFormData({
      title: 'Nova Regra ou Política',
      content: 'Digite aqui o conteúdo da regra ou instrução para os clientes.',
      category: 'REGRAS',
      isImportant: false
    });
    setIsCreating(true);
    setEditingTerm(null);
  };

  const handleOpenEdit = (term: TermItem) => {
    setEditingTerm(term);
    setFormData({
      title: term.title,
      content: term.content,
      category: term.category,
      isImportant: term.isImportant || false
    });
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) {
      addTerm(formData);
    } else if (editingTerm) {
      updateTerm(editingTerm.id, formData);
    }
    setIsCreating(false);
    setEditingTerm(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold font-display text-white uppercase">
            Gerenciamento dos Termos & Condições
          </h3>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Os itens abaixo são exibidos na aba pública "Termos e Condições".
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-cyber py-2.5 px-5 text-xs flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>ADICIONAR TERMO</span>
        </button>
      </div>

      {/* Terms List Grid */}
      <div className="space-y-3">
        {terms.map((term, idx) => (
          <div 
            key={term.id}
            className="hud-card p-5 border border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#ff003c]/50 transition-all"
          >
            <div className="flex items-start gap-4 flex-1">
              <span className="font-mono text-xs font-bold text-[#ff003c] bg-[#1a141a] px-2 py-1 border border-[#ff003c]/40 mt-1">
                #{String(idx + 1).padStart(2, '0')}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white font-display uppercase">
                    {term.title}
                  </h4>
                  <span className="px-2 py-0.5 bg-[#181824] border border-gray-700 font-mono text-[10px] text-gray-300">
                    {term.category}
                  </span>
                  {term.isImportant && (
                    <span className="px-2 py-0.5 bg-[#ff003c]/20 border border-[#ff003c] font-mono text-[10px] text-[#ff003c]">
                      DESTAQUE / IMPORTANTE
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-300 font-light mt-1.5 leading-relaxed bg-[#0b0b0b]/60 p-3 border border-gray-800">
                  {term.content}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => handleOpenEdit(term)}
                className="p-2.5 bg-[#1c1c29] border border-gray-700 hover:border-[#ff003c] text-gray-300 hover:text-white transition-all"
                title="Editar termo"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Excluir a regra "${term.title}"?`)) {
                    deleteTerm(term.id);
                  }
                }}
                className="p-2.5 bg-red-950/40 border border-red-700/50 hover:border-red-500 text-red-400 transition-all"
                title="Excluir termo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Create/Edit */}
      {(isCreating || editingTerm) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div 
            className="relative w-full max-w-lg bg-[#121218] border-2 border-[#ff003c] neon-glow p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#ff003c]/40">
              <div className="font-mono text-xs text-[#ff003c] uppercase tracking-widest font-bold">
                {isCreating ? '// NOVO TERMO DE SERVIÇO // ' : '// EDITAR REGRA //'}
              </div>
              <button 
                onClick={() => {
                  setIsCreating(false);
                  setEditingTerm(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-gray-300 uppercase mb-1">
                  Título da Regra (Ex: Prazo de entrega)
                </label>
                <input 
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0b0b0b] border border-gray-700 focus:border-[#ff003c] text-white font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-gray-300 uppercase mb-1">
                    Categoria da Regra
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#0b0b0b] border border-gray-700 focus:border-[#ff003c] text-white font-mono text-sm"
                  >
                    <option value="PAGAMENTO">PAGAMENTO</option>
                    <option value="ENTREGA">ENTREGA</option>
                    <option value="SUPORTE">SUPORTE</option>
                    <option value="REGRAS">REGRAS GERAIS</option>
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={formData.isImportant || false}
                      onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                      className="w-4 h-4 accent-[#ff003c] bg-[#0b0b0b] border-gray-700"
                    />
                    <span className="font-mono text-xs text-white uppercase">Destacar com Badge IMPORTANTE</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-gray-300 uppercase mb-1">
                  Conteúdo Completo do Termo
                </label>
                <textarea 
                  rows={5}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0b0b0b] border border-gray-700 focus:border-[#ff003c] text-white font-main text-sm"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingTerm(null);
                  }}
                  className="py-2.5 px-5 bg-[#191922] border border-gray-700 hover:border-gray-500 text-gray-300 font-mono text-xs uppercase"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-cyber py-2.5 px-6 text-xs uppercase"
                >
                  SALVAR TERMO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
