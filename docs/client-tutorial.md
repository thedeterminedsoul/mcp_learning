# MCP Client Development Guide

This guide covers building MCP clients that can connect to and interact with MCP servers.

## Client Architecture

MCP clients are responsible for:
1. **Connection Management**: Establishing and maintaining server connections
2. **Protocol Handling**: Managing JSON-RPC communication
3. **Tool Discovery**: Finding available tools and resources
4. **Request/Response**: Executing operations and handling results

## Basic Client Implementation

Our `SimpleMCPClient` demonstrates the core patterns:

```typescript
export class SimpleMCPClient {
  private client: Client;
  private transport: StdioClientTransport | null = null;

  constructor() {
    this.client = new Client(
      { name: 'simple-mcp-client', version: '1.0.0' },
      { capabilities: {} }
    );
  }
}
```

## Connection Patterns

### Stdio Transport (Most Common)

```typescript
async connect(command: string, args: string[]): Promise<void> {
  this.transport = new StdioClientTransport({
    command,
    args,
    stderr: 'pipe' // Capture errors
  });

  await this.client.connect(this.transport);
}
```

### SSE Transport (Server-Sent Events)

```typescript
// For web-based clients
const transport = new SSEClientTransport(
  new URL('http://localhost:3000/sse')
);
await client.connect(transport);
```

## Tool Discovery and Execution

### Listing Available Tools

```typescript
async listTools(): Promise<Tool[]> {
  const response = await this.client.request(
    { method: 'tools/list' },
    ListToolsRequestSchema
  );
  return response.tools;
}
```

### Calling Tools

```typescript
async callTool(name: string, args: any): Promise<any> {
  const response = await this.client.request(
    {
      method: 'tools/call',
      params: { name, arguments: args }
    },
    CallToolRequestSchema
  );
  
  return this.parseToolResponse(response);
}
```

## Resource Management

### Listing Resources

```typescript
async listResources(): Promise<Resource[]> {
  const response = await this.client.request(
    { method: 'resources/list' },
    ListResourcesRequestSchema
  );
  return response.resources;
}
```

### Reading Resources

```typescript
async readResource(uri: string): Promise<string> {
  const response = await this.client.request(
    {
      method: 'resources/read',
      params: { uri }
    },
    ReadResourceRequestSchema
  );
  
  return response.contents
    .map(content => content.text)
    .join('\n');
}
```

## Error Handling Patterns

### Connection Errors

```typescript
async connect(command: string, args: string[]): Promise<void> {
  try {
    this.transport = new StdioClientTransport({
      command,
      args,
      stderr: 'pipe'
    });

    await this.client.connect(this.transport);
    logger.info('Connected to MCP server');
  } catch (error) {
    logger.error('Failed to connect:', error);
    throw new Error(`Connection failed: ${error.message}`);
  }
}
```

### Request Errors

```typescript
async callTool(name: string, args: any): Promise<any> {
  try {
    const response = await this.client.request(
      {
        method: 'tools/call',
        params: { name, arguments: args }
      },
      CallToolRequestSchema
    );
    
    if (response.isError) {
      throw new Error(`Tool error: ${response.content[0]?.text}`);
    }
    
    return this.parseToolResponse(response);
  } catch (error) {
    logger.error(`Tool call failed: ${name}`, error);
    throw error;
  }
}
```

## Advanced Client Features

### Connection Pooling

```typescript
export class MCPClientPool {
  private connections = new Map<string, SimpleMCPClient>();

  async getClient(serverName: string): Promise<SimpleMCPClient> {
    if (!this.connections.has(serverName)) {
      const client = new SimpleMCPClient();
      await client.connect(/* server config */);
      this.connections.set(serverName, client);
    }
    
    return this.connections.get(serverName)!;
  }
}
```

### Request Caching

