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
var index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
var stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
var types_js_1 = require("@modelcontextprotocol/sdk/types.js");
var zod_1 = require("zod");
var GreetArgsSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name cannot be empty'),
    style: zod_1.z.enum(['casual', 'formal', 'excited']).optional().default('casual')
});
var server = new index_js_1.Server({
    name: 'hello-world-server',
    version: '1.0.0'
}, {
    capabilities: {
        tools: {}
    }
});
server.setRequestHandler(types_js_1.ListToolsRequestSchema, function () { return __awaiter(void 0, void 0, void 0, function () {
    var tools;
    return __generator(this, function (_a) {
        tools = [
            {
                name: 'greet',
                description: 'Generate a personalized greeting with different styles',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'The name of the person to greet'
                        },
                        style: {
                            type: 'string',
                            enum: ['casual', 'formal', 'excited'],
                            description: 'The style of greeting',
                            default: 'casual'
                        }
                    },
                    required: ['name']
                }
            },
            {
                name: 'farewell',
                description: 'Generate a personalized farewell message',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'The name of the person to say goodbye to'
                        }
                    },
                    required: ['name']
                }
            }
        ];
        return [2 /*return*/, { tools: tools }];
    });
}); });
server.setRequestHandler(types_js_1.CallToolRequestSchema, function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, args, _b, personName, style, greeting, personName, farewell;
    return __generator(this, function (_c) {
        _a = request.params, name = _a.name, args = _a.arguments;
        if (name === 'greet') {
            _b = GreetArgsSchema.parse(args), personName = _b.name, style = _b.style;
            greeting = void 0;
            switch (style) {
                case 'formal':
                    greeting = "Good day, ".concat(personName, ". It is a pleasure to make your acquaintance.");
                    break;
                case 'excited':
                    greeting = "Hey ".concat(personName, "!!! \uD83C\uDF89 Welcome to the amazing MCP world! This is SO exciting! \uD83D\uDE80\u2728");
                    break;
                case 'casual':
                default:
                    greeting = "Hello, ".concat(personName, "! Welcome to the MCP world! \uD83C\uDF1F");
                    break;
            }
            return [2 /*return*/, {
                    content: [
                        {
                            type: 'text',
                            text: greeting
                        }
                    ]
                }];
        }
        if (name === 'farewell') {
            personName = zod_1.z.object({
                name: zod_1.z.string().min(1, 'Name cannot be empty')
            }).parse(args).name;
            farewell = "Goodbye, ".concat(personName, "! Thanks for exploring MCP with us. See you soon! \uD83D\uDC4B");
            return [2 /*return*/, {
                    content: [
                        {
                            type: 'text',
                            text: farewell
                        }
                    ]
                }];
        }
        throw new Error("Unknown tool: ".concat(name));
    });
}); });
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var transport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transport = new stdio_js_1.StdioServerTransport();
                    return [4 /*yield*/, server.connect(transport)];
                case 1:
                    _a.sent();
                    console.error('Hello World MCP Server running on stdio');
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(console.error);
