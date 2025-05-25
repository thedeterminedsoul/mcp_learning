# Step 2: Testing Your MCP Servers

This tutorial shows you how to test your MCP servers effectively using the provided client tools.

## Testing Approaches

1. **Simple Client Testing**: Using our SimpleMCPClient
2. **Manual Testing**: Command-line testing
3. **Integration Testing**: Testing with Claude Desktop
4. **Unit Testing**: Automated test suites

## Simple Client Testing

### Basic Connection Test

Create a test file `examples/test-servers.ts`:

```typescript
import { SimpleMCPClient } from '../dist/client/simple-client.js';

async function testCalculatorServer() {
  const client = new SimpleMCPClient();
  
  try {
    console.log('🔌 Connecting to calculator server...');
    await client.connect('node', ['dist/servers/calculator.js']);
    
    console.log('📋 Listing available tools...');
    const tools = await client.listTools();
    console.log('Available tools:', tools.map(t => t.name));
    
    console.log('🧮 Testing addition...');
    const addResult = await client.callTool('add', { a: 5, b: 3 });
    console.log('5 + 3 =', addResult);
    
    console.log('📐 Testing division...');
    const divResult = await client.callTool('divide', { a: 10, b: 2 });
    console.log('10 ÷ 2 =', divResult);
    
    console.log('✅ Calculator server test completed!');
  } catch (error) {
    console.error('❌ Calculator test failed:', error);
  } finally {
    await client.disconnect();
  }
}

async function testWeatherServer() {
  const client = new SimpleMCPClient();
  
  try {
    console.log('🔌 Connecting to weather server...');
    await client.connect('node', ['dist/servers/weather.js']);
    
    console.log('📋 Listing available tools...');
    const tools = await client.listTools();
    console.log('Available tools:', tools.map(t => t.name));
    
    console.log('🌤️ Getting weather forecast for NYC...');
    const forecast = await client.callTool('get-forecast', {
      latitude: 40.7128,
      longitude: -74.0060
    });
    console.log('NYC Forecast:', JSON.parse(forecast).properties);
    
    console.log('🚨 Getting weather alerts for NYC...');
    const alerts = await client.callTool('get-alerts', {
      latitude: 40.7128, 
      longitude: -74.0060
    });
    console.log('NYC Alerts:', JSON.parse(alerts));
    
    console.log('✅ Weather server test completed!');
  } catch (error) {
    console.error('❌ Weather test failed:', error);
  } finally {
    await client.disconnect();
  }
}

async function testFilesystemServer() {
  const client = new SimpleMCPClient();
  
  try {
    console.log('🔌 Connecting to filesystem server...');
    await client.connect('node', ['dist/servers/filesystem.js'], {
      env: { ALLOWED_PATHS: '/tmp' }
    });
    
    console.log('📋 Listing available tools...');
    const tools = await client.listTools();
    console.log('Available tools:', tools.map(t => t.name));
    
    console.log('📋 Listing available resources...');
    const resources = await client.listResources();
    console.log('Available resources:', resources.map(r => r.name));
    
    console.log('📂 Listing /tmp directory...');
    const listResult = await client.callTool('list-directory', {
      path: '/tmp'
    });
    console.log('Directory contents:', listResult);
    
    console.log('✅ Filesystem server test completed!');
  } catch (error) {
    console.error('❌ Filesystem test failed:', error);
  } finally {
    await client.disconnect();
  }
}

async function testHelloWorldServer() {
  const client = new SimpleMCPClient();
  
  try {
    console.log('🔌 Connecting to hello world server...');
    await client.connect('node', ['dist/examples/01-hello-world.js']);
    
    console.log('📋 Listing available tools...');
    const tools = await client.listTools();
    console.log('Available tools:', tools.map(t => t.name));
    
    console.log('👋 Testing casual greeting...');
    const casualGreeting = await client.callTool('greet', { 
      name: 'Alice',
      style: 'casual'
    });
    console.log('Casual greeting:', casualGreeting);
    
    console.log('🎩 Testing formal greeting...');
    const formalGreeting = await client.callTool('greet', {
      name: 'Bob', 
      style: 'formal'
    });
    console.log('Formal greeting:', formalGreeting);
    
    console.log('👋 Testing farewell...');
    const farewell = await client.callTool('farewell', { name: 'Charlie' });
    console.log('Farewell:', farewell);
    
    console.log('✅ Hello World server test completed!');
  } catch (error) {
    console.error('❌ Hello World test failed:', error);
  } finally {
    await client.disconnect();
  }
}

async function runAllTests() {
  console.log('🧪 Starting MCP Server Tests\n');
  
  await testHelloWorldServer();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testCalculatorServer();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testWeatherServer();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testFilesystemServer();
  console.log('\n' + '='.repeat(50) + '\n');
  
  console.log('🎉 All tests completed!');
}

// Run tests
runAllTests().catch(console.error);
```

