"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleMCPClient = void 0;
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/client/stdio.js");
/**
 * Simple MCP Client for Testing
 *
 * This demonstrates how to:
 * - Create an MCP client
 * - Connect to an MCP server
 * - List available tools and resources
 * - Call tools with parameters
 * - Return data for testing purposes
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
    }
    /**
     * List all available tools
     */
    async listTools() {
        if (!this.client) {
            throw new Error("Client not connected");
        }
        const response = await this.client.listTools();
        return response.tools;
    }
    /**
     * Call a tool with the given parameters
     */
    async callTool(toolName, parameters = {}) {
        if (!this.client) {
            throw new Error("Client not connected");
        }
        const response = await this.client.callTool({
            name: toolName,
            arguments: parameters,
        });
        if (response.isError) {
            throw new Error(`Tool execution error: ${response.content[0]?.text || 'Unknown error'}`);
        }
        // Try to parse JSON response, otherwise return the text content
        const textContent = response.content
            .filter((c) => c.type === 'text')
            .map((c) => c.text)
            .join('\n');
        try {
            return JSON.parse(textContent);
        }
        catch {
            return textContent;
        }
    }
    /**
     * List available resources
     */
    async listResources() {
        if (!this.client) {
            throw new Error("Client not connected");
        }
        try {
            const response = await this.client.listResources();
            return response.resources;
        }
        catch (error) {
            // Server might not support resources
            return [];
        }
    }
    /**
     * Read a specific resource
     */
    async readResource(uri) {
        if (!this.client) {
            throw new Error("Client not connected");
        }
        const response = await this.client.readResource({ uri });
        return response.contents
            .filter(c => c.text)
            .map(c => c.text)
            .join('\n');
    }
    /**
     * Disconnect from the server
     */
    async disconnect() {
        if (this.client && this.transport) {
            await this.client.close();
            this.client = null;
            this.transport = null;
        }
    }
}
exports.SimpleMCPClient = SimpleMCPClient;
