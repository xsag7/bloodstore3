// Netlify Serverless Function • Proxy Blindado para Webhooks Discord (Anti-Network Sniffing)
// Este proxy garante que as URLs dos webhooks NUNCA sejam enviadas nem visíveis na aba Network do navegador dos clientes!

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://wizkszkiahqtuwsygter.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_OWiqfuWAcgTv-Kl-awjJgA_NhYS5iKj';

// URLs de fallback iniciais caso o Supabase não responda imediatamente
const DEFAULT_WEBHOOKS = {
  sales: "https://discord.com/api/webhooks/1527709858521022597/yQu3kvsRc9GblhZZBma4361FjEtWrGB5OwZHxpz-arXiGqMNDUJQmVUiG--VOTLKsj8g",
  logs: "https://discord.com/api/webhooks/1527709756414754876/XS2Q5993ommq4E-F48F1xz_NoSlbMj3vz-OSwLNRvzmPgI5NhG678jM3cTT0S0zMtceu",
  msgLogs: "https://discord.com/api/webhooks/1527709858521022597/yQu3kvsRc9GblhZZBma4361FjEtWrGB5OwZHxpz-arXiGqMNDUJQmVUiG--VOTLKsj8g",
  approval: "https://discord.com/api/webhooks/1527709968927559681/X9-22J4ASWXACKl8U7EaaMwNnFmc8l_uxQi0v94jbDOxfYuWrB6dTltMNXH3p1OZYvql",
  rejected: "https://discord.com/api/webhooks/1527710112922210475/5lZrqHBXbQ55rEUGljSfW4ONimIVNTGpoG7zMkYxxU_qje8wYK9JD7nJCDXfPCspmfWS",
  staffJoin: "https://discord.com/api/webhooks/1527710186087649481/4k7PDV2bjuFPsLQ9F2pn1kFRp4HYv2TgqPes_xiOtssSCaVNFqgAn53_U9elJ9we1NA0"
};

export const handler = async (event) => {
  // Configurar CORS seguro
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Método não permitido. Utilize POST.' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { type = 'sales', payload, contentText, overrideUrl } = body;

    if (!payload && !contentText) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Payload de mensagem não fornecido.' }) };
    }

    let targetUrl = '';

    // Se overrideUrl for passado em testes pelo Admin (deve ser uma URL válida do Discord)
    if (overrideUrl && typeof overrideUrl === 'string' && (overrideUrl.trim().toLowerCase().includes('discord.com/api/webhooks/') || overrideUrl.trim().toLowerCase().includes('discordapp.com/api/webhooks/'))) {
      targetUrl = overrideUrl.trim();
    } else {
      // 1. Tentar buscar a URL atualizada no banco Supabase (tabela store_state)
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
      } catch (dbErr) {
        console.warn('⚠️ Falha ao buscar store_state no Supabase. Usando fallback padrão:', dbErr.message);
      }

      // 2. Se a URL não for obtida do banco, usa o fallback correspondente
      if (!targetUrl) {
        targetUrl = DEFAULT_WEBHOOKS[type] || DEFAULT_WEBHOOKS.sales;
      }
    }

    if (!targetUrl || !targetUrl.includes('discord')) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Nenhuma URL de Webhook válida configurada para este evento.' }) };
    }

    // Formatar payload para o Discord
    const discordPayload = {
      username: payload?.username || "Blood Store • Sistema Ao Vivo",
      avatar_url: payload?.avatar_url || "https://i.imgur.com/8N40WzN.png",
      ...(contentText ? { content: contentText } : (payload?.content ? { content: payload.content } : {})),
      ...(payload?.embeds ? { embeds: payload.embeds } : {})
    };

    // Fazer requisição de disparo diretamente dos servidores do Netlify para o Discord
    const discordRes = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload)
    });

    if (!discordRes.ok) {
      const errText = await discordRes.text().catch(() => '');
      return { 
        statusCode: discordRes.status, 
        headers, 
        body: JSON.stringify({ error: 'O servidor do Discord rejeitou a notificação.', details: errText }) 
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Notificação enviada e blindada com sucesso!' })
    };
  } catch (err) {
    console.error('❌ Erro no Webhook Proxy:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro interno no Proxy de Webhook.', details: err.message })
    };
  }
};
