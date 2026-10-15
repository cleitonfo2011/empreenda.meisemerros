# Publicação e Stripe — estado e próximos passos

## O que foi feito

Página responsiva criada no repositório `empreenda.meisemerros`; integração preparada no repositório `MEI-SEM-ERROS-APP`. Nenhuma alteração foi enviada ao GitHub ou publicada. Nenhuma migração foi aplicada ao banco remoto e nenhuma cobrança foi executada.

Dados informados pelo proprietário:

- Página: `https://www.meisemerros.com.br`, domínio adquirido no Registro.br.
- App existente na Vercel: `https://app.meisemerros.com.br`.
- Supabase: `https://mpmlcqgeksfmzfaqpjdh.supabase.co`.
- Produto Stripe: `prod_VPUXbhq30p2EZV`.
- Preço inicial Stripe: `price_1UOfYD3vvJ7KNwTA9j5SqbON`.
- Suporte e reembolso: `contato@meisemerros.com.br`.

Os identificadores Stripe foram recebidos, mas não consultados na conta: a chave não está disponível neste ambiente. A aplicação verifica produto, moeda, valor, modalidade e ambiente antes de criar o checkout.

## Oferta confirmada

R$ 147 em pagamento único antecipado por 12 meses. Limite de 100 fundadores e garantia comercial de 30 dias. Depois, renovação opcional de R$ 298,80 à vista por mais 12 meses, equivalente a R$ 24,90 por mês. A proteção desse valor equivalente continua pelos 24 meses após o primeiro ano, permitindo duas renovações anuais opcionais. Cada renovação é cobrada à parte. Não há assinatura ou renovação automática nessa modalidade.

A renovação abre nos 30 dias antes do fim do acesso. Essa janela operacional é uma proposta implementada para revisão. Após o fim da proteção, o fluxo não cobra um novo preço sem condições definidas.

## Integração implementada no app

- `/fundadores`: login Google existente, resumo da oferta e status do acesso.
- `/api/founder-offer`: informa disponibilidade, sem inventar contador de vagas.
- `/api/founder-checkout`: autentica o usuário no Supabase e cria uma Checkout Session de pagamento único, com preço conferido no servidor.
- `/api/founder-webhook`: valida assinatura sobre corpo bruto, consulta estado atual na Stripe, valida itens/valor/moeda/identidade e entrega ou revoga o acesso.
- `/api/founder-access`: informa somente o período do usuário autenticado.
- `/api/checkout`: encaminha novas compras para o fluxo fundador; não cria mais a assinatura antiga de R$ 19,90/mês. Assinaturas existentes mantêm o webhook legado.
- Migração SQL `supabase/migrations/20261015_founder_offer.sql`: pedidos, acesso, proteção de preço, reservas transacionais, idempotência e políticas RLS.
- A leitura de acesso respeita o vencimento fundador mesmo que o status legado seja `active`. O webhook e a sincronização antigos ignoram compras fundadoras para não conceder acesso permanente.

O retorno do checkout sozinho não libera acesso. Uma reserva pendente conta nas 100 vagas e só é liberada após a expiração confirmada na Stripe. Uma falha ambígua ao criar sessão não libera vaga automaticamente: pode exigir conciliação pelo suporte. Reembolso integral e disputa bloqueiam o acesso conservadoramente; reativação após disputa resolvida ou análise de múltiplas compras exige revisão manual. Reembolso parcial não revoga automaticamente. Essas escolhas precisam estar alinhadas à operação antes do lançamento.

A implementação inicial aceita cartão. Pix e parcelamento não foram habilitados ou prometidos.

## Configurar e testar antes de vender

