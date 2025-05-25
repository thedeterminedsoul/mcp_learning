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
var fs_1 = require("fs");
var path_1 = require("path");
/**
 * Filesystem MCP Server
 *
 * This server demonstrates both TOOLS and RESOURCES:
 * - Tools: File operations (read, write, list)
 * - Resources: Direct file access for reading
 *
 * Shows advanced MCP concepts:
 * - Multiple capability types
 * - File system operations
 * - Error handling for file operations
 * - Security considerations (restricted to working directory)
 */
var server = new index_js_1.Server({
    name: "filesystem-server",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
        resources: {},
    },
});
// Security: Restrict operations to current working directory
var WORKING_DIR = process.cwd();
/**
 * Safely resolve a path within the working directory
 */
function safePath(inputPath) {
    var resolved = (0, path_1.join)(WORKING_DIR, inputPath);
    if (!resolved.startsWith(WORKING_DIR)) {
        throw new Error("Path traversal detected - access denied");
    }
    return resolved;
}
/**
 * Check if a file exists
 */
function fileExists(path) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs_1.promises.access(path)];
                case 1:
                    _b.sent();
                    return [2 /*return*/, true];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get file information
 */
function getFileInfo(path) {
    return __awaiter(this, void 0, void 0, function () {
        var stats;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.promises.stat(path)];
                case 1:
                    stats = _a.sent();
                    return [2 /*return*/, {
                            size: stats.size,
                            isFile: stats.isFile(),
                            isDirectory: stats.isDirectory(),
                            modified: stats.mtime.toISOString(),
                            created: stats.birthtime.toISOString(),
                        }];
            }
        });
    });
}
// Tools
server.setRequestHandler(types_js_1.ListToolsRequestSchema, function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
                tools: [
                    {
                        name: "read-file",
                        description: "Read the contents of a file",
                        inputSchema: {
                            type: "object",
                            properties: {
                                path: {
                                    type: "string",
                                    description: "Path to the file to read (relative to working directory)",
                                },
                            },
                            required: ["path"],
                        },
                    },
                    {
                        name: "write-file",
                        description: "Write content to a file",
                        inputSchema: {
                            type: "object",
                            properties: {
                                path: {
                                    type: "string",
                                    description: "Path to the file to write (relative to working directory)",
                                },
                                content: {
                                    type: "string",
                                    description: "Content to write to the file",
                                },
                            },
                            required: ["path", "content"],
                        },
                    },
                    {
                        name: "list-directory",
                        description: "List contents of a directory",
                        inputSchema: {
                            type: "object",
                            properties: {
                                path: {
                                    type: "string",
                                    description: "Path to the directory to list (relative to working directory)",
                                    default: ".",
                                },
                            },
                        },
                    },
                    {
                        name: "create-directory",
                        description: "Create a new directory",
                        inputSchema: {
                            type: "object",
                            properties: {
                                path: {
                                    type: "string",
                                    description: "Path of the directory to create (relative to working directory)",
                                },
                            },
                            required: ["path"],
                        },
                    },
                    {
                        name: "delete-file",
                        description: "Delete a file or directory",
                        inputSchema: {
                            type: "object",
                            properties: {
                                path: {
                                    type: "string",
                                    description: "Path to the file or directory to delete (relative to working directory)",
                                },
                            },
                            required: ["path"],
                        },
                    },
                    {
                        name: "file-info",
                        description: "Get information about a file or directory",
                        inputSchema: {
                            type: "object",
                            properties: {
                                path: {
                                    type: "string",
                                    description: "Path to the file or directory (relative to working directory)",
                                },
                            },
                            required: ["path"],
                        },
                    },
                ],
            }];
    });
}); });
server.setRequestHandler(types_js_1.CallToolRequestSchema, function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, args, _b, path, safePath_resolved, content, _c, path, content, safePath_resolved, dir, _d, path, safePath_resolved_1, items, itemDetails, path, safePath_resolved, path, safePath_resolved, stats, path, safePath_resolved, info, infoText, error_1;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = request.params, name = _a.name, args = _a.arguments;
                _e.label = 1;
            case 1:
                _e.trys.push([1, 25, , 26]);
                _b = name;
                switch (_b) {
                    case "read-file": return [3 /*break*/, 2];
                    case "write-file": return [3 /*break*/, 5];
                    case "list-directory": return [3 /*break*/, 8];
                    case "create-directory": return [3 /*break*/, 12];
                    case "delete-file": return [3 /*break*/, 14];
                    case "file-info": return [3 /*break*/, 20];
                }
                return [3 /*break*/, 23];
            case 2:
                path = args.path;
                safePath_resolved = safePath(path);
                return [4 /*yield*/, fileExists(safePath_resolved)];
            case 3:
                if (!(_e.sent())) {
                    return [2 /*return*/, {
                            content: [{ type: "text", text: "File not found: ".concat(path) }],
                            isError: true,
                        }];
                }
                return [4 /*yield*/, fs_1.promises.readFile(safePath_resolved, "utf8")];
            case 4:
                content = _e.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Contents of ".concat(path, ":\n\n").concat(content),
                            },
                        ],
                    }];
            case 5:
                _c = args, path = _c.path, content = _c.content;
                safePath_resolved = safePath(path);
                dir = (0, path_1.dirname)(safePath_resolved);
                return [4 /*yield*/, fs_1.promises.mkdir(dir, { recursive: true })];
            case 6:
                _e.sent();
                return [4 /*yield*/, fs_1.promises.writeFile(safePath_resolved, content, "utf8")];
            case 7:
                _e.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Successfully wrote ".concat(content.length, " characters to ").concat(path),
                            },
                        ],
                    }];
            case 8:
                _d = args.path, path = _d === void 0 ? "." : _d;
                safePath_resolved_1 = safePath(path);
                return [4 /*yield*/, fileExists(safePath_resolved_1)];
            case 9:
                if (!(_e.sent())) {
                    return [2 /*return*/, {
                            content: [{ type: "text", text: "Directory not found: ".concat(path) }],
                            isError: true,
                        }];
                }
                return [4 /*yield*/, fs_1.promises.readdir(safePath_resolved_1)];
            case 10:
                items = _e.sent();
                return [4 /*yield*/, Promise.all(items.map(function (item) { return __awaiter(void 0, void 0, void 0, function () {
                        var itemPath, stats, type, size;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    itemPath = (0, path_1.join)(safePath_resolved_1, item);
                                    return [4 /*yield*/, fs_1.promises.stat(itemPath)];
                                case 1:
                                    stats = _a.sent();
                                    type = stats.isDirectory() ? "DIR" : "FILE";
                                    size = stats.isFile() ? " (".concat(stats.size, " bytes)") : "";
                                    return [2 /*return*/, "".concat(type, ": ").concat(item).concat(size)];
                            }
                        });
                    }); }))];
            case 11:
                itemDetails = _e.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Contents of ".concat(path, ":\n\n").concat(itemDetails.join("\n")),
                            },
                        ],
                    }];
            case 12:
                path = args.path;
                safePath_resolved = safePath(path);
                return [4 /*yield*/, fs_1.promises.mkdir(safePath_resolved, { recursive: true })];
            case 13:
                _e.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Directory created: ".concat(path),
                            },
                        ],
                    }];
            case 14:
                path = args.path;
                safePath_resolved = safePath(path);
                return [4 /*yield*/, fileExists(safePath_resolved)];
            case 15:
                if (!(_e.sent())) {
                    return [2 /*return*/, {
                            content: [{ type: "text", text: "File or directory not found: ".concat(path) }],
                            isError: true,
                        }];
                }
                return [4 /*yield*/, fs_1.promises.stat(safePath_resolved)];
            case 16:
                stats = _e.sent();
                if (!stats.isDirectory()) return [3 /*break*/, 18];
                return [4 /*yield*/, fs_1.promises.rmdir(safePath_resolved, { recursive: true })];
            case 17:
                _e.sent();
                return [2 /*return*/, {
                        content: [{ type: "text", text: "Directory deleted: ".concat(path) }],
                    }];
            case 18: return [4 /*yield*/, fs_1.promises.unlink(safePath_resolved)];
            case 19:
                _e.sent();
                return [2 /*return*/, {
                        content: [{ type: "text", text: "File deleted: ".concat(path) }],
                    }];
            case 20:
                path = args.path;
                safePath_resolved = safePath(path);
                return [4 /*yield*/, fileExists(safePath_resolved)];
            case 21:
                if (!(_e.sent())) {
                    return [2 /*return*/, {
                            content: [{ type: "text", text: "File or directory not found: ".concat(path) }],
                            isError: true,
                        }];
                }
                return [4 /*yield*/, getFileInfo(safePath_resolved)];
            case 22:
                info = _e.sent();
                infoText = [
                    "File information for: ".concat(path),
                    "Type: ".concat(info.isFile ? "File" : "Directory"),
                    "Size: ".concat(info.size, " bytes"),
                    "Modified: ".concat(info.modified),
                    "Created: ".concat(info.created),
                ].join("\n");
                return [2 /*return*/, {
                        content: [{ type: "text", text: infoText }],
                    }];
            case 23: return [2 /*return*/, {
                    content: [{ type: "text", text: "Unknown tool: ".concat(name) }],
                    isError: true,
                }];
            case 24: return [3 /*break*/, 26];
            case 25:
                error_1 = _e.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Error executing ".concat(name, ": ").concat(error_1 instanceof Error ? error_1.message : String(error_1)),
                            },
                        ],
                        isError: true,
                    }];
            case 26: return [2 /*return*/];
        }
    });
}); });
// Resources
server.setRequestHandler(types_js_1.ListResourcesRequestSchema, function () { return __awaiter(void 0, void 0, void 0, function () {
    var resources, items, _i, items_1, item, itemPath, stats, ext, textExtensions, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                resources = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                return [4 /*yield*/, fs_1.promises.readdir(WORKING_DIR)];
            case 2:
                items = _a.sent();
                _i = 0, items_1 = items;
                _a.label = 3;
            case 3:
                if (!(_i < items_1.length)) return [3 /*break*/, 6];
                item = items_1[_i];
                itemPath = (0, path_1.join)(WORKING_DIR, item);
                return [4 /*yield*/, fs_1.promises.stat(itemPath)];
            case 4:
                stats = _a.sent();
                if (stats.isFile()) {
                    ext = (0, path_1.extname)(item).toLowerCase();
                    textExtensions = ['.txt', '.md', '.js', '.ts', '.json', '.yaml', '.yml', '.xml', '.html', '.css'];
                    if (textExtensions.includes(ext) || !ext) {
                        resources.push({
                            uri: "file://".concat((0, path_1.relative)(WORKING_DIR, itemPath)),
                            name: item,
                            description: "Text file: ".concat(item, " (").concat(stats.size, " bytes)"),
                            mimeType: "text/plain",
                        });
                    }
                }
                _a.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 8];
            case 7:
                error_2 = _a.sent();
                console.error("Error listing resources:", error_2);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/, { resources: resources }];
        }
    });
}); });
server.setRequestHandler(types_js_1.ReadResourceRequestSchema, function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var uri, path, safePath_resolved, content, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                uri = request.params.uri;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                // Extract path from file:// URI
                if (!uri.startsWith("file://")) {
                    return [2 /*return*/, {
                            contents: [
                                {
                                    uri: uri,
                                    mimeType: "text/plain",
                                    text: "Error: Only file:// URIs are supported",
                                },
                            ],
                        }];
                }
                path = uri.slice(7);
                safePath_resolved = safePath(path);
                return [4 /*yield*/, fileExists(safePath_resolved)];
            case 2:
                if (!(_a.sent())) {
                    return [2 /*return*/, {
                            contents: [
                                {
                                    uri: uri,
                                    mimeType: "text/plain",
                                    text: "File not found: ".concat(path),
                                },
                            ],
                        }];
                }
                return [4 /*yield*/, fs_1.promises.readFile(safePath_resolved, "utf8")];
            case 3:
                content = _a.sent();
                return [2 /*return*/, {
                        contents: [
                            {
                                uri: uri,
                                mimeType: "text/plain",
                                text: content,
                            },
                        ],
                    }];
            case 4:
                error_3 = _a.sent();
                return [2 /*return*/, {
                        contents: [
                            {
                                uri: uri,
                                mimeType: "text/plain",
                                text: "Error reading resource: ".concat(error_3 instanceof Error ? error_3.message : String(error_3)),
                            },
                        ],
                    }];
            case 5: return [2 /*return*/];
        }
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
                    console.error("Filesystem MCP Server running on stdio");
                    console.error("Working directory: ".concat(WORKING_DIR));
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
