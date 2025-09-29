#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import Anthropic from "@anthropic-ai/sdk";
import { get_encoding } from "tiktoken";
import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from "zod";

const server = new Server(
  {
    name: "token-counter-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

async function countAnthropicTokens(content: string): Promise<number> {
  const anthropic = new Anthropic(); // Assumes ANTHROPIC_API_KEY is set in environment
  const message = await anthropic.messages.create({
    max_tokens: 1,
    messages: [{ role: "user", content }],
    model: "claude-3-haiku-20240307",
  });
  return message.usage.input_tokens;
}

async function countTokens(
  targetPath: string,
  file_pattern?: string,
  tokenizer: string = "tiktoken"
): Promise<number> {
  let allContent = "";
  const stats = await fs.stat(targetPath);

  if (stats.isDirectory()) {
    const { glob } = await import("glob");
    const pattern = file_pattern || "**/*";
    const files = await glob(pattern, {
      cwd: targetPath,
      nodir: true,
      dot: true,
    });

    for (const file of files) {
      try {
        const filePath = path.join(targetPath, file);
        const content = await fs.readFile(filePath, "utf-8");
        allContent += content + "\n"; // Add a newline to separate file contents
      } catch (e) {
        // Ignore files we can't read
      }
    }
  } else if (stats.isFile()) {
    allContent = await fs.readFile(targetPath, "utf-8");
  }

  if (tokenizer === "anthropic") {
    if (!allContent) return 0;
    return countAnthropicTokens(allContent);
  }

  // Default to tiktoken
  const enc = get_encoding("cl100k_base");
  try {
    return enc.encode(allContent).length;
  } finally {
    enc.free();
  }
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "count_tokens",
                description: "Count the number of tokens in a file or directory.",
                inputSchema: {
                    type: "object",
                    properties: {
                        path: {
                            type: "string",
                            description: "Path to a file or directory",
                        },
                        file_pattern: {
                            type: "string",
                            description: "Glob pattern to filter files (e.g., '*.ts')",
                        },
                        tokenizer: {
                            type: "string",
                            description: "The tokenizer to use (e.g., 'tiktoken', 'anthropic'). Defaults to 'tiktoken'.",
                        },
                    },
                    required: ["path"],
                },
            },
        ],
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request: z.infer<typeof CallToolRequestSchema>) => {
    if (request.params.name !== 'count_tokens') {
        throw new Error(`Unknown tool: ${request.params.name}`);
    }

    const {
      path: targetPath,
      file_pattern,
      tokenizer,
    } = request.params.arguments as {
      path: string;
      file_pattern?: string;
      tokenizer?: string;
    };

    try {
        const tokenCount = await countTokens(targetPath, file_pattern, tokenizer);
        return {
            content: [
                {
                    type: "text",
                    text: `Total token count: ${tokenCount}`,
                },
            ],
        };
    } catch (error: any) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error counting tokens: ${error.message}`,
                },
            ],
            isError: true,
        };
    }
});


async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Token Counter MCP server running on stdio');
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