### Running the Tests

```bash
# Build the project first
npm run build

# Run the test suite
node dist/examples/test-servers.js
```

## Manual Command Line Testing

### Direct Server Testing

You can test servers directly using Node.js:

```bash
# Test calculator server
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | node dist/servers/calculator.js

# Test with a calculation
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"add","arguments":{"a":5,"b":3}}}' | node dist/servers/calculator.js
```

### Interactive Testing Script

Create `examples/interactive-test.ts`:

```typescript
import readline from 'readline';
import { SimpleMCPClient } from '../dist/client/simple-client.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class InteractiveTestClient {
  private client: SimpleMCPClient | null = null;
  private currentServer: string | null = null;

  async start() {
    console.log('🧪 MCP Interactive Test Client');
    console.log('Commands:');
    console.log('  connect <server> - Connect to a server (calculator, weather, filesystem, hello)');
    console.log('  tools - List available tools');
    console.log('  call <tool> <args> - Call a tool with JSON args');
    console.log('  disconnect - Disconnect from current server');
    console.log('  exit - Exit the client\n');

    this.promptUser();
  }

  private promptUser() {
    rl.question(`[${this.currentServer || 'disconnected'}] > `, async (input) => {
      await this.handleCommand(input.trim());
      this.promptUser();
    });
  }

  private async handleCommand(input: string) {
    const [command, ...args] = input.split(' ');

    try {
      switch (command) {
        case 'connect':
          await this.connect(args[0]);
          break;
        case 'tools':
          await this.listTools();
          break;
        case 'call':
          await this.callTool(args[0], args.slice(1).join(' '));
          break;
        case 'disconnect':
          await this.disconnect();
          break;
        case 'exit':
          await this.disconnect();
          process.exit(0);
        default:
          console.log('Unknown command:', command);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  private async connect(serverName: string) {
    if (this.client) {
      await this.client.disconnect();
    }

    this.client = new SimpleMCPClient();
    
    const serverMap = {
      calculator: ['dist/servers/calculator.js'],
      weather: ['dist/servers/weather.js'],
      filesystem: ['dist/servers/filesystem.js'],
      hello: ['dist/examples/01-hello-world.js']
    };

    if (!serverMap[serverName]) {
      throw new Error(`Unknown server: ${serverName}`);
    }

    await this.client.connect('node', serverMap[serverName]);
    this.currentServer = serverName;
    console.log(`✅ Connected to ${serverName} server`);
  }

  private async listTools() {
    if (!this.client) {
      throw new Error('Not connected to any server');
    }

    const tools = await this.client.listTools();
    console.log('Available tools:');
    tools.forEach(tool => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
  }

  private async callTool(toolName: string, argsStr: string) {
    if (!this.client) {
      throw new Error('Not connected to any server');
    }

    let args = {};
    if (argsStr) {
      try {
        args = JSON.parse(argsStr);
      } catch (error) {
        throw new Error('Invalid JSON arguments');
      }
    }

    const result = await this.client.callTool(toolName, args);
    console.log('Result:', result);
  }

  private async disconnect() {
    if (this.client) {
      await this.client.disconnect();
      this.client = null;
      this.currentServer = null;
      console.log('✅ Disconnected');
    }
  }
}

const testClient = new InteractiveTestClient();
testClient.start().catch(console.error);
```

## Error Testing

### Testing Error Conditions

Create `examples/error-tests.ts`:

```typescript
import { SimpleMCPClient } from '../dist/client/simple-client.js';

async function testErrorHandling() {
  const client = new SimpleMCPClient();
  
  try {
    await client.connect('node', ['dist/servers/calculator.js']);
    
    console.log('Testing error conditions...\n');
    
    // Test division by zero
    try {
      await client.callTool('divide', { a: 10, b: 0 });
    } catch (error) {
      console.log('✅ Division by zero properly handled:', error.message);
    }
    
    // Test invalid tool name
    try {
      await client.callTool('invalid-tool', {});
    } catch (error) {
      console.log('✅ Invalid tool name properly handled:', error.message);
    }
    
    // Test missing required arguments
    try {
      await client.callTool('add', { a: 5 }); // Missing 'b'
    } catch (error) {
      console.log('✅ Missing arguments properly handled:', error.message);
    }
    
    // Test invalid argument types
    try {
      await client.callTool('add', { a: 'not a number', b: 5 });
    } catch (error) {
      console.log('✅ Invalid argument types properly handled:', error.message);
    }
    
  } finally {
    await client.disconnect();
  }
}

testErrorHandling().catch(console.error);
```

