#!/usr/bin/env node
// Hook SessionStart: roda "git pull" na memória coletiva e injeta o status do time
// como contexto, ANTES da primeira resposta da sessão. Best-effort — nunca deve travar
// o início de uma sessão (sem rede, sem remote configurado etc. são casos normais).
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { buildSessionContext } from "../memoryStore.js";

const REPO_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

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
  await readStdin(); // não usamos o input hoje, só drenamos o pipe

  try {
    execSync("git pull --quiet", { cwd: REPO_DIR, stdio: "ignore", timeout: 10_000 });
  } catch {
    // sem rede / sem remote / conflito — não é motivo pra travar a sessão
  }

  const context = buildSessionContext();

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext: context,
      },
    })
  );
}

main();
