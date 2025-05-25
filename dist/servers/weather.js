#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
/**
 * Weather MCP Server
 *
 * This is a basic MCP server that provides weather-related tools.
 * It demonstrates the core concepts of MCP:
 * - Tool registration with schemas
 * - Tool execution with error handling
 * - External API integration
 * - Proper TypeScript types
 */
const NWS_API_BASE = "https://api.weather.gov";
const USER_AGENT = "weather-mcp-server/1.0";
// Server instance
const server = new index_js_1.Server({
    name: "weather-server",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
/**
 * Helper function for making requests to the National Weather Service API
 */
async function makeNWSRequest(url) {
    const headers = {
        "User-Agent": USER_AGENT,
        "Accept": "application/geo+json",
    };
    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return (await response.json());
    }
    catch (error) {
        console.error("Error making NWS request:", error);
        return null;
    }
}
/**
 * Format alert data for display
 */
function formatAlert(feature) {
    const props = feature.properties;
    return [
        `Event: ${props.event || "Unknown"}`,
        `Area: ${props.areaDesc || "Unknown"}`,
        `Severity: ${props.severity || "Unknown"}`,
        `Status: ${props.status || "Unknown"}`,
        `Headline: ${props.headline || "No headline"}`,
        `Description: ${props.description || "No description"}`,
        `Instructions: ${props.instruction || "No instructions"}`,
        "---",
    ].join("\n");
}
// Tool handlers
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "get-alerts",
                description: "Get weather alerts for a US state",
                inputSchema: {
                    type: "object",
                    properties: {
                        state: {
                            type: "string",
                            description: "Two-letter US state code (e.g. CA, NY)",
                            pattern: "^[A-Z]{2}$",
                        },
                    },
                    required: ["state"],
                },
            },
            {
                name: "get-forecast",
                description: "Get weather forecast for a specific location",
                inputSchema: {
                    type: "object",
                    properties: {
                        latitude: {
                            type: "number",
                            description: "Latitude coordinate (-90 to 90)",
                            minimum: -90,
                            maximum: 90,
                        },
                        longitude: {
                            type: "number",
                            description: "Longitude coordinate (-180 to 180)",
                            minimum: -180,
                            maximum: 180,
                        },
                    },
                    required: ["latitude", "longitude"],
                },
            },
        ],
    };
});
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        if (name === "get-alerts") {
            const { state } = args;
            const stateCode = state.toUpperCase();
            const alertsUrl = `${NWS_API_BASE}/alerts?area=${stateCode}`;
            const alertsData = await makeNWSRequest(alertsUrl);
            if (!alertsData) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Failed to retrieve alerts data from the National Weather Service.",
                        },
                    ],
                };
            }
            const features = alertsData.features || [];
            if (features.length === 0) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `No active weather alerts for ${stateCode}.`,
                        },
                    ],
                };
            }
            const formattedAlerts = features.map(formatAlert);
            const alertsText = `Active weather alerts for ${stateCode}:\n\n${formattedAlerts.join("\n")}`;
            return {
                content: [
                    {
                        type: "text",
                        text: alertsText,
                    },
                ],
            };
        }
        if (name === "get-forecast") {
            const { latitude, longitude } = args;
            // Get grid point data first
            const pointsUrl = `${NWS_API_BASE}/points/${latitude.toFixed(4)},${longitude.toFixed(4)}`;
            const pointsData = await makeNWSRequest(pointsUrl);
            if (!pointsData) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Failed to retrieve grid point data for coordinates: ${latitude}, ${longitude}. This location may not be supported by the NWS API (only US locations are supported).`,
                        },
                    ],
                };
            }
            const forecastUrl = pointsData.properties?.forecast;
            if (!forecastUrl) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Failed to get forecast URL from grid point data.",
                        },
                    ],
                };
            }
            // Get forecast data
            const forecastData = await makeNWSRequest(forecastUrl);
            if (!forecastData) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Failed to retrieve forecast data.",
                        },
                    ],
                };
            }
            const periods = forecastData.properties?.periods || [];
            if (periods.length === 0) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "No forecast periods available.",
                        },
                    ],
                };
            }
            // Format forecast periods (show first 5)
            const formattedForecast = periods.slice(0, 5).map((period) => [
                `${period.name || "Unknown"}:`,
                `Temperature: ${period.temperature || "Unknown"}°${period.temperatureUnit || "F"}`,
                `Wind: ${period.windSpeed || "Unknown"} ${period.windDirection || ""}`,
                `Forecast: ${period.detailedForecast || period.shortForecast || "No forecast available"}`,
                "---",
            ].join("\n"));
            const forecastText = `Weather forecast for ${latitude}, ${longitude}:\n\n${formattedForecast.join("\n")}`;
            return {
                content: [
                    {
                        type: "text",
                        text: forecastText,
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: `Unknown tool: ${name}`,
                },
            ],
            isError: true,
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error executing tool ${name}: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
            isError: true,
        };
    }
});
/**
 * Main function to start the server
 */
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error("Weather MCP Server running on stdio");
}
// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.error('Shutting down server...');
    process.exit(0);
});
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
