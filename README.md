# MCP Learning Project

A comprehensive tutorial project for learning Model Context Protocol (MCP) with TypeScript.

## What is MCP?

Model Context Protocol (MCP) is an open standard that enables AI applications to securely connect to external data sources and tools. It acts as a bridge between AI models and various systems like databases, APIs, file systems, and more.

## Project Structure

```
mcp_learning/
├── src/
│   ├── servers/           # Example MCP servers
│   ├── client/           # Example MCP client
│   └── shared/           # Shared utilities and types
├── examples/             # Step-by-step examples and tutorials
├── docs/                # Comprehensive documentation
├── dist/                # Compiled JavaScript files
└── README.md
```

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Test all servers:**
   ```bash
   npm test
   ```

4. **Run individual servers:**
   ```bash
   npm run example:calculator
   npm run example:weather
   npm run example:filesystem
   ```

## Available Servers

### 1. Calculator Server
Basic mathematical operations with comprehensive examples:
- Addition, subtraction, multiplication, division
- Power functions and square roots
- Factorial calculations

**Start server:**
```bash
npm run example:calculator
```

### 2. Weather Server
Weather information and alerts (mock data):
- Weather forecasts for locations
- Weather alerts by state
- Extensible for real weather APIs

**Start server:**
```bash
npm run example:weather
```

### 3. Filesystem Server
Secure file system operations:
- Read/write files
- Directory operations
- File information and management
- Path validation for security

**Start server:**
```bash
npm run example:filesystem
```

### 4. Hello World Server
Simple greeting server for learning basics:
- Multiple greeting styles
- Personalized messages
- Great starting point for beginners

**Found in:** `examples/01-hello-world.js`

## Development

### Build Commands
```bash
npm run build          # Compile TypeScript to JavaScript
npm run dev            # Watch mode for development
npm test               # Test all servers
```

### VS Code Integration
This project includes VS Code configurations:
- **Tasks**: Build, test, and run servers
- **MCP Configuration**: Ready for Claude Desktop integration

## Learning Resources

### 📚 Documentation
- **[MCP Overview](./docs/mcp-overview.md)** - Core concepts and architecture
- **[Server Tutorial](./docs/server-tutorial.md)** - Step-by-step server development
- **[Client Tutorial](./docs/client-tutorial.md)** - Building MCP clients
- **[Integration Examples](./docs/integration-examples.md)** - Claude Desktop setup

### 🎯 Step-by-Step Examples
- **[Hello World](./examples/01-hello-world.md)** - Your first MCP server
- **[Testing Guide](./examples/02-testing-guide.md)** - Testing MCP servers

## Claude Desktop Integration

To use these servers with Claude Desktop, add this configuration to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "calculator": {
      "command": "node",
      "args": ["/Users/pawantejwani/development/personal/mcp_learning/dist/servers/calculator.js"],
      "env": {}
    },
    "weather": {
      "command": "node", 
      "args": ["/Users/pawantejwani/development/personal/mcp_learning/dist/servers/weather.js"],
      "env": {}
    },
    "filesystem": {
      "command": "node",
      "args": ["/Users/pawantejwani/development/personal/mcp_learning/dist/servers/filesystem.js"],
      "env": {
        "ALLOWED_PATHS": "/tmp,/Users/pawantejwani/development/personal/mcp_learning/examples"
      }
    }
  }
}
```

**Note**: Update the file paths in the configuration above to match your actual project location.

## Key MCP Concepts

### 1. Servers
MCP servers provide capabilities to clients:
- **Tools**: Functions that can be called
- **Resources**: Data that can be read  
- **Prompts**: Template prompts for specific tasks

### 2. Clients
Applications that connect to and use MCP servers:
- Can discover server capabilities
- Call tools and read resources
### 3. Transports
Communication methods between clients and servers:
- **stdio**: Standard input/output (most common)
- **SSE**: Server-Sent Events over HTTP

## Learning Path

1. **Start Here** - Read [MCP Overview](./docs/mcp-overview.md)
2. **Build Your First Server** - Follow [Hello World Tutorial](./examples/01-hello-world.md)
3. **Advanced Features** - Study the calculator and filesystem servers
4. **Client Development** - Learn from [Client Tutorial](./docs/client-tutorial.md)
5. **Integration** - Set up [Claude Desktop Integration](./docs/integration-examples.md)
6. **Best Practices** - Error handling, security, performance

## Troubleshooting

### Build Issues
If TypeScript compilation fails:
```bash
npx tsc --skipLibCheck --noEmitOnError false
```

### Server Testing
Use the built-in test runner:
```bash
node test-runner.js
```

### Permission Issues (Filesystem Server)
Ensure the `ALLOWED_PATHS` environment variable includes safe directories only.

## Resources

- **[Official MCP Documentation](https://modelcontextprotocol.io)** - Complete specification
- **[MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)** - Official SDK
- **[Claude Desktop](https://claude.ai/download)** - AI assistant with MCP support
- **[Example Servers](https://github.com/modelcontextprotocol/examples)** - More examples

## Contributing

This is a learning project! Feel free to:
- Add new example servers
- Improve documentation
- Fix bugs or enhance existing servers
- Add more comprehensive tests

## License

MIT - Feel free to use this project for learning and teaching MCP concepts.
