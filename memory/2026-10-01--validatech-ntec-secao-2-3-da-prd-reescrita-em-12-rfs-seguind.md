---
title: >-
  ValidaTech (NTec): seção 2.3 da PRD reescrita em 12 RFs seguindo o fluxo de
  validação do NTec
type: decisao
tags:
  - valida-ni
  - ntec
  - validatech
  - requisitos
  - prd
author: Caqui
date: '2026-10-01'
ts: '2026-10-01T19:35:48.414Z'
related:
  - 2026-09-24--rf-do-validtech-ntec-draftada-a-partir-do-exemplo-valedoc-ag
nextStep: ''
---
Sessão de 2026-10-01 (Caqui + Claude). A seção 2.3 (NTec) do doc mestre "Requisitos — Valida NI (por Núcleo)" foi reescrita com base no fluxo e nos 7 gargalos do Miro do NTec, que o Caqui confirmou. O texto completo, pronto para colar, está no vault do Caqui: `02 Especificação/(C) ValidaTech - requisitos funcionais (NTec).md`. O nome do produto continua provisório (ValidaTech, ValiTech ou ValidTech), e por isso os textos dizem "a plataforma".

**Papéis:** CN = Consultor de Negócios; AS = Analista Sênior (validador); CP = Gerente de Projetos.

**O que mudou na tabela antiga (RF-NTec-01 a 09):**
- 01 e 06 viraram o RF-01.
- 07 virou o RF-02.
- 02 e 08 viraram o RF-05.
- 05 e 09 viraram o RF-12 ("Mantido do template base").

**Nova ordem, que segue o fluxo:**
- 01 Abertura do card e insumos: transcrição da AT e do aprofundamento, link e descrição do protótipo do Lovable, docs de API.
- 02 Rascunho do PRD por IA no padrão ValeDOC. O CN pode usar prompt próprio, mas a estrutura é obrigatória.
- 03 Pré-validação automática por IA. O CN vê o resultado e corrige antes de mandar para a fila. Horas e confiança por feature, apoiadas na base.
- 04 Fila com aceite. O resumo mostra APIs, carga leve/médio/pesado e prazo. A fila é ordenada pelo prazo, e o gerente é avisado se ninguém aceitar.
- 05 Validação técnica pelo AS. Veredito por feature (aprovada / com ressalva / fora do escopo, e o que fica fora vai para Exclusões Explícitas). Feedback obrigatório e aceite "Revisei o conteúdo gerado". Sem "Validado", não há pacote nem prompt da proposta.
- 06 Feedback visível para todo o NTec e consulta ao CP dentro do card.
- 07 Base de features e integrações, semiautomática.
- 08 Prompt da proposta, gerado só depois de "Validado", para o Claude Design. O design system da PJ entra quando existir.
- 09 Biblioteca de prompts versionada: Lovable, PRD, pré-validação e proposta.
- 10 Prazos contados para trás a partir da reunião de proposta, mais as notificações.
- 11 Métricas: ajuste IA × AS desde o primeiro card, dimensionado × realizado, tempos, retrabalho e adoção.
- 12 Login.

**Decisões do Caqui:**
1. A IA roda dentro da plataforma, com um prompt único padrão. O CN pode usar prompt próprio de vez em quando.
2. O card chega ao AS por fila com aceite, com um resumo para ele escolher por afinidade técnica e carga.
3. O dimensionamento é em horas, por feature.
4. "Proposta marcada" = a reunião de proposta com o cliente já tem data. Os prazos são contados para trás a partir dela.
5. A base é semiautomática: a feature entra com a aprovação do gerente de projetos ou do AS que validou.
6. A plataforma NÃO gera a proposta. Ela gera os prompts que o CN cola nas ferramentas externas (Lovable, Claude Design).
7. Os prompts não têm dono: qualquer membro do NTec edita, e o controle vem do versionamento.

**Limite registrado:** a plataforma não consegue impedir o CN de mandar uma proposta ao cliente por fora. O que ela faz é tornar isso inútil, porque sem validação não há pacote nem prompt, e visível, com alerta ao gerente se o deal no Pipedrive passar para "proposta enviada" sem validação. Isso também deve virar regra de processo.

**Perguntas pendentes para o NTec:**
1. A extração do Lovable é um prompt no chat do Lovable que devolve uma descrição em texto?
2. Os projetos registram as horas reais gastas por feature? Se não registram, a métrica dimensionado × realizado não existe.
3. Quantos dias antes da reunião de proposta vencem o aceite e a validação?
4. Quais são as faixas de horas de leve, médio e pesado?

As respostas 1 e 2 podem mudar o texto dos RF-01, 07 e 11.
