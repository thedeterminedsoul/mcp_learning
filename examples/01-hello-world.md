# Step 1: Your First MCP Server

In this tutorial, you'll create a simple "Hello World" MCP server to understand the basic concepts.

## Learning Objectives

- Understand MCP server structure
- Learn about tool registration
- Implement basic tool handlers
- Test your server with a client

## Code Walkthrough

Let's build a simple greeting server step by step.

### 1. Import Required Modules

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
```

### 2. Create the Server Instance

```typescript
const server = new Server(
  {
    name: 'hello-world-server',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {} // We'll provide tools
    }
  }
);
```

### 3. Define Input Schemas

```typescript
const GreetArgsSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty')
});

type GreetArgs = z.infer<typeof GreetArgsSchema>;
```

### 4. Register Tool Handlers

```typescript
// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools: Tool[] = [
    {
      name: 'greet',
      description: 'Generate a personalized greeting',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The name of the person to greet'
          }
        },
        required: ['name']
      }
    }
  ];
  
  return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  if (name === 'greet') {
    const { name: personName } = GreetArgsSchema.parse(args);
    
    const greeting = `Hello, ${personName}! Welcome to the MCP world! 🌟`;
    
    return {
      content: [
        {
          type: 'text',
          text: greeting
        }
      ]
    };
  }
  
  throw new Error(`Unknown tool: ${name}`);
});
```

### 5. Start the Server

```typescript
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Hello World MCP Server running on stdio');
}

main().catch(console.error);
```

## Complete Code

Create a new file `examples/01-hello-world.ts`:

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

const GreetArgsSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty')
});

type GreetArgs = z.infer<typeof GreetArgsSchema>;

const server = new Server(
  {
    name: 'hello-world-server',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools: Tool[] = [
    {
      name: 'greet',
      description: 'Generate a personalized greeting',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The name of the person to greet'
          }
        },
        required: ['name']
      }
    }
  ];
  
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  if (name === 'greet') {
    const { name: personName } = GreetArgsSchema.parse(args);
    
    const greeting = `Hello, ${personName}! Welcome to the MCP world! 🌟`;
    
    return {
      content: [
        {
          type: 'text',
          text: greeting
        }
      ]
    };
  }
  
  throw new Error(`Unknown tool: ${name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Hello World MCP Server running on stdio');
}

main().catch(console.error);
```

## Testing Your Server

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Test with the simple client**:
   ```typescript
   import { SimpleMCPClient } from '../dist/client/simple-client.js';

   async function testHelloWorld() {
     const client = new SimpleMCPClient();
     
     try {
       await client.connect('node', ['dist/examples/01-hello-world.js']);
       
       console.log('Available tools:', await client.listTools());
       
       const result = await client.callTool('greet', { name: 'Alice' });
       console.log('Greeting result:', result);
       
     } finally {
       await client.disconnect();
     }
   }

   testHelloWorld().catch(console.error);
   ```

3. **Expected output**:
   ```
   Available tools: [
     {
       name: 'greet',
       description: 'Generate a personalized greeting',
       inputSchema: { ... }
     }
   ]
   Greeting result: Hello, Alice! Welcome to the MCP world! 🌟
   ```

## Key Concepts Learned

1. **Server Structure**: How to create and configure an MCP server
2. **Tool Registration**: How to define available tools with schemas
3. **Input Validation**: Using Zod for type-safe input validation
4. **Request Handling**: Processing tool calls and returning responses
5. **Transport**: Using stdio for communication

## Exercises

1. **Add a new tool** called `farewell` that says goodbye
2. **Add input validation** for minimum name length
3. **Add multiple greeting styles** (formal, casual, excited)
4. **Add error handling** for empty or invalid inputs

## Next Steps

- Move to [Step 2: Adding Multiple Tools](./02-multiple-tools.md)
- Learn about external API integration
- Explore resource-based servers

## Common Issues

- **Build errors**: Make sure TypeScript compiles without errors
- **Connection issues**: Verify the server starts without syntax errors
- **Schema validation**: Check that your Zod schemas match the input data
