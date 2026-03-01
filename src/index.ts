#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { callDeepWikiAskQuestion } from "./client.js";

const server = new McpServer({
  name: "deepwiki-ask",
  version: "0.1.0",
});

server.registerTool(
  "ask_question",
  {
    title: "Ask DeepWiki Question",
    description: `Ask any question about a GitHub repository and get an AI-powered, context-grounded response.

Args:
  - repoName: GitHub repository or list of repositories (max 10) in owner/repo format (e.g. "facebook/react")
  - question: The question to ask about the repository

Returns:
  AI-generated answer grounded in the repository's codebase and documentation.

Examples:
  - "How does the middleware system work?" with repoName "expressjs/express"
  - "What is the architecture of the project?" with repoName "vercel/next.js"`,
    inputSchema: {
      repoName: z
        .union([z.string(), z.array(z.string().min(1)).max(10)])
        .describe(
          'GitHub repository or list of repositories (max 10) in owner/repo format (e.g. "facebook/react")',
        ),
      question: z
        .string()
        .min(1)
        .describe("The question to ask about the repository"),
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  async (params: { repoName: string | string[]; question: string }) => {
    const result = await callDeepWikiAskQuestion(
      params.repoName,
      params.question,
    );

    return result.match(
      (value) => ({
        content: [{ type: "text" as const, text: value }],
      }),
      (error) => ({
        isError: true as const,
        content: [
          {
            type: "text" as const,
            text: `Error: ${error.message} [${error.code}]`,
          },
        ],
      }),
    );
  },
);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[deepwiki-ask] MCP server running via stdio");
}

main().catch((error: unknown) => {
  console.error("[deepwiki-ask] Server error:", error);
  process.exit(1);
});
