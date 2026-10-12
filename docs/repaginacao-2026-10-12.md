# Repaginação do site público — 12/10/2026

## Direção visual e fontes

Alvo: identidade existente da Rodada, com azul-marinho #031a30, dourado nos pontos de ação, Barlow Condensed nos títulos e Manrope no corpo. As imagens e o logo vieram do próprio repositório. Não foram criados preços, avaliações, pessoas, eventos ou fotografias.

| Decisão | Referência | Aplicação |
| --- | --- | --- |
| Preservar azul-marinho, logo e fontes | AGENTS.md, layout e página existentes | Cabeçalho e abertura da marca |
| Produtos como foco visual | Imagens existentes de barril e chopeira | Composição da abertura e catálogo |
| Texto legível e escala consistente | Refero: typography.md | Títulos expressivos, textos de apoio e botões maiores |
| Foco visível, autocomplete e controles de toque | Refero: craft-details.md e a11y-audit | Formulário, navegação e diálogos |
| Sem movimento contínuo necessário | scroll-animation | Retirada de parallax e suporte a reduced motion |

A pesquisa online Refero foi tentada, mas retornou NO_SUBSCRIPTION. A direção usa o produto existente e as referências locais da skill, sem atribuir inspirações a sites não consultados.

## Alterações

- Nova abertura, faixa de identidade e composição do catálogo.
- Seção de eventos com título acessível e sequência de atendimento.
- Formulário, calculadora, contato e rodapé reorganizados para desktop e celular.
- Painel de pedidos corrigido: cabeçalho não sobrepõe itens durante a rolagem.
- Foco inicial, contenção de Tab e restauração de foco nos diálogos; Escape fecha pedidos.
- Um único H1; estado dos perfis da calculadora exposto por aria-pressed.
- Imagens da abertura agora são locais; URLs com vírgula são codificadas para o otimizador.
- Alegação de pioneirismo retirada da abertura por não haver comprovação disponível na documentação do projeto.

## Verificações executadas

- `pnpm typecheck`: passou.
- `pnpm build`: passou após as últimas alterações; 18 páginas geradas.
- `git diff --check`: passou.
- Revisão visual em desktop e viewport de 390 × 844.
- Menu móvel, abertura de pedido por produto, quantidade, cidade e habilitação de continuar testados.
- Fechamento por Escape devolveu foco ao botão de origem.
- Calculadora mudou de 35 L para 50 L ao mudar de moderado para alto no cenário padrão.
- Formulário vazio bloqueado pelo navegador no campo Nome, sem gravar lead de teste.
- Imagens do painel verificadas no navegador após correção da URL.
- Lighthouse 13.5.0, perfil móvel padrão, build local: desempenho 87, acessibilidade 100, boas práticas 96, SEO 100. São medições locais desta execução, não notas da produção nem certificação WCAG.

## Segurança, SEO e limites da revisão

As skills release-checklist, security-review, seo-audit e a11y-audit foram usadas na revisão, além de scroll-animation. Não houve alteração em schema, Auth, RLS, Storage, endpoints ou credenciais. Metadata, canonical, sitemap e robots existentes foram preservados; nenhuma chave foi adicionada ao código.

Não existem variáveis Supabase locais: `/api/catalog` responde 503 e usa o fallback já existente. Esse erro explica o alerta de console em boas práticas. Leitura de dados reais, envio de leads, regras RLS, MFA, backups do banco e configurações privadas da Vercel não foram homologados nesta revisão visual. Não se declara o checklist completo de infraestrutura como aprovado. Não foi executado teste com leitor de tela nem criada suíte E2E automatizada; os fluxos acima foram testados interativamente no navegador.

PENDENCIAS.md foi revisado e mantém dados comerciais e legais que exigem confirmação. O commit anterior `d0eaca804ec1f7da5eb639f7c2be962ef89f2947` preserva o código para reversão; isso não equivale a backup do banco. A publicação direta na main foi autorizada pelo usuário.