## Performance Testing

### Load Testing

Create `examples/performance-test.ts`:

```typescript
import { SimpleMCPClient } from '../dist/client/simple-client.js';

async function performanceTest() {
  const client = new SimpleMCPClient();
  
  try {
    await client.connect('node', ['dist/servers/calculator.js']);
    
    console.log('Running performance test...\n');
    
    const operations = 100;
    const startTime = Date.now();
    
    const promises = [];
    for (let i = 0; i < operations; i++) {
      promises.push(
        client.callTool('add', { a: i, b: i + 1 })
      );
    }
    
    const results = await Promise.all(promises);
    const endTime = Date.now();
    
    console.log(`✅ Completed ${operations} operations in ${endTime - startTime}ms`);
    console.log(`📊 Average: ${(endTime - startTime) / operations}ms per operation`);
    console.log(`🚀 Throughput: ${(operations / (endTime - startTime)) * 1000} ops/sec`);
    
  } finally {
    await client.disconnect();
  }
}

performanceTest().catch(console.error);
```

## Test Results Validation

### Automated Test Suite

Create `examples/validation-tests.ts`:

```typescript
import { SimpleMCPClient } from '../dist/client/simple-client.js';

interface TestCase {
  name: string;
  server: string;
  tool: string;
  args: any;
  expected?: any;
  shouldFail?: boolean;
}

const testCases: TestCase[] = [
  {
    name: 'Calculator addition',
    server: 'calculator',
    tool: 'add',
    args: { a: 2, b: 3 },
    expected: { result: 5 }
  },
  {
    name: 'Calculator subtraction',
    server: 'calculator', 
    tool: 'subtract',
    args: { a: 10, b: 4 },
    expected: { result: 6 }
  },
  {
    name: 'Division by zero should fail',
    server: 'calculator',
    tool: 'divide',
    args: { a: 5, b: 0 },
    shouldFail: true
  },
  {
    name: 'Hello world casual greeting',
    server: 'hello',
    tool: 'greet',
    args: { name: 'Test', style: 'casual' },
    expected: 'Hello, Test! Welcome to the MCP world! 🌟'
  }
];

async function runValidationTests() {
  const serverMap = {
    calculator: ['dist/servers/calculator.js'],
    weather: ['dist/servers/weather.js'],
    filesystem: ['dist/servers/filesystem.js'],
    hello: ['dist/examples/01-hello-world.js']
  };

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const client = new SimpleMCPClient();
    
    try {
      await client.connect('node', serverMap[testCase.server]);
      
      try {
        const result = await client.callTool(testCase.tool, testCase.args);
        
        if (testCase.shouldFail) {
          console.log(`❌ ${testCase.name}: Expected failure but succeeded`);
          failed++;
        } else if (testCase.expected && JSON.stringify(result) !== JSON.stringify(testCase.expected)) {
          console.log(`❌ ${testCase.name}: Expected ${JSON.stringify(testCase.expected)}, got ${JSON.stringify(result)}`);
          failed++;
        } else {
          console.log(`✅ ${testCase.name}: Passed`);
          passed++;
        }
      } catch (error) {
        if (testCase.shouldFail) {
          console.log(`✅ ${testCase.name}: Failed as expected (${error.message})`);
          passed++;
        } else {
          console.log(`❌ ${testCase.name}: Unexpected failure: ${error.message}`);
          failed++;
        }
      }
    } finally {
      await client.disconnect();
    }
  }

  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

runValidationTests().catch(console.error);
```

## Next Steps

1. **Run all test scripts** to verify your servers work correctly
2. **Add your own test cases** for edge conditions  
3. **Test with Claude Desktop** integration
4. **Create automated CI/CD tests** for your servers
5. **Benchmark performance** under load

## Common Testing Issues

- **Connection timeouts**: Increase timeout values for slow operations
- **Port conflicts**: Ensure servers aren't already running
- **Path issues**: Use absolute paths for server scripts
- **Environment variables**: Set up proper environment for filesystem server

This completes the testing tutorial. You now have comprehensive tools to validate your MCP servers!
