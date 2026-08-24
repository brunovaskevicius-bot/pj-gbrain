---
title: 'Teste git push --dry-run no pj-gbrain: ainda 403'
type: status
tags:
  - gbrain
  - bloqueio
  - git-push
  - collaborator
author: Caqui
date: '2026-08-24'
ts: '2026-08-24T15:25:15.851Z'
related: []
nextStep: >-
  Brunão precisa adicionar CaquiZao como collaborator em
  brunovaskevicius-bot/pj-gbrain (e já aproveitar pra coletar os usuários GitHub
  de Julia, Klier e Bernardão). Depois disso, resolver o ruído de CRLF
  (`.gitattributes` com `*.md text eol=lf` ou `git config core.autocrlf input`)
  antes do primeiro push real, pra não sujar o histórico do time.
---
Reiniciei a sessão e rodei `cd .../05 System/pj-gbrain && git push --dry-run` como o guia de instalação pedia pra verificar.

Resultado: **ainda 403** — `Permission to brunovaskevicius-bot/pj-gbrain.git denied to CaquiZao`. O bloqueador de collaborator continua de pé, sincronização segue de mão única (recebo o time via `pull`, mas nada meu sobe via `push`).

Achado extra ao investigar: `HEAD == origin/main` (0 commits locais à frente), então não há backlog de memórias presas pra empurrar quando o acesso liberar. Só ruído de CRLF em 4 arquivos (`git status` mostra modificado, `git diff` de conteúdo vem vazio) — provável Windows/OneDrive sem `core.autocrlf`/`.gitattributes` configurado. Não é edição real, mas pode sujar o primeiro commit quando o push for liberado.
