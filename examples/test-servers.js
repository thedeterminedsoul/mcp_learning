"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var test_client_js_1 = require("../src/client/test-client.js");
function testCalculatorServer() {
    return __awaiter(this, void 0, void 0, function () {
        var client, tools, addResult, divResult, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = new test_client_js_1.SimpleMCPClient();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 9]);
                    console.log('🔌 Connecting to calculator server...');
                    return [4 /*yield*/, client.connect('node', ['dist/servers/calculator.js'])];
                case 2:
                    _a.sent();
                    console.log('📋 Listing available tools...');
                    return [4 /*yield*/, client.listTools()];
                case 3:
                    tools = _a.sent();
                    console.log('Available tools:', tools.map(function (t) { return t.name; }));
                    console.log('🧮 Testing addition...');
                    return [4 /*yield*/, client.callTool('add', { a: 5, b: 3 })];
                case 4:
                    addResult = _a.sent();
                    console.log('5 + 3 =', addResult);
                    console.log('📐 Testing division...');
                    return [4 /*yield*/, client.callTool('divide', { a: 10, b: 2 })];
                case 5:
                    divResult = _a.sent();
                    console.log('10 ÷ 2 =', divResult);
                    console.log('✅ Calculator server test completed!');
                    return [3 /*break*/, 9];
                case 6:
                    error_1 = _a.sent();
                    console.error('❌ Calculator test failed:', error_1.message);
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, client.disconnect()];
                case 8:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function testWeatherServer() {
    return __awaiter(this, void 0, void 0, function () {
        var client, tools, forecast, alerts, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = new test_client_js_1.SimpleMCPClient();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 9]);
                    console.log('🔌 Connecting to weather server...');
                    return [4 /*yield*/, client.connect('node', ['dist/servers/weather.js'])];
                case 2:
                    _a.sent();
                    console.log('📋 Listing available tools...');
                    return [4 /*yield*/, client.listTools()];
                case 3:
                    tools = _a.sent();
                    console.log('Available tools:', tools.map(function (t) { return t.name; }));
                    console.log('🌤️ Getting weather forecast for NYC...');
                    return [4 /*yield*/, client.callTool('get-forecast', {
                            latitude: 40.7128,
                            longitude: -74.0060
                        })];
                case 4:
                    forecast = _a.sent();
                    console.log('NYC Forecast received (length:', JSON.stringify(forecast).length, 'chars)');
                    console.log('🚨 Getting weather alerts for NYC...');
                    return [4 /*yield*/, client.callTool('get-alerts', {
                            latitude: 40.7128,
                            longitude: -74.0060
                        })];
                case 5:
                    alerts = _a.sent();
                    console.log('NYC Alerts received (length:', JSON.stringify(alerts).length, 'chars)');
                    console.log('✅ Weather server test completed!');
                    return [3 /*break*/, 9];
                case 6:
                    error_2 = _a.sent();
                    console.error('❌ Weather test failed:', error_2.message);
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, client.disconnect()];
                case 8:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function testFilesystemServer() {
    return __awaiter(this, void 0, void 0, function () {
        var client, tools, resources, listResult, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = new test_client_js_1.SimpleMCPClient();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 9]);
                    console.log('🔌 Connecting to filesystem server...');
                    // Set environment for filesystem server
                    process.env.ALLOWED_PATHS = '/tmp';
                    return [4 /*yield*/, client.connect('node', ['dist/servers/filesystem.js'])];
                case 2:
                    _a.sent();
                    console.log('📋 Listing available tools...');
                    return [4 /*yield*/, client.listTools()];
                case 3:
                    tools = _a.sent();
                    console.log('Available tools:', tools.map(function (t) { return t.name; }));
                    console.log('📋 Listing available resources...');
                    return [4 /*yield*/, client.listResources()];
                case 4:
                    resources = _a.sent();
                    console.log('Available resources:', resources.map(function (r) { return r.name; }));
                    console.log('📂 Listing /tmp directory...');
                    return [4 /*yield*/, client.callTool('list-directory', {
                            path: '/tmp'
                        })];
                case 5:
                    listResult = _a.sent();
                    console.log('Directory contents found:', Object.keys(listResult).length, 'items');
                    console.log('✅ Filesystem server test completed!');
                    return [3 /*break*/, 9];
                case 6:
                    error_3 = _a.sent();
                    console.error('❌ Filesystem test failed:', error_3.message);
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, client.disconnect()];
                case 8:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function testHelloWorldServer() {
    return __awaiter(this, void 0, void 0, function () {
        var client, tools, casualGreeting, formalGreeting, farewell, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = new test_client_js_1.SimpleMCPClient();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, 8, 10]);
                    console.log('🔌 Connecting to hello world server...');
                    return [4 /*yield*/, client.connect('node', ['dist/examples/01-hello-world.js'])];
                case 2:
                    _a.sent();
                    console.log('📋 Listing available tools...');
                    return [4 /*yield*/, client.listTools()];
                case 3:
                    tools = _a.sent();
                    console.log('Available tools:', tools.map(function (t) { return t.name; }));
                    console.log('👋 Testing casual greeting...');
                    return [4 /*yield*/, client.callTool('greet', {
                            name: 'Alice',
                            style: 'casual'
                        })];
                case 4:
                    casualGreeting = _a.sent();
                    console.log('Casual greeting:', casualGreeting);
                    console.log('🎩 Testing formal greeting...');
                    return [4 /*yield*/, client.callTool('greet', {
                            name: 'Bob',
                            style: 'formal'
                        })];
                case 5:
                    formalGreeting = _a.sent();
                    console.log('Formal greeting:', formalGreeting);
                    console.log('👋 Testing farewell...');
                    return [4 /*yield*/, client.callTool('farewell', { name: 'Charlie' })];
                case 6:
                    farewell = _a.sent();
                    console.log('Farewell:', farewell);
                    console.log('✅ Hello World server test completed!');
                    return [3 /*break*/, 10];
                case 7:
                    error_4 = _a.sent();
                    console.error('❌ Hello World test failed:', error_4.message);
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, client.disconnect()];
                case 9:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function runAllTests() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🧪 Starting MCP Server Tests\n');
                    return [4 /*yield*/, testHelloWorldServer()];
                case 1:
                    _a.sent();
                    console.log('\n' + '='.repeat(50) + '\n');
                    return [4 /*yield*/, testCalculatorServer()];
                case 2:
                    _a.sent();
                    console.log('\n' + '='.repeat(50) + '\n');
                    return [4 /*yield*/, testWeatherServer()];
                case 3:
                    _a.sent();
                    console.log('\n' + '='.repeat(50) + '\n');
                    return [4 /*yield*/, testFilesystemServer()];
                case 4:
                    _a.sent();
                    console.log('\n' + '='.repeat(50) + '\n');
                    console.log('🎉 All tests completed!');
                    return [2 /*return*/];
            }
        });
    });
}
// Run tests
runAllTests().catch(console.error);
