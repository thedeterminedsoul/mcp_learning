<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# MCP Learning Project Instructions

This is an MCP (Model Context Protocol) learning project designed to teach the concepts and implementation patterns of MCP servers and clients.

## Project Context

You can find more info and examples at https://modelcontextprotocol.io/llms-full.txt

## Key MCP Concepts to Remember

1. **Servers**: Provide resources and tools to clients
2. **Clients**: Applications that connect to MCP servers (like Claude Desktop, IDEs)
3. **Resources**: Data sources (files, databases, APIs)
4. **Tools**: Functions that can be executed
5. **Prompts**: Reusable prompt templates

## Code Style Guidelines

- Use TypeScript for type safety
- Follow async/await patterns for all server operations
- Use the `@modelcontextprotocol/sdk` package for all MCP implementations
- Include comprehensive error handling
- Add detailed JSDoc comments for all public methods
- Follow the MCP protocol specifications strictly

## Example Structure

When creating MCP servers:
1. Initialize with server name and capabilities
2. Register tools with proper schemas using zod
3. Implement tool handlers with proper error handling
4. Use appropriate transport (stdio, SSE, etc.)
