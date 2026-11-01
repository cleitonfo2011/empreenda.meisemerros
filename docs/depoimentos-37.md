# Depoimentos — tarefa 37

Esta branch integra a vitrine à implementação do app em `cleitonfo2011/MEI-SEM-ERROS-APP`, branch `codex/avaliacoes-37`. A publicação aguarda revisão e autorização.

`api/testimonials.js` consulta somente a URL fixa `https://app.meisemerros.com.br/api/testimonials`, com timeout e sem cache. Devolve apenas campos públicos e no máximo 12 itens. O frontend renderiza texto, não HTML, oculta a seção quando vazia/indisponível e atualiza a cada 30 segundos enquanto visível e ao recuperar foco. A CSP continua restrita ao próprio domínio.

A migração de avaliações deve estar instalada no banco atual e o endpoint do app publicado antes de ativar a vitrine. Sem dados disponíveis, a página de vendas continua funcionando e não mostra placeholders ou depoimentos inventados. O texto informa que são experiências selecionadas, não uma média ou garantia. A página de condições foi complementada com finalidade, consentimento, revogação e canal de atendimento.

Validação: nove testes Node passaram, inclusive o servidor HTTP local; navegador local com depoimento fictício aprovado e autorizado, viewport 390 px sem overflow, e retirada após revogação. A documentação completa de permissões, consentimento, tratamento/retencão e Instagram está em `docs/avaliacoes-37.md` no repositório do app.
