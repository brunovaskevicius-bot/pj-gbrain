---
title: 'GBRAIN v0 completo: hooks configurados (MCP server ainda não reconectou)'
type: nota
tags: []
author: Bruno Vaskevicius
date: '2026-08-14'
related: []
---
[Registrado como 'nota' porque o processo MCP desta sessão ainda está na versão antiga do server.ts — type 'status' ainda não é aceito. Numa sessão nova, o mesmo conteúdo deveria ser regravado como type: status.]

Sessão de 14/08: construí o protótipo v0 do GBRAIN (servidor MCP de memória coletiva sobre markdown versionado), subi pro repo privado github.com/brunovaskevicius-bot/pj-gbrain, e adicionei automação por pedido do Bruno (must-have pra produtividade dos aprendizes).

O que existe agora:
- 4 tools: search_memory, save_memory (com type: decisao/aprendizado/fato/status/bloqueio/nota + nextStep opcional), list_recent_memory, team_status.
- 3 hooks em .claude/settings.json: SessionStart (git pull + injeta status do time), Stop (nudge pra salvar status, com proteção contra loop), PostToolUse no matcher mcp__gbrain__save_memory (commit+push automático).
- Descoberta desta sessão: hooks (lidos do settings.json a cada disparo) recarregam independente da conexão MCP (processo stdio de longa duração, só reconecta em sessão nova). O Stop hook já disparou com a lógica nova nesta mesma sessão — prova real. O save_memory real ainda não, porque o processo MCP não reconectou.

Próximo passo claro: abrir sessão nova, confirmar que o enum novo (status/bloqueio) é aceito, confirmar que o PostToolUse comita+dá push automaticamente de verdade (checar git log), depois adicionar os 2 aprendizes como collaborators no repo e decidir a política de escrita (gravação livre vs review) e quando nasce o packages/shared/.
