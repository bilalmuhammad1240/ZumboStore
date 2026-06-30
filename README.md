# Zumbo Store — Guia de Setup

> Schema Supabase dedicado: **`zumbo`** (projecto partilhado com outras apps)
> Progresso: Sprint 1 e 2 completos (Módulos 1–7) · Sprint 3 em curso (Módulos 8–12)

---

## Pré-requisitos

- Node.js 20+
- npm 10+
- Projecto Supabase existente (partilhado — não criar um novo)
- Conta Vercel (para deploy)

---

## 1. Instalar dependências

```bash
npm install
```

> Se faltar: `npm install tailwindcss-animate`

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

## 3. Aplicar migrations — ORDEM OBRIGATÓRIA

Todas as tabelas da Zumbo Store vivem no schema **`zumbo`**, isolado do `public`
para não colidir com outras aplicações no mesmo projecto Supabase.

As migrations têm dependências entre si — **aplicar sempre por esta ordem**:

| # | Ficheiro | Conteúdo |
|---|----------|----------|
| 1 | `0000_schema.sql`    | Cria o schema `zumbo`, grants, função `set_updated_at()` |
| 2 | `0001_settings.sql`  | `user_profiles` (criada primeiro — é referenciada pelas restantes), `settings`, `company`, `seo_settings` |
| 3 | `0002_auth.sql`      | `user_sessions`, `role_permissions`, função `has_permission()` |
| 4 | `0003_catalog.sql`   | `categories`, `brands`, `attributes`, `attribute_values` |
| 5 | `0004_products.sql`  | `products`, `product_images`, `product_videos`, `product_variants`, etc. |
| 6 | `0005_stock.sql`     | `stock`, `stock_movements`, view `stock_alert` |
| 7 | `0006_suppliers.sql` | `suppliers`, `purchase_orders`, `purchase_items` |
| 8 | `0007_store.sql`     | `banners`, `wishlists`, `carts`, `cart_items`, `search_logs` |

### Via Supabase CLI (recomendado)

```bash
npm install -g supabase
supabase link --project-ref SEU_PROJECT_REF
supabase db push
```

O CLI aplica as migrations em `supabase/migrations/` pela ordem alfabética dos
nomes de ficheiro — por isso o prefixo numérico (`0000`, `0001`…) é importante.

### Via SQL Editor do Dashboard (alternativa)

Executar cada ficheiro **na ordem da tabela acima**, um de cada vez, colando o
conteúdo completo no SQL Editor e correndo com "Run".

> ⚠️ **Erro comum:** `relation "zumbo.user_profiles" does not exist`
> Significa que `0001_settings.sql` não foi corrido por inteiro, ou os
> ficheiros foram aplicados fora de ordem. Dentro do próprio `0001_settings.sql`,
> a tabela `user_profiles` é criada **antes** de `settings`/`company`/`seo_settings`
> porque as políticas RLS destas últimas referenciam `zumbo.user_profiles`.

---

## 4. Expor o schema `zumbo` na API Supabase

**Passo obrigatório** — sem isto, o PostgREST não responde a pedidos para o
schema `zumbo` e todas as chamadas do projecto falham com 404/406.

```
Supabase Dashboard → Settings → API → Exposed schemas
→ adicionar "zumbo" à lista (mantendo "public" se outras apps precisarem dele)
→ Guardar
```

---

## 5. Configurar autenticação no Supabase

```
Authentication → URL Configuration
Site URL:           http://localhost:3000
Redirect URLs:      http://localhost:3000/api/auth/callback
```

Em produção, substituir pelo domínio real (`https://zumbostore.co.mz`).

---

## 6. Gerar tipos TypeScript

```bash
npm run db:types
```

Por defeito o Supabase CLI gera tipos do schema `public`. Para gerar do
schema `zumbo`, ajustar o script em `package.json` ou correr manualmente:

```bash
supabase gen types typescript --schema zumbo --local > src/types/database.types.ts
```

---

## 7. Iniciar em desenvolvimento

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## 8. Criar o primeiro superadmin

Registar a primeira conta via `/auth/register`, depois no Supabase Dashboard
→ SQL Editor:

```sql
UPDATE zumbo.user_profiles
SET role = 'superadmin'
WHERE id = 'UUID_DO_SEU_UTILIZADOR';
```

Depois aceder a `/admin`.

---

## Convenções importantes do projecto

- **Todas as queries passam por `serverDB()` ou `adminDB()`** (`src/lib/supabase/db.ts`),
  que aplicam `.schema("zumbo")` automaticamente. Nunca chamar `createClient()` /
  `createAdminClient()` directamente nos repositórios — sempre via este helper.
- **Buckets de Storage** têm prefixo `zumbo-` (ex: `zumbo-products`, `zumbo-banners`)
  para não colidir com buckets de outras apps no mesmo projecto.
- **RLS em todas as tabelas**, com policies baseadas em `zumbo.has_permission()`
  para regras granulares por role.

---

## Estrutura de ficheiros

```
src/
├── actions/
│   ├── auth.ts
│   └── admin/{settings,catalog,products,stock}.ts
├── app/
│   ├── (admin)/admin/{produtos,categorias,marcas,estoque,configuracoes}/
│   ├── (auth)/auth/{login,register,recuperar-senha,nova-senha,verificar-email}/
│   ├── (customer)/conta/
│   ├── (public)/
│   └── api/auth/callback/
├── components/{admin,common,layout}/
├── lib/
│   ├── supabase/{client,server,middleware,admin,db}.ts
│   ├── utils/{logger,currency,phone,slug,helpers,cn}.ts
│   └── constants/{provinces,payment-methods}.ts
├── repositories/  (catalog, product, stock, settings, supplier, cart)
├── services/      (catalog, product, stock, settings)
├── types/         (auth, settings, catalog, product, stock, supplier, cart)
└── validators/    (auth, settings, catalog)

supabase/migrations/
0000_schema.sql    → cria schema zumbo
0001_settings.sql  → user_profiles, settings, company, seo
0002_auth.sql       → sessions, role_permissions
0003_catalog.sql    → categories, brands, attributes
0004_products.sql   → products, variants, images
0005_stock.sql      → stock, movements
0006_suppliers.sql  → suppliers, purchase orders
0007_store.sql      → banners, wishlists, carts, search_logs
```

---

## Progresso — Roadmap de 36 Módulos

| Sprint | Módulos | Estado |
|--------|---------|--------|
| 1 | 1–2 (Config Base, Autenticação) | ✅ Completo |
| 2 | 3–7 (Categorias, Marcas, Produtos, Variações, Estoque) | ✅ Completo |
| 3 | 8–12 (Fornecedores, Home, Pesquisa, Favoritos, Carrinho) | 🔄 Em curso |
| 4 | 13–18 (Checkout, Pagamentos, Pedidos) | ⏳ Pendente |
| 5 | 19–25 (Conta Cliente, Avaliações, Marketing) | ⏳ Pendente |
| 6 | 26–29 (Logística, Suporte, FAQ) | ⏳ Pendente |
| 7 | 30–31 (Blog, Páginas) | ⏳ Pendente |
| 8 | 32–33 (Analytics, Relatórios) | ⏳ Pendente |
| 9 | 34–36 (Recomendações, Notificações, Mobile) | ⏳ Pendente |
