import { MCPServer } from "mcp-use";
import { z } from "zod";

const server = new MCPServer({
  name: "mcp-apps-image-generator",
  title: "mcp-apps-image-generator", // Human readable name of the server
  version: "1.0.0",
  description: "an mcp-use app",
  instructions: "use show-app to open the app view", // Model-facing guidance — surfaced to the LLM by compatible clients.
  websiteUrl: "https://mcp-use.com",
  // Icons for your MCP Server, from public/ (or absolute URLs).
  icons: [
    {
      src: "icon.svg",
      mimeType: "image/svg+xml",
      sizes: ["512x512"],
    },
  ],

  // The MCP server is by default served at /mcp, to customise
  // basePath: "/mcp",

  // mcp-use has 1 line adapter for OAuth, import from mcp-use/oauth/*
  // oauth: oauthClerkProvider(), // zero-config via MCP_USE_OAUTH_CLERK_FRONTEND_API_URL, import from mcp-use/oauth/*

  // When OAuth is on, the HTML landing page (/mcp) is protected by default, set to true to keep the landing page public while /mcp stays bearer-protected.
  // publicLandingPage: true,
});

// TOOLS

// tool inputs are zod schemas. Important: set decriptions for the model to understand the input.
const generateImageInputSchema = z.object({
  prompt: z.string().max(1024).describe("Image generation prompt"),
  apiKey: z
    .string()
    .optional()
    .describe(
      "OpenAI API key (optional, will use the key setup at server level via env if not provided)",
    ),
})

// tool outputs are zod schemas. Important: set descriptions for the model to understand the output.
// Here the tool just passes the values to the view, that will trigger the required image generation step
const generateImageOutputSchema = generateImageInputSchema

export const showApp = server.tool(
  {
    name: "generate-image", // Unique tool id on the wire.
    title: "Generate image", // Short label in inspector and client UIs (falls back to name).
    description: "Generate an image using OpenAI API", // LLM-facing summary of what the tool does.
    inputSchema: generateImageInputSchema, // Validated before the handler runs; .describe() text becomes LLM hints.
    outputSchema: generateImageOutputSchema, // Required when binding a view — the view reads structuredContent typed by this.
    view: {
      name: "image-generator", // directory under views/
      description: "Generate images using OpenAI API",
      prefersBorder: false, // ask the host to skip a card border around the view
      csp: {
        resourceDomains: [
          "https://fonts.googleapis.com",
          "https://fonts.gstatic.com",
          // To load the image in dev
          "http://127.0.0.1:3000",
          "http://localhost:3000",
        ],
        connectDomains: [
          // To call openai from the iframe
          "https://api.openai.com",
          "wss://api.openai.com"
        ],
      },
    },
    // Behavioral hints for clients (readOnly / destructive / open-world).
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: false,
    },
  },
  async ({ prompt, apiKey }, ctx) => {
    //@ts-ignore
    console.log(import.meta.env["OPENAI_API_KEY"])
    // @ts-ignore
    const finalApiKey = apiKey || process.env["OPENAI_API_KEY"] // import.meta.env["OPENAI_API_KEY"]
    return {
      content: [{ type: "text", text: "Opening image generator" }],
      structuredContent: { prompt, apiKey: finalApiKey },
    };
  }
);

export default server;
