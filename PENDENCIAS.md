# Pendências

Revisado em 12/10/2026. Ver docs/auditoria-entrega-2026-10-12.md para testes e correções. Hospedagem Vercel e Supabase de produção já funcionam; entrega definitiva ainda depende dos itens comerciais, legais, MFA e backup abaixo.

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
- [x] Supabase de produção configurado e RLS verificado
- [ ] Separar ambiente Supabase de desenvolvimento, se necessário
- [x] Criar buckets público/privado e políticas de Storage
- [ ] Habilitar/documentar backups
- [x] Criar projeto Vercel do site e projeto Vercel do admin
- [ ] Configurar www.cervejariarodada.com.br
- [ ] Configurar admin.cervejariarodada.com.br
- [ ] Configurar variáveis e segredo de revalidação
- [x] Criar primeiro owner
- [ ] Responsável ativar MFA e homologar seu acesso
