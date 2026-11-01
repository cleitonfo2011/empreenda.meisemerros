# Tarefa 38 — página de vendas por lote

Preparada em branch/PR, sem publicação de produção. COMMERCIAL_LOTS_ENABLED ausente/false preserva a oferta atual. Com true e FOUNDER_LINK_ENABLED=true, /api/offer usa a oferta validada por /api/commercial-offer do app. Sem lote habilitado/preço válido, checkout fica fechado; não inventa preço de Clube10K.

O cliente altera valores, título, faixa e condições de renovação do lote, oculta perguntas com preços antigos e usa texto seguro. O link /api/checkout reconfere disponibilidade e encaminha para /assinatura no domínio fixo do app. O aceite e a reserva definitiva são feitos pelo servidor do app; a página não cobra nem promete posição antes de pagamento.

condicoes-lotes.html está em rascunho para revisão antes da habilitação. Condições de Fundadores já contratadas permanecem. Clube Mil: adesão de R$197 no Pix ou R$247 no cartão à vista; renovações de R$297 e R$298,80. Terceira renovação pendente; Clube10K sem preços. Indique e Ganhe reserva imediatamente ao liberar o programa, carência30dias e excedente via Pix manual.

Ordem futura: aprovar/applicar migração e publicar app com flags desligadas; revisar condições e catálogo Stripe; publicar página com flag desligada; autorizar ativação e habilitar em ambos os projetos. Esta entrega não altera variáveis nem produção. Rollback: desligar flag da página; não remover suporte a contratos novos já vendidos no app.

11 testes da página passaram, incluindo regressão do fluxo Fundadores, lotes, bloqueio sem preço e destinos fixos.
