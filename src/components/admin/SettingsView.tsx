import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Save, Download, Upload, Check, RefreshCw } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { config, updateConfig, exportBackup, importBackup, resetToDefault } = useStore();
  const [formData, setFormData] = useState({ ...config });
  const [saved, setSaved] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDownloadBackup = () => {
    const jsonString = exportBackup();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_bloodstore_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApplyImport = () => {
    if (!importJsonText.trim()) return;
    const ok = importBackup(importJsonText);
    if (ok) {
      alert('Backup JSON importado e aplicado com sucesso!');
      setShowImportBox(false);
      setImportJsonText('');
    } else {
      alert('Erro: Arquivo JSON inválido. Verifique o formato e tente novamente.');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      {/* Settings Form */}
      <div className="hud-card p-6 sm:p-8 border border-gray-800 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div>
            <h3 className="text-xl font-bold font-display text-white uppercase">
              Configurações e Customização Global
            </h3>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              Altere instantaneamente o link do Discord, nome do site e mensagens de aviso.
            </p>
          </div>
          {saved && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-950/60 border border-green-500 text-green-300 font-mono text-xs animate-bounce">
              <Check className="w-4 h-4" />
              <span>SALVO COM SUCESSO!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-xs text-[#ff003c] uppercase font-bold mb-1">
                Nome da Loja (Título Global)
              </label>
              <input 
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0b0b0b] border border-gray-700 focus:border-[#ff003c] text-white font-mono text-sm"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-[#00f0ff] uppercase font-bold mb-1">
                Link Global do Servidor Discord
              </label>
              <input 
                type="url"
                required
                value={formData.globalDiscordUrl}
                onChange={(e) => setFormData({ ...formData, globalDiscordUrl: e.target.value })}
                placeholder="https://discord.gg/Gvbg5WYPBP"
                className="w-full px-4 py-2.5 bg-[#0b0b0b] border border-gray-700 focus:border-[#ff003c] text-white font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs text-gray-300 uppercase font-bold mb-1">
              Barra de Aviso do Topo (Ticker no Navbar)
            </label>
            <input 
              type="text"
              value={formData.announcementBanner}
              onChange={(e) => setFormData({ ...formData, announcementBanner: e.target.value })}
              placeholder="Ex: ENTREGA EM ATÉ 24H // PIX INSTANTÂNEO..."
              className="w-full px-4 py-2.5 bg-[#0b0b0b] border border-gray-700 focus:border-[#ff003c] text-white font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-xs text-gray-300 uppercase font-bold mb-1">
                Título do Banner Principal (Hero)
              </label>
              <input 
                type="text"
                required
                value={formData.bannerTitle}
                onChange={(e) => setFormData({ ...formData, bannerTitle: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0b0b0b] border border-gray-700 focus:border-[#ff003c] text-white font-main text-sm uppercase font-bold"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-yellow-400 uppercase font-bold mb-1">
                Senha de Acesso ao Painel Admin
              </label>
              <input 
                type="text"
                required
                value={formData.adminPassword}
                onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                placeholder="Ex: admin"
                className="w-full px-4 py-2.5 bg-[#0b0b0b] border border-gray-700 focus:border-[#ff003c] text-white font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs text-gray-300 uppercase font-bold mb-1">
              Subtítulo do Banner Principal
            </label>
            <textarea 
              rows={2}
              required
              value={formData.bannerSubtitle}
              onChange={(e) => setFormData({ ...formData, bannerSubtitle: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0b0b0b] border border-gray-700 focus:border-[#ff003c] text-white font-main text-sm font-light"
            />
          </div>

          {/* Stats simulation configuration */}
          <div className="border-t border-gray-800 pt-5">
            <h4 className="font-mono text-xs text-[#ff003c] uppercase tracking-wider font-bold mb-3">
              // CUSTOMIZAR ESTATÍSTICAS EXIBIDAS NO BANNER
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-mono text-[11px] text-gray-400 uppercase mb-1">Vendas Concluídas</label>
                <input 
                  type="number"
                  value={formData.stats.totalSales}
                  onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats, totalSales: Number(e.target.value) } })}
                  className="w-full px-3 py-2 bg-[#0b0b0b] border border-gray-700 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-gray-400 uppercase mb-1">Membros Ativos</label>
                <input 
                  type="number"
                  value={formData.stats.activeUsers}
                  onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats, activeUsers: Number(e.target.value) } })}
                  className="w-full px-3 py-2 bg-[#0b0b0b] border border-gray-700 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-gray-400 uppercase mb-1">Taxa de Satisfação</label>
                <input 
                  type="text"
                  value={formData.stats.satisfactionRate}
                  onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats, satisfactionRate: e.target.value } })}
                  className="w-full px-3 py-2 bg-[#0b0b0b] border border-gray-700 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-gray-400 uppercase mb-1">Tempo de Resposta</label>
                <input 
                  type="text"
                  value={formData.stats.averageDelivery}
                  onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats, averageDelivery: e.target.value } })}
                  className="w-full px-3 py-2 bg-[#0b0b0b] border border-gray-700 text-white font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800 flex justify-end">
            <button
              type="submit"
              className="btn-cyber py-3 px-8 text-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>SALVAR TODAS AS CONFIGURAÇÕES</span>
            </button>
          </div>
        </form>
      </div>

      {/* Backup & Data Recovery Section */}
      <div className="hud-card p-6 sm:p-8 border border-gray-800 space-y-5">
        <h3 className="text-lg font-bold font-display text-white uppercase border-b border-gray-800 pb-3">
          Backup de Dados e Portabilidade
        </h3>
        <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
          Para garantir a segurança de seus produtos e termos personalizados ou transferi-los para outro computador ou navegador, faça o download do arquivo de backup JSON.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={handleDownloadBackup}
            className="btn-cyber-outline py-2.5 px-5 text-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#00f0ff]" />
            <span>EXPORTAR BACKUP (JSON)</span>
          </button>

          <button
            onClick={() => setShowImportBox(!showImportBox)}
            className="btn-cyber-outline py-2.5 px-5 text-xs flex items-center gap-2"
          >
            <Upload className="w-4 h-4 text-[#ff003c]" />
            <span>IMPORTAR BACKUP (JSON)</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Atenção: Deseja restaurar todos os dados para as configurações de fábrica?')) {
                resetToDefault();
                alert('Dados originais de fábrica restaurados com sucesso!');
              }
            }}
            className="px-5 py-2.5 bg-red-950/40 border border-red-600/50 hover:border-red-500 text-red-300 font-mono text-xs flex items-center gap-2 transition-all ml-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>RESTAURAR PADRÃO DE FÁBRICA</span>
          </button>
        </div>

        {/* JSON Paste Import Area */}
        {showImportBox && (
          <div className="mt-4 p-4 bg-[#0b0b0b] border border-[#ff003c]/40 space-y-3 animate-fadeIn">
            <label className="block font-mono text-xs text-[#ff003c] uppercase font-bold">
              Cole o conteúdo do arquivo JSON de Backup abaixo:
            </label>
            <textarea 
              rows={6}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder={`{"products": [...], "terms": [...], "config": {...}}`}
              className="w-full p-3 bg-[#121218] border border-gray-700 font-mono text-xs text-white focus:border-[#ff003c]"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowImportBox(false)}
                className="py-2 px-4 bg-[#191922] border border-gray-700 text-gray-300 font-mono text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleApplyImport}
                className="btn-cyber py-2 px-6 text-xs"
              >
                APLICAR IMPORTAÇÃO
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
