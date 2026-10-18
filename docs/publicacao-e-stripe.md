# Oferta Primeiros 100 — estado da implantação

## Oferta confirmada

Responsável: Cleiton Felipe Ostroski. Suporte e reembolso: contato@meisemerros.com.br.

- Nova página: https://empreenda.meisemerros.com.br. Preservar a página antiga e o domínio do app.
- App: https://app.meisemerros.com.br.
- Compra inicial: R$ 147 em pagamento único por 12 meses, com garantia comercial de 30 dias e limite de 100 participantes.
- Renovação opcional: R$ 298,80 à vista por mais 12 meses, equivalente a R$ 24,90/mês. Proteção por 24 meses após o primeiro ano, permitindo duas renovações anuais opcionais, sem cobrança automática.
- Janela de renovação confirmada pelo proprietário: a partir dos 30 dias anteriores ao vencimento. O período vigente é preservado na renovação antecipada.
- Produto de produção informado: `prod_VPUXbhq30p2EZV`.
- Preço inicial informado: `price_1UOfYD3vvJ7KNwTA9j5SqbON`.
- Preço de renovação informado: `price_1UQr493vvJ7KNwTAkkP5dB0i`.

## O que já foi feito

A página e o app foram enviados ao GitHub e publicados na Vercel. A migração de pagamentos foi aplicada pelo proprietário no Supabase; o SQL Editor apresentou sucesso. O login Google retornou à página dos Primeiros 100. O webhook deixou de responder 503 após configuração/redeploy e passou a rejeitar corretamente uma requisição sem assinatura com 400. Isso não comprova entrega de evento autêntico nem pagamento aprovado.

O proprietário confirmou que os dados antigos continuam visíveis ao entrar na conta de teste. O histórico mostra que o arquivo de conexão e as operações de leitura/gravação de lançamentos não foram substituídos. Os testes isolados verificam preservação dos registros e acesso das contas antigas sob RLS.

Foi corrigida a navegação de contas com teste válido ou assinatura antiga. A contratação durante um teste permanece possível por opção explícita na página de vendas; não se exige uma nova compra para acessar um plano vigente.

O checkout confere preço, produto, moeda, ambiente, usuário e pagamento no servidor. A reserva transacional solicita uma única linha ao PostgREST antes de usar o ID do pedido. O webhook verifica assinatura, usa o estado atual da Stripe e entrega o período de forma idempotente. O retorno do checkout sozinho não libera acesso.

## O que ainda falta

1. Preparar um projeto Supabase separado e um ambiente Stripe de teste. Não copiar dados de clientes para esse projeto.
2. Configurar uma versão Preview do app com essas credenciais, sem alterar as variáveis de Production.
3. Validar compra de teste, pagamento recusado, expiração, webhook autêntico e repetido, acesso, renovação e reembolso.
4. Concluir a identificação complementar do fornecedor e as regras de retenção/descarte e operação de privacidade. `condicoes.html` é um texto completo para revisão, ainda identificado como rascunho, e não autoriza abertura comercial.
5. Somente após essas verificações, configurar/habilitar produção e o link da página. Não mudar os planos antigos automaticamente.

## Configuração de produção a preservar

Supabase do app real: `https://mpmlcqgeksfmzfaqpjdh.supabase.co`.

No app, manter `FOUNDER_SALES_ENABLED=false` e `FOUNDER_TERMS_READY=false` até concluir a preparação. Os preços informados são para conferência no ambiente correto; não foram consultados diretamente na conta Stripe nesta conversa. Produção usa `FOUNDER_STRIPE_MODE=live`. O segredo do novo endpoint usa `FOUNDER_STRIPE_WEBHOOK_SECRET`; preservar `STRIPE_WEBHOOK_SECRET` do endpoint legado.

Na página de vendas, manter `FOUNDER_LINK_ENABLED=false`. Quando habilitado, o link consulta a disponibilidade no app antes de encaminhar. A intenção de compra durante o teste é sinalizada por `/fundadores?oferta=fundador`; apenas essa intenção não libera acesso nem faz cobrança.

Nunca colocar chaves privadas ou segredos no Git, nos textos ou no chat. Os IDs de produto/preço e URLs públicas não substituem as credenciais dos painéis.

## Observações operacionais

- A migração de produção pressupõe `users` e `transactions`; `prestador_perfil` é opcional.
- Uma reserva pendente conta nas vagas até sua expiração ser confirmada pela Stripe. Falhas ambíguas de criação da sessão podem exigir conciliação.
- Reembolso integral e disputa bloqueiam o acesso de forma conservadora. Reativação depois de disputa resolvida e situações com múltiplas compras exigem revisão do suporte. Reembolso parcial não revoga automaticamente.
- A implementação inicial aceita cartão. Não há promessa de Pix ou parcelamento.
- Não foram executados pagamentos reais, reembolsos reais ou publicação de anúncios nesta tarefa.
- Os testes PostgreSQL via PGlite são isolados e não substituem o teste integrado no Supabase/Stripe.
