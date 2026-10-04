# AGENTS.md — Cervejaria Rodada

## Regra de ouro
Não invente preços, CNPJ, endereço, horários, registro MAPA, ABV, IBU, pessoas, avaliações, eventos ou fotos. Campo desconhecido é NULL e bloco sem dado não aparece.

## Arquitetura
- Site público: Next.js/TypeScript. Durante a fase de compatibilidade permanece na raiz para preservar o deploy atual; destino final: `apps/site`.
- Admin: `apps/admin`, deploy e variáveis separados.
- Banco: Supabase Postgres + Auth + Storage, modelado em `packages/db`.
- Identidade: azul-marinho #031a30 e linguagem atual da Rodada.

## Regras técnicas
- Segredos só em variáveis de ambiente.
- Nunca expor secret/service-role no cliente.
- RLS em toda tabela exposta.
- Conteúdo público somente quando publicado/aprovado.
- Admin sem cadastro público, com papéis owner/editor/viewer.
- Reduced motion obrigatório para animações.
- Conteúdo essencial sempre presente no HTML.
- Alterações devem seguir a skill correspondente em `skills/<nome>/SKILL.md`.

## Comandos
- `pnpm dev`: site legado/compatibilidade na raiz.
- `pnpm dev:admin`: admin separado.
- `pnpm build`: build do site atual.
- `pnpm build:all`: builds de workspaces quando a migração física do site terminar.

## Antes de release
Executar release-checklist, security-review, seo-audit e a11y-audit. Não declarar Lighthouse, testes ou auditoria como aprovados sem execução real.
