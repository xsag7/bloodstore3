import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Plugin Vite para emular o proxy de Webhook no ambiente local de desenvolvimento (npm run dev)
// Garante que o frontend sempre chame /api/webhook-proxy e nunca exponha a URL real na aba Network!
function viteWebhookPlugin() {
  const DEFAULT_WEBHOOKS = {
    sales: "https://discord.com/api/webhooks/1527709858521022597/yQu3kvsRc9GblhZZBma4361FjEtWrGB5OwZHxpz-arXiGqMNDUJQmVUiG--VOTLKsj8g",
    logs: "https://discord.com/api/webhooks/1527709756414754876/XS2Q5993ommq4E-F48F1xz_NoSlbMj3vz-OSwLNRvzmPgI5NhG678jM3cTT0S0zMtceu",
    msgLogs: "https://discord.com/api/webhooks/1527709858521022597/yQu3kvsRc9GblhZZBma4361FjEtWrGB5OwZHxpz-arXiGqMNDUJQmVUiG--VOTLKsj8g",
    approval: "https://discord.com/api/webhooks/1527709968927559681/X9-22J4ASWXACKl8U7EaaMwNnFmc8l_uxQi0v94jbDOxfYuWrB6dTltMNXH3p1OZYvql",
    rejected: "https://discord.com/api/webhooks/1527710112922210475/5lZrqHBXbQ55rEUGljSfW4ONimIVNTGpoG7zMkYxxU_qje8wYK9JD7nJCDXfPCspmfWS",
    staffJoin: "https://discord.com/api/webhooks/1527710186087649481/4k7PDV2bjuFPsLQ9F2pn1kFRp4HYv2TgqPes_xiOtssSCaVNFqgAn53_U9elJ9we1NA0"
  };

  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://wizkszkiahqtuwsygter.supabase.co';
  const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_OWiqfuWAcgTv-Kl-awjJgA_NhYS5iKj';

  const webhookMiddleware = async (req, res, next) => {
    if (req.url?.startsWith('/api/webhook-proxy') && req.method === 'POST') {
      let bodyStr = '';
      req.on('data', chunk => { bodyStr += chunk; });
      req.on('end', async () => {
        try {
          const body = JSON.parse(bodyStr || '{}');
          const { type = 'sales', payload, contentText, overrideUrl } = body;

          let targetUrl = '';
          if (overrideUrl && typeof overrideUrl === 'string' && (overrideUrl.trim().toLowerCase().includes('discord.com/api/webhooks/') || overrideUrl.trim().toLowerCase().includes('discordapp.com/api/webhooks/'))) {
            targetUrl = overrideUrl.trim();
          } else {
            try {
              const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/store_state?id=eq.global_state&select=config`, {
                method: 'GET',
                headers: {
                  'apikey': SUPABASE_ANON_KEY,
                  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
              });
              if (supaRes.ok) {
                const rows = await supaRes.json();
                if (rows && rows.length > 0 && rows[0].config) {
                  const cfg = rows[0].config;
                  if (type === 'approval') targetUrl = cfg.webhookApprovalUrl || DEFAULT_WEBHOOKS.approval;
                  else if (type === 'rejected') targetUrl = cfg.webhookRejectedUrl || DEFAULT_WEBHOOKS.rejected;
                  else if (type === 'logs') targetUrl = cfg.webhookLogsUrl || DEFAULT_WEBHOOKS.logs;
                  else if (type === 'msgLogs') targetUrl = cfg.webhookMsgLogsUrl || DEFAULT_WEBHOOKS.msgLogs;
                  else if (type === 'staffJoin') targetUrl = cfg.webhookStaffJoinUrl || DEFAULT_WEBHOOKS.staffJoin;
                  else targetUrl = cfg.webhookUrl || DEFAULT_WEBHOOKS.sales;
                }
              }
            } catch (e) {
              console.warn('⚠️ Erro ao buscar configuração no Supabase no plugin Vite:', e.message);
            }
            if (!targetUrl) targetUrl = DEFAULT_WEBHOOKS[type] || DEFAULT_WEBHOOKS.sales;
          }

          if (!targetUrl || !targetUrl.includes('discord')) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Nenhuma URL configurada para este evento.' }));
            return;
          }

          const discordPayload = {
            username: payload?.username || "Blood Store • Sistema Ao Vivo",
            avatar_url: payload?.avatar_url || "https://i.imgur.com/8N40WzN.png",
            ...(contentText ? { content: contentText } : (payload?.content ? { content: payload.content } : {})),
            ...(payload?.embeds ? { embeds: payload.embeds } : {})
          };

          const discordRes = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(discordPayload)
          });

          if (!discordRes.ok) {
            const errText = await discordRes.text().catch(() => '');
            res.writeHead(discordRes.status, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'O servidor do Discord rejeitou a notificação.', details: errText }));
            return;
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Notificação enviada com sucesso!' }));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Erro no plugin Vite proxy.', details: err.message }));
        }
      });
      return;
    }
    next();
  };

  return {
    name: 'vite-webhook-proxy',
    configureServer(server) {
      server.middlewares.use(webhookMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(webhookMiddleware);
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteWebhookPlugin()],
  server: {
    host: true, // Escuta automaticamente em todas as interfaces (Network & Localhost)
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  }
})
