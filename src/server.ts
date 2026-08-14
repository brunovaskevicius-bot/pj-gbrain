#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { saveMemory, searchMemory, listRecent, getTeamStatus } from "./memoryStore.js";

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
    },
  },
  async ({ title, content, type, tags, author, related }) => {
    const result = saveMemory({ title, content, type, tags, author, related });
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
      .map((s) => `**${s.author}** (${s.date}): ${s.title}\n   ${s.content.slice(0, 200)}`)
      .join("\n\n");
    return { content: [{ type: "text", text }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
