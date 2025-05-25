"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleMCPClient = void 0;
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/client/stdio.js");
/**
 * Simple MCP Client Example
 *
 * This demonstrates how to:
 * - Create an MCP client
 * - Connect to an MCP server
 * - List available tools
 * - Call tools with parameters
 * - Handle responses and errors
 */
class SimpleMCPClient {
    constructor() {
        this.client = null;
        this.transport = null;
    }
    /**
     * Connect to an MCP server
     */
    async connect(serverCommand, serverArgs = []) {
        console.log(`Connecting to MCP server: ${serverCommand} ${serverArgs.join(' ')}`);
        // Create transport
        this.transport = new stdio_js_1.StdioClientTransport({
            command: serverCommand,
            args: serverArgs,
        });
        // Create client
        this.client = new index_js_1.Client({
            name: "simple-mcp-client",
            version: "1.0.0",
        }, {
            capabilities: {},
        });
        // Connect
        await this.client.connect(this.transport);
        console.log("Connected to MCP server!");
    }
    /**
     * List all available tools
     */
    async listTools() {
        if (!this.client) {
            throw new Error("Client not connected");
        }
        console.log("\n=== Available Tools ===");
        const response = await this.client.listTools();
        if (response.tools.length === 0) {
            console.log("No tools available");
            return;
        }
        response.tools.forEach((tool, index) => {
            console.log(`${index + 1}. ${tool.name}`);
            console.log(`   Description: ${tool.description}`);
            if (tool.inputSchema) {
                console.log(`   Input Schema: ${JSON.stringify(tool.inputSchema, null, 2)}`);
            }
            console.log("");
        });
    }
    /**
     * Call a tool with the given parameters
     */
    async callTool(toolName, parameters = {}) {
        if (!this.client) {
            throw new Error("Client not connected");
        }
        console.log(`\n=== Calling Tool: ${toolName} ===`);
        console.log(`Parameters: ${JSON.stringify(parameters, null, 2)}`);
        try {
            const response = await this.client.callTool({
                name: toolName,
                arguments: parameters,
            });
            console.log("Response:");
            response.content.forEach((content, index) => {
                if (content.type === "text") {
                    console.log(`${index + 1}. ${content.text}`);
                }
                else {
                    console.log(`${index + 1}. [${content.type}] (content not shown)`);
                }
            });
            if (response.isError) {
                console.log("⚠️  Tool execution resulted in an error");
            }
        }
        catch (error) {
            console.error(`Error calling tool: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * List available resources
     */
    async listResources() {
        if (!this.client) {
            throw new Error("Client not connected");
        }
        console.log("\n=== Available Resources ===");
        try {
            const response = await this.client.listResources();
            if (response.resources.length === 0) {
                console.log("No resources available");
                return;
            }
            response.resources.forEach((resource, index) => {
                console.log(`${index + 1}. ${resource.name || resource.uri}`);
                console.log(`   URI: ${resource.uri}`);
                console.log(`   Description: ${resource.description || "No description"}`);
                console.log(`   MIME Type: ${resource.mimeType || "unknown"}`);
                console.log("");
            });
        }
        catch (error) {
            console.log("Server does not support resources or error occurred");
        }
    }
    /**
     * Read a specific resource
     */
    async readResource(uri) {
        if (!this.client) {
            throw new Error("Client not connected");
        }
        console.log(`\n=== Reading Resource: ${uri} ===`);
        try {
            const response = await this.client.readResource({ uri });
            response.contents.forEach((content, index) => {
                console.log(`Content ${index + 1}:`);
                console.log(`URI: ${content.uri}`);
                console.log(`MIME Type: ${content.mimeType}`);
                if (content.text) {
                    console.log("Text Content:");
                    console.log(content.text);
                }
                else if (content.blob) {
                    console.log(`Binary Content: ${content.blob.length} bytes`);
                }
                console.log("");
            });
        }
        catch (error) {
            console.error(`Error reading resource: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Disconnect from the server
     */
    async disconnect() {
        if (this.client && this.transport) {
            await this.client.close();
            this.client = null;
            this.transport = null;
            console.log("Disconnected from MCP server");
        }
    }
}
exports.SimpleMCPClient = SimpleMCPClient;
/**
 * Interactive demo function
 */
async function runDemo() {
    const client = new SimpleMCPClient();
    try {
        // Connect to calculator server
        console.log("🧮 Testing Calculator Server");
        await client.connect("node", ["build/servers/calculator.js"]);
        await client.listTools();
        await client.callTool("add", { a: 5, b: 3 });
        await client.callTool("multiply", { a: 4, b: 7 });
        await client.callTool("factorial", { number: 5 });
        await client.callTool("sqrt", { number: 16 });
        await client.disconnect();
        // Wait a moment between connections
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Connect to filesystem server
        console.log("\n📁 Testing Filesystem Server");
        await client.connect("node", ["build/servers/filesystem.js"]);
        await client.listTools();
        await client.listResources();
        await client.callTool("list-directory", { path: "." });
        await client.callTool("file-info", { path: "package.json" });
        await client.disconnect();
    }
    catch (error) {
        console.error("Demo error:", error);
    }
}
// Run demo if this file is executed directly
// Note: In a real application, you might want to use a different approach
// for detecting if this is the main module in ESM
const isMainModule = process.argv[1] && process.argv[1].endsWith('simple-client.js');
if (isMainModule) {
    runDemo().catch(console.error);
}
