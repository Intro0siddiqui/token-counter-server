# token-counter-server MCP Server

[![MCP Badge](https://lobehub.com/badge/mcp-full/intro0siddiqui-token-counter-server)](https://lobehub.com/mcp/intro0siddiqui-token-counter-server)

Creating a token-aware system to manage the context window for LLMs is a sophisticated approach to optimizing multi-agent workflows. It correctly identifies a key bottleneck in current AI-powered development systems.

This is a TypeScript-based MCP server that provides a tool for counting tokens in files and directories.

## Installation

There are two primary ways to install and run this server.

### Method 1: From Source (Manual)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/intro0siddiqui/token-counter-server.git
    cd token-counter-server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Build the server:**
    ```bash
    npm run build
    ```

4.  **Configure your client (e.g., Claude Desktop):**
    Add the following to your `claude_desktop_config.json`:
    -   **MacOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
    -   **Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

    ```json
    {
      "mcpServers": {
        "token-counter-server": {
          "command": "/path/to/your/cloned/repo/token-counter-server/build/index.js"
        }
      }
    }
    ```
    *Replace `/path/to/your/cloned/repo` with the actual path.*

### Method 2: Install as a Global Command

This method makes the `token-counter-server` command available globally, so you don't need to use the full path in your client configuration.

1.  **Install globally from the local source:**
    After cloning the repository, installing dependencies, and building the project (as described in Method 1), navigate to the project's root directory and run:
    ```bash
    npm install -g .
    ```
    This will install the package from the current directory and create a symbolic link to the executable in your system's path.

2.  **Configure your client:**
    You can now use the `token-counter-server` command directly in your MCP client configuration:
    ```json
    {
      "mcpServers": {
        "token-counter-server": {
          "command": "token-counter-server"
        }
      }
    }
    ```

## Tools Included

This server provides the following tool:

-   **`count_tokens`**: Counts the number of tokens in a file or directory.
    -   `path` (string, required): The path to the file or directory.
    -   `file_pattern` (string, optional): A glob pattern to filter files (e.g., `*.ts`).

## Prompts

Here are some example prompts you can use:

-   **Count tokens in a single file:**
    > "Can you count the tokens in `src/index.ts`?"

-   **Count tokens in a directory with a filter:**
    > "How many tokens are in the `src` directory, only counting `.ts` files?"

You can find these and other examples in the `prompts/` directory.

## Resources

This MCP includes sample files for testing and demonstration purposes.

-   `resources/sample.txt`: A sample text file to test token counting.

## Development

-   **Install dependencies:** `npm install`
-   **Build:** `npm run build`
-   **Watch for changes:** `npm run watch`

## Debugging

To debug the server, you can use the MCP Inspector:
```bash
npm run inspector
```
This will provide a browser-based interface to inspect the communication between the client and the server.