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
