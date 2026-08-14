---
title: 'Decisão: reconsiderar hexagonal para vertical slice + shared kernel'
type: decisao
tags:
  - arquitetura
  - hexagonal
  - vertical-slice
author: Bruno Vaskevicius
date: '2026-08-13'
ts: '2026-08-13T18:36:00.000Z'
related: []
---
No desafio, Bruno comprometeu arquitetura hexagonal como base dos 3 produtos (Valida NI, Silu, PCP Automática). Pesquisa pós-aprovação mostrou que hexagonal resolve um problema (troca de infraestrutura) que nenhum dos 3 produtos tem hoje, e que camadas técnicas são piores para agentes de IA navegarem do que estrutura por feature. Recomendação: vertical slice dentro de cada produto + shared kernel fino (packages/shared) entre eles, hexagonal reservada só para o MCP da Silu se a fonte de conhecimento realmente precisar trocar.
