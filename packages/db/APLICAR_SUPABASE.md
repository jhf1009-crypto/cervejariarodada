# Aplicar o Supabase da Cervejaria Rodada

> **Não use o projeto Fernandes Barbearia.** Crie um projeto novo e exclusivo da Cervejaria Rodada.

## Opção A — Supabase CLI

1. Instale a CLI do Supabase.
2. Na raiz do repositório, entre na conta:
   `supabase login`
3. Vincule **somente** o novo projeto da Rodada:
   `supabase link --project-ref SEU_PROJECT_REF_DA_RODADA`
4. Confira o projeto mostrado pela CLI antes de continuar.
5. Aplique as migrations:
   `supabase db push`
6. Abra o SQL Editor do novo projeto e execute `packages/db/supabase/seed.sql` uma única vez.
7. Crie o primeiro usuário administrativo manualmente no Auth e adicione o UUID dele em `public.admin_profiles` com role `owner`.
8. Ative MFA/TOTP para esse owner.

## Opção B — SQL Editor

No SQL Editor do **novo projeto Rodada**, execute nesta ordem:

1. `packages/db/supabase/migrations/20261004210000_initial_schema.sql`
2. `packages/db/supabase/migrations/20261004211000_storage.sql`
3. `packages/db/supabase/seed.sql`

O seed não preenche preço, ABV, IBU, CNPJ, endereço ou outros dados desconhecidos.

## Variáveis do site público (Vercel)

Configure apenas:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

A chave pública é usada com RLS. **Nunca** configure `service_role`, secret key ou equivalente em variável exposta ao navegador.

## Variáveis do admin

No projeto Vercel separado do admin:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- chave secreta apenas se uma operação administrativa server-side realmente precisar dela

Qualquer secret/service-role deve ficar somente no servidor do admin e nunca em componente client-side.

## Buckets

A migration cria:

- `public-media`: imagens publicadas, leitura pública; escrita somente por owner/editor.
- `originals`: originais privados; acesso somente por owner/editor.

## Verificação mínima depois de aplicar

- Abra Table Editor e confirme as tabelas.
- Em Authentication, confirme que não existe cadastro público habilitado no fluxo do admin.
- Em Storage, confirme os dois buckets.
- Use o SQL Editor para verificar que RLS está habilitado nas tabelas públicas.
- Só depois configure as chaves no projeto Vercel do site.