1. Preservar os dados e verificar o schema remoto. Aplicar a migração no Supabase de teste primeiro. A migração foi testada em PostgreSQL isolado via PGlite, não no projeto remoto. Ela pressupõe as tabelas `users`, `transactions` e `prestador_perfil` do schema atual.
2. Configurar as variáveis do app na Vercel conforme `.env.example`. Reutilizar bindings existentes: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `APP_URL`. Não substituir chaves já válidas desnecessariamente.
3. Adicionar `FOUNDER_STRIPE_WEBHOOK_SECRET`, `FOUNDER_SUPPORT_EMAIL=contato@meisemerros.com.br`, `STRIPE_FOUNDER_PRODUCT_ID` e `STRIPE_FOUNDER_PRICE_ID`. Cadastrar segredos apenas no painel seguro; nunca no Git ou no chat.
4. Criar ou identificar o preço de renovação de pagamento único de R$ 298,80 no mesmo produto e configurar `STRIPE_FOUNDER_RENEWAL_PRICE_ID`. Esse preço ainda não foi fornecido nem criado.
5. Usar `FOUNDER_STRIPE_MODE=test` e chaves/preços de teste em ambiente e banco separados. Não usar pagamentos de teste no banco real de clientes. Os IDs de produção fornecidos não são automaticamente válidos em teste.
6. Publicar a versão de teste do app com `FOUNDER_SALES_ENABLED=false` e `FOUNDER_TERMS_READY=false`. Cadastrar o endpoint de webhook `https://app.meisemerros.com.br/api/founder-webhook` quando estiver no domínio final (em teste, usar o domínio do ambiente de teste). Eventos: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.expired`, `charge.refunded`, `charge.dispute.created`. Este endpoint tem segredo próprio; preservar o webhook legado para assinaturas existentes.
7. Autorizar a URL `/fundadores` na lista de redirect URLs do Supabase Auth, nos ambientes usados. O login Google agora pode retornar a essa página.
8. Finalizar identificação do fornecedor, termos de uso e aviso de privacidade. A página `condicoes.html` continua explicitamente provisória; não liberar vendas com ela assim. Confirmar entrega, suporte, renovação, política de reembolso e privacidade antes de ativar `FOUNDER_TERMS_READY=true`.
9. Só habilitar vendas no ambiente de teste após os pré-requisitos. Testar compra paga, recusa, abandono/expiração, assinatura falsa de webhook, repetição de evento, acesso de outro usuário, última vaga concorrente, vencimento, renovação e reembolso. Testes reais da integração Stripe/Supabase não foram executados nesta tarefa.
10. Após validação, aplicar a migração revisada em produção, usar os IDs/chaves de produção, `FOUNDER_STRIPE_MODE=live` e habilitar as flags no deploy final. Conferir a operação antes de habilitar o link da página.

## Página na Vercel e domínio

Usar projeto separado para a página. Código estático em `public`, funções em `api`, configuração em `vercel.json`. Nenhum deploy foi executado ou validado na Vercel nesta tarefa. Antes de importar pelo Git, os arquivos locais precisam ser revisados e enviados ao repositório; isso ainda não foi feito.

Na página, `FOUNDER_LINK_ENABLED=false` por padrão. Somente ativar depois de o app, checkout e termos estarem validados. Quando ativo, o servidor consulta a disponibilidade no app. O botão leva ao login do app e depois ao checkout Stripe; a página de marketing não recebe chaves de pagamento.

Adicionar `www.meisemerros.com.br` ao projeto da página e seguir os registros DNS exatos fornecidos pela Vercel. Não adivinhar IP ou CNAME. Verificar quem opera o DNS: se houver delegação para outro provedor, editar nesse provedor. Preservar `app.meisemerros.com.br` e os registros de e-mail. Definir redirecionamento do domínio raiz `meisemerros.com.br` para o endereço canônico escolhido, sem alterar a configuração do app.

## Validações locais

- App: 220 testes aprovados, incluindo casos de preço, pagamento, prazo e banco isolado.
- Migração: execução repetida, limite de 100 reservas, reserva/pagamento idempotentes, renovação, expiração, reembolso e permissões RLS verificados no PostgreSQL isolado. Não substitui ensaio com sessões concorrentes no Supabase remoto.
- Build de produção e checagem de tipos da aplicação aprovados. O projeto original incluía fixtures de testes com erros de tipos na compilação Next; `tsconfig.app.json` separa o código da aplicação, mantendo os testes executados pelo Node. A checagem geral anterior do repositório falhava nesses arquivos; não foi usada como indicação de aprovação.
- Página: teste HTTP e verificação em navegador nas larguras 360, 390, 768 e 1440 px, sem rolagem horizontal ou erros de JavaScript; botão indisponível e FAQ testados. Evidências em `browser-checks.json` e `assets/pagina-*.png`.
- Endpoints locais do app: `/fundadores` respondeu 200; oferta fechada; rotas de compra retornam indisponibilidade com vendas desativadas.

Não foram validados: compra na conta Stripe, login no Supabase remoto, envio de e-mails, DNS, deploy Vercel ou publicação de anúncios. Sem autenticação dessas plataformas e configuração segura, não é possível concluir a publicação nesta conversa.
