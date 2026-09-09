---
title: >-
  Sessão 09/09: contexto de arquitetura multi-núcleo do ValidaNI registrado no
  Vault
type: status
tags:
  - validani
  - arquitetura
  - discovery
author: Caqui
date: '2026-09-09'
ts: '2026-09-09T21:56:56.962Z'
related: []
nextStep: >-
  Fechar os dois eixos com o Caqui (e depois com o Brunão, já que mexe no
  ValidaNI que está em produção no NI). Confirmado, detalhar modelo de
  dados/nucleo_id, RLS, papéis e aprovação, funil como dado e plano de migração
  — e mover a nota pra `02 Especificação/`. Avaliar se vira card no board.
---
Trouxe pro Vault a conversa de arquitetura sobre escalar o ValidaNI do NI para os 5 núcleos. Criada a nota `01 Discovery/(C) ValidaNI - arquitetura multi-núcleo (repositório e login).md` com os dois eixos (estrutura do repositório e fluxo de login), as opções descartadas com o motivo, e os 2 furos técnicos descobertos (escopo de núcleo no `mcp_tokens`, `products` já é por núcleo). Nada decidido ainda — é recomendação aguardando validação.
