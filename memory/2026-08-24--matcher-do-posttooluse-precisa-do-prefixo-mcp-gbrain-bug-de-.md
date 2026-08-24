---
title: >-
  Matcher do PostToolUse precisa do prefixo mcp__gbrain__ — bug de sincronização
  silenciosa
type: aprendizado
tags:
  - gbrain
  - bug
  - hooks
  - matcher
  - sincronizacao
author: Caqui
date: '2026-08-24'
ts: '2026-08-24T15:41:29.840Z'
related:
  - 2026-08-24--teste-git-push-dry-run-no-pj-gbrain-ainda-403
nextStep: ''
---
O hook `PostToolUse` que faz `git add/commit/push` automático depois de `save_memory`/`create_card`/`claim_card`/`update_card` nunca disparou pra ninguém que seguiu o guia de instalação — e a falha era 100% silenciosa (script best-effort engole erro).

Causa raiz: o campo `matcher` em `.claude/settings.json`, quando contém só letras/dígitos/`_`/`-`/`,`/`|`, é avaliado como **string EXATA** contra o nome completo da tool — não é "contém"/substring (confirmado na doc oficial code.claude.com/docs/en/hooks). Tools MCP chegam com o nome completo `mcp__<server>__<tool>` (aqui: `mcp__gbrain__save_memory`). O matcher documentado no README e no guia era só `save_memory|create_card|claim_card|update_card` — sem o prefixo `mcp__gbrain__` — então nunca casava com nada.

Histórico: já tinha um bug conhecido anterior (underscores comidos em copy/paste do WhatsApp: `mcpgbrainsave_memory`), e a "correção" aplicada trocou por um matcher sintaticamente válido mas com o mesmo problema de fundo (prefixo errado/faltando). Ou seja: dois bugs diferentes, mesmo sintoma, nunca resolvido de fato até hoje (2026-08-24).

Sintoma pra detectar isso no futuro: depois de um `save_memory`, rodar `git status` no clone — se o arquivo aparece como `??` (untracked) em vez de já commitado, o matcher está errado. `.session-markers/` vazio é outro sinal (o marker de status também é escrito pelo mesmo hook).

Corrigido em: `.claude/settings.json` (Caqui), `README.md` e `(C) GBRAIN - guia de instalação para aprendizes.md` do repo pj-gbrain. Matcher certo: `mcp__gbrain__save_memory|mcp__gbrain__create_card|mcp__gbrain__claim_card|mcp__gbrain__update_card`.
