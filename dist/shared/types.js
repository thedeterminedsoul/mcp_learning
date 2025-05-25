"use strict";
/**
 * Common types and utilities for MCP learning project
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = exports.MCPLogger = exports.MCPError = void 0;
exports.validateType = validateType;
exports.validateRequired = validateRequired;
exports.createMCPResponse = createMCPResponse;
exports.createMCPError = createMCPError;
exports.createServerConfig = createServerConfig;
// Utility functions
class MCPError extends Error {
    constructor(message, code = -1, data) {
        super(message);
        this.code = code;
        this.data = data;
        this.name = "MCPError";
    }
}
exports.MCPError = MCPError;
/**
 * Validate that a value matches the expected type
 */
function validateType(value, expectedType, fieldName) {
    const actualType = typeof value;
    if (actualType !== expectedType) {
        throw new MCPError(`Invalid type for ${fieldName}: expected ${expectedType}, got ${actualType}`);
    }
}
/**
 * Validate that required fields are present
 */
function validateRequired(obj, requiredFields) {
    for (const field of requiredFields) {
        if (!(field in obj) || obj[field] === undefined || obj[field] === null) {
            throw new MCPError(`Missing required field: ${field}`);
        }
    }
}
/**
 * Create a standardized MCP response
 */
function createMCPResponse(content, isError = false) {
    return {
        content: [
            {
                type: "text",
                text: content,
            },
        ],
        isError,
    };
}
/**
 * Create a standardized MCP error response
 */
function createMCPError(message, code = -1) {
    return {
        content: [
            {
                type: "text",
                text: `Error: ${message}`,
            },
        ],
        isError: true,
    };
}
/**
 * Logging utility for MCP servers
 */
class MCPLogger {
    constructor(serverName) {
        this.serverName = serverName;
    }
    log(level, message, data) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${this.serverName}] [${level.toUpperCase()}] ${message}`;
        // Log to stderr to avoid interfering with stdio transport
        if (data) {
            console.error(logMessage, data);
        }
        else {
            console.error(logMessage);
        }
    }
    info(message, data) {
        this.log("info", message, data);
    }
    warn(message, data) {
        this.log("warn", message, data);
    }
    error(message, data) {
        this.log("error", message, data);
    }
}
exports.MCPLogger = MCPLogger;
/**
 * Rate limiter utility
 */
class RateLimiter {
    constructor(maxRequests, windowMs) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.requests = [];
    }
    isAllowed() {
        const now = Date.now();
        // Remove old requests outside the window
        this.requests = this.requests.filter(time => now - time < this.windowMs);
        if (this.requests.length >= this.maxRequests) {
            return false;
        }
        this.requests.push(now);
        return true;
    }
    getRemainingRequests() {
        const now = Date.now();
        this.requests = this.requests.filter(time => now - time < this.windowMs);
        return Math.max(0, this.maxRequests - this.requests.length);
    }
}
exports.RateLimiter = RateLimiter;
function createServerConfig(config) {
    const result = {
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
