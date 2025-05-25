#!/usr/bin/env node
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
/**
 * Calculator MCP Server
 *
 * A simple MCP server that demonstrates:
 * - Multiple tool registration
 * - Input validation with Zod
 * - Mathematical operations
 * - Error handling for invalid inputs
 */
var server = new index_js_1.Server({
    name: "calculator-server",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
// Input validation schemas using Zod
var NumberPairSchema = zod_1.z.object({
    a: zod_1.z.number().describe("First number"),
    b: zod_1.z.number().describe("Second number"),
});
var SingleNumberSchema = zod_1.z.object({
    number: zod_1.z.number().describe("Input number"),
});
var PowerSchema = zod_1.z.object({
    base: zod_1.z.number().describe("Base number"),
    exponent: zod_1.z.number().describe("Exponent"),
});
server.setRequestHandler(types_js_1.ListToolsRequestSchema, function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
                tools: [
                    {
                        name: "add",
                        description: "Add two numbers",
                        inputSchema: {
                            type: "object",
                            properties: {
                                a: { type: "number", description: "First number" },
                                b: { type: "number", description: "Second number" },
                            },
                            required: ["a", "b"],
                        },
                    },
                    {
                        name: "subtract",
                        description: "Subtract second number from first",
                        inputSchema: {
                            type: "object",
                            properties: {
                                a: { type: "number", description: "First number (minuend)" },
                                b: { type: "number", description: "Second number (subtrahend)" },
                            },
                            required: ["a", "b"],
                        },
                    },
                    {
                        name: "multiply",
                        description: "Multiply two numbers",
                        inputSchema: {
                            type: "object",
                            properties: {
                                a: { type: "number", description: "First number" },
                                b: { type: "number", description: "Second number" },
                            },
                            required: ["a", "b"],
                        },
                    },
                    {
                        name: "divide",
                        description: "Divide first number by second",
                        inputSchema: {
                            type: "object",
                            properties: {
                                a: { type: "number", description: "Dividend" },
                                b: { type: "number", description: "Divisor (cannot be zero)" },
                            },
                            required: ["a", "b"],
                        },
                    },
                    {
                        name: "power",
                        description: "Raise base to the power of exponent",
                        inputSchema: {
                            type: "object",
                            properties: {
                                base: { type: "number", description: "Base number" },
                                exponent: { type: "number", description: "Exponent" },
                            },
                            required: ["base", "exponent"],
                        },
                    },
                    {
                        name: "sqrt",
                        description: "Calculate square root of a number",
                        inputSchema: {
                            type: "object",
                            properties: {
                                number: {
                                    type: "number",
                                    description: "Number to calculate square root of (must be non-negative)",
                                    minimum: 0
                                },
                            },
                            required: ["number"],
                        },
                    },
                    {
                        name: "factorial",
                        description: "Calculate factorial of a non-negative integer",
                        inputSchema: {
                            type: "object",
                            properties: {
                                number: {
                                    type: "number",
                                    description: "Non-negative integer to calculate factorial of",
                                    minimum: 0
                                },
                            },
                            required: ["number"],
                        },
                    },
                ],
            }];
    });
}); });
server.setRequestHandler(types_js_1.CallToolRequestSchema, function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, args, _b, a, b, result, _c, a, b, result, _d, a, b, result, _e, a, b, result, _f, base, exponent, result, number, result, number, result, i;
    return __generator(this, function (_g) {
        _a = request.params, name = _a.name, args = _a.arguments;
        try {
            switch (name) {
                case "add": {
                    _b = NumberPairSchema.parse(args), a = _b.a, b = _b.b;
                    result = a + b;
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "".concat(a, " + ").concat(b, " = ").concat(result),
                                },
                            ],
                        }];
                }
                case "subtract": {
                    _c = NumberPairSchema.parse(args), a = _c.a, b = _c.b;
                    result = a - b;
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "".concat(a, " - ").concat(b, " = ").concat(result),
                                },
                            ],
                        }];
                }
                case "multiply": {
                    _d = NumberPairSchema.parse(args), a = _d.a, b = _d.b;
                    result = a * b;
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "".concat(a, " \u00D7 ").concat(b, " = ").concat(result),
                                },
                            ],
                        }];
                }
                case "divide": {
                    _e = NumberPairSchema.parse(args), a = _e.a, b = _e.b;
                    if (b === 0) {
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: "text",
                                        text: "Error: Division by zero is undefined",
                                    },
                                ],
                                isError: true,
                            }];
                    }
                    result = a / b;
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "".concat(a, " \u00F7 ").concat(b, " = ").concat(result),
                                },
                            ],
                        }];
                }
                case "power": {
                    _f = PowerSchema.parse(args), base = _f.base, exponent = _f.exponent;
                    result = Math.pow(base, exponent);
                    if (!isFinite(result)) {
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: "text",
                                        text: "Error: Result is ".concat(result, " (infinite or too large)"),
                                    },
                                ],
                                isError: true,
                            }];
                    }
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "".concat(base, "^").concat(exponent, " = ").concat(result),
                                },
                            ],
                        }];
                }
                case "sqrt": {
                    number = SingleNumberSchema.parse(args).number;
                    if (number < 0) {
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: "text",
                                        text: "Error: Cannot calculate square root of a negative number",
                                    },
                                ],
                                isError: true,
                            }];
                    }
                    result = Math.sqrt(number);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "\u221A".concat(number, " = ").concat(result),
                                },
                            ],
                        }];
                }
                case "factorial": {
                    number = SingleNumberSchema.parse(args).number;
                    if (!Number.isInteger(number) || number < 0) {
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: "text",
                                        text: "Error: Factorial is only defined for non-negative integers",
                                    },
                                ],
                                isError: true,
                            }];
                    }
                    if (number > 170) {
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: "text",
                                        text: "Error: Factorial too large (number > 170 causes overflow)",
                                    },
                                ],
                                isError: true,
                            }];
                    }
                    result = 1;
                    for (i = 2; i <= number; i++) {
                        result *= i;
                    }
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "".concat(number, "! = ").concat(result),
                                },
                            ],
                        }];
                }
                default:
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Unknown tool: ".concat(name),
                                },
                            ],
                            isError: true,
                        }];
            }
        }
        catch (error) {
            return [2 /*return*/, {
                    content: [
                        {
                            type: "text",
                            text: "Error executing tool ".concat(name, ": ").concat(error instanceof Error ? error.message : String(error)),
                        },
                    ],
                    isError: true,
                }];
        }
        return [2 /*return*/];
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
                    console.error("Calculator MCP Server running on stdio");
                    return [2 /*return*/];
            }
        });
    });
}
process.on('SIGINT', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.error('Shutting down server...');
        process.exit(0);
        return [2 /*return*/];
    });
}); });
main().catch(function (error) {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
