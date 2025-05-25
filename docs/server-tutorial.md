# MCP Server Development Tutorial

This tutorial walks you through creating MCP servers from simple to advanced examples.

## Prerequisites

- Node.js 18+ installed
- TypeScript knowledge
- Understanding of async/await patterns

## Step 1: Simple Calculator Server

Let's start with a basic server that provides mathematical operations.

### Key Concepts Demonstrated
- Server initialization
- Tool registration
- Input validation with Zod
- Error handling

### Code Walkthrough

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
```

**Important**: We use the MCP SDK to handle the protocol details. The server handles:
1. Tool registration with schemas
2. Input validation
3. Request routing
4. Response formatting

### Running the Server

```bash
# Build the project
npm run build

# Run the calculator server
node dist/servers/calculator.js
```

### Testing with Client

```typescript
const client = new SimpleMCPClient();
await client.connect('node', ['dist/servers/calculator.js']);

const result = await client.callTool('add', { a: 5, b: 3 });
console.log(result); // { result: 8 }
```

## Step 2: Weather Server with External APIs

This server demonstrates how to integrate external APIs.

### Key Concepts Demonstrated
- HTTP API integration
- Environment variables
- Rate limiting
- Error handling for external services

### Code Highlights

```typescript
// Tool definition with proper schema
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  if (name === 'get-forecast') {
    const { latitude, longitude } = args as GetForecastArgs;
    
    try {
      // External API call with error handling
      const response = await fetch(
        `https://api.weather.gov/points/${latitude},${longitude}`
      );
      
      if (!response.ok) {
        throw new McpError(
          ErrorCode.InternalError,
          `Weather API error: ${response.status}`
        );
      }
      
      // Process and return data
      const data = await response.json();
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    } catch (error) {
      // Proper error handling
      throw new McpError(ErrorCode.InternalError, `Failed to get forecast: ${error}`);
    }
  }
});
```

### Environment Setup

Create a `.env` file:
```
NODE_ENV=development
WEATHER_API_TIMEOUT=5000
```

## Step 3: Advanced Filesystem Server

This server demonstrates both tools and resources capabilities.

### Key Concepts Demonstrated
- Resource listing and reading
- Security restrictions
- File operations
- Mixed tool/resource server

### Resource vs Tool Decision

**Use Resources when:**
- Data can be read directly (files, databases)
- Content is relatively static
- AI needs to understand the content

**Use Tools when:**
- Operations have side effects
- Dynamic data generation
- Complex processing required

### Security Implementation

```typescript
const ALLOWED_PATHS = process.env.ALLOWED_PATHS?.split(',') || ['/tmp'];

function isPathAllowed(filePath: string): boolean {
  const resolvedPath = path.resolve(filePath);
  return ALLOWED_PATHS.some(allowedPath => 
    resolvedPath.startsWith(path.resolve(allowedPath))
  );
}
```

## Best Practices

### 1. Input Validation
Always use Zod schemas for input validation:

```typescript
const AddArgsSchema = z.object({
  a: z.number(),
  b: z.number()
});
```

### 2. Error Handling
Use proper MCP error codes:

```typescript
catch (error) {
  throw new McpError(
    ErrorCode.InternalError,
    `Operation failed: ${error.message}`
  );
}
```

### 3. Documentation
Include comprehensive tool descriptions:

```typescript
{
  name: 'add',
  description: 'Add two numbers together',
  inputSchema: {
    type: 'object',
    properties: {
      a: { type: 'number', description: 'First number' },
      b: { type: 'number', description: 'Second number' }
    },
    required: ['a', 'b']
  }
}
```

### 4. Async Operations
Always handle async operations properly:

```typescript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  // Always use async/await for external calls
  const result = await someAsyncOperation();
  return { content: [{ type: 'text', text: result }] };
});
```

## Testing Your Servers

### Unit Testing
```typescript
describe('Calculator Server', () => {
  test('should add two numbers', async () => {
    const client = new SimpleMCPClient();
    await client.connect('node', ['dist/servers/calculator.js']);
    
    const result = await client.callTool('add', { a: 2, b: 3 });
    expect(result).toEqual({ result: 5 });
  });
});
```

### Manual Testing
Use the simple client to test your servers:

```bash
node -e "
import('./dist/client/simple-client.js').then(async ({ SimpleMCPClient }) => {
  const client = new SimpleMCPClient();
  await client.connect('node', ['dist/servers/calculator.js']);
  console.log(await client.listTools());
});
"
```

## Next Steps

1. Try modifying the existing servers
2. Create your own server with a new domain (e.g., database, calendar)
3. Integrate with Claude Desktop
4. Build a client application

## Common Issues

### Transport Errors
- Ensure server runs without syntax errors
- Check that stdio transport is properly configured
- Verify async operations are awaited

### Schema Validation
- Double-check Zod schemas match your data
- Ensure required fields are provided
- Test with various input combinations

### External APIs
- Handle network timeouts gracefully
- Implement proper retry logic
- Use environment variables for configuration
