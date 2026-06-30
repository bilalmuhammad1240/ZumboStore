# Zumbo Store — Guia de Setup

> Sprint 1 completo: Módulos 1 (Configuração Base) + 2 (Autenticação)

---

## Pré-requisitos

- Node.js 20+
- npm 10+
- Conta Supabase (projeto criado)
- Conta Vercel (para deploy)

---

## 1. Instalar dependências

```bash
npm install
```

> **Nota:** O `tailwindcss-animate` é necessário para as animações Shadcn.
> Se não estiver no package.json, adicionar: `npm install tailwindcss-animate`

---

## 2. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencher em `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 3. Aplicar migrations no Supabase

### Via Supabase CLI (recomendado)

```bash
# Instalar CLI (se não tiver)
npm install -g supabase

# Ligar ao projecto remoto
supabase link --project-ref SEU_PROJECT_REF

# Aplicar migrations
supabase db push
```

### Alternativa: SQL Editor no Dashboard

1. Abrir Supabase Dashboard → SQL Editor
2. Executar `supabase/migrations/0001_settings.sql`
3. Executar `supabase/migrations/0002_auth.sql`

---

## 4. Configurar autenticação no Supabase

No Dashboard Supabase → Authentication → URL Configuration:

```
Site URL:           http://localhost:3000
Redirect URLs:      http://localhost:3000/api/auth/callback
```

Em produção substituir pelo domínio real (`https://zumbostore.co.mz`).

---

## 5. Gerar tipos TypeScript

```bash
npm run db:types
```

Substitui o stub `src/types/database.types.ts` pelos tipos reais do schema.

---

## 6. Iniciar em desenvolvimento

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## 7. Criar o primeiro superadmin

Após registar a primeira conta via `/auth/register`, actualizar o role
directamente no Supabase Dashboard → Table Editor → `user_profiles`:

```sql
UPDATE public.user_profiles
SET role = 'superadmin'
WHERE id = 'UUID_DO_SEU_UTILIZADOR';
```

Depois aceder a `/admin`.

---

## Estrutura de ficheiros — Sprint 1

```
src/
├── actions/
│   ├── auth.ts                    # Login, Register, Logout, Reset
│   └── admin/settings.ts          # CRUD configurações admin
├── app/
│   ├── (admin)/
│   │   ├── layout.tsx             # Guard requireAdmin()
│   │   └── admin/
│   │       ├── page.tsx           # Dashboard executivo
│   │       └── configuracoes/     # 5 páginas de configurações
│   ├── (auth)/
│   │   ├── layout.tsx             # Card centrado com logo
│   │   └── auth/
│   │       ├── login/             # Entrar
│   │       ├── register/          # Criar conta
│   │       ├── recuperar-senha/   # Forgot password
│   │       ├── nova-senha/        # Reset password
│   │       └── verificar-email/   # Confirmar email
│   ├── (customer)/
│   │   ├── layout.tsx             # Sidebar conta cliente
│   │   └── conta/page.tsx         # Dashboard cliente
│   ├── (public)/
│   │   ├── layout.tsx
│   │   └── page.tsx               # Home (placeholder)
│   ├── api/auth/callback/         # OAuth callback Supabase
│   ├── globals.css                # CSS variables + Tailwind
│   ├── layout.tsx                 # Root layout (fonts, Toaster)
│   └── not-found.tsx
├── components/
│   ├── common/FormMessage.tsx
│   └── layout/
│       ├── AdminHeader.tsx
│       └── AdminSidebar.tsx
├── lib/
│   ├── supabase/                  # client, server, middleware, admin
│   ├── utils/                     # logger, currency, phone, slug, helpers, cn
│   └── constants/                 # provinces, payment-methods
├── repositories/settings.repository.ts
├── services/settings.service.ts
├── types/                         # auth.types, settings.types, database.types
└── validators/                    # auth.validator, settings.validator
supabase/migrations/
├── 0001_settings.sql              # settings, company, seo_settings, user_profiles
└── 0002_auth.sql                  # user_sessions, role_permissions, has_permission()
```

---

## Próximo: Sprint 2 — Módulos 3, 4, 5, 6, 7

- **Módulo 3:** Categorias com hierarquia infinita + CRUD admin
- **Módulo 4:** Marcas / Fabricantes + CRUD admin
- **Módulo 5:** Produtos (CRUD completo, galeria, SEO)
- **Módulo 6:** Variações (cor, tamanho, capacidade)
- **Módulo 7:** Estoque (entradas, saídas, ajustes, histórico)
