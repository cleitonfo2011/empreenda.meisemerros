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

Compra inicial: R$ 147 em pagamento único por 12 meses. Renovação opcional após esse período: R$ 298,80 em pagamento único por mais 12 meses, equivalente a R$ 24,90/mês; sem renovação automática. A proteção do equivalente mensal de R$ 24,90 continua pelos 24 meses posteriores ao primeiro ano, permitindo duas renovações anuais opcionais de R$ 298,80.

## Publicação

O proprietário informou ter feito o deploy na Vercel e aberto o novo subdomínio. A validação externa continua bloqueada pela política de rede deste ambiente. Usar um projeto separado para a página, preservando o app em `app.meisemerros.com.br`. Não alterar o DNS do subdomínio do app. O domínio da nova página é `empreenda.meisemerros.com.br`. Manter a página antiga em `www.meisemerros.com.br` durante a transição, sem configurar redirecionamentos por enquanto. Não habilitar o link da oferta antes de validar a integração do app nem apresentar a página provisória de condições como termos definitivos.

Não colocar chaves Stripe no navegador, no Git ou em mensagens. Os identificadores `price_...` são configuração pública, mas chaves `sk_...` e segredos `whsec_...` devem ser cadastrados em configuração segura do servidor.
