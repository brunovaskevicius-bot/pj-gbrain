#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { saveMemory, searchMemory, listRecent, getTeamStatus } from "./memoryStore.js";
import {
  listCards,
  createCard,
  claimCard,
  updateCard,
  CardNotFoundError,
  type CardStatus,
} from "./cardStore.js";
import { syncBoardNote } from "./boardNote.js";

const server = new McpServer({
  name: "gbrain",
  version: "0.1.0",
});

server.registerTool(
  "search_memory",
  {
    title: "Buscar na memória coletiva (GBRAIN)",
    description:
      "Busca por palavra-chave na memória coletiva do time (decisões, aprendizados e fatos registrados por qualquer membro). Use antes de responder perguntas sobre histórico de decisões, produtos internos da Poli Júnior (Valida NI, Silu, PCP Automática) ou contexto institucional, em vez de assumir ou inventar. Retorna os trechos mais relevantes com autor e data.",
    inputSchema: {
      query: z.string().describe("Termos de busca, em português, palavras-chave simples"),
      limit: z.number().int().min(1).max(20).optional().describe("Máximo de resultados (padrão 5)"),
    },
  },
  async ({ query, limit }) => {
    const results = searchMemory(query, limit ?? 5);
    if (results.length === 0) {
      return {
        content: [{ type: "text", text: `Nenhum resultado na memória coletiva para "${query}".` }],
      };
    }
    const text = results
      .map(
        (r, i) =>
          `${i + 1}. [${r.type}] "${r.title}" — por ${r.author} em ${r.date} (slug: ${r.slug})\n   ${r.snippet}`
      )
      .join("\n\n");
    return { content: [{ type: "text", text }] };
  }
);

server.registerTool(
  "save_memory",
  {
    title: "Salvar na memória coletiva (GBRAIN)",
    description:
      "Grava uma decisão, aprendizado, fato, status de trabalho ou bloqueio na memória coletiva do time, para que outros agentes/membros encontrem depois via search_memory (ou via team_status, no caso de 'status'). Use quando uma decisão for tomada, um aprendizado relevante surgir, ou algo precisar ficar registrado para dar continuidade ao trabalho de outra pessoa. SEMPRE informe o autor real — quem está pedindo o registro, não 'Claude'.",
    inputSchema: {
      title: z.string().describe("Título curto e descritivo da memória"),
      content: z.string().describe("Conteúdo em markdown — o que foi decidido/aprendido e por quê"),
      type: z
        .enum(["decisao", "aprendizado", "fato", "status", "bloqueio", "nota"])
        .optional()
        .describe(
          "Tipo da memória (padrão: nota). 'decisao'/'aprendizado'/'fato' = permanente, sobrevive ao projeto. " +
            "'status' = o que a pessoa está fazendo AGORA — perecível, use team_status para consultar (não search_memory). " +
            "'bloqueio' = impedimento que trava o trabalho, precisa de ajuda de alguém."
        ),
      tags: z.array(z.string()).optional().describe("Tags livres, ex: ['silu', 'arquitetura']"),
      author: z.string().describe("Nome de quem está registrando esta memória"),
      related: z.array(z.string()).optional().describe("Slugs de memórias relacionadas, se souber"),
      nextStep: z
        .string()
        .optional()
        .describe(
          "Próximo passo claro pra quem for continuar isso (você mesmo ou outra pessoa). " +
            "Especialmente importante em type='status' — é o que team_status/SessionStart mostram em destaque."
        ),
    },
  },
  async ({ title, content, type, tags, author, related, nextStep }) => {
    const result = saveMemory({ title, content, type, tags, author, related, nextStep });
    let text = `Memória salva: "${title}" (slug: ${result.slug}).`;
    if (result.possibleDuplicates.length > 0) {
      text +=
        `\n\n⚠️ Possível duplicata — títulos parecidos já existem na memória coletiva:\n` +
        result.possibleDuplicates
          .map((d) => `- "${d.title}" (slug: ${d.slug})`)
          .join("\n") +
        `\nVale confirmar com quem pediu o registro se isso é realmente novo ou deveria atualizar a memória existente.`;
    }
    return { content: [{ type: "text", text }] };
  }
);

server.registerTool(
  "list_recent_memory",
  {
    title: "Listar memórias recentes (GBRAIN)",
    description:
      "Lista as memórias mais recentes registradas no GBRAIN — útil para retomar o contexto de trabalho de outra pessoa do time antes de continuar uma tarefa.",
    inputSchema: {
      limit: z.number().int().min(1).max(20).optional().describe("Máximo de itens (padrão 5)"),
    },
  },
  async ({ limit }) => {
    const entries = listRecent(limit ?? 5);
    if (entries.length === 0) {
      return { content: [{ type: "text", text: "Memória coletiva ainda vazia." }] };
    }
    const text = entries
      .map(
        (e, i) => `${i + 1}. [${e.type}] "${e.title}" — por ${e.author} em ${e.date} (slug: ${e.slug})`
      )
      .join("\n");
    return { content: [{ type: "text", text }] };
  }
);

server.registerTool(
  "team_status",
  {
    title: "Status atual do time (GBRAIN)",
    description:
      "Retorna o status de trabalho MAIS RECENTE de cada pessoa do time (não o histórico completo) — responde diretamente 'no que cada um está trabalhando agora'. Use isso em vez de search_memory quando a pergunta for sobre o presente ('o que o [nome] tá fazendo', 'alguém está travado em algo', 'quem está livre'). Registros de status antigos continuam pesquisáveis via search_memory, mas aqui só aparece o mais novo por autor.",
    inputSchema: {},
  },
  async () => {
    const statuses = getTeamStatus();
    if (statuses.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "Nenhum status registrado ainda. Peça pra cada pessoa salvar um com save_memory (type: 'status').",
          },
        ],
      };
    }
    const text = statuses
      .map((s) => {
        let line = `**${s.author}** (${s.date}): ${s.title}\n   ${s.content.slice(0, 200)}`;
        if (s.nextStep) line += `\n   → Próximo passo: ${s.nextStep}`;
        return line;
      })
      .join("\n\n");
    return { content: [{ type: "text", text }] };
  }
);

