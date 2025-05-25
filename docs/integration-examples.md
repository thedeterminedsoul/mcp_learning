# Claude Desktop Integration Examples

This guide shows how to integrate your MCP servers with Claude Desktop for practical AI assistance.

## Claude Desktop Configuration

### Basic Configuration

Edit your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "calculator": {
      "command": "node",
      "args": ["/path/to/your/project/dist/servers/calculator.js"]
    },
    "weather": {
      "command": "node", 
      "args": ["/path/to/your/project/dist/servers/weather.js"]
    },
    "filesystem": {
      "command": "node",
      "args": ["/path/to/your/project/dist/servers/filesystem.js"],
      "env": {
        "ALLOWED_PATHS": "/Users/yourname/Documents,/tmp"
      }
    }
  }
}
```

### Advanced Configuration

```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": ["/path/to/project/dist/servers/weather.js"],
      "env": {
        "NODE_ENV": "production",
        "WEATHER_API_TIMEOUT": "10000",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

## Practical Use Cases

### 1. Mathematical Assistant

Once the calculator server is configured, you can ask Claude:

> "Calculate the compound interest for $10,000 at 5% annual rate for 10 years"

Claude will use the calculator tools to:
1. Calculate intermediate values
2. Apply the compound interest formula
3. Show step-by-step calculations

### 2. Weather Planning Assistant  

With the weather server, ask Claude:

> "I'm planning a picnic in New York City this weekend. What's the weather forecast?"

Claude will:
1. Use the weather tools to get forecasts
2. Analyze the data for outdoor activities
3. Provide recommendations based on conditions

### 3. File Management Helper

With the filesystem server:

> "Help me organize the files in my Downloads folder by creating folders for different file types"

Claude can:
1. List files in the directory
2. Analyze file types and sizes
3. Create organizing folders
4. Move files to appropriate locations

## Example Conversations

### Weather Analysis

**You**: "What's the weather like in San Francisco and should I bring an umbrella?"

**Claude**: I'll check the current weather conditions and forecast for San Francisco for you.

*[Uses get-forecast tool with SF coordinates]*

Based on the weather data:
- Current conditions: Partly cloudy, 65°F
- Chance of precipitation: 20% 
- Wind: Light breeze from the west

You likely won't need an umbrella today, but it's always good to have one handy in San Francisco as weather can change quickly!

### Mathematical Problem Solving

**You**: "If I invest $5,000 at 7% annual interest compounded monthly, how much will I have after 15 years?"

**Claude**: I'll calculate this compound interest problem step by step.

*[Uses calculator tools for the computation]*

The compound interest formula is: A = P(1 + r/n)^(nt)

Where:
- P = $5,000 (principal)
- r = 0.07 (7% annual rate)
- n = 12 (compounded monthly)
- t = 15 years

*[Performs calculations using tools]*

After 15 years, your investment will be worth approximately **$14,274.73**.

### File Organization

**You**: "Can you help me see what's in my project folder and organize it better?"

**Claude**: I'll help you explore and organize your project folder.

*[Uses filesystem tools to list directory contents]*

I can see your project contains:
- 15 JavaScript files
- 8 TypeScript files  
- 3 configuration files
- 2 documentation files

Would you like me to:
1. Create a `src/` folder for source code
2. Create a `docs/` folder for documentation
3. Move files to appropriate folders
4. Create a `.gitignore` if needed

## Debugging Integration Issues

### Common Problems

1. **Server Path Issues**
   ```json
   // ❌ Relative path won't work
   "args": ["./dist/servers/calculator.js"]
   
   // ✅ Use absolute path
   "args": ["/full/path/to/project/dist/servers/calculator.js"]
   ```

2. **Permission Issues**
   ```bash
   # Make sure scripts are executable
   chmod +x dist/servers/*.js
   ```

3. **Environment Variables**
   ```json
   {
     "mcpServers": {
       "filesystem": {
         "command": "node",
         "args": ["/path/to/filesystem.js"],
         "env": {
           "ALLOWED_PATHS": "/safe/path1,/safe/path2"
         }
       }
     }
   }
   ```

### Testing Server Connection

1. Test servers independently:
   ```bash
   node dist/servers/calculator.js
   ```

2. Check Claude Desktop logs (if available)

3. Use the simple client to verify functionality:
   ```bash
   node -e "
   import('./dist/client/simple-client.js').then(async ({ SimpleMCPClient }) => {
     const client = new SimpleMCPClient();
     await client.connect('node', ['dist/servers/calculator.js']);
     console.log(await client.listTools());
   });
   "
   ```

## Best Practices for Production

### 1. Error Handling
Ensure servers handle errors gracefully:

```typescript
// In your server code
try {
  const result = await someOperation();
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
} catch (error) {
  return {
    content: [{ type: 'text', text: `Error: ${error.message}` }],
    isError: true
  };
}
```

### 2. Logging
Add logging for debugging:

```typescript
import { logger } from '../shared/types.js';

// Log important operations
logger.info('Weather forecast requested', { latitude, longitude });
logger.error('API call failed', { error: error.message });
```

### 3. Rate Limiting
Implement rate limiting for external APIs:

```typescript
const rateLimiter = new RateLimiter(10, 60000); // 10 requests per minute

if (!rateLimiter.isAllowed()) {
  throw new McpError(ErrorCode.InvalidRequest, 'Rate limit exceeded');
}
```

### 4. Security
- Validate all inputs
- Restrict file system access
- Use environment variables for sensitive data
- Implement proper authentication if needed

## Advanced Integration Patterns

### Multi-Server Workflows

Configure multiple servers that work together:

```json
{
  "mcpServers": {
    "data-analyzer": {
      "command": "node",
      "args": ["/path/to/data-analyzer.js"]
    },
    "file-reader": {
      "command": "node", 
      "args": ["/path/to/file-reader.js"]
    },
    "chart-generator": {
      "command": "node",
      "args": ["/path/to/chart-generator.js"]
    }
  }
}
```

This enables workflows like:
1. Read data files with file-reader
2. Analyze data with data-analyzer  
3. Generate visualizations with chart-generator

### Domain-Specific Servers

Create specialized servers for your workflow:

- **Development Server**: Git operations, code analysis
- **Research Server**: Paper search, citation management
- **Finance Server**: Stock data, portfolio analysis
- **Content Server**: Image processing, text analysis

## Next Steps

1. Test your servers with Claude Desktop
2. Create additional specialized servers
3. Explore more complex integrations
4. Share your servers with the community
5. Contribute to the MCP ecosystem

## Resources

- [MCP Official Documentation](https://modelcontextprotocol.io)
- [Claude Desktop Configuration Guide](https://docs.anthropic.com/claude/desktop)
- [MCP Server Registry](https://github.com/modelcontextprotocol/servers)
- [Community Examples](https://github.com/modelcontextprotocol/examples)
