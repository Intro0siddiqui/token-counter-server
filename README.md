

Creating a token-aware system to manage the context window for LLMs is a sophisticated approach to optimizing multi-agent workflows. It correctly identifies a key bottleneck in current AI-powered development systems.

This is a TypeScript-based MCP server that provides a tool for counting tokens in files and directories.

## Installation

To get started, you first need to clone the repository and build the server from the source code.

### Step 1: Clone and Build

1.  **Clone the repository** to your local machine:
    ```bash
    git clone https://github.com/intro0siddiqui/token-counter-server.git
    ```

2.  **Navigate into the directory**:
    ```bash
    cd token-counter-server
    ```

3.  **Install dependencies and build the project**:
    ```bash
    npm install
    npm run build
    ```
After this step, the server is ready to be used. You can now configure your MCP client (like Claude Desktop) to use it.

### Step 2: Configure Your Client

You have two options for configuring your client:

#### Option A: Use the Full Path (Simple)

You can point your client directly to the built server file. This is the simplest method and doesn't require any global system changes.

In your `claude_desktop_config.json`, use the full path to `build/index.js` inside the directory you just cloned.

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
*Remember to replace `/path/to/your/cloned/repo` with the actual, absolute path on your system.*

#### Option B: Make the Command Globally Available (Advanced)

If you prefer to use a simple `token-counter-server` command without typing the full path, you can install the server as a global command.

**Important**: You must be inside the `token-counter-server` directory (the one you cloned) before running this command.

1.  **Install globally from the local source**:
    ```bash
    npm install -g .
    ```
    This command creates a symbolic link on your system that points to the server executable.

2.  **Configure your client with the simple command**:
    Now you can use `token-counter-server` in your client configuration:
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