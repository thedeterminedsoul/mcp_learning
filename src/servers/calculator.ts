#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

/**
 * Calculator MCP Server
 * 
 * A simple MCP server that demonstrates:
 * - Multiple tool registration
 * - Input validation with Zod
 * - Mathematical operations
 * - Error handling for invalid inputs
 */

const server = new Server({
  name: "calculator-server",
  version: "1.0.0",
}, {
  capabilities: {
    tools: {},
  },
});

// Input validation schemas using Zod
const NumberPairSchema = z.object({
  a: z.number().describe("First number"),
  b: z.number().describe("Second number"),
});

const SingleNumberSchema = z.object({
  number: z.number().describe("Input number"),
});

const PowerSchema = z.object({
  base: z.number().describe("Base number"),
  exponent: z.number().describe("Exponent"),
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "add",
        description: "Add two numbers",
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "number", description: "First number" },
            b: { type: "number", description: "Second number" },
          },
          required: ["a", "b"],
        },
      },
      {
        name: "subtract",
        description: "Subtract second number from first",
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "number", description: "First number (minuend)" },
            b: { type: "number", description: "Second number (subtrahend)" },
          },
          required: ["a", "b"],
        },
      },
      {
        name: "multiply",
        description: "Multiply two numbers",
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "number", description: "First number" },
            b: { type: "number", description: "Second number" },
          },
          required: ["a", "b"],
        },
      },
      {
        name: "divide",
        description: "Divide first number by second",
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "number", description: "Dividend" },
            b: { type: "number", description: "Divisor (cannot be zero)" },
          },
          required: ["a", "b"],
        },
      },
      {
        name: "power",
        description: "Raise base to the power of exponent",
        inputSchema: {
          type: "object",
          properties: {
            base: { type: "number", description: "Base number" },
            exponent: { type: "number", description: "Exponent" },
          },
          required: ["base", "exponent"],
        },
      },
      {
        name: "sqrt",
        description: "Calculate square root of a number",
        inputSchema: {
          type: "object",
          properties: {
            number: { 
              type: "number", 
              description: "Number to calculate square root of (must be non-negative)",
              minimum: 0
            },
          },
          required: ["number"],
        },
      },
      {
        name: "factorial",
        description: "Calculate factorial of a non-negative integer",
        inputSchema: {
          type: "object",
          properties: {
            number: { 
              type: "number", 
              description: "Non-negative integer to calculate factorial of",
              minimum: 0
            },
          },
          required: ["number"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "add": {
        const { a, b } = NumberPairSchema.parse(args);
        const result = a + b;
        return {
          content: [
            {
              type: "text",
              text: `${a} + ${b} = ${result}`,
            },
          ],
        };
      }

      case "subtract": {
        const { a, b } = NumberPairSchema.parse(args);
        const result = a - b;
        return {
          content: [
            {
              type: "text",
              text: `${a} - ${b} = ${result}`,
            },
          ],
        };
      }

      case "multiply": {
        const { a, b } = NumberPairSchema.parse(args);
        const result = a * b;
        return {
          content: [
            {
              type: "text",
              text: `${a} × ${b} = ${result}`,
            },
          ],
        };
      }

      case "divide": {
        const { a, b } = NumberPairSchema.parse(args);
        
        if (b === 0) {
          return {
            content: [
              {
                type: "text",
                text: "Error: Division by zero is undefined",
              },
            ],
            isError: true,
          };
        }
        
        const result = a / b;
        return {
          content: [
            {
              type: "text",
              text: `${a} ÷ ${b} = ${result}`,
            },
          ],
        };
      }

      case "power": {
        const { base, exponent } = PowerSchema.parse(args);
        const result = Math.pow(base, exponent);
        
        if (!isFinite(result)) {
          return {
            content: [
              {
                type: "text",
                text: `Error: Result is ${result} (infinite or too large)`,
              },
            ],
            isError: true,
          };
        }
        
        return {
          content: [
            {
              type: "text",
              text: `${base}^${exponent} = ${result}`,
            },
          ],
        };
      }

      case "sqrt": {
        const { number } = SingleNumberSchema.parse(args);
        
        if (number < 0) {
          return {
            content: [
              {
                type: "text",
                text: "Error: Cannot calculate square root of a negative number",
              },
            ],
            isError: true,
          };
        }
        
        const result = Math.sqrt(number);
        return {
          content: [
            {
              type: "text",
              text: `√${number} = ${result}`,
            },
          ],
        };
      }

      case "factorial": {
        const { number } = SingleNumberSchema.parse(args);
        
        if (!Number.isInteger(number) || number < 0) {
          return {
            content: [
              {
                type: "text",
                text: "Error: Factorial is only defined for non-negative integers",
              },
            ],
            isError: true,
          };
        }
        
        if (number > 170) {
          return {
            content: [
              {
                type: "text",
                text: "Error: Factorial too large (number > 170 causes overflow)",
              },
            ],
            isError: true,
          };
        }
        
        let result = 1;
        for (let i = 2; i <= number; i++) {
          result *= i;
        }
        
        return {
          content: [
            {
              type: "text",
              text: `${number}! = ${result}`,
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: "text",
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error executing tool ${name}: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Calculator MCP Server running on stdio");
}

process.on('SIGINT', async () => {
  console.error('Shutting down server...');
  process.exit(0);
});

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
