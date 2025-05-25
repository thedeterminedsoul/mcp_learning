import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

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

export class SimpleMCPClient {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;

  /**
   * Connect to an MCP server
   */
  async connect(serverCommand: string, serverArgs: string[] = []): Promise<void> {
    // Create transport
    this.transport = new StdioClientTransport({
      command: serverCommand,
      args: serverArgs,
    });

    // Create client
    this.client = new Client({
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
  async listTools(): Promise<any[]> {
    if (!this.client) {
      throw new Error("Client not connected");
    }

    const response = await this.client.listTools();
    return response.tools;
  }

  /**
   * Call a tool with the given parameters
   */
  async callTool(toolName: string, parameters: Record<string, any> = {}): Promise<any> {
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
    const textContent = (response.content as any[])
      .filter((c: any) => c.type === 'text')
      .map((c: any) => c.text)
      .join('\n');

    try {
      return JSON.parse(textContent);
    } catch {
      return textContent;
    }
  }

  /**
   * List available resources
   */
  async listResources(): Promise<any[]> {
    if (!this.client) {
      throw new Error("Client not connected");
    }

    try {
      const response = await this.client.listResources();
      return response.resources;
    } catch (error) {
      // Server might not support resources
      return [];
    }
  }

  /**
   * Read a specific resource
   */
  async readResource(uri: string): Promise<string> {
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
  async disconnect(): Promise<void> {
    if (this.client && this.transport) {
      await this.client.close();
      this.client = null;
      this.transport = null;
    }
  }
}
