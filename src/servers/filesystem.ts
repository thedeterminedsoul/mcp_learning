#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema, 
  ReadResourceRequestSchema, 
  ListResourcesRequestSchema 
} from "@modelcontextprotocol/sdk/types.js";
import { promises as fs } from "fs";
import { join, dirname, extname, relative } from "path";

/**
 * Filesystem MCP Server
 * 
 * This server demonstrates both TOOLS and RESOURCES:
 * - Tools: File operations (read, write, list)
 * - Resources: Direct file access for reading
 * 
 * Shows advanced MCP concepts:
 * - Multiple capability types
 * - File system operations
 * - Error handling for file operations
 * - Security considerations (restricted to working directory)
 */

const server = new Server({
  name: "filesystem-server",
  version: "1.0.0",
}, {
  capabilities: {
    tools: {},
    resources: {},
  },
});

// Security: Restrict operations to current working directory
const WORKING_DIR = process.cwd();

/**
 * Safely resolve a path within the working directory
 */
function safePath(inputPath: string): string {
  const resolved = join(WORKING_DIR, inputPath);
  if (!resolved.startsWith(WORKING_DIR)) {
    throw new Error("Path traversal detected - access denied");
  }
  return resolved;
}

/**
 * Check if a file exists
 */
async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get file information
 */
async function getFileInfo(path: string) {
  const stats = await fs.stat(path);
  return {
    size: stats.size,
    isFile: stats.isFile(),
    isDirectory: stats.isDirectory(),
    modified: stats.mtime.toISOString(),
    created: stats.birthtime.toISOString(),
  };
}

// Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "read-file",
        description: "Read the contents of a file",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Path to the file to read (relative to working directory)",
            },
          },
          required: ["path"],
        },
      },
      {
        name: "write-file",
        description: "Write content to a file",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Path to the file to write (relative to working directory)",
            },
            content: {
              type: "string",
              description: "Content to write to the file",
            },
          },
          required: ["path", "content"],
        },
      },
      {
        name: "list-directory",
        description: "List contents of a directory",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Path to the directory to list (relative to working directory)",
              default: ".",
            },
          },
        },
      },
      {
        name: "create-directory",
        description: "Create a new directory",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Path of the directory to create (relative to working directory)",
            },
          },
          required: ["path"],
        },
      },
      {
        name: "delete-file",
        description: "Delete a file or directory",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Path to the file or directory to delete (relative to working directory)",
            },
          },
          required: ["path"],
        },
      },
      {
        name: "file-info",
        description: "Get information about a file or directory",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Path to the file or directory (relative to working directory)",
            },
          },
          required: ["path"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "read-file": {
        const { path } = args as { path: string };
        const safePath_resolved = safePath(path);
        
        if (!(await fileExists(safePath_resolved))) {
          return {
            content: [{ type: "text", text: `File not found: ${path}` }],
            isError: true,
          };
        }
        
        const content = await fs.readFile(safePath_resolved, "utf8");
        return {
          content: [
            {
              type: "text",
              text: `Contents of ${path}:\n\n${content}`,
            },
          ],
        };
      }

      case "write-file": {
        const { path, content } = args as { path: string; content: string };
        const safePath_resolved = safePath(path);
        
        // Ensure directory exists
        const dir = dirname(safePath_resolved);
        await fs.mkdir(dir, { recursive: true });
        
        await fs.writeFile(safePath_resolved, content, "utf8");
        return {
          content: [
            {
              type: "text",
              text: `Successfully wrote ${content.length} characters to ${path}`,
            },
          ],
        };
      }

      case "list-directory": {
        const { path = "." } = args as { path?: string };
        const safePath_resolved = safePath(path);
        
        if (!(await fileExists(safePath_resolved))) {
          return {
            content: [{ type: "text", text: `Directory not found: ${path}` }],
            isError: true,
          };
        }
        
        const items = await fs.readdir(safePath_resolved);
        const itemDetails = await Promise.all(
          items.map(async (item) => {
            const itemPath = join(safePath_resolved, item);
            const stats = await fs.stat(itemPath);
            const type = stats.isDirectory() ? "DIR" : "FILE";
            const size = stats.isFile() ? ` (${stats.size} bytes)` : "";
            return `${type}: ${item}${size}`;
          })
        );
        
        return {
          content: [
            {
              type: "text",
              text: `Contents of ${path}:\n\n${itemDetails.join("\n")}`,
            },
          ],
        };
      }

      case "create-directory": {
        const { path } = args as { path: string };
        const safePath_resolved = safePath(path);
        
        await fs.mkdir(safePath_resolved, { recursive: true });
        return {
          content: [
            {
              type: "text",
              text: `Directory created: ${path}`,
            },
          ],
        };
      }

      case "delete-file": {
        const { path } = args as { path: string };
        const safePath_resolved = safePath(path);
        
        if (!(await fileExists(safePath_resolved))) {
          return {
            content: [{ type: "text", text: `File or directory not found: ${path}` }],
            isError: true,
          };
        }
        
        const stats = await fs.stat(safePath_resolved);
        if (stats.isDirectory()) {
          await fs.rmdir(safePath_resolved, { recursive: true });
          return {
            content: [{ type: "text", text: `Directory deleted: ${path}` }],
          };
        } else {
          await fs.unlink(safePath_resolved);
          return {
            content: [{ type: "text", text: `File deleted: ${path}` }],
          };
        }
      }

      case "file-info": {
        const { path } = args as { path: string };
        const safePath_resolved = safePath(path);
        
        if (!(await fileExists(safePath_resolved))) {
          return {
            content: [{ type: "text", text: `File or directory not found: ${path}` }],
            isError: true,
          };
        }
        
        const info = await getFileInfo(safePath_resolved);
        const infoText = [
          `File information for: ${path}`,
          `Type: ${info.isFile ? "File" : "Directory"}`,
          `Size: ${info.size} bytes`,
          `Modified: ${info.modified}`,
          `Created: ${info.created}`,
        ].join("\n");
        
        return {
          content: [{ type: "text", text: infoText }],
        };
      }

      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error executing ${name}: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const resources = [];
  
  // List all text files in the working directory as resources
  try {
    const items = await fs.readdir(WORKING_DIR);
    for (const item of items) {
      const itemPath = join(WORKING_DIR, item);
      const stats = await fs.stat(itemPath);
      
      if (stats.isFile()) {
        const ext = extname(item).toLowerCase();
        const textExtensions = ['.txt', '.md', '.js', '.ts', '.json', '.yaml', '.yml', '.xml', '.html', '.css'];
        
        if (textExtensions.includes(ext) || !ext) {
          resources.push({
            uri: `file://${relative(WORKING_DIR, itemPath)}`,
            name: item,
            description: `Text file: ${item} (${stats.size} bytes)`,
            mimeType: "text/plain",
          });
        }
      }
    }
  } catch (error) {
    console.error("Error listing resources:", error);
  }
  
  return { resources };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  
  try {
    // Extract path from file:// URI
    if (!uri.startsWith("file://")) {
      return {
        contents: [
          {
            uri,
            mimeType: "text/plain",
            text: "Error: Only file:// URIs are supported",
          },
        ],
      };
    }
    
    const path = uri.slice(7); // Remove "file://"
    const safePath_resolved = safePath(path);
    
    if (!(await fileExists(safePath_resolved))) {
      return {
        contents: [
          {
            uri,
            mimeType: "text/plain",
            text: `File not found: ${path}`,
          },
        ],
      };
    }
    
    const content = await fs.readFile(safePath_resolved, "utf8");
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: content,
        },
      ],
    };
  } catch (error) {
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: `Error reading resource: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Filesystem MCP Server running on stdio");
  console.error(`Working directory: ${WORKING_DIR}`);
}

process.on('SIGINT', async () => {
  console.error('Shutting down server...');
  process.exit(0);
});

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
