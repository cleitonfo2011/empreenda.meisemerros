# MEI Sem Erros — página da oferta Primeiros 100

Primeira implementação para revisão. A página foi publicada pelo proprietário em `empreenda.meisemerros.com.br`; as compras continuam desativadas e o deploy não foi verificado externamente neste ambiente. As rotas desta página só encaminham ao app quando a disponibilidade estiver habilitada e confirmada no backend. A integração com Stripe foi implementada no checkout local do repositório do app, mas ainda não foi conectada à conta ou publicada. A identidade visual é uma proposta, não a identidade visual final confirmada. A logo original foi copiada do repositório do app.

## Executar

Requer Node.js 24 ou superior. Sem dependências externas e sem etapa de compilação.

```sh
cd /workspace/empreenda.meisemerros
npm test
npm start
```

O servidor usa a porta 3000, ou `PORT` se definida. Verificar internamente com `curl http://127.0.0.1:3000/api/offer`: a resposta desta versão deve conter `available: false`. Os processos precisam ser iniciados novamente em uma nova máquina.

## Arquivos

- `public/`: página responsiva, estilos, comportamento e condições provisórias.
- `api/`: funções para consultar disponibilidade e encaminhar ao login do app; vendas desativadas por padrão.
- `server.mjs`: servidor local para os mesmos arquivos e funções.
- `docs/criativos.md`: quatro ângulos de campanha, textos e roteiro revisado.
- `docs/publicacao-e-stripe.md`: decisões confirmadas e requisitos para lançamento.
- `test/site.test.mjs`: teste HTTP da página, arquivos, oferta e bloqueio do checkout.

## Condição confirmada

Plano Fundadores: oferta exclusiva para os primeiros 100 compradores com pagamento confirmado. Compra inicial de 12 meses: R$ 147 no Pix ou R$ 247 no cartão à vista. Pagamentos exclusivamente pelo checkout da Stripe, após login no aplicativo. Primeira renovação opcional: R$ 247 por mais 12 meses. Segunda renovação opcional: R$ 298,80 por mais 12 meses. Sem cobrança automática.

Após o preenchimento das 100 vagas, a oferta é encerrada para novos compradores. A oferta para os clientes seguintes será definida posteriormente: não adicionar outro plano, preço ou redirecionamento automático como substituto. Preservar as condições de renovação dos fundadores.

A página consulta a disponibilidade no aplicativo e a reconfere no servidor antes de encaminhar a compra. O aplicativo é responsável pela reserva transacional das vagas, criação da sessão Stripe e liberação por confirmação do pagamento. Uma indisponibilidade não deve ser apresentada como prova de esgotamento: também pode indicar vendas fechadas ou uma falha temporária.

## Publicação

O proprietário informou ter feito o deploy na Vercel e aberto o novo subdomínio. A validação externa continua bloqueada pela política de rede deste ambiente. Usar um projeto separado para a página, preservando o app em `app.meisemerros.com.br`. Não alterar o DNS do subdomínio do app. O domínio da nova página é `empreenda.meisemerros.com.br`. Manter a página antiga em `www.meisemerros.com.br` durante a transição, sem configurar redirecionamentos por enquanto. Não habilitar o link da oferta antes de validar a integração do app nem apresentar a página provisória de condições como termos definitivos.

Não colocar chaves Stripe no navegador, no Git ou em mensagens. Os identificadores `price_...` são configuração pública, mas chaves `sk_...` e segredos `whsec_...` devem ser cadastrados em configuração segura do servidor.
