import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listCards, type CardEntry, type CardStatus } from "./cardStore.js";

// Nota do vault que exibe o board de cards em markdown puro — sem depender do
// plugin Dataview (não instalado neste vault). Reescrita inteira a cada mudança
// de card, direto pelos tool handlers do server.ts. Não é pra editar à mão.
const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
export const BOARD_NOTE_PATH = path.join(
  MODULE_DIR,
  "..",
  "..",
  "(C) Board — Kanban de Cards (GBRAIN).md"
);

function renderCard(c: CardEntry): string {
  const who = c.assignee ? `*${c.assignee}*` : "*sem dono*";
  const tags = c.tags.length ? " " + c.tags.map((t) => `#${t}`).join(" ") : "";
  const snippet = c.content.split("\n---\n")[0].trim().slice(0, 240);
  return `- **${c.title}** (\`${c.slug}\`) — ${who}${tags}\n  > ${snippet}`;
}

function renderColumn(title: string, emoji: string, cards: CardEntry[]): string {
  if (cards.length === 0) {
    return `## ${emoji} ${title}\n\n_vazio_\n`;
  }
  return `## ${emoji} ${title}\n\n${cards.map(renderCard).join("\n")}\n`;
}

export function renderBoardMarkdown(): string {
  const all = listCards();
  const byStatus: Record<CardStatus, CardEntry[]> = { backlog: [], doing: [], done: [] };
  for (const c of all) byStatus[c.status].push(c);

  const updatedAt = new Date().toISOString().slice(0, 16).replace("T", " ");

  return [
    "# 📋 Board de Cards — GBRAIN",
    "",
    "> Gerado automaticamente pelo GBRAIN toda vez que um card muda (criado, assumido ou atualizado " +
      "via Claude Code). **Não editar esta nota à mão** — a próxima sincronização sobrescreve. Para " +
      "mexer nos cards, converse com o Claude (`list_cards`, `create_card`, `claim_card`, `update_card`) " +
      "ou edite os arquivos-fonte em `05 System/gbrain-prototype/cards/`.",
    "",
    `**Última atualização:** ${updatedAt}`,
    "",
    renderColumn("Em andamento", "🔵", byStatus.doing),
    renderColumn("Backlog (livre pra pegar)", "⚪", byStatus.backlog),
    renderColumn("Concluídos", "✅", byStatus.done),
  ].join("\n");
}

export function syncBoardNote(): void {
  try {
    fs.writeFileSync(BOARD_NOTE_PATH, renderBoardMarkdown(), "utf-8");
  } catch {
    // best-effort — não deve derrubar a tool call que disparou o sync
  }
}
