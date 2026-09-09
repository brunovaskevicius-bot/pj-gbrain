---
title: >-
  ValidaNI: direção "full multitenant" já circula em reunião — corrobora a Opção
  A da arquitetura
type: fato
tags:
  - validani
  - multitenant
  - arquitetura
  - custo
author: Caqui
date: '2026-09-09'
ts: '2026-09-09T21:58:04.347Z'
related:
  - 2026-09-09--validani-multi-nucleo-recomendacao-de-app-unico-banco-unico-
nextStep: >-
  Caqui confirmar data/participantes da reunião e responder as 5 perguntas em
  aberto listadas na nota, principalmente o que é "Product House" e a que
  produto se refere "mais aprovações no vestibular".
---
Anotações cruas de reunião sobre o ValidaNI (data e participantes ainda não confirmados) registradas em `00 Ideias e Demandas/2026-09-09 - ValidaNI - anotações cruas de reunião.md`.

O que dá pra extrair com alguma confiança:
- **"ValidaNI full multitenant"** foi dito em reunião — ou seja, a direção multi-núcleo não é só desenho do Caqui, já circula com outras pessoas. Corrobora a recomendação da Opção A (app único + banco único).
- Stack citada bate: **Render (~US$ 7/mês), Supabase, SSO**. Esse custo reforça o argumento contra o monorepo com um deploy por núcleo (viraria ~US$ 35/mês pra resolver um problema que a Opção A não tem).
- Narrativa de valor usada: o produto é **"um funcionário a mais, fazendo um bagulho que ninguém fazia"** — cobre lacuna, não substitui trabalho. Boa frase pra venda interna.

Trechos ainda **não decifrados**, não usar como fato: "mais aprovações no vestibular" (métrica de quê?), "antes dashboard", "sessão deixar referenciado Product House".
