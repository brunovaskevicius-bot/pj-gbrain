---
title: >-
  PostToolUse não dispara no Claudian — memória fica presa local mesmo com
  matcher correto
type: aprendizado
tags:
  - gbrain
  - hooks
  - claudian
  - obsidian
  - bug
  - infra
author: Caqui
date: '2026-08-31'
ts: '2026-08-31T18:52:54.572Z'
related:
  - 2026-08-31--gbrain-destravado-mcp-aprovado-push-liberado-403-resolvido
nextStep: >-
  Avisar o Brunão pra adicionar isso no README ao lado do aviso de matcher — é
  uma segunda causa do mesmo sintoma (`??` após save_memory) e o README hoje
  leva a pessoa a mexer num matcher que já está certo. Quem roda o `claude` no
  terminal não é afetado; quem usa Claudian/Obsidian precisa do commit manual
  até existir correção.
---
Falha silenciosa nova, **diferente** da que o README documenta (linha 76). O README diz: se o arquivo ficar `??` depois de um `save_memory`, o matcher está errado. Nesta sessão o matcher estava **correto** (`mcp__gbrain__save_memory|mcp__gbrain__create_card|mcp__gbrain__claim_card|mcp__gbrain__update_card`) e o arquivo ficou `??` de qualquer forma.

**Diagnóstico:** o hook `PostToolUse` não disparou na sessão do Claudian (plugin do Obsidian). Evidências que isolam a causa:
- `SessionStart` **disparou** (contexto do time foi injetado) → hooks são lidos, settings.json é encontrado.
- `postToolUse.ts` roda perfeitamente quando invocado à mão: `echo '{"tool_name":"mcp__gbrain__save_memory"}' | node .../tsx/dist/cli.mjs .../postToolUse.ts` → commitou e deu push (HEAD 123d869 → ee0a0f5).
- Ainda assim o arquivo permaneceu untracked após a tool call real.
- Se o hook tivesse rodado e só o push falhasse, o commit local existiria. Não existia.

Logo: o script está bom, o matcher está bom, o disparo automático de `PostToolUse` é que não acontece nesse harness. `SessionStart` sim, `PostToolUse` não.

**Impacto:** quem usa o Claudian perde 100% do que salva, silenciosamente — o hook é best-effort e engole erro, então nada avisa. `team_status` local mostra a memória normalmente (ela existe em disco), o que reforça a ilusão de que subiu.

**Workaround até resolver:** depois de `save_memory`/cards no Claudian, rodar à mão no clone:
`git add memory cards && git commit -m "gbrain: <tipo> de <autor>" && git push`

Efeito colateral bom: `git add` com `core.autocrlf=true` também limpou o ruído de CRLF dos 3 arquivos que viviam como `M`. Working tree limpa agora.
