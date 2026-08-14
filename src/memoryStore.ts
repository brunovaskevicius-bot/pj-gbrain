import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
// @ts-ignore - gray-matter não publica types próprios de forma perfeita com NodeNext, mas a API é estável
import matter from "gray-matter";

// Ancorado na localização do próprio módulo (não em process.cwd()) — assim a memória
// sempre vai para gbrain-prototype/memory, independente de onde/como o processo for iniciado
// (ex: Claude Code pode rodar o servidor com outro cwd).
const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
export const MEMORY_DIR = path.join(MODULE_DIR, "..", "memory");

export interface MemoryEntry {
  slug: string;
  filePath: string;
  title: string;
  type: string;
  tags: string[];
  author: string;
  date: string;
  ts: string;
  related: string[];
  content: string;
}

function ensureDir(): void {
  if (!fs.existsSync(MEMORY_DIR)) fs.mkdirSync(MEMORY_DIR, { recursive: true });
}

export function listEntries(): MemoryEntry[] {
  ensureDir();
  return fs
    .readdirSync(MEMORY_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => readEntry(f));
}

function readEntry(fileName: string): MemoryEntry {
  const filePath = path.join(MEMORY_DIR, fileName);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug: fileName.replace(/\.md$/, ""),
    filePath,
    title: data.title ?? fileName,
    type: data.type ?? "nota",
    tags: data.tags ?? [],
    author: data.author ?? "desconhecido",
    date: data.date ?? "",
    ts: data.ts ?? data.date ?? "",
    related: data.related ?? [],
    content: content.trim(),
  };
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

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function nowISO(): string {
  return new Date().toISOString();
}

function titleOverlap(a: string, b: string): number {
  const toWords = (s: string) =>
    new Set(s.toLowerCase().split(/\W+/).filter((w) => w.length > 3));
  const wordsA = toWords(a);
  const wordsB = toWords(b);
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  let shared = 0;
  for (const w of wordsA) if (wordsB.has(w)) shared++;
  return shared / Math.min(wordsA.size, wordsB.size);
}

export interface SaveMemoryInput {
  title: string;
  content: string;
  type?: string;
  tags?: string[];
  author: string;
  related?: string[];
}

export interface SaveMemoryResult {
  slug: string;
  filePath: string;
  possibleDuplicates: { slug: string; title: string; overlap: number }[];
}

export function saveMemory(input: SaveMemoryInput): SaveMemoryResult {
  ensureDir();
  const existing = listEntries();
  const possibleDuplicates = existing
    .map((e) => ({ slug: e.slug, title: e.title, overlap: titleOverlap(e.title, input.title) }))
    .filter((d) => d.overlap >= 0.5)
    .sort((a, b) => b.overlap - a.overlap);

  const date = todayISO();
  const baseSlug = slugify(input.title) || "memoria";
  let slug = `${date}--${baseSlug}`;
  let counter = 2;
  while (fs.existsSync(path.join(MEMORY_DIR, `${slug}.md`))) {
    slug = `${date}--${baseSlug}-${counter}`;
    counter++;
  }

  const frontmatter = {
    title: input.title,
    type: input.type ?? "nota",
    tags: input.tags ?? [],
    author: input.author,
    date,
    ts: nowISO(),
    related: input.related ?? [],
  };

  const fileContent = matter.stringify(input.content.trim() + "\n", frontmatter);
  const filePath = path.join(MEMORY_DIR, `${slug}.md`);
  fs.writeFileSync(filePath, fileContent, "utf-8");

  return { slug, filePath, possibleDuplicates };
}

export interface SearchResult {
  slug: string;
  title: string;
  type: string;
  tags: string[];
  author: string;
  date: string;
  snippet: string;
  score: number;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSnippet(content: string, terms: string[], radius = 120): string {
  const lower = content.toLowerCase();
  for (const term of terms) {
    const idx = lower.indexOf(term);
    if (idx >= 0) {
      const start = Math.max(0, idx - radius / 2);
      const end = Math.min(content.length, idx + term.length + radius / 2);
      return (
        (start > 0 ? "…" : "") +
        content.slice(start, end).replace(/\s+/g, " ").trim() +
        (end < content.length ? "…" : "")
      );
    }
  }
  return content.slice(0, radius).replace(/\s+/g, " ").trim() + "…";
}

export function searchMemory(query: string, limit = 5): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  const entries = listEntries();

  const scored = entries.map((e) => {
    let score = 0;
    for (const term of terms) {
      const re = new RegExp(escapeRegex(term), "gi");
      const titleHits = (e.title.match(re) ?? []).length;
      const tagHits = e.tags.some((t) => t.toLowerCase().includes(term)) ? 1 : 0;
      const bodyHits = (e.content.match(re) ?? []).length;
      score += titleHits * 5 + tagHits * 3 + bodyHits;
    }
    return { e, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ e, score }) => ({
      slug: e.slug,
      title: e.title,
      type: e.type,
      tags: e.tags,
      author: e.author,
      date: e.date,
      snippet: buildSnippet(e.content, terms),
      score,
    }));
}

export function listRecent(limit = 5): MemoryEntry[] {
  return listEntries()
    .sort((a, b) => (b.ts || "").localeCompare(a.ts || ""))
    .slice(0, limit);
}

/**
 * Retorna o status mais recente de CADA autor (não o histórico todo) — responde
 * diretamente "no que cada um está trabalhando agora", sem poluir com status antigos
 * já superados. Status é memória perecível por natureza: o registro antigo continua no
 * disco (histórico), mas só o mais novo por pessoa aparece aqui.
 */
export function getTeamStatus(): MemoryEntry[] {
  const statuses = listEntries().filter((e) => e.type === "status");
  const latestByAuthor = new Map<string, MemoryEntry>();
  for (const entry of statuses) {
    const key = entry.author.trim().toLowerCase();
    const current = latestByAuthor.get(key);
    if (!current || (entry.ts || "") > (current.ts || "")) {
      latestByAuthor.set(key, entry);
    }
  }
  return [...latestByAuthor.values()].sort((a, b) => (b.ts || "").localeCompare(a.ts || ""));
}
