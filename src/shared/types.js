"use strict";
/**
 * Common types and utilities for MCP learning project
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = exports.MCPLogger = exports.MCPError = void 0;
exports.validateType = validateType;
exports.validateRequired = validateRequired;
exports.createMCPResponse = createMCPResponse;
exports.createMCPError = createMCPError;
exports.createServerConfig = createServerConfig;
// Utility functions
var MCPError = /** @class */ (function (_super) {
    __extends(MCPError, _super);
    function MCPError(message, code, data) {
        if (code === void 0) { code = -1; }
        var _this = _super.call(this, message) || this;
        _this.code = code;
        _this.data = data;
        _this.name = "MCPError";
        return _this;
    }
    return MCPError;
}(Error));
exports.MCPError = MCPError;
/**
 * Validate that a value matches the expected type
 */
function validateType(value, expectedType, fieldName) {
    var actualType = typeof value;
    if (actualType !== expectedType) {
        throw new MCPError("Invalid type for ".concat(fieldName, ": expected ").concat(expectedType, ", got ").concat(actualType));
    }
}
/**
 * Validate that required fields are present
 */
function validateRequired(obj, requiredFields) {
    for (var _i = 0, requiredFields_1 = requiredFields; _i < requiredFields_1.length; _i++) {
        var field = requiredFields_1[_i];
        if (!(field in obj) || obj[field] === undefined || obj[field] === null) {
            throw new MCPError("Missing required field: ".concat(field));
        }
    }
}
/**
 * Create a standardized MCP response
 */
function createMCPResponse(content, isError) {
    if (isError === void 0) { isError = false; }
    return {
        content: [
            {
                type: "text",
                text: content,
            },
        ],
        isError: isError,
    };
}
/**
 * Create a standardized MCP error response
 */
function createMCPError(message, code) {
    if (code === void 0) { code = -1; }
    return {
        content: [
            {
                type: "text",
                text: "Error: ".concat(message),
            },
        ],
        isError: true,
    };
}
/**
 * Logging utility for MCP servers
 */
var MCPLogger = /** @class */ (function () {
    function MCPLogger(serverName) {
        this.serverName = serverName;
    }
    MCPLogger.prototype.log = function (level, message, data) {
        var timestamp = new Date().toISOString();
        var logMessage = "[".concat(timestamp, "] [").concat(this.serverName, "] [").concat(level.toUpperCase(), "] ").concat(message);
        // Log to stderr to avoid interfering with stdio transport
        if (data) {
            console.error(logMessage, data);
        }
        else {
            console.error(logMessage);
        }
    };
    MCPLogger.prototype.info = function (message, data) {
        this.log("info", message, data);
    };
    MCPLogger.prototype.warn = function (message, data) {
        this.log("warn", message, data);
    };
    MCPLogger.prototype.error = function (message, data) {
        this.log("error", message, data);
    };
    return MCPLogger;
}());
exports.MCPLogger = MCPLogger;
/**
 * Rate limiter utility
 */
var RateLimiter = /** @class */ (function () {
    function RateLimiter(maxRequests, windowMs) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.requests = [];
    }
    RateLimiter.prototype.isAllowed = function () {
        var _this = this;
        var now = Date.now();
        // Remove old requests outside the window
        this.requests = this.requests.filter(function (time) { return now - time < _this.windowMs; });
        if (this.requests.length >= this.maxRequests) {
            return false;
        }
        this.requests.push(now);
        return true;
    };
    RateLimiter.prototype.getRemainingRequests = function () {
        var _this = this;
        var now = Date.now();
        this.requests = this.requests.filter(function (time) { return now - time < _this.windowMs; });
        return Math.max(0, this.maxRequests - this.requests.length);
    };
    return RateLimiter;
}());
exports.RateLimiter = RateLimiter;
function createServerConfig(config) {
    var result = {
        serverInfo: {
            name: config.name,
            version: config.version,
        },
        capabilities: config.capabilities || {
            tools: {},
        },
    };
    if (config.enableLogging) {
        result.logger = new MCPLogger(config.name);
    }
    if (config.maxRequestsPerMinute) {
        result.rateLimiter = new RateLimiter(config.maxRequestsPerMinute, 60000);
    }
    return result;
}
