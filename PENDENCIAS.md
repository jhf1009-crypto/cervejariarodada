# Pendências

Nada desta lista deve ser inventado ou publicado sem confirmação.

## Empresa
- [ ] Razão social oficial
- [ ] CNPJ
- [ ] Registro no MAPA
- [ ] Endereço completo e coordenadas
- [ ] Horários
- [ ] Área de entrega, prazos e taxas
- [ ] Formas de pagamento
- [ ] Texto oficial da história
- [ ] Link oficial do Google Meu Negócio

## Produtos
- [ ] Preços e promoções
- [ ] ABV e IBU
- [ ] Ingredientes
- [ ] Notas de sabor/aroma
- [ ] Temperatura de serviço
- [ ] Harmonizações
- [ ] Disponibilidade real
- [ ] Fotos oficiais e respectivos textos alternativos

## Eventos
- [ ] Preços e regras dos barris de 30 L e 50 L
- [ ] Copos estimados por tamanho
- [ ] Caução/devolução
- [ ] O que está incluso e o que o cliente providencia
- [ ] Fotos reais/autorizadas
- [ ] Números reais para qualquer contador

## Confiança e legal
- [ ] Nomes, cargos e fotos da equipe
- [ ] Depoimentos reais com origem
- [ ] Política de privacidade
- [ ] Termos de uso
- [ ] Texto final de cookies/LGPD

## Infraestrutura
- [ ] Criar Supabase de desenvolvimento e produção
- [ ] Criar buckets público/privado e políticas de Storage
- [ ] Habilitar/documentar backups
- [ ] Criar projeto Vercel do site e projeto Vercel do admin
- [ ] Configurar www.cervejariarodada.com.br
- [ ] Configurar admin.cervejariarodada.com.br
- [ ] Configurar variáveis e segredo de revalidação
- [ ] Criar primeiro owner e exigir MFA


## Admin — fatia 1
- [ ] Aplicar `packages/db/schema.sql` no projeto Supabase da Cervejaria Rodada.
- [ ] Configurar `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` e `SUPABASE_SECRET_KEY` no projeto Vercel do admin.
- [ ] Configurar `ADMIN_APP_URL=https://admin.cervejariarodada.com.br`.
- [ ] Criar projeto Vercel separado com Root Directory `apps/admin`.
- [ ] Apontar DNS de `admin.cervejariarodada.com.br` para a Vercel.
- [ ] Adicionar `https://admin.cervejariarodada.com.br/auth/callback` nas Redirect URLs do Supabase Auth.
- [ ] Configurar SMTP de produção no Supabase para convites e recuperação.
- [ ] Criar primeiro owner no Supabase da Rodada e inserir o perfil `owner`.
- [ ] Validar login, MFA, convite de editor, troca de papel, desativação, recuperação e logout contra o Supabase real.
