// Smoke test end-to-end: spawna o servidor MCP real via stdio e chama as 3 tools,
// exatamente como o Claude Code faria. Não é teste unitário — é teste de integração real.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: ["node_modules/tsx/dist/cli.mjs", "src/server.ts"],
  });

  const client = new Client({ name: "smoketest-client", version: "0.1.0" });
  await client.connect(transport);

  console.log("=== tools/list ===");
  const tools = await client.listTools();
  console.log(tools.tools.map((t) => t.name).join(", "));

  console.log("\n=== save_memory #1 ===");
  const save1 = await client.callTool({
    name: "save_memory",
    arguments: {
      title: "Decisão: reconsiderar hexagonal para vertical slice + shared kernel",
      content:
        "No desafio, Bruno comprometeu arquitetura hexagonal como base dos 3 produtos (Valida NI, Silu, PCP Automática). Pesquisa pós-aprovação mostrou que hexagonal resolve um problema (troca de infraestrutura) que nenhum dos 3 produtos tem hoje, e que camadas técnicas são piores para agentes de IA navegarem do que estrutura por feature. Recomendação: vertical slice dentro de cada produto + shared kernel fino (packages/shared) entre eles, hexagonal reservada só para o MCP da Silu se a fonte de conhecimento realmente precisar trocar.",
      type: "decisao",
      tags: ["arquitetura", "hexagonal", "vertical-slice"],
      author: "Bruno Vaskevicius",
    },
  });
  console.log(JSON.stringify(save1, null, 2));

  console.log("\n=== save_memory #2 (título parecido, testa detecção de duplicata) ===");
  const save2 = await client.callTool({
    name: "save_memory",
    arguments: {
      title: "Reconsiderar arquitetura hexagonal dos produtos",
      content: "Registro de teste para validar detecção de duplicata por similaridade de título.",
      type: "nota",
      author: "Bruno Vaskevicius",
    },
  });
  console.log(JSON.stringify(save2, null, 2));

  console.log("\n=== search_memory: 'hexagonal' ===");
  const search1 = await client.callTool({
    name: "search_memory",
    arguments: { query: "hexagonal arquitetura" },
  });
  console.log(JSON.stringify(search1, null, 2));

  console.log("\n=== list_recent_memory ===");
  const recent = await client.callTool({ name: "list_recent_memory", arguments: {} });
  console.log(JSON.stringify(recent, null, 2));

  console.log("\n=== save_memory: status Aprendiz A ===");
  await client.callTool({
    name: "save_memory",
    arguments: {
      title: "Status — teste aprendiz A",
      content: "Testando fluxo de status.",
      type: "status",
      author: "Aprendiz Teste A",
    },
  });

  console.log("\n=== save_memory: status Aprendiz A (segundo, deve superar o primeiro) ===");
  await client.callTool({
    name: "save_memory",
    arguments: {
      title: "Status — teste aprendiz A (atualizado)",
      content: "Segundo status, deve ser o único retornado por team_status pra essa pessoa.",
      type: "status",
      author: "Aprendiz Teste A",
    },
  });

  console.log("\n=== team_status ===");
  const status = await client.callTool({ name: "team_status", arguments: {} });
  console.log(JSON.stringify(status, null, 2));

  await client.close();
}

main().catch((err) => {
  console.error("Smoke test falhou:", err);
  process.exitCode = 1;
});
