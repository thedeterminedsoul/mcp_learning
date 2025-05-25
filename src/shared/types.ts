/**
 * Common types and utilities for MCP learning project
 */

// MCP Protocol Types (for reference)
export interface MCPCapabilities {
  tools?: {
    listChanged?: boolean;
  };
  resources?: {
    subscribe?: boolean;
    listChanged?: boolean;
  };
  prompts?: {
    listChanged?: boolean;
  };
  logging?: Record<string, never>;
}

export interface MCPServerInfo {
  name: string;
  version: string;
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface MCPResource {
  uri: string;
  name?: string;
  description?: string;
  mimeType?: string;
}

export interface MCPPrompt {
  name: string;
  description?: string;
  arguments?: Array<{
    name: string;
    description?: string;
    required?: boolean;
  }>;
}

// Utility functions
export class MCPError extends Error {
  constructor(
    message: string,
    public code: number = -1,
    public data?: any
  ) {
    super(message);
    this.name = "MCPError";
  }
}

/**
 * Validate that a value matches the expected type
 */
export function validateType(value: any, expectedType: string, fieldName: string): void {
  const actualType = typeof value;
  if (actualType !== expectedType) {
    throw new MCPError(
      `Invalid type for ${fieldName}: expected ${expectedType}, got ${actualType}`
    );
  }
}

/**
 * Validate that required fields are present
 */
export function validateRequired(obj: any, requiredFields: string[]): void {
  for (const field of requiredFields) {
    if (!(field in obj) || obj[field] === undefined || obj[field] === null) {
      throw new MCPError(`Missing required field: ${field}`);
    }
  }
}

/**
 * Create a standardized MCP response
 */
export function createMCPResponse(content: string, isError: boolean = false) {
  return {
    content: [
      {
        type: "text" as const,
        text: content,
      },
    ],
    isError,
  };
}

/**
 * Create a standardized MCP error response
 */
export function createMCPError(message: string, code: number = -1) {
  return {
    content: [
      {
        type: "text" as const,
        text: `Error: ${message}`,
      },
    ],
    isError: true,
  };
}

/**
 * Logging utility for MCP servers
 */
export class MCPLogger {
  constructor(private serverName: string) {}

  log(level: "info" | "warn" | "error", message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${this.serverName}] [${level.toUpperCase()}] ${message}`;
    
    // Log to stderr to avoid interfering with stdio transport
    if (data) {
      console.error(logMessage, data);
    } else {
      console.error(logMessage);
    }
  }

  info(message: string, data?: any): void {
    this.log("info", message, data);
  }

  warn(message: string, data?: any): void {
    this.log("warn", message, data);
  }

  error(message: string, data?: any): void {
    this.log("error", message, data);
  }
}

/**
 * Rate limiter utility
 */
export class RateLimiter {
  private requests: number[] = [];

  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}

  isAllowed(): boolean {
    const now = Date.now();
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }

  getRemainingRequests(): number {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    return Math.max(0, this.maxRequests - this.requests.length);
  }
}

/**
 * Configuration helper for MCP servers
 */
export interface MCPServerConfig {
  name: string;
  version: string;
  description?: string;
  maxRequestsPerMinute?: number;
  enableLogging?: boolean;
  capabilities?: MCPCapabilities;
}

export function createServerConfig(config: MCPServerConfig): {
  serverInfo: MCPServerInfo;
  capabilities: MCPCapabilities;
  logger?: MCPLogger;
  rateLimiter?: RateLimiter;
} {
  const result: any = {
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
