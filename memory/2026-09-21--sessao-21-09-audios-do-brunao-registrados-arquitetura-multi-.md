---
title: >-
  Sessão 21/09: áudios do Brunão registrados + arquitetura multi-núcleo em
  decisão (aguardando ok da abordagem A)
type: status
tags:
  - validani
  - arquitetura
  - multi-nucleo
  - login
  - governanca
  - brunao
author: Caqui
date: '2026-09-21'
ts: '2026-09-21T17:07:32.628Z'
related: []
nextStep: >-
  Caqui dar ok (ou não) na abordagem A. Se ok, seguir pro design em seções:
  modelo de dados + nucleo_id, fluxo do hub de login, as 4 camadas de permissão,
  e plano de migração do NI — e então spec em `02 Especificação/`. Antes da call
  de hoje 16h30: (1) clonar o repo na máquina ou consertar o auth do GitHub MCP,
  porque sem ler o código nada disso se confirma; (2) mandar pro Brunão a
  pergunta que muda tudo — "editar" pro Rivas é configurar o funil do núcleo
  dele ou mexer em código?; (3) confirmar se "os repos" no plural significa um
  repo por núcleo; (4) alinhar com o Bernardão quem faz o quê. Pendência de
  discovery: consolidar no Vault o mapeamento dos processos dos 5 núcleos, que
  hoje só existe na cabeça das pessoas.
---
Brunão mandou 3 áudios em 20/09 com uma task pro Caqui + Bernardão, com prazo "até amanhã" (= hoje, 21/09) e call ~16h30-17h sem garantia de presença dele. Registrei tudo verbatim + decodificado em `00 Ideias e Demandas/(C) 2026-09-20 - ValidaNI - áudios do Brunão (hub de login e governança de edição).md`.

**O que o Brunão pediu:**
1. Acesso ao repo do ValidaNI já liberado pro Caqui e Bernardão — estudar o repo.
2. Construir o hub de login (escolher pra qual Valida/núcleo ir) — com avanço de código real, não só desenho.
3. Requisito NOVO: governança de edição por núcleo — alguém do núcleo (citou o "Rivas") edita o do Tec e não o do Dados, sem quebrar o app.

**Decisões tomadas na conversa de arquitetura (sessão de brainstorming):**
- ValidaNI em produção no NI **pode ser evoluído no lugar** → não criar repo novo, evoluir o existente com migrations incrementais; NI vira "o primeiro núcleo".
- Descartado repo/app novo em paralelo (duplicação + cutover sem necessidade).

**Insight principal — "editar" tem 4 níveis empilhados:** (1) ler, (2) escrever dado, (3) escrever **configuração** do próprio núcleo, (4) escrever **código**. O "não pode quebrar o app" só é problema nos níveis 3 e 4. Aposta: o Brunão quer o nível 3 e descreve como nível 4 porque hoje só existe o 4. Se config (etapas/critérios/campos) virar tabela, governança vira RLS por nucleo_id — não permissão de repositório (GitHub não escopa por pasta).

**Abordagem recomendada (A), aguardando ok do Caqui:** um app, núcleo como contexto de sessão, diferença entre núcleos começa 100% como dado, com UM ponto de extensão lazy pra quando um núcleo *provar* que precisa de comportamento próprio. Descartada a B (registry de 5 módulos desde já — YAGNI, não resolve governança, rotatividade semestral não mantém).

**⚠️ Lacuna de evidência encontrada:** a afirmação "cada núcleo faz coisa genuinamente diferente" é hipótese forte mas NÃO validada — o mapeamento dos benchs está espalhado/na cabeça do pessoal, não existe no Vault (só o roteiro). Isso virou restrição de design: a arquitetura precisa ser barata de estar errada.

**⚠️ Divergência possível com o Brunão:** no 3º áudio ele fala "os repos" no plural — pode estar imaginando um repo por núcleo (= Opção B da nota de arquitetura, que a nota descarta). Confrontar na call.

**⚠️ Bloqueio técnico:** o repo não está na máquina e o MCP do GitHub falhou (Authorization header badly formatted) — não consegui ler código nenhum. Toda a arquitetura até agora é em cima das notas, não do código real.
