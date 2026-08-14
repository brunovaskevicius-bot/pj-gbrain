# GBRAIN — protótipo v0

Memória coletiva de agentes via MCP. Testado end-to-end em 13/08/2026 (ver `(C) Benchmark — Arquitetura de Repositório e Memória Coletiva de Agentes (GBRAIN).md` em `01 Benchmark/` pra entender o porquê das escolhas técnicas abaixo).

## O que é

Um servidor MCP fino sobre markdown com frontmatter versionado em git (`memory/*.md`). Sem vector DB, sem grafo — de propósito. A pesquisa mostrou que pra essa escala (dezenas/centenas de registros, crescimento orgânico), busca por palavra-chave resolve, e vetor/grafo só valem a pena quando isso parar de escalar.

Expõe 8 tools MCP:

**Memória (imutável, um arquivo por registro em `memory/*.md`):**
- **`search_memory(query, limit?)`** — busca por palavra-chave em título/tags/conteúdo, com scoring simples e snippet.
- **`save_memory(title, content, type?, tags?, author, related?)`** — grava uma memória nova, com detecção de possível duplicata por similaridade de título (aviso, não bloqueio).
- **`list_recent_memory(limit?)`** — lista as memórias mais recentes, pra retomar contexto de trabalho de outra pessoa.
- **`team_status()`** — retorna o status mais recente de CADA pessoa (não o histórico) — responde direto "no que cada um tá trabalhando agora". Cada status pode ter um `nextStep` — o próximo passo declarado por quem salvou.

**Cards / kanban do time (mutável, um arquivo por card em `cards/*.md`):**
- **`list_cards(status?, assignee?)`** — vê o board: backlog, em andamento (`doing`) e concluídos (`done`), com dono de cada um.
- **`create_card(title, description, author, tags?, assignee?)`** — abre um card novo, começa em `backlog`.
- **`claim_card(slug, author, note?)`** — assume um card do backlog: vira `doing` + você como dono.
- **`update_card(slug, status?, assignee?, note?, author)`** — muda status/dono e/ou registra uma nota no histórico do card (aprendizado, progresso, bloqueio).

Toda mudança de card também reescreve automaticamente a nota `05 System/(C) Board — Kanban de Cards (GBRAIN).md` — um board em markdown puro (sem depender do plugin Dataview, que não está instalado neste vault) que você abre no Obsidian pra ver o estado atual sem precisar perguntar ao Claude.

## O que colocar aqui — taxonomia de `type`

| type | Natureza | Exemplo real |
|---|---|---|
| **decisao** | Permanente. Sobrevive ao projeto. Vira ADR de fato. | "Reconsiderar hexagonal → vertical slice" |
| **aprendizado** | Permanente. O que funcionou/não funcionou e por quê. | "Popup de feedback antes da S9 gera ruído — usar entrevista qualitativa" |
| **fato** | Permanente. Dado institucional estável. | "NCon já tem uma Silu rodando" |
| **status** | **Perecível.** O que a pessoa está fazendo AGORA. Só o mais recente por autor importa — consulte com `team_status`, não `search_memory`. | "Terminei o schema do NCiv, começando ingestão do NTec" |
| **bloqueio** | Perecível-ish. Impedimento que trava alguém e precisa de ajuda de outra pessoa. | "Travado esperando acesso à base do NDados — preciso que o Reis libere" |
| **nota** | Catch-all. Quando não sabe qual dos acima usar. | — |

**Regra prática pro dia a dia:** toda vez que alguém (você ou um aprendiz) terminar uma sessão de trabalho, pede pro Claude salvar um `status` de 2-3 linhas antes de fechar. Isso substitui o "fup de áudio diário" por algo que o PRÓXIMO agente (seu ou do outro aprendiz) consegue ler antes de continuar o trabalho — não substitui a conversa humana, complementa.

## Por que essas decisões

- **Markdown > vector DB**: a própria Anthropic validou isso oficialmente (memory tool, set/2025) — arquivo é inspecionável, diffável, git-native, e reduziu 84% de tokens vs. vector DB num eval deles.
- **Governança manual, não automática**: escrita concorrente entre múltiplos agentes é problema de pesquisa em aberto (nem Zep/Mem0/Letta resolveram de vez). Por isso `save_memory` só *avisa* de duplicata possível — quem decide é a pessoa, não o sistema.
- **`author` é obrigatório**: sem isso, memória coletiva de time perde a única coisa que multi-agente ainda não sabe resolver sozinho — quem é o dono do fato.

