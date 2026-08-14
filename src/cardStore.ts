import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
// @ts-ignore - gray-matter não publica types próprios de forma perfeita com NodeNext, mas a API é estável
import matter from "gray-matter";

// Mesmo padrão do memoryStore.ts: ancorado no módulo, não em process.cwd().
const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
export const CARDS_DIR = path.join(MODULE_DIR, "..", "cards");

export type CardStatus = "backlog" | "doing" | "done";
const VALID_STATUSES: CardStatus[] = ["backlog", "doing", "done"];

export interface CardEntry {
  slug: string;
  filePath: string;
  title: string;
  status: CardStatus;
  assignee: string;
  tags: string[];
  author: string;
  created: string;
  updated: string;
  content: string;
}

function ensureDir(): void {
  if (!fs.existsSync(CARDS_DIR)) fs.mkdirSync(CARDS_DIR, { recursive: true });
}

const DIACRITICS_RE = new RegExp("[\\u0300-\\u036f]", "g");

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITICS_RE, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function nowISO(): string {
  return new Date().toISOString();
}

function readCard(fileName: string): CardEntry {
  const filePath = path.join(CARDS_DIR, fileName);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug: fileName.replace(/\.md$/, ""),
    filePath,
    title: data.title ?? fileName,
    status: (data.status as CardStatus) ?? "backlog",
    assignee: data.assignee ?? "",
    tags: data.tags ?? [],
    author: data.author ?? "desconhecido",
    created: data.created ?? "",
    updated: data.updated ?? data.created ?? "",
    content: content.trim(),
  };
}

function writeCard(entry: CardEntry): void {
  const frontmatter = {
    title: entry.title,
    status: entry.status,
    assignee: entry.assignee,
    tags: entry.tags,
    author: entry.author,
    created: entry.created,
    updated: entry.updated,
  };
  const fileContent = matter.stringify(entry.content.trim() + "\n", frontmatter);
  fs.writeFileSync(entry.filePath, fileContent, "utf-8");
}

export function listCards(filter?: { status?: CardStatus; assignee?: string }): CardEntry[] {
  ensureDir();
  let entries = fs
    .readdirSync(CARDS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => readCard(f));

  if (filter?.status) entries = entries.filter((e) => e.status === filter.status);
  if (filter?.assignee) {
    const want = filter.assignee.trim().toLowerCase();
    entries = entries.filter((e) => e.assignee.trim().toLowerCase() === want);
  }

  // Ordena por atualização mais recente dentro de cada status
  return entries.sort((a, b) => (b.updated || "").localeCompare(a.updated || ""));
}

export interface CreateCardInput {
  title: string;
  description: string;
  author: string;
  tags?: string[];
  assignee?: string;
}

export function createCard(input: CreateCardInput): CardEntry {
  ensureDir();
  const baseSlug = slugify(input.title) || "card";
  let slug = baseSlug;
  let counter = 2;
  while (fs.existsSync(path.join(CARDS_DIR, `${slug}.md`))) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const ts = nowISO();
  const entry: CardEntry = {
    slug,
    filePath: path.join(CARDS_DIR, `${slug}.md`),
    title: input.title,
    status: "backlog",
    assignee: input.assignee ?? "",
    tags: input.tags ?? [],
    author: input.author,
    created: ts,
    updated: ts,
    content: input.description.trim(),
  };
  writeCard(entry);
  return entry;
}

export interface UpdateCardInput {
  slug: string;
  status?: CardStatus;
  assignee?: string;
  note?: string;
  author: string;
}

export class CardNotFoundError extends Error {}

function loadOrThrow(slug: string): CardEntry {
  const filePath = path.join(CARDS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    throw new CardNotFoundError(`Card "${slug}" não encontrado.`);
  }
  return readCard(`${slug}.md`);
}

export function updateCard(input: UpdateCardInput): CardEntry {
  const entry = loadOrThrow(input.slug);

  if (input.status) {
    if (!VALID_STATUSES.includes(input.status)) {
      throw new Error(`Status inválido: "${input.status}". Use backlog, doing ou done.`);
    }
    entry.status = input.status;
  }
  if (input.assignee !== undefined) entry.assignee = input.assignee;

  if (input.note) {
    const dateLabel = nowISO().slice(0, 16).replace("T", " ");
    entry.content = `${entry.content}\n\n---\n**${dateLabel} — ${input.author}:** ${input.note}`.trim();
  }

  entry.updated = nowISO();
  writeCard(entry);
  return entry;
}

/** Atalho: assume o card (vira "doing" + assignee = quem chamou), com nota opcional. */
export function claimCard(slug: string, author: string, note?: string): CardEntry {
  return updateCard({ slug, status: "doing", assignee: author, note, author });
}

/**
 * Texto pronto pra injetar no início de sessão: board resumido por coluna,
 * pra quem começa a sessão já ver o que tá rolando e poder escolher um card.
 */
export function buildBoardSummary(): string {
  const all = listCards();
  if (all.length === 0) {
    return "Nenhum card no board ainda. Use create_card pra abrir o primeiro.";
  }

  const byStatus: Record<CardStatus, CardEntry[]> = { backlog: [], doing: [], done: [] };
  for (const c of all) byStatus[c.status].push(c);

  const parts: string[] = ["**Board de cards (GBRAIN):**"];

  const label: Record<CardStatus, string> = {
    doing: "🔵 Em andamento",
    backlog: "⚪ Backlog (livre pra pegar)",
    done: "✅ Concluídos recentes",
  };

  for (const status of ["doing", "backlog", "done"] as CardStatus[]) {
    const cards = status === "done" ? byStatus.done.slice(0, 5) : byStatus[status];
    if (cards.length === 0) continue;
    parts.push(`\n${label[status]}:`);
    for (const c of cards) {
      const who = c.assignee ? ` — ${c.assignee}` : "";
      parts.push(`- [${c.slug}] ${c.title}${who}`);
    }
  }

  parts.push(
    "\nSe o usuário quiser atacar algo, sugira pegar um card do backlog (claim_card) em vez de começar do zero sem contexto."
  );

  return parts.join("\n");
}
