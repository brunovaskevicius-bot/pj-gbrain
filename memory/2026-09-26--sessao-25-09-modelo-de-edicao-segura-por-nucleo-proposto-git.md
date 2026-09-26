---
title: >-
  Sessão 25/09: modelo de edição segura por núcleo proposto + GitHub sem
  proteção de branch
type: status
tags:
  - validani
  - arquitetura
  - multi-nucleo
  - governanca
  - github
author: Caqui
date: '2026-09-26'
ts: '2026-09-26T02:12:49.594Z'
related: []
nextStep: >-
  Caqui responder o escopo da v1 (A: só prompts, evals e checklist; B: A + telas
  React; C: B + backend). A recomendação é A, com a estrutura já pronta para B.
  Levar ao Brunão/Naka a decisão do plano GitHub. Depois seguir o design por
  seções (modelo de dados/funil como dado, hub de login, plano de migração do
  NI) e escrever a spec em 02 Especificação/.
---
Diagnóstico do fork bmchad/ValidaNI-for-PJ (bmchad = Bernardo). Continua 10 commits atrás de cassoli-filipe/validani; o sync fica parado a pedido do Caqui. O commit `first` do Bernardo quebrou o backup, o submódulo pj-gbrain e o seed.sql.

Caqui escolheu: monorepo com pasta `nucleos/<núcleo>/` por núcleo e CODEOWNERS, com um app e um deploy. Proposta de edição segura em 6 travas:
1. CODEOWNERS e master protegida;
2. lint limitando imports a `nucleo-sdk`;
3. módulo carregado sob demanda dentro de ErrorBoundary, com kill switch;
4. RLS por nucleo_id, generalizando o `is_ni`;
5. núcleo não escreve Python nem migração, porque a service_role ignora a RLS; no backend só edita prompts e casos de avaliação;
6. deploy único.
Risco menos óbvio: o código do módulo roda com a sessão de quem está vendo. O SDK amarra a escrita ao núcleo dono e bloqueia escrita para quem não é membro.

BLOQUEIO: o GitHub retorna "Upgrade to GitHub Pro or make this repository public" (repo privado em conta pessoal Free). A master não tem proteção e há 5 contas com write. A org inovacao-polijunior também é Free. Opções: plano Team na org da PJ, repo público, ou GitHub Pro via Student Pack do Bernardo.
