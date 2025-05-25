import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

const GreetArgsSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty'),
  style: z.enum(['casual', 'formal', 'excited']).optional().default('casual')
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
      description: 'Generate a personalized greeting with different styles',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The name of the person to greet'
          },
          style: {
            type: 'string',
            enum: ['casual', 'formal', 'excited'],
            description: 'The style of greeting',
            default: 'casual'
          }
        },
        required: ['name']
      }
    },
    {
      name: 'farewell',
      description: 'Generate a personalized farewell message',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The name of the person to say goodbye to'
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
    const { name: personName, style } = GreetArgsSchema.parse(args);
    
    let greeting: string;
    switch (style) {
      case 'formal':
        greeting = `Good day, ${personName}. It is a pleasure to make your acquaintance.`;
        break;
      case 'excited':
        greeting = `Hey ${personName}!!! 🎉 Welcome to the amazing MCP world! This is SO exciting! 🚀✨`;
        break;
      case 'casual':
      default:
        greeting = `Hello, ${personName}! Welcome to the MCP world! 🌟`;
        break;
    }
    
    return {
      content: [
        {
          type: 'text',
          text: greeting
        }
      ]
    };
  }
  
  if (name === 'farewell') {
    const { name: personName } = z.object({ 
      name: z.string().min(1, 'Name cannot be empty') 
    }).parse(args);
    
    const farewell = `Goodbye, ${personName}! Thanks for exploring MCP with us. See you soon! 👋`;
    
    return {
      content: [
        {
          type: 'text',
          text: farewell
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
