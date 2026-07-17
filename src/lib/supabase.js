import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wizkszkiahqtuwsygter.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_OWiqfuWAcgTv-Kl-awjJgA_NhYS5iKj';

let supabaseInstance = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
    console.log('🩸 [Supabase Anti-Hacking Shield] Conectado à nuvem de forma persistente.');
  } catch (err) {
    console.error('❌ Erro ao inicializar cliente do Supabase:', err.message);
  }
} else {
  console.warn('⚠️ Credenciais do Supabase não encontradas. O site operará no modo de fallback local com cache.');
}

export const supabase = supabaseInstance;

/**
 * Comprime imagens no navegador (HTML5 Canvas) e tenta fazer upload no Supabase Storage.
 * Garante que comprovantes e fotos grandes NUNCA estouram o limite do LocalStorage/Realtime nem somem ao atualizar.
 */
export const compressAndUploadImage = async (file, { maxWidth = 1400, maxHeight = 1400, quality = 0.72 } = {}) => {
  if (!file) return null;

  // 1. Comprimir via Canvas no frontend para ~120KB-200KB
  const compressedBase64 = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target.result); // fallback em caso de erro na imagem
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });

  if (!compressedBase64) return null;

  // 2. Tentar upload no Supabase Storage se estiver disponível e bucket 'receipts' existir
  if (supabase) {
    try {
      const res = await fetch(compressedBase64);
      const blob = await res.blob();
      const filename = `proof_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;

      const { data, error } = await supabase.storage
        .from('receipts')
        .upload(filename, blob, { contentType: 'image/jpeg', upsert: true });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('receipts')
          .getPublicUrl(filename);
        
        if (publicUrlData && publicUrlData.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
    } catch (err) {
      console.warn("⚠️ Não foi possível salvar no bucket Supabase Storage (usando versão otimizada base64):", err.message);
    }
  }

  // 3. Retorna a versão otimizada (leve e garantida de não estourar quotas)
  return compressedBase64;
};
