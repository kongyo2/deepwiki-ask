import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { ok, err, type Result } from "neverthrow";
import { DeepWikiError } from "./errors.js";
import { withRetry } from "./retry.js";

const DEEPWIKI_MCP_URL =
  process.env["DEEPWIKI_MCP_URL"] ?? "https://mcp.deepwiki.com/mcp";

const TOOL_CALL_TIMEOUT_MS = 120_000;

function extractText(
  content: Array<{ type: string; [key: string]: unknown }>,
): string {
  const parts: string[] = [];
  for (const item of content) {
    if (item.type === "text" && typeof item.text === "string") {
      parts.push(item.text);
    }
  }
  return parts.join("\n");
}

async function callOnce(
  repoName: string | string[],
  question: string,
): Promise<Result<string, DeepWikiError>> {
  let client: Client | undefined;

  try {
    client = new Client(
      { name: "deepwiki-ask", version: "1.0.0" },
      { capabilities: {} },
    );
    const transport = new StreamableHTTPClientTransport(
      new URL(DEEPWIKI_MCP_URL),
    );
    await client.connect(transport);

    const result = await client.callTool(
      {
        name: "ask_question",
        arguments: { repoName, question },
      },
      undefined,
      { timeout: TOOL_CALL_TIMEOUT_MS },
    );

    const content = result.content as Array<{
      type: string;
      [key: string]: unknown;
    }>;

    if (result.isError) {
      const errorText = extractText(content);
      return err(
        new DeepWikiError(
          errorText || "Unknown DeepWiki error",
          "DEEPWIKI_ERROR",
        ),
      );
    }

    const text = extractText(content);
    return ok(text);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);

    if (
      message.includes("timeout") ||
      message.includes("ETIMEDOUT") ||
      message.includes("ECONNABORTED")
    ) {
      return err(new DeepWikiError(message, "TIMEOUT"));
    }

    return err(new DeepWikiError(message, "CONNECTION_ERROR"));
  } finally {
    if (client) {
      await client.close().catch(() => {});
    }
  }
}

export async function callDeepWikiAskQuestion(
  repoName: string | string[],
  question: string,
): Promise<Result<string, DeepWikiError>> {
  return withRetry(() => callOnce(repoName, question));
}
