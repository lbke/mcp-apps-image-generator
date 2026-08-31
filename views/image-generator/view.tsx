/** MCP App starter view — edit this file to build your UI. */
import { useToolContext } from "mcp-use/react";

import "./view.css";
import { useData } from "./useData.js";

export default function McpApp() {
  const view = useToolContext<"generate-image">();
  const [imgBody, error] = useData(
    view.status !== "ready",
    "https://api.openai.com/v1/images/generations",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${view.toolOutput?.apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1.5",
        prompt: view.toolOutput?.prompt,
        n: 1,
        size: "1024x1024",
      }),
    },
  );
  if (error) {
    return "Error: " + error;
  }
  if (view.status === "pending") {
    return "Loading...";
  }
  if (view.status === "error") {
    return "Error...";
  }
  if (!imgBody) return "Generating image...";
  console.log(imgBody);
  // https://developers.openai.com/api/reference/resources/images/methods/generate
  const img = imgBody.data[0].b64_json;

  return (
    <img src={"data:image/png;base64, " + img} width={1024} height={1024} />
  );
}
