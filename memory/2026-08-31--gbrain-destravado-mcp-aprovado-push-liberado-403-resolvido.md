---
title: 'GBRAIN destravado: MCP aprovado + push liberado (403 resolvido)'
type: status
tags:
  - gbrain
  - infra
  - mcp
  - git
  - onboarding
author: Caqui
date: '2026-08-31'
ts: '2026-08-31T18:51:35.800Z'
related: []
nextStep: >-
  Corrigir o bloco "Estado atual: sincronização de mão única" no CLAUDE.md do
  Vault — push funciona, GBRAIN já serve como canal de comunicação com o time.
  Depois, confirmar com o Brunão se Julia, Klier e Bernardão também já foram
  adicionados como collaborators (só o CaquiZao foi verificado). Este próprio
  status serve de teste end-to-end: se ele aparecer no team_status dos outros, o
  push do hook está de fato subindo.
---
GBRAIN está 100% funcional agora, nas duas frentes.

**1. MCP aprovado.** O servidor aparecia como `⏸ Pending approval` no `claude` do terminal. Aprovação não exige TUI — é só flag em `~/.claude.json`: criei a entrada do projeto com `enabledMcpjsonServers: ["gbrain"]` + `hasTrustDialogAccepted: true`. Verificado: `✔ Connected`. Backup em `~/.claude.json.bak-20260831-154946`. No Claudian já funcionava antes disso (hook SessionStart injetando contexto) — o pending afetava só o CLI.

**2. Push liberado — o 403 acabou.** `Everything up-to-date` não prova nada; o teste real é `git push --dry-run origin HEAD:refs/heads/<ref-descartável>`, que retornou `* [new branch]`. Write access concedido, sync é bidirecional. ⚠️ O aviso de "sincronização de mão única" no CLAUDE.md do Vault está **desatualizado** e precisa ser corrigido.

**3. CRLF era falso alarme.** O medo registrado em 24/08 (sujar o histórico do time no primeiro push) não se aplica: `core.autocrlf=true` já normaliza CRLF→LF no `git add`. Simulei o staging dos 3 arquivos marcados como `M` — `git diff --cached` vem vazio, commit sairia vazio. É ruído cosmético de stat cache, não conteúdo. Não precisa de `.gitattributes`.

**Aprendizado de método:** o Vault fica em `Área de Trabalho/Aprendizagem de Produtos`, NÃO em `Projetos/03 Projects/...`. Diagnostiquei "descasamento de diretório" contra esse caminho inexistente e a conclusão inteira foi inválida. Confirmar que o caminho existe (`ls -d`) antes de construir teoria sobre ele.
