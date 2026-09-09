---
title: >-
  ValidaNI multi-núcleo: recomendação de app único + banco único (Opção A) e
  login com roteamento automático
type: aprendizado
tags:
  - validani
  - arquitetura
  - multi-nucleo
  - supabase
  - rls
  - login
author: Caqui
date: '2026-09-09'
ts: '2026-09-09T21:56:39.381Z'
related: []
nextStep: >-
  Caqui validar se os dois eixos fecham. Se sim, detalhar em 5 seções e graduar
  a nota pra `02 Especificação/`: modelo de dados e nucleo_id, políticas de RLS,
  papéis e aprovação de acesso, etapas do funil como dado, e plano de migração
  do NI que já está em produção.
---
Proposta de arquitetura para escalar o ValidaNI do NI para os 5 núcleos da PJ. **Ainda não é decisão fechada** — é recomendação registrada, aguardando validação do Caqui. Nota completa no Vault: `01 Discovery/(C) ValidaNI - arquitetura multi-núcleo (repositório e login).md`.

**Requisito que amarra tudo:** "vê tudo, só não edita" (leitura cruzada entre núcleos + diretoria). Isso sozinho decide o eixo de repositório.

**Eixo 1 — repositório. Recomendado: Opção A** — um app, um deploy, um Supabase; núcleo como contexto de sessão na rota (`/n/ni/...`). Diferença entre núcleos vive em tabelas de config no banco (etapas, campos, documentos), não em código duplicado; diferença de comportamento real vira registry de módulos com lazy loading. Risco: config errada derruba os 5 — mitiga com validação de schema + smoke test por núcleo no CI.
- Opção B (monorepo, um app por núcleo) descartada: leitura cruzada fica caríssima (outra origem, outro auth, outro bundle) e 5 pipelines de deploy é dívida operacional insustentável com rotatividade semestral de empresa júnior.
- Opção C (5 projetos Supabase) descartada: mata a visibilidade cruzada, custo x5, auth fragmentada, migration x5.

**Eixo 2 — login. Descartado: senha por núcleo.** Não protege nada (viveria no cliente, Supabase não a conhece, RLS é quem segura de fato), vaza no primeiro print em grupo, não identifica ninguém (péssimo pra LGPD: sem rastreabilidade individual não há resposta a pedido de titular) e cada desligamento exigiria troca + reaviso do núcleo inteiro.
**No lugar: roteamento automático com queda para escolha** — 1 núcleo → direto no dashboard; 2+ ou diretoria → carrossel de seleção; 0 núcleos → solicitação de acesso com aprovação de gestor; retorno → último núcleo usado com seletor no header. O caso "0 núcleos" resolve a fonte de verdade dos membros sem depender do Google Admin (grupos do Workspace, se vierem, entram como sync que pré-preenche, não como pré-requisito). Núcleo de terceiros abre em "modo leitura" na UI, com RLS como garantia real.

**Dois furos a corrigir no desenho:** (1) token do MCP (`mcp_tokens`) precisa de escopo de núcleo, senão token de membro do NI lê os outros 4; (2) a tabela `products` provavelmente já é por núcleo na prática.
