# Preparação da entrega — 15/10/2026

## Concluído

- Supabase de produção ativo e saudável; nenhuma tabela pública sem RLS.
- MFA passa a ser obrigatório para abrir o painel. Políticas do banco exigem `aal2` para proprietário/editor acessarem dados internos e alterarem conteúdo. O próprio perfil continua legível para permitir a configuração inicial do autenticador.
- Gestão de usuários na Edge Function também exige JWT validado com `aal2`; não depende apenas da interface. Biblioteca da função fixada em 2.57.4 e código versionado em `packages/db/functions/admin-users`.
- Atualização de sessão no proxy Next.js, com cookies de resposta e cache privado. `/` e `/mfa` redirecionam visitantes para `/login`.
- Limites aplicados no banco aos orçamentos do site: até 5 por telefone em 15 minutos e 500 no total em uma hora, com trava transacional. A API traduz o limite em HTTP 429 e mantém alternativa WhatsApp. Tentativas anônimas de inserir status interno e campos fora dos limites são rejeitadas.
- Migrações aplicadas: `20261015_lead_abuse_protection.sql` e `20261015_admin_mfa.sql`.
- Builds do site e painel aprovados, incluindo TypeScript. Auditoria de 72 dependências de produção sem vulnerabilidades conhecidas.
- Testes reais com rollback: quinto orçamento aceito, sexto bloqueado; inserção anônima válida aceita, status forjado rejeitado; sessão `aal1` sem acesso a leads, `aal2` de owner autorizada; leitura do próprio perfil preservada para configuração inicial. Nenhum registro de teste persistiu.
- Conferência HTTP local do painel: `/` e `/mfa` retornam 307 para login; `/login` retorna 200; cache `private, no-store`, headers de segurança e noindex presentes.
- Nenhuma mensagem, convite ou e-mail enviado; nenhuma senha ou credencial pessoal alterada.

## Domínio e contatos: descoberta importante

`cervejariarodada.com.br` já resolve por DNS e aponta para o site institucional antigo (Wix). `www` também está configurado. Há registros MX do Google. WhatsApp e e-mail divulgados nesse site coincidem com os cadastrados no projeto.

Isso confirma configuração pública e consistência, mas não prova titularidade do domínio nem recebimento de mensagens na caixa específica. Não é necessário comprar esse endereço novamente. O responsável pelo domínio precisa autorizar e fornecer acesso para a mudança de destino; preservar os MX e os demais registros de e-mail.

Fonte consultada: [site institucional](https://www.cervejariarodada.com.br/). Nenhuma mudança de DNS foi executada.

## Etapas que exigem o responsável

### 1. Primeiro acesso com autenticador

1. Abrir o painel administrativo e entrar com a conta existente.
2. Na tela de segunda etapa, clicar em **Configurar autenticador**.
3. No celular, abrir um aplicativo autenticador, adicionar conta pelo QR Code e digitar o código de 6 dígitos no painel.
4. Clicar em **Verificar e entrar**.
5. Testar uma edição de produto e uma foto autorizada antes de entregar a conta ao cliente.

Essa configuração é pessoal; o agente não criou nem guardou o segredo do autenticador. O responsável deve definir a recuperação segura da conta, incluindo acesso ao Supabase da organização. O painel agora bloqueia dados internos até completar MFA.

### 2. Textos de privacidade e atendimento

Dois rascunhos locais foram preparados para revisão. Não foram publicados nem gravados no banco: a revisão automática rejeitou a ação por exigir confirmação direta dos dados identificadores e das declarações pela empresa. O responsável precisa confirmar identificação, contatos, finalidade, retenção e procedimento de atendimento aos titulares e aprovar o texto antes da publicação.

As páginas legais continuam sem conteúdo publicado. Não foi declarado cumprimento integral da LGPD.

### 3. Backup e restauração

Foi tentado acesso a [Database → Backups](https://supabase.com/dashboard/project/qkxykrgaumgnalpjeocx/database/backups/scheduled); o navegador solicitou login. O conector disponível não expõe a lista de backups. Portanto, backup, retenção e restauração continuam **não confirmados**.

1. Responsável entrar no Supabase e selecionar o projeto **cervejaria rodada**.
2. Abrir **Database → Backups** e verificar disponibilidade, última execução e retenção do plano.
3. Se não houver backup disponível, decidir entre exportação segura e funcionalidade do plano, sem contratar nada automaticamente.
4. Testar restauração em ambiente separado; não restaurar sobre a produção para um simples teste.
5. Incluir cópia dos arquivos do Storage: o backup do banco não inclui os objetos armazenados nos buckets.

Referência: [backups do Supabase](https://supabase.com/docs/guides/platform/backups).

### 4. Conectar o domínio à Vercel

1. No projeto público da Vercel, abrir **Settings → Domains** e adicionar o domínio escolhido pelo responsável.
2. No provedor DNS, alterar apenas os registros indicados pela Vercel para o site, preservando os registros de e-mail.
3. Esperar a validação e a emissão do HTTPS.
4. Definir `NEXT_PUBLIC_SITE_URL` com o endereço HTTPS principal e fazer novo deploy.
5. Conferir site, redirecionamento entre www/raiz, sitemap e envio de formulário.

### 5. Alertas e verificações restantes

- Supabase sinaliza proteção contra senhas vazadas desativada; o painel de configuração exige login e disponibilidade depende do plano. Não foi habilitada sem acesso nem contratado recurso pago. [Referência](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).
- O aviso de função `is_owner()` executável por usuários autenticados é intencional: auxilia RLS, verifica `auth.uid()` e `aal2` e retorna somente um booleano. Não é executável por anon. [Advisor](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable).
- Não foi homologado recebimento de e-mail/WhatsApp por um atendente. Notificação automática por e-mail depende de provedor/remetente/variáveis e autorização para teste de envio.
- CAPTCHA, monitoramento e teste de carga não foram implantados. Os limites de banco reduzem abuso, mas não garantem proteção contra toda forma de ataque ou spam.
- Login e upload autenticados pela interface aguardam configuração do autenticador pelo responsável; não foram simulados como se estivessem aprovados.

Documentação usada na implementação: [SSR e cookies](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs), [MFA e políticas de acesso](https://supabase.com/docs/guides/auth/auth-mfa).
