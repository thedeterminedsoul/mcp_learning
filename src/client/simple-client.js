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
exports.SimpleMCPClient = void 0;
var index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
var stdio_js_1 = require("@modelcontextprotocol/sdk/client/stdio.js");
/**
 * Simple MCP Client Example
 *
 * This demonstrates how to:
 * - Create an MCP client
 * - Connect to an MCP server
 * - List available tools
 * - Call tools with parameters
 * - Handle responses and errors
 */
var SimpleMCPClient = /** @class */ (function () {
    function SimpleMCPClient() {
        this.client = null;
        this.transport = null;
    }
    /**
     * Connect to an MCP server
     */
    SimpleMCPClient.prototype.connect = function (serverCommand_1) {
        return __awaiter(this, arguments, void 0, function (serverCommand, serverArgs) {
            if (serverArgs === void 0) { serverArgs = []; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Connecting to MCP server: ".concat(serverCommand, " ").concat(serverArgs.join(' ')));
                        // Create transport
                        this.transport = new stdio_js_1.StdioClientTransport({
                            command: serverCommand,
                            args: serverArgs,
                        });
                        // Create client
                        this.client = new index_js_1.Client({
                            name: "simple-mcp-client",
                            version: "1.0.0",
                        }, {
                            capabilities: {},
                        });
                        // Connect
                        return [4 /*yield*/, this.client.connect(this.transport)];
                    case 1:
                        // Connect
                        _a.sent();
                        console.log("Connected to MCP server!");
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * List all available tools
     */
    SimpleMCPClient.prototype.listTools = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.client) {
                            throw new Error("Client not connected");
                        }
                        console.log("\n=== Available Tools ===");
                        return [4 /*yield*/, this.client.listTools()];
                    case 1:
                        response = _a.sent();
                        if (response.tools.length === 0) {
                            console.log("No tools available");
                            return [2 /*return*/];
                        }
                        response.tools.forEach(function (tool, index) {
                            console.log("".concat(index + 1, ". ").concat(tool.name));
                            console.log("   Description: ".concat(tool.description));
                            if (tool.inputSchema) {
                                console.log("   Input Schema: ".concat(JSON.stringify(tool.inputSchema, null, 2)));
                            }
                            console.log("");
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Call a tool with the given parameters
     */
    SimpleMCPClient.prototype.callTool = function (toolName_1) {
        return __awaiter(this, arguments, void 0, function (toolName, parameters) {
            var response, error_1;
            if (parameters === void 0) { parameters = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.client) {
                            throw new Error("Client not connected");
                        }
                        console.log("\n=== Calling Tool: ".concat(toolName, " ==="));
                        console.log("Parameters: ".concat(JSON.stringify(parameters, null, 2)));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client.callTool({
                                name: toolName,
                                arguments: parameters,
                            })];
                    case 2:
                        response = _a.sent();
                        console.log("Response:");
                        response.content.forEach(function (content, index) {
                            if (content.type === "text") {
                                console.log("".concat(index + 1, ". ").concat(content.text));
                            }
                            else {
                                console.log("".concat(index + 1, ". [").concat(content.type, "] (content not shown)"));
                            }
                        });
                        if (response.isError) {
                            console.log("⚠️  Tool execution resulted in an error");
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Error calling tool: ".concat(error_1 instanceof Error ? error_1.message : String(error_1)));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * List available resources
     */
    SimpleMCPClient.prototype.listResources = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.client) {
                            throw new Error("Client not connected");
                        }
                        console.log("\n=== Available Resources ===");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client.listResources()];
                    case 2:
                        response = _a.sent();
                        if (response.resources.length === 0) {
                            console.log("No resources available");
                            return [2 /*return*/];
                        }
                        response.resources.forEach(function (resource, index) {
                            console.log("".concat(index + 1, ". ").concat(resource.name || resource.uri));
                            console.log("   URI: ".concat(resource.uri));
                            console.log("   Description: ".concat(resource.description || "No description"));
                            console.log("   MIME Type: ".concat(resource.mimeType || "unknown"));
                            console.log("");
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.log("Server does not support resources or error occurred");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Read a specific resource
     */
    SimpleMCPClient.prototype.readResource = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.client) {
                            throw new Error("Client not connected");
                        }
                        console.log("\n=== Reading Resource: ".concat(uri, " ==="));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client.readResource({ uri: uri })];
                    case 2:
                        response = _a.sent();
                        response.contents.forEach(function (content, index) {
                            console.log("Content ".concat(index + 1, ":"));
                            console.log("URI: ".concat(content.uri));
                            console.log("MIME Type: ".concat(content.mimeType));
                            if (content.text) {
                                console.log("Text Content:");
                                console.log(content.text);
                            }
                            else if (content.blob) {
                                console.log("Binary Content: ".concat(content.blob.length, " bytes"));
                            }
                            console.log("");
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.error("Error reading resource: ".concat(error_3 instanceof Error ? error_3.message : String(error_3)));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Disconnect from the server
     */
    SimpleMCPClient.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.client && this.transport)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.client.close()];
                    case 1:
                        _a.sent();
                        this.client = null;
                        this.transport = null;
                        console.log("Disconnected from MCP server");
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    return SimpleMCPClient;
}());
exports.SimpleMCPClient = SimpleMCPClient;
/**
 * Interactive demo function
 */
function runDemo() {
    return __awaiter(this, void 0, void 0, function () {
        var client, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = new SimpleMCPClient();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 16, , 17]);
                    // Connect to calculator server
                    console.log("🧮 Testing Calculator Server");
                    return [4 /*yield*/, client.connect("node", ["build/servers/calculator.js"])];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, client.listTools()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, client.callTool("add", { a: 5, b: 3 })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, client.callTool("multiply", { a: 4, b: 7 })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, client.callTool("factorial", { number: 5 })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, client.callTool("sqrt", { number: 16 })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, client.disconnect()];
                case 8:
                    _a.sent();
                    // Wait a moment between connections
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 9:
                    // Wait a moment between connections
                    _a.sent();
                    // Connect to filesystem server
                    console.log("\n📁 Testing Filesystem Server");
                    return [4 /*yield*/, client.connect("node", ["build/servers/filesystem.js"])];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, client.listTools()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, client.listResources()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, client.callTool("list-directory", { path: "." })];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, client.callTool("file-info", { path: "package.json" })];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, client.disconnect()];
                case 15:
                    _a.sent();
                    return [3 /*break*/, 17];
                case 16:
                    error_4 = _a.sent();
                    console.error("Demo error:", error_4);
                    return [3 /*break*/, 17];
                case 17: return [2 /*return*/];
            }
        });
    });
}
// Run demo if this file is executed directly
// Note: In a real application, you might want to use a different approach
// for detecting if this is the main module in ESM
var isMainModule = process.argv[1] && process.argv[1].endsWith('simple-client.js');
if (isMainModule) {
    runDemo().catch(console.error);
}
