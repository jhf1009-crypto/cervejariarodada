# Auditoria de entrega — 12/10/2026

## Parecer

Os fluxos públicos verificados funcionam como catálogo e captação de orçamentos, com atendimento pelo WhatsApp. Não é uma loja com pagamento online. Há hospedagem de produção na Vercel; domínio próprio é uma etapa separada.

A entrega definitiva ainda depende de textos legais aprovados, confirmação dos dados comerciais e operacionais, ativação do autenticador pelo administrador e confirmação de backup/restauração. Não foi declarado que todos os cenários possíveis foram testados.

## Correções realizadas

- Home, catálogo, páginas individuais e sitemap consultam os mesmos produtos publicados no Supabase. Conteúdo essencial e formulário presentes no HTML inicial. Produtos despublicados não ganham páginas de detalhe válidas. Links usam os slugs do painel.
- Canonical, robots e sitemap usam o endereço Vercel atual. `NEXT_PUBLIC_SITE_URL` permite trocar o endereço quando houver domínio próprio. Imagens Open Graph e Twitter de 1200 × 630.
- Telefone, calendário, e-mail, convidados, tamanho de requisição, origem e honeypot validados no formulário. Limite básico de reenvio e mapa de tentativas limitado em memória. Isso não equivale a um limitador distribuído; acesso direto ao endpoint de inserção do Supabase ainda exige proteção adicional contra spam em cenários de alto volume.
- Formulário e detalhes usam o WhatsApp configurado no painel. Pedido permite cidade manual quando a consulta ViaCEP não funciona; consultas têm timeout e respostas antigas são ignoradas.
- Contraste do botão secundário do formulário, labels de login e MFA, validação de foto antes de salvar produto, headers públicos de segurança e remoção de razão social não confirmada.
- Perfil visualizador pode consultar conteúdo público sem editar. Dados de clientes continuam restritos a proprietário/editor. Editor não recebe módulos exclusivos do proprietário. Sessões com fator MFA já verificado precisam completar a segunda etapa antes de abrir o painel.
- Revogada execução pública de duas funções internas de triggers. Política de imagens públicas exige que o produto também esteja publicado. As duas migrações aplicadas estão em `packages/db/migrations`.
- Gerado `pnpm-lock.yaml` e ajustados os comandos de verificação para pnpm.

## Testes executados

- Builds reais do site e painel, com validação TypeScript: aprovados. Build administrativo repetido isoladamente após uma falha local de memória ao executar builds simultâneos.
- Script `scripts/audit-site.mjs`: 74 verificações aprovadas no build final, incluindo 15 imagens locais, páginas, H1/canonical, sitemap, headers, 404, validações, honeypot, limite de reenvio e inserção real no banco. Resultado: `auditoria-http-2026-10-12.json`.
- Envio completo do formulário pela interface: feedback de sucesso e limpeza dos campos. Todos os registros com o marcador exclusivo de auditoria foram removidos; nenhum orçamento real foi alterado. Nenhuma mensagem WhatsApp ou notificação de e-mail foi enviada.
- Pedido pela interface: seleção de Lager, aumento para 2 fardos/12 unidades, cidade manual e abertura do rascunho WhatsApp com esses dados.
- Navegação mobile, âncoras e fechamento do menu; confirmação de idade e opção de armazenamento essencial; calculadora por teclado com resultado de 35 L no padrão e 700 L para 1000 convidados/70%/4h/moderado.
- Larguras 320, 390, 768 e 1440 verificadas no navegador; sem overflow horizontal nas medições de 320, 768 e 1440. Imagens carregadas e console sem erros na versão final local.
- Telefone com letras bloqueado pelo navegador; telefone formatado válido aceito. Botão WhatsApp com texto branco em fundo azul-marinho confirmado por estilos computados.
- Painel sem sessão redireciona para `/login`. Nenhuma credencial foi solicitada ou alterada. Não foram realizados convites, recuperação de senha ou testes de edição/upload autenticados pela interface.
- SQL com transações revertidas: visitante não lê orçamentos nem rascunhos e não edita produtos; viewer não edita nem lê leads; editor passa no teste de autorização de conteúdo sem privilégio de owner. As 15 tabelas públicas têm RLS; existe um proprietário e nenhum fator MFA verificado.
- `pnpm audit --prod --json`: nenhuma vulnerabilidade conhecida reportada, 72 dependências contabilizadas.
- Lighthouse 13.5.0, mobile simulado: produção anterior 88/100/100/100; build final local 79/100/100/100 (desempenho/acessibilidade/boas práticas/SEO). No local: LCP 3,8 s, TBT 280 ms, CLS 0,014, resposta inicial 530 ms. As notas variam com ambiente; não são garantia de WCAG ou de desempenho real de todos os usuários.
- Lint não configurado no projeto. Leitor de tela, testes de carga, restauração de backup e recebimento real de e-mail/WhatsApp não homologados.

## O que o responsável precisa concluir

1. **Informações legais:** fornecer e aprovar política de privacidade, termos e dados oficiais da empresa. Depois: painel → Páginas legais → cadastrar → publicar. Não há páginas legais publicadas atualmente. Não foram inventados textos aprovados ou dados fiscais.
2. **Autenticador:** entrar no painel → Configurar autenticação em duas etapas → ler o QR Code em um aplicativo autenticador → digitar o código → Verificar. Essa etapa envolve uma credencial pessoal e deve ser feita pelo administrador. A proteção não foi declarada obrigatória no banco enquanto o responsável não concluir a ativação.
3. **Contato e operação:** confirmar que `(77) 9814-0440` é o WhatsApp correto e que `contato@cervejariarodada.com.br` recebe e-mails; confirmar cidades atendidas, prazos, taxas, disponibilidade e regras dos barris. O link WhatsApp abriu corretamente, mas isso não confirma recebimento por um atendente.
4. **Backup:** responsável pelo Supabase deve confirmar rotina, retenção e executar teste de restauração. O histórico Git não é backup dos dados. Não foi contratada funcionalidade paga.
5. **Domínio próprio, quando adquirido:** conectar na Vercel, ajustar DNS e `NEXT_PUBLIC_SITE_URL`, fazer novo deploy e verificar canonical/sitemap. O domínio Vercel atual já permite apresentação e uso.
6. **E-mail automático, se desejado:** produção tem apenas as duas variáveis públicas do Supabase. Para notificações, configurar provedor/remetente e as variáveis `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `LEADS_NOTIFICATION_EMAIL`; homologar recebimento com autorização explícita para o envio. A gravação de orçamentos funciona sem e-mail.

## Segurança e limites

A revisão automática rejeitou a proposta de ampliar o papel viewer para leitura de leads e dados internos por falta de autorização específica para esse acesso. Nenhuma política dessa proposta foi aplicada. A solução entregue usa somente as permissões públicas existentes para viewer.

O advisor mantém aviso sobre `is_owner()`: a função é usada intencionalmente pelas políticas, verifica `auth.uid()` e retorna somente um booleano. Também há aviso de proteção contra senhas vazadas desativada; configuração e disponibilidade no plano precisam ser confirmadas pelo responsável. Referências: [advisor de funções](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable) e [proteção de senhas](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

Publicação direta na main autorizada pelo usuário. Commit anterior disponível para reversão do código: `078bd81174e258ffbbd741761a93d2a6949e9363`. As migrações reduzem acesso público e não removem dados comerciais.