server.registerTool(
  "list_cards",
  {
    title: "Ver o board de cards (GBRAIN)",
    description:
      "Mostra o board de cards do time (kanban): backlog, em andamento ('doing') e concluídos ('done'), com quem está executando cada um. Use no início de uma sessão pra saber o que está livre pra pegar, ou quando alguém perguntar 'o que tem pra fazer' / 'quem tá com o quê'. Pode filtrar por status ou por quem está atribuído.",
    inputSchema: {
      status: z
        .enum(["backlog", "doing", "done"])
        .optional()
        .describe("Filtrar só por uma coluna do board"),
      assignee: z.string().optional().describe("Filtrar só cards de uma pessoa"),
    },
  },
  async ({ status, assignee }) => {
    const cards = listCards({ status: status as CardStatus | undefined, assignee });
    if (cards.length === 0) {
      return { content: [{ type: "text", text: "Nenhum card encontrado com esse filtro." }] };
    }
    const text = cards
      .map((c) => {
        const who = c.assignee ? ` — atribuído a ${c.assignee}` : " — livre";
        const tags = c.tags.length ? ` [${c.tags.join(", ")}]` : "";
        return `[${c.slug}] (${c.status}) "${c.title}"${who}${tags}\n   ${c.content.slice(0, 200)}`;
      })
      .join("\n\n");
    return { content: [{ type: "text", text }] };
  }
);

server.registerTool(
  "create_card",
  {
    title: "Criar card novo (GBRAIN)",
    description:
      "Cria um card novo no board (kanban) do time, começando em 'backlog'. Use quando uma ideia, tarefa ou pedaço de trabalho novo surgir e merecer virar algo rastreável pro time — não pra tudo, só pro que tem valor acompanhar.",
    inputSchema: {
      title: z.string().describe("Título curto do card"),
      description: z.string().describe("Descrição em markdown do que precisa ser feito e por quê"),
      author: z.string().describe("Nome de quem está criando o card"),
      tags: z.array(z.string()).optional().describe("Tags livres, ex: ['silu', 'frontend']"),
      assignee: z
        .string()
        .optional()
        .describe("Se já nasce atribuído a alguém (padrão: sem dono, fica no backlog livre)"),
    },
  },
  async ({ title, description, author, tags, assignee }) => {
    const card = createCard({ title, description, author, tags, assignee });
    syncBoardNote();
    return {
      content: [
        { type: "text", text: `Card criado: "${title}" (slug: ${card.slug}, status: backlog).` },
      ],
    };
  }
);

server.registerTool(
  "claim_card",
  {
    title: "Pegar um card do board (GBRAIN)",
    description:
      "Assume um card do backlog: atribui a quem está pedindo e move pra 'doing'. Use quando o usuário disser que vai atacar um card específico, ou pedir 'me dá um card' (nesse caso, sugira um do backlog via list_cards primeiro).",
    inputSchema: {
      slug: z.string().describe("Slug do card a assumir (ver em list_cards)"),
      author: z.string().describe("Nome de quem está assumindo o card"),
      note: z.string().optional().describe("Nota opcional sobre como vai atacar o card"),
    },
  },
  async ({ slug, author, note }) => {
    try {
      const card = claimCard(slug, author, note);
      syncBoardNote();
      return {
        content: [
          { type: "text", text: `Card "${card.title}" (${slug}) assumido por ${author} — status: doing.` },
        ],
      };
    } catch (err) {
      if (err instanceof CardNotFoundError) {
        return { content: [{ type: "text", text: err.message }], isError: true };
      }
      throw err;
    }
  }
);

server.registerTool(
  "update_card",
  {
    title: "Atualizar um card (GBRAIN)",
    description:
      "Atualiza status e/ou dono de um card existente, e/ou registra uma nota (aprendizado, progresso, motivo de bloqueio) no histórico do card. Use ao terminar de trabalhar num card ('done'), ao encontrar um bloqueio, ou pra deixar registrado o que foi aprendido — mesmo sem mudar de status.",
    inputSchema: {
      slug: z.string().describe("Slug do card a atualizar (ver em list_cards)"),
      status: z.enum(["backlog", "doing", "done"]).optional().describe("Novo status, se mudou"),
      assignee: z.string().optional().describe("Novo dono do card, se mudou (string vazia = devolve pro backlog sem dono)"),
      note: z
        .string()
        .optional()
        .describe("Nota a registrar no card: o que foi aprendido, progresso feito, ou motivo de bloqueio"),
      author: z.string().describe("Nome de quem está atualizando o card"),
    },
  },
  async ({ slug, status, assignee, note, author }) => {
    try {
      const card = updateCard({ slug, status: status as CardStatus | undefined, assignee, note, author });
      syncBoardNote();
      return {
        content: [
          {
            type: "text",
            text: `Card "${card.title}" (${slug}) atualizado — status: ${card.status}${card.assignee ? `, dono: ${card.assignee}` : ""}.`,
          },
        ],
      };
    } catch (err) {
      if (err instanceof CardNotFoundError) {
        return { content: [{ type: "text", text: err.message }], isError: true };
      }
      throw err;
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
