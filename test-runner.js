#!/usr/bin/env node

// Simple test script that directly tests the compiled MCP servers
// This bypasses TypeScript issues and lets us test functionality

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class SimpleTestClient {
  constructor() {
    this.processes = [];
  }

  async testServer(serverPath, testName) {
    console.log(`\n🧪 Testing ${testName}...`);
    
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(serverPath)) {
        console.log(`❌ Server file not found: ${serverPath}`);
        resolve(false);
        return;
      }

      const child = spawn('node', [serverPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, ALLOWED_PATHS: '/tmp' }
      });

      let output = '';
      let errorOutput = '';

      child.stdout.on('data', (data) => {
        output += data.toString();
      });

      child.stderr.on('data', (data) => {
        errorOutput += data.toString();
        // Server is ready when it logs to stderr
        if (errorOutput.includes('running') || errorOutput.includes('Server')) {
          this.testServerFunctionality(child, testName, resolve);
        }
      });

      child.on('error', (error) => {
        console.log(`❌ Failed to start ${testName}: ${error.message}`);
        resolve(false);
      });

      child.on('exit', (code) => {
        if (code !== 0 && !output && !errorOutput) {
          console.log(`❌ ${testName} exited with code ${code}`);
          resolve(false);
        }
      });

      this.processes.push(child);

      // Timeout after 5 seconds
      setTimeout(() => {
        if (child.exitCode === null) {
          console.log(`❌ ${testName} did not start within 5 seconds`);
          child.kill();
          resolve(false);
        }
      }, 5000);
    });
  }

  testServerFunctionality(child, testName, resolve) {
    // Test basic functionality by sending a tools/list request
    const listRequest = JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/list",
      params: {}
    }) + '\n';

    let responseData = '';
    let hasResponded = false;

    child.stdout.on('data', (data) => {
      responseData += data.toString();
      
      // Look for a complete JSON response
      const lines = responseData.split('\n');
      for (const line of lines) {
        if (line.trim() && !hasResponded) {
          try {
            const response = JSON.parse(line);
            if (response.result && response.result.tools) {
              console.log(`✅ ${testName} is working! Found ${response.result.tools.length} tools:`);
              response.result.tools.forEach(tool => {
                console.log(`   - ${tool.name}: ${tool.description}`);
              });
              hasResponded = true;
              child.kill();
              resolve(true);
            }
          } catch (e) {
            // Not valid JSON, continue waiting
          }
        }
      }
    });

    // Send the request
    child.stdin.write(listRequest);

    // Timeout for this specific test
    setTimeout(() => {
      if (!hasResponded) {
        console.log(`⚠️ ${testName} started but didn't respond to tools/list`);
        child.kill();
        resolve(false);
      }
    }, 3000);
  }

  async runAllTests() {
    console.log('🚀 Starting MCP Server Tests\n');

    const tests = [
      { path: 'src/servers/calculator.js', name: 'Calculator Server' },
      { path: 'src/servers/weather.js', name: 'Weather Server' },
      { path: 'src/servers/filesystem.js', name: 'Filesystem Server' },
      { path: 'examples/01-hello-world.js', name: 'Hello World Server' }
    ];

    let passed = 0;
    let total = tests.length;

    for (const test of tests) {
      const result = await this.testServer(test.path, test.name);
      if (result) {
        passed++;
      }
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`\n📊 Test Results: ${passed}/${total} servers working`);
    
    // Cleanup any remaining processes
    this.processes.forEach(proc => {
      if (proc.exitCode === null) {
        proc.kill();
      }
    });

    return passed === total;
  }
}

// Run the tests
async function main() {
  const client = new SimpleTestClient();
  const success = await client.runAllTests();
  process.exit(success ? 0 : 1);
}

main().catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});
