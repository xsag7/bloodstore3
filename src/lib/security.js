/**
 * Módulo de Cibersegurança & Proteção Anti-Hacking • Blood Store
 * 
 * Este arquivo concentra as defesas do frontend contra ataques comuns:
 * 1. Sanitização de texto contra XSS (Cross-Site Scripting) & HTML Injection
 * 2. Rate Limiting (Anti-Spam / Anti-Flood) contra requisições automatizadas por robôs
 * 3. Validação estrutural de dados antes do salvamento no Supabase
 */

// 1. SANITIZAÇÃO ANTI-XSS (STRIP TAGS & MALICIOUS SCRIPTS)
export const sanitizeString = (input, maxLen = 1000) => {
  if (!input || typeof input !== 'string') return '';
  
  // Corta strings muito longas para evitar buffer overflow ou travamento de UI por megabytes de texto
  let clean = input.slice(0, maxLen);

  // Remove tags perigosas como <script>, <iframe>, <object>, <embed>, <link>, <style>
  clean = clean.replace(/<\/?(script|iframe|object|embed|link|style|meta|base)[^>]*>/gi, '');

  // Remove atributos event handlers do tipo onload=, onerror=, onclick=, onmouseover=
  clean = clean.replace(/\bon[a-z]+\s*=\s*(?:(['"])[^'\1]*\1|[^\s>]+)/gi, '');

  // Remove URLs javascript: ou vbscript: ou data:text/html
  clean = clean.replace(/(javascript|vbscript|data:text\/html):/gi, '');

  // Converte caracteres HTML sensíveis para entidades seguras
  clean = clean
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  return clean.trim();
};

// Remove sanitização de exibição em inputs normais ou reverte entidades se necessário em campos confiáveis,
// mas para exibição pura em JSX no React, o próprio React faz escaping por padrão a menos que se use dangerouslySetInnerHTML.
// Nossa sanitização protege contra salvamento perigoso no banco de dados e APIs externas.

// 2. RATE LIMITING (PROTEÇÃO CONTRA BOT FLOODING & DOS NO CLIENTE)
const lastActionTimes = {
  orderCreation: 0,
  chatMessage: 0,
  loginAttempt: 0
};

/**
 * Verifica se o usuário pode criar um novo pedido (Cooldown de 15 segundos entre pedidos no mesmo navegador)
 */
export const canSubmitOrder = () => {
  const now = Date.now();
  const cooldownMs = 15000; // 15 segundos de intervalo entre pedidos
  if (now - lastActionTimes.orderCreation < cooldownMs) {
    const remaining = Math.ceil((cooldownMs - (now - lastActionTimes.orderCreation)) / 1000);
    return {
      allowed: false,
      reason: `⏳ Proteção Anti-Spam ativa: Aguarde ${remaining}s antes de registrar outro pedido.`
    };
  }
  lastActionTimes.orderCreation = now;
  return { allowed: true };
};

/**
 * Verifica se o usuário pode enviar uma mensagem no chat ao vivo (Cooldown de 2 segundos)
 */
export const canSendMessage = () => {
  const now = Date.now();
  const cooldownMs = 2000; // 2 segundos entre mensagens
  if (now - lastActionTimes.chatMessage < cooldownMs) {
    return {
      allowed: false,
      reason: `⏳ Proteção Anti-Spam: Não envie mensagens tão rápido. Aguarde alguns segundos.`
    };
  }
  lastActionTimes.chatMessage = now;
  return { allowed: true };
};

/**
 * Verifica tentativa de login de Staff para mitigar Brute Force (Cooldown após falhas)
 */
export const recordLoginAttempt = () => {
  lastActionTimes.loginAttempt = Date.now();
};

export const canAttemptLogin = () => {
  const now = Date.now();
  const cooldownMs = 1000; // 1 segundo mínimo entre tentativas
  if (now - lastActionTimes.loginAttempt < cooldownMs) {
    return false;
  }
  return true;
};

// 3. VALIDAÇÃO RIGOROSA DO PAYLOAD DO PEDIDO
export const validateOrderPayload = (order) => {
  if (!order || typeof order !== 'object') {
    return { valid: false, error: 'Payload de pedido inválido ou corrompido.' };
  }

  if (!order.product || !order.product.name) {
    return { valid: false, error: 'O produto associado ao pedido é obrigatório.' };
  }

  if (!order.contactValue || typeof order.contactValue !== 'string' || order.contactValue.trim().length === 0) {
    return { valid: false, error: 'O meio de contato/identificação do cliente é obrigatório.' };
  }

  if (order.contactValue.length > 200) {
    return { valid: false, error: 'A identificação excede o tamanho máximo permitido (200 caracteres).' };
  }

  return { valid: true };
};
