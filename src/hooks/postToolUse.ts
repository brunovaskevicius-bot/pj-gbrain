#!/usr/bin/env node
// Hook PostToolUse (matcher: mcp__gbrain__save_memory): sincroniza a memória
// automaticamente após qualquer gravação — commit + push, sem depender de ninguém
// lembrar de fazer isso. Best-effort: sem rede não deve quebrar a tool call que já rodou.
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
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
  let input: Record<string, any> = {};
  try {
    input = raw ? JSON.parse(raw) : {};
  } catch {
    process.exit(0);
  }

  const toolInput = input.tool_input ?? {};
  const author = toolInput.author ?? "desconhecido";
  const type = toolInput.type ?? "nota";

  if (type === "status") {
    const sessionId = String(input.session_id ?? "unknown");
    fs.mkdirSync(MARKER_DIR, { recursive: true });
    fs.writeFileSync(path.join(MARKER_DIR, `${sessionId}.status-saved`), new Date().toISOString());
  }

  try {
    execSync("git add memory", { cwd: REPO_DIR, stdio: "ignore" });
    execSync(`git commit -m "gbrain: ${type} de ${author}" --quiet`, {
      cwd: REPO_DIR,
      stdio: "ignore",
    });
    execSync("git push --quiet", { cwd: REPO_DIR, stdio: "ignore", timeout: 15_000 });
  } catch {
    // nada pra commitar, sem rede, sem remote — best-effort, não falha a tool call
  }

  process.exit(0);
}

main();