```typescript
export class CachedMCPClient extends SimpleMCPClient {
  private cache = new Map<string, any>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  async listTools(): Promise<Tool[]> {
    const cacheKey = 'tools';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    
    const tools = await super.listTools();
    this.cache.set(cacheKey, {
      data: tools,
      timestamp: Date.now()
    });
    
    return tools;
  }
}
```

### Retry Logic

```typescript
async callToolWithRetry(
  name: string, 
  args: any, 
  maxRetries = 3
): Promise<any> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await this.callTool(name, args);
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        logger.warn(`Tool call attempt ${attempt} failed, retrying...`);
      }
    }
  }
  
  throw lastError!;
}
```

## Testing Client Code

### Unit Tests

```typescript
import { SimpleMCPClient } from '../src/client/simple-client.js';

describe('SimpleMCPClient', () => {
  let client: SimpleMCPClient;

  beforeEach(() => {
    client = new SimpleMCPClient();
  });

  afterEach(async () => {
    await client.disconnect();
  });

  test('should connect to calculator server', async () => {
    await client.connect('node', ['dist/servers/calculator.js']);
    const tools = await client.listTools();
    
    expect(tools).toHaveLength(4);
    expect(tools.map(t => t.name)).toContain('add');
  });

  test('should perform calculations', async () => {
    await client.connect('node', ['dist/servers/calculator.js']);
    
    const result = await client.callTool('add', { a: 5, b: 3 });
    expect(result).toEqual({ result: 8 });
  });
});
```

### Integration Tests

```typescript
describe('Client-Server Integration', () => {
  test('should work with multiple servers', async () => {
    const calcClient = new SimpleMCPClient();
    const weatherClient = new SimpleMCPClient();
    
    await calcClient.connect('node', ['dist/servers/calculator.js']);
    await weatherClient.connect('node', ['dist/servers/weather.js']);
    
    const mathResult = await calcClient.callTool('add', { a: 1, b: 2 });
    const weatherResult = await weatherClient.callTool('get-alerts', {
      latitude: 40.7128,
      longitude: -74.0060
    });
    
    expect(mathResult.result).toBe(3);
    expect(weatherResult).toBeDefined();
  });
});
```

## Example Usage Patterns

### Interactive CLI Client

```typescript
#!/usr/bin/env node

import readline from 'readline';
import { SimpleMCPClient } from './simple-client.js';

async function interactiveCLI() {
  const client = new SimpleMCPClient();
  await client.connect('node', ['dist/servers/calculator.js']);
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  console.log('MCP Calculator Client');
  console.log('Available commands: add, subtract, multiply, divide');
  
  rl.on('line', async (input) => {
    const [command, ...args] = input.trim().split(' ');
    
    try {
      if (['add', 'subtract', 'multiply', 'divide'].includes(command)) {
        const [a, b] = args.map(Number);
        const result = await client.callTool(command, { a, b });
        console.log(`Result: ${result.result}`);
      } else {
        console.log('Unknown command');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
    
    rl.prompt();
  });
  
  rl.prompt();
}

interactiveCLI().catch(console.error);
```

### Web Client Example

```typescript
// For use in web applications
export class WebMCPClient {
  private serverEndpoint: string;

  constructor(serverEndpoint: string) {
    this.serverEndpoint = serverEndpoint;
  }

  async callTool(name: string, args: any): Promise<any> {
    const response = await fetch(`${this.serverEndpoint}/tools/call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, arguments: args })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }
}
```

## Best Practices

1. **Connection Management**: Always close connections properly
2. **Error Handling**: Implement comprehensive error handling
3. **Timeouts**: Set reasonable timeouts for operations
4. **Logging**: Add detailed logging for debugging
5. **Validation**: Validate responses from servers
6. **Caching**: Cache tool lists and other static data
7. **Retry Logic**: Implement retry for transient failures

## Next Steps

1. Extend the SimpleMCPClient with additional features
2. Build a GUI client using Electron or web technologies
3. Create specialized clients for specific domains
4. Integrate MCP clients into existing applications
5. Explore advanced transport options