## Como testar

```bash
npm install
npm run smoketest   # spawna o servidor de verdade via stdio e chama as 3 tools
```

## Como rodar via Claude Code

Já está registrado no `.mcp.json` na raiz do projeto (`PJ — Assessor de Produtos 2026.2/.mcp.json`) como o server `gbrain`. Reinicie o Claude Code nesse projeto e as 3 tools ficam disponíveis — teste pedindo algo como *"busca na memória coletiva se já discutimos arquitetura hexagonal"*.

## Como os aprendizes acessam isso

Não é um servidor hospedado — é markdown versionado, então o compartilhamento é via **git**, não uma URL central. Cada pessoa roda sua própria cópia do servidor localmente, todas lendo/escrevendo no mesmo repo git.

1. Este projeto (`gbrain-prototype/`) vira um repo git próprio (privado no GitHub da PJ ou pessoal seu).
2. Cada aprendiz: `git clone` do repo → `npm install` → cria/edita o `.mcp.json` do próprio Claude Code apontando pra essa pasta clonada (mesmo formato do `.mcp.json` deste projeto, só que com paths relativos à raiz do clone: `node_modules/tsx/dist/cli.mjs` e `src/server.ts`, sem o prefixo `05 System/gbrain-prototype/`).
3. **Disciplina de sync é automática, não manual** — ver seção de hooks abaixo. `git pull` no início da sessão e `git commit`+`push` depois de cada `save_memory` já rodam sozinhos, via hooks do Claude Code.
4. Conflito de merge no `memory/` é raro e barato de resolver — são arquivos markdown independentes, um por memória; só colide se duas pessoas criarem o mesmo slug no mesmo dia (o `saveMemory` já numera automaticamente pra evitar isso).

**Quando isso vira dor** (tempo real de verdade, não só sync assíncrono): sobe pra um servidor MCP remoto (HTTP/SSE) com um backend simples por trás. Não construir isso agora — é o tipo de complexidade que a pesquisa (seção de governança do benchmark) diz pra adicionar só quando a dor for real, não antes.

## Automação via hooks (Claude Code)

Configurados em `.claude/settings.json` na raiz do projeto — cada pessoa (você e os aprendizes) precisa ter os mesmos 3 hooks configurados no `.claude/settings.json` do próprio clone (copie o bloco `hooks` de lá, ajustando os paths se a estrutura de pastas do clone for diferente):

| Hook | Evento | O que faz |
|---|---|---|
| **SessionStart** | Início/resume de qualquer sessão | `git pull` na memória + injeta `team_status`, bloqueios recentes E o board de cards (backlog/doing/done) como contexto, antes da primeira resposta — já dá pra sugerir "pega esse card do backlog" de cara |
| **Stop** | Antes da sessão terminar | Se ninguém salvou um `status` nesta sessão ainda, pede pro Claude decidir se vale registrar um antes de fechar; se um card foi trabalhado, pede também pra atualizar o status dele e registrar o aprendizado (não força — ignora se não houve trabalho relevante) |
| **PostToolUse** (matcher `save_memory\|create_card\|claim_card\|update_card`) | Depois de qualquer uma dessas tools | `git add`/`commit`/`push` automático de `memory/` e `cards/` — ninguém precisa lembrar de sincronizar. Mudanças de card também reescrevem a nota do board na hora, dentro do próprio tool handler (não depende do hook rodar) |

Tudo best-effort: sem rede, sem remote configurado, ou qualquer erro nesses scripts NUNCA deve travar a sessão — eles engolem erro e deixam a sessão seguir normal.

**Importante:** hooks só são lidos quando a sessão inicia (ou via `/hooks` pra forçar reload numa sessão já aberta). Se você editou `.claude/settings.json` com a sessão já rodando, abra `/hooks` uma vez ou reinicie pra ativar.

## Próximos passos (não implementados ainda — são decisão de processo, não de código)

1. **Quem escreve** — hoje qualquer agente com a tool pode gravar. Decidir se os aprendizes têm gravação livre ou passam por review antes (pergunta 2 do benchmark).
2. **Índice leve quando a busca por palavra-chave não escalar mais** — SQLite+FTS é o próximo passo natural, não vetor direto.
3. **Isso pode virar a semente real da Silu-MCP** — a Silu (produto pra empresa toda) é essa mesma arquitetura, com curadoria de bases institucionais por cima. Não é código descartável.
