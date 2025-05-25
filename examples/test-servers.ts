import { SimpleMCPClient } from '../src/client/test-client.js';

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
    console.error('❌ Calculator test failed:', error.message);
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
    console.log('NYC Forecast received (length:', JSON.stringify(forecast).length, 'chars)');
    
    console.log('🚨 Getting weather alerts for NYC...');
    const alerts = await client.callTool('get-alerts', {
      latitude: 40.7128, 
      longitude: -74.0060
    });
    console.log('NYC Alerts received (length:', JSON.stringify(alerts).length, 'chars)');
    
    console.log('✅ Weather server test completed!');
  } catch (error) {
    console.error('❌ Weather test failed:', error.message);
  } finally {
    await client.disconnect();
  }
}

async function testFilesystemServer() {
  const client = new SimpleMCPClient();
  
  try {
    console.log('🔌 Connecting to filesystem server...');
    // Set environment for filesystem server
    process.env.ALLOWED_PATHS = '/tmp';
    await client.connect('node', ['dist/servers/filesystem.js']);
    
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
    console.log('Directory contents found:', Object.keys(listResult).length, 'items');
    
    console.log('✅ Filesystem server test completed!');
  } catch (error) {
    console.error('❌ Filesystem test failed:', error.message);
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
    console.error('❌ Hello World test failed:', error.message);
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
