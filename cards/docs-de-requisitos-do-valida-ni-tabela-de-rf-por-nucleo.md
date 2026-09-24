---
title: Docs de requisitos do Valida NI — tabela de RF por núcleo
status: doing
assignee: Bruno
tags:
  - valida-ni
  - requisitos
  - docs
author: Bruno
created: '2026-09-21T17:56:32.076Z'
updated: '2026-09-24T13:04:44.868Z'
---
Criar os docs de requisitos de cada versão do Valida NI (NI · CIValida/NCiv · ValidTech/NTec · ValidaCON/NCon), com foco principal na tabela de Requisitos Funcionais (RF).

**Modelo de referência (estrutura a seguir):** [PRD Rede Inspira · Plataforma IA de Desempenho](https://docs.google.com/document/d/1dHko194IfFDFLXUiKo6f47O0y23jUMPPtvAwdO0eO4E/edit?tab=t.0)

**Fonte dos processos de validação por núcleo:** [Miro — Valida NI](https://miro.com/app/board/uXjVHo0aayA=/)

**Primeiro doc criado (scaffold, base NI):** [Requisitos — Valida NI · Base (NI)](https://docs.google.com/document/d/1Oc2QGbYMEZUXcaks6s17gyf6XFFHXuVk7nBMy99l21k/edit) — estrutura pronta (Visão Geral, RF, RNF, Referências); a tabela de RF está com placeholders por categoria (registro de escopo, validação pelo núcleo, notificações, métricas, autenticação) — completar linha a linha usando os processos mapeados no Miro.

Próximo passo: revisar o board do Miro núcleo a núcleo e preencher a RF de cada versão, depois duplicar a estrutura pros outros núcleos.

---
**2026-09-21 17:57 — Bruno:** Scaffold do doc base criado: [Requisitos — Valida NI · Base (NI)](https://docs.google.com/document/d/1Oc2QGbYMEZUXcaks6s17gyf6XFFHXuVk7nBMy99l21k/edit), estrutura baseada no PRD Rede Inspira, seção de Requisitos Funcionais dividida em 5 categorias (registro de escopo, validação pelo núcleo, notificações, métricas, autenticação) com placeholders "[completar a partir do Miro]" — não inventei conteúdo real de RF porque depende do fluxo específico mapeado no board do Miro. Falta: revisar o Miro núcleo a núcleo, preencher a tabela de RF do NI, e depois duplicar/adaptar o doc pra CIValida (NCiv), ValidTech (NTec) e ValidaCON (NCon).

---
**2026-09-21 18:00 — Bruno:** Correção: o scaffold anterior só cobria NI e faltava o NDados (5 núcleos reais: NI, NCiv, NCon, NTec, NDados). Doc antigo (só NI) foi pra lixeira do Drive; refeito como [Requisitos — Valida NI (por Núcleo)](https://docs.google.com/document/d/12UxKMgms4_-RJpJkUE3fYJQzfs9qPCo7unMrCD2QRK4/edit) — agora com uma seção e uma tabela de RF própria pra cada núcleo (NI/Valida NI, NCiv/CIValida, NTec/ValidTech, NCon/ValidaCON, NDados/nome a definir), todas com placeholder "[completar a partir do Miro]". NDados não tem nome de versão nem gerente confirmado no fluxo — Lucas Reis é o gerente do núcleo, mas o processo específico ainda não está mapeado.

---
**2026-09-24 13:04 — Bruno:** Bruno trouxe um exemplo concreto de saída pro NTec: `07 Attachments/__REQUISITOS__ValeDOC_v2.docx`, um doc de requisitos completo (projeto fictício de telemedicina) que segue um padrão rigoroso — Visão Geral, Notas/Abreviaturas (convenção A(cli)D/SID), RF numerado por seção com Regras de Negócio (RN-XX), RNF, Exclusões Explícitas. A ideia dele: um agente de IA lê a transcrição da call de handoff Comercial→NTec e gera direto um rascunho nesse formato, substituindo o levantamento manual de escopo.

Escopo confirmado com Bruno (pergunta direta): esse mecanismo é específico do NTec por enquanto, NÃO generaliza pros outros núcleos (NI, NCiv, NCon, NDados seguem como estão, dependendo do Miro).

Draftei a RF real pra seção 2.3 (NTec — ValidTech) em `11 Valida NI/(C) RF — ValidTech (NTec).md`: RF-NTec-01 (registro via transcrição), 02 (IA gera rascunho no padrão ValeDOC), 03 (validação humana obrigatória antes de ir pro Comercial/cliente — princípio puxado do próprio ValeDOC, seção do prontuário assistido por IA), 04 (notificações), 05 (métricas), 06 (login). Ainda NÃO foi pra dentro do Google Doc mestre — Bruno vai revisar no vault primeiro.

Pendências levantadas: (1) o prompt/spec exato do agente de IA fica pra depois, como Skill em `06 Skills/` — não faz parte do doc de requisitos; (2) falta confirmar com Gabriel Gáudio (gerente NTec) se o handoff real passa por call transcrita e onde essa transcrição nasce (Fireflies/Otter/gravação nativa) — pré-requisito de infra pro RF-NTec-01.
