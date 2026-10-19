# Plano Fundadores — primeiros 100 compradores

Compra inicial: R$ 147,00 no Pix ou R$ 247,00 no cartão à vista. Mesmo acesso por 12 meses. Primeira renovação opcional: R$ 247,00 por mais 12 meses. Segunda renovação: R$ 298,80 por mais 12 meses. Sem cobrança automática ou parcelamento.

Todos os pagamentos desta oferta passam exclusivamente pelo checkout da Stripe, com a conta identificada pelo login no aplicativo. Após o preenchimento das 100 vagas, encerrar a oferta para novos compradores. O próximo plano será definido posteriormente, sem fallback para um preço ou plano diferente. A renovação dos fundadores continua conforme as condições contratadas.

A página, as perguntas frequentes e as condições foram alinhadas. A referência ao anual regular de R$ 197 foi removida para evitar comparação incoerente com o preço no cartão.

## Abertura das vendas

Além de FOUNDER_LINK_ENABLED=true, a API exige FOUNDER_PAYMENT_METHOD_PRICING_READY=true. Manter esta segunda variável ausente ou false até o aplicativo implementar e validar os preços por meio de pagamento, incluindo rejeição de cartão no preço exclusivo de Pix, webhook, compra autenticada e entrega de acesso. Esta alteração não configura os preços no aplicativo ou no Stripe e não abre vendas.

Validação local: node --test; cobre página, recursos, termos, catálogo por meio e bloqueio de checkout mesmo com FOUNDER_LINK_ENABLED=true quando a nova confirmação está ausente. A avaliação visual em navegador e o pagamento integrado permanecem pendentes.
