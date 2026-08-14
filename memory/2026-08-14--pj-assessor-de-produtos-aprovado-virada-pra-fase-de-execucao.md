---
title: >-
  PJ Assessor de Produtos: aprovado, virada pra fase de execução + fix de
  permissão do Claudian
type: status
tags:
  - assessor-de-produtos
  - pj
  - claudian
  - infra
  - permissoes
author: Bruno
date: '2026-08-14'
ts: '2026-08-14T18:48:48.735Z'
related: []
nextStep: >-
  Reestruturar CLAUDE.md e Current Status do projeto PJ — Assessor de Produtos
  2026.2 pra fase de execução (dev dos 3 produtos), e decidir se reorganiza
  pastas (histórico candidatura vs. material de execução por produto).
---
Bruno foi **aprovado** como Assessor(a) de Produtos da Poli Júnior (entrevista de 11/08 já ocorreu). A missão mudou de "candidatura" pra "desenvolver de fato os produtos": PCP Automática, Silu e Valida NI — os mesmos 3 do desafio escrito, escopo não mudou.

**Decisão de estrutura**: manter tudo em um projeto guarda-chuva único, reaproveitando a pasta atual `03 Projects/PJ — Assessor de Produtos 2026.2/` (já tem RICE, cronograma, benchmark e conversas dos gerentes — vira a base da execução), em vez de criar 3 projetos separados por produto.

**Ainda falta fazer** (próxima sessão): reestruturar o CLAUDE.md desse projeto e o "Current Status" pra refletir a fase de execução (hoje ainda descreve fase de candidatura/desafio). Provavelmente vale reorganizar pastas também (ex: separar histórico da candidatura de material de execução por produto).

**Bug de infra resolvido nessa sessão**: o plugin Claudian tinha `allowedExportPaths: ["~/Desktop", "~/Downloads"]` em `.claude/claudian-settings.json`, e como o vault inteiro mora dentro de `~/Desktop`, qualquer path apontando pra raiz do vault (ou acima) era classificado errado como "export dir write-only", bloqueando leitura/grep/cd pra fora da pasta do projeto atual. Corrigido removendo `~/Desktop` da lista (só ficou `~/Downloads`). Precisou de reload de sessão pra pegar efeito — edição no arquivo sozinha não bastou.
