-- ==============================================================================
-- SCRIPT DE INICIALIZAÇÃO E BLINDAGEM DE BANCO DE DADOS • BLOOD STORE (SUPABASE)
-- ==============================================================================
-- Copie todo o conteúdo abaixo e cole no SQL Editor do painel do seu Supabase.
-- Clique em "Run" e o banco estará 100% montado e blindado para a Blood Store!
-- ==============================================================================

-- 1. Criação da tabela principal que armazena todo o estado sincronizado da loja
CREATE TABLE IF NOT EXISTS public.store_state (
  id TEXT PRIMARY KEY DEFAULT 'global_state',
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  products JSONB NOT NULL DEFAULT '[]'::jsonb,
  terms JSONB NOT NULL DEFAULT '[]'::jsonb,
  orders JSONB NOT NULL DEFAULT '[]'::jsonb,
  staff_users JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Habilitar Row Level Security (RLS) para proteção cibernética contra acessos não autorizados
ALTER TABLE public.store_state ENABLE ROW LEVEL SECURITY;

-- 3. Criar política permitindo que a aplicação frontend (anon / autenticados) leia o estado global
DROP POLICY IF EXISTS "Allow public read access to store_state" ON public.store_state;
CREATE POLICY "Allow public read access to store_state"
ON public.store_state
FOR SELECT
USING (true);

-- 4. Criar política permitindo inserção e atualização (upsert) do estado global com a chave anon
DROP POLICY IF EXISTS "Allow public upsert access to store_state" ON public.store_state;
CREATE POLICY "Allow public upsert access to store_state"
ON public.store_state
FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update access to store_state" ON public.store_state;
CREATE POLICY "Allow public update access to store_state"
ON public.store_state
FOR UPDATE
USING (true)
WITH CHECK (true);

-- 5. Inserir registro inicial padrão caso a tabela esteja completamente vazia
INSERT INTO public.store_state (id, config, products, terms, orders, staff_users)
VALUES (
  'global_state',
  '{
    "storeName": "BLOOD STORE",
    "slogan": "Sua evolução começa aqui.",
    "discordInvite": "https://discord.gg/Gvbg5WYPBP",
    "webhookUrl": "",
    "pixKey": "00020126580014br.gov.bcb.pix0136BLOOD-STORE-PIX-EXCLUSIVE5204000053039865802BR5911BLOOD STORE6009SAO PAULO62070503***63041A2B",
    "logoUrl": "/fotos e videos/Bloodstore.png",
    "bannerVideoUrl": "/fotos e videos/BloodstoreLogo2.png",
    "qrCodeUrl": "/fotos e videos/qrcode.png"
  }'::jsonb,
  '[
    {
      "id": "p1",
      "slug": "robux (r0b6x)",
      "name": "Robux (r0b6x)",
      "priceText": "R$ 29,90",
      "priceValue": 29.9,
      "image": "/fotos e videos/robux.png",
      "icon": "fa-solid fa-coins",
      "pixKey": "",
      "qrCodeUrl": "",
      "benefits": [
        "Entrega rápida via Gamepass ou Grupo",
        "Sem risco de punição ou banimento",
        "Taxa de 30% da plataforma coberta"
      ]
    },
    {
      "id": "p2",
      "slug": "conta-18v (c0nta-18v)",
      "name": "Conta 18v (c0nta-18v)",
      "priceText": "R$ 49,90",
      "priceValue": 49.9,
      "image": "/fotos e videos/conta18v.png",
      "icon": "fa-solid fa-user-shield",
      "pixKey": "",
      "qrCodeUrl": "",
      "benefits": [
        "Conta verificada 18 anos de registro",
        "Full Acesso (Altere e-mail e senha)",
        "Histórico limpo e raridade elevada"
      ]
    },
    {
      "id": "p3",
      "slug": "j0g0s-st34m",
      "name": "Jogos Steam (j0g0s-st34m)",
      "priceText": "R$ 34,90",
      "priceValue": 34.9,
      "image": "/fotos e videos/steam.png",
      "icon": "fa-brands fa-steam",
      "pixKey": "",
      "qrCodeUrl": "",
      "benefits": [
        "Chaves originais (CD-Keys) ou Gift",
        "Ativação oficial em sua conta Steam",
        "Jogos AAA e Indies em promoção"
      ]
    },
    {
      "id": "p4",
      "slug": "murd3r-myst3ry",
      "name": "Murder Mystery 2 (murd3r-myst3ry)",
      "priceText": "R$ 19,90",
      "priceValue": 19.9,
      "image": "/fotos e videos/murder.png",
      "icon": "fa-solid fa-wand-magic-sparkles",
      "pixKey": "",
      "qrCodeUrl": "",
      "benefits": [
        "Godlys, Ancients e Chromas mais raras",
        "Entrega direta via Trade in-game",
        "Itens 100% limpos e legítimos"
      ]
    },
    {
      "id": "p5",
      "slug": "bloxfru1ts-g0d-human",
      "name": "Blox Fruits - God Human + Cursed Dual Katana",
      "priceText": "R$ 39,90",
      "priceValue": 39.9,
      "image": "/fotos e videos/blox.png",
      "icon": "fa-solid fa-khanda",
      "pixKey": "",
      "qrCodeUrl": "",
      "benefits": [
        "Conta nível máximo (Max Level 2550)",
        "God Human + Cursed Dual Katana e Soul Guitar",
        "Fruta mítica no inventário ou comida"
      ]
    },
    {
      "id": "p6",
      "slug": "d1sc0rd-n1tr0",
      "name": "Discord Nitro Gaming (3 Meses + 2 Boosts)",
      "priceText": "R$ 14,90",
      "priceValue": 14.9,
      "image": "/fotos e videos/discord.png",
      "icon": "fa-brands fa-discord",
      "pixKey": "",
      "qrCodeUrl": "",
      "benefits": [
        "Link de ativação oficial e instantâneo",
        "Acesso a 2 Boosts para seu servidor preferido",
        "Garantia contra quedas ou revogações"
      ]
    }
  ]'::jsonb,
  '[
    {
      "title": "1. Garantia de Entrega",
      "content": "Todos os produtos adquiridos na Blood Store possuem garantia integral de funcionamento. Caso ocorra qualquer problema na entrega ou ativação, nossa equipe de suporte garante a substituição ou reembolso."
    },
    {
      "title": "2. Prazo e Horários de Atendimento",
      "content": "Nosso sistema de atendimento opera em tempo real através da nossa comunidade no Discord ou diretamente por este painel. O prazo médio para entrega de contas e itens virtuais é de até 30 minutos após a confirmação do pagamento via PIX."
    },
    {
      "title": "3. Política de Reembolso e Cancelamento",
      "content": "Por se tratarem de produtos digitais (contas full acesso, gamepasses e chaves de ativação), uma vez que as credenciais são enviadas e alteradas pelo cliente, não é possível realizar o cancelamento ou devolução, salvo em casos onde o produto apresente defeito comprovado no ato do recebimento."
    }
  ]'::jsonb,
  '[]'::jsonb,
  '[
    {
      "id": "owner-xsag",
      "username": "xsag",
      "password": "penismurcho",
      "role": "owner",
      "name": "Dono Supremo (xsag)",
      "permissions": {
        "manageStaff": true,
        "manageProducts": true,
        "manageOrders": true,
        "manageConfig": true,
        "manageTerms": true
      }
    }
  ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 6. Configurar Replica Identity para FULL para garantir que o Supabase Realtime envie todos os dados no payload de atualização
ALTER TABLE public.store_state REPLICA IDENTITY FULL;

-- 7. Habilitar a tabela store_state na publicação do Supabase Realtime
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_rel pr
    JOIN pg_publication p ON p.oid = pr.prpubid
    JOIN pg_class c ON c.oid = pr.prrelid
    WHERE p.pubname = 'supabase_realtime' AND c.relname = 'store_state'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.store_state;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'A publicação supabase_realtime pode não existir ou já conter a tabela.';
END $$;
