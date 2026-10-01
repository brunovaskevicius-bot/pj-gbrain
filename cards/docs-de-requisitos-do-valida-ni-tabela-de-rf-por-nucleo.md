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
updated: '2026-10-01T19:35:57.113Z'
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

---
**2026-09-28 13:28 — Bruno:** Draftei a RF do ValiDADOS (NDados) a partir de uma ata de reunião (transcrição informal, meio suja — teve trecho truncado que precisei confirmar com Bruno: "gravação do BS" = gravação da call de validação). Arquivo: `11 Valida NI/(C) RF — ValiDADOS (NDados).md`.

Escopo confirmado com Bruno (3 perguntas diretas): (1) ValiDADOS valida escopo/demanda comercial, mesmo padrão dos outros núcleos (Definition of Ready) — não é review de entregável de aprendiz; (2) os cards vivem dentro do próprio app Valida NI (módulo "Cards"), não em ferramenta terceira; (3) confirmado o trecho truncado da ata.

7 RF propostos pra seção 2.5 (NDados): card com checklist de Definition of Ready (01), validação item-a-item pelo núcleo (02), pasta de Drive automática por card via API pra anexos/gravação de call (03), v1 100% manual sem IA — combinado explicitamente na reunião pro time se acostumar com a plataforma antes de automatizar (04), resultado de validação público pra todo o núcleo — valor declarado pra aprendizes aprenderem o padrão (05), notificações (06) e login/perfis (07) mantidos como placeholder porque a ata não cobriu isso. MCP pra discussão/validação via mensagens foi registrado como direção futura, fora do escopo da v1.

Pendências: identificar o papel da Bibi (voz mais forte da call, mas o gerente formal listado é Lucas Reis) e confirmar RF-06/07 com ele. Ainda não editei o Google Doc mestre — mesma limitação de ferramenta do RF do NTec (sem edição de conteúdo no Docs, só leitura), o texto fica pronto pra Bruno colar.

---
**2026-10-01 19:35 — Caqui:** 2026-10-01, Caqui: a seção 2.3 (NTec, ValidaTech com nome provisório) foi reescrita em 12 RFs, na ordem do fluxo do Miro e confirmada com o Caqui. As linhas antigas foram juntadas: 01+06, 02+08 e 05+09; o 07 virou o RF-02. Entraram RFs novos para os gargalos que estavam sem cobertura: pré-validação por IA, fila com aceite, feedback visível com consulta ao CP, base de features e integrações, prompt da proposta, biblioteca de prompts, prazos contados a partir da reunião de proposta e métricas de superdimensionamento. O texto pronto para colar está em `02 Especificação/(C) ValidaTech - requisitos funcionais (NTec).md`, no vault do Caqui. Antes de fechar faltam 4 respostas do NTec: como funciona a extração do Lovable, se registram horas reais por feature, os prazos em dias e as faixas de carga. O card continua em doing porque os outros núcleos ainda estão abertos.
