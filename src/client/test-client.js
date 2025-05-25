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
 * Simple MCP Client for Testing
 *
 * This demonstrates how to:
 * - Create an MCP client
 * - Connect to an MCP server
 * - List available tools and resources
 * - Call tools with parameters
 * - Return data for testing purposes
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
                        return [4 /*yield*/, this.client.listTools()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.tools];
                }
            });
        });
    };
    /**
     * Call a tool with the given parameters
     */
    SimpleMCPClient.prototype.callTool = function (toolName_1) {
        return __awaiter(this, arguments, void 0, function (toolName, parameters) {
            var response, textContent;
            var _a;
            if (parameters === void 0) { parameters = {}; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.client) {
                            throw new Error("Client not connected");
                        }
                        return [4 /*yield*/, this.client.callTool({
                                name: toolName,
                                arguments: parameters,
                            })];
                    case 1:
                        response = _b.sent();
                        if (response.isError) {
                            throw new Error("Tool execution error: ".concat(((_a = response.content[0]) === null || _a === void 0 ? void 0 : _a.text) || 'Unknown error'));
                        }
                        textContent = response.content
                            .filter(function (c) { return c.type === 'text'; })
                            .map(function (c) { return c.text; })
                            .join('\n');
                        try {
                            return [2 /*return*/, JSON.parse(textContent)];
                        }
                        catch (_c) {
                            return [2 /*return*/, textContent];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * List available resources
     */
    SimpleMCPClient.prototype.listResources = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.client) {
                            throw new Error("Client not connected");
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client.listResources()];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.resources];
                    case 3:
                        error_1 = _a.sent();
                        // Server might not support resources
                        return [2 /*return*/, []];
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
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.client) {
                            throw new Error("Client not connected");
                        }
                        return [4 /*yield*/, this.client.readResource({ uri: uri })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.contents
                                .filter(function (c) { return c.text; })
                                .map(function (c) { return c.text; })
                                .join('\n')];
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
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    return SimpleMCPClient;
}());
exports.SimpleMCPClient = SimpleMCPClient;
