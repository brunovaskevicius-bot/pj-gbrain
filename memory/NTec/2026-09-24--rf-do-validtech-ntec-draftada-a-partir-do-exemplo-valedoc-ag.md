---
title: >-
  RF do ValidTech (NTec) draftada a partir do exemplo ValeDOC — aguardando
  validação de Bruno pra ir ao doc mestre
type: status
nucleo: NTec
tags:
  - valida-ni
  - ntec
  - validtech
  - requisitos
author: Bruno
date: '2026-09-24'
ts: '2026-09-24T13:05:04.026Z'
related: []
nextStep: >-
  1) Bruno validar/ajustar a tabela em `11 Valida NI/(C) RF — ValidTech
  (NTec).md`. 2) Se aprovado, atualizar a seção 2.3 do doc mestre
  (https://docs.google.com/document/d/12UxKMgms4_-RJpJkUE3fYJQzfs9qPCo7unMrCD2QRK4/edit)
  substituindo os placeholders "[completar a partir do Miro]" pela RF real. 3)
  Confirmar com Gabriel Gáudio se o handoff do NTec passa por call transcrita e
  onde essa transcrição nasce (pré-requisito de infra pro RF-NTec-01). 4) O
  prompt/spec do agente de IA em si fica pra fase de implementação, como Skill
  em `06 Skills/` — não faz parte do doc de requisitos. 5) NI, NCiv, NCon,
  NDados continuam parados até revisão do board do Miro (card ainda em 'doing').
---
Bruno colocou `07 Attachments/__REQUISITOS__ValeDOC_v2.docx` como exemplo do padrão de saída que o ValidTech deve produzir: Visão Geral → Notas/Abreviaturas (convenção A(cli)D = app cliente / SID = sistema integrado) → Requisitos Funcionais numerados por seção, cada um com bloco de Regras de Negócio (RN-XX) → Requisitos Não Funcionais → Exclusões Explícitas. Conteúdo do exemplo (telemedicina) é irrelevante — o que importa é o rigor do formato.

Ideia central: um agente de IA lê a transcrição da call de handoff Comercial→NTec e gera direto um rascunho de doc nesse formato, substituindo o levantamento manual/informal de escopo (a dor que o Valida NI como um todo existe pra resolver).

Escopo confirmado com Bruno via pergunta direta: esse mecanismo (transcrição → IA → doc) é específico do NTec por enquanto — NÃO generalizei pra NI/NCiv/NCon/NDados, que seguem dependendo da revisão do Miro (conforme status anterior de 2026-09-21).

Produzido nesta sessão: `11 Valida NI/(C) RF — ValidTech (NTec).md` com 6 RF propostos (RF-NTec-01 a 06: registro via transcrição, geração do rascunho por IA, validação humana obrigatória antes de ir ao Comercial/cliente, notificações, métricas, login) e 3 Regras de Negócio derivadas do próprio ValeDOC (especialmente o princípio de que conteúdo de IA nunca vira registro final sem revisão humana explícita, puxado da seção de prontuário assistido por IA do exemplo).

Ainda não editei o Google Doc mestre (Requisitos — Valida NI por Núcleo) — Bruno vai revisar a tabela no vault primeiro antes de decidir se substitui os placeholders da seção 2.3 (NTec — ValidTech).
