#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
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

async function countTokens(targetPath: string, file_pattern?: string): Promise<number> {
    const enc = get_encoding("cl100k_base");
    let tokenCount = 0;

    try {
        const stats = await fs.stat(targetPath);

        if (stats.isDirectory()) {
            const { glob } = await import('glob');
            const pattern = file_pattern || '**/*';
            const files = await glob(pattern, { cwd: targetPath, nodir: true, dot: true });

            for (const file of files) {
                try {
                    const filePath = path.join(targetPath, file);
                    const content = await fs.readFile(filePath, "utf-8");
                    tokenCount += enc.encode(content).length;
                } catch (e) {
                    // Ignore files we can't read
                }
            }
        } else if (stats.isFile()) {
            const content = await fs.readFile(targetPath, "utf-8");
            tokenCount += enc.encode(content).length;
        }
    } finally {
        enc.free();
    }
    return tokenCount;
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

    const { path: targetPath, file_pattern } = request.params.arguments as { path: string; file_pattern?: string };

    try {
        const tokenCount = await countTokens(targetPath, file_pattern);
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
