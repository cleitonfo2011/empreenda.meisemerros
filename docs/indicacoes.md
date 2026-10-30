# Links de vendedores

O script app.js reconhece apenas ref no formato v + 32 caracteres hexadecimais. Encaminha a navegação para https://app.meisemerros.com.br/api/referrals/capture?ref=CODIGO. O destino é fixo e nenhum identificador pessoal é acrescentado à URL.

O app registra uma entrada válida, guarda cookie próprio assinado e devolve à raiz limpa da página. Cookies/credenciais não são compartilhados com o projeto da landing page. Compras, disponibilidade, preços e aceite continuam no fluxo existente.

Publicar somente depois da migration e das rotas do app estarem em produção. Atualização do aviso em condicoes.html descreve indicação e cookie de até 30 dias. Não altera condições de preço ou renovação.

Testes: código válido, inválido, URL maliciosa, destino fixo e fluxo de checkout existente. Não há teste com cobrança real.
