#!/usr/bin/env node
// Hook Stop: antes de a sessão terminar, se ninguém salvou um status ainda nesta
// sessão, pede pro próprio Claude decidir se vale registrar (não força — a sessão pode
// ter sido só uma pergunta, sem trabalho real pra registrar).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const MARKER_DIR = path.join(REPO_DIR, ".session-markers");

function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    if (process.stdin.isTTY) return resolve("");
    let data = "";
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", () => resolve(""));
  });
}

async function main() {
  const raw = await readStdin();
  let input: Record<string, unknown> = {};
  try {
    input = raw ? JSON.parse(raw) : {};
  } catch {
    process.exit(0);
  }

  // Já tentamos bloquear uma vez nesta sessão — não insistir de novo (evita loop infinito).
  if (input.stop_hook_active) {
    process.exit(0);
  }

  const sessionId = String(input.session_id ?? "unknown");
  fs.mkdirSync(MARKER_DIR, { recursive: true });
  const markerPath = path.join(MARKER_DIR, `${sessionId}.status-saved`);

  if (fs.existsSync(markerPath)) {
    process.exit(0); // já salvou status nesta sessão
  }

  process.stdout.write(
    JSON.stringify({
      decision: "block",
      reason:
        "Antes de terminar: se este trabalho merece continuidade, chame a tool mcp__gbrain__save_memory " +
        "(type: 'status', com nextStep claro) resumindo o que foi feito e o que falta. " +
        "Se algum card do board foi trabalhado nesta sessão (mcp__gbrain__claim_card/update_card), " +
        "atualize o status dele (ex: 'done' se terminou) e registre uma nota com o que foi aprendido, via mcp__gbrain__update_card. " +
        "Se a sessão não teve trabalho relevante (só pergunta, sem decisão/produção), ignore isto e finalize normalmente.",
    })
  );
}

main();
