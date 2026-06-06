/**
 * nimbleScraper.ts
 * Helper utility to integrate Nimble Scraper API (Nimbleway) into the panic.design backend.
 * This intercepts URL-only requests, renders the live target URL inside a real browser through
 * Nimble's residential proxy cloud, captures a high-resolution screenshot, and feeds it into the
 * visual-grounding Gemini UX generator.
 */

interface NimbleWebFetchPayload {
  url: string;
  render?: "js" | "html";
  screenshot?: boolean;
  viewport_width?: number;
  viewport_height?: number;
  wait_ms?: number;
}

export async function captureUrlWithNimble(targetUrl: string): Promise<string | null> {
  const username = process.env.NIMBLE_API_USERNAME;
  const password = process.env.NIMBLE_API_PASSWORD;

  // Graceful fallback if credentials are placeholder or not provided
  if (!username || !password || username === "MY_NIMBLE_API_USERNAME" || password === "MY_NIMBLE_API_PASSWORD") {
    return null;
  }

  try {
    console.log(`[NIMBLE INTERCEPT] Performing headless render for: ${targetUrl} (Using Nimble Scraper credits)`);

    // Standard Basic Authentication header based on Nimbleway specs
    const credentials = Buffer.from(`${username}:${password}`).toString("base64");
    
    // Nimbleway's highly robust Real-Time Web API
    const response = await fetch("https://api.nimbleway.com/v1/web/fetch", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        url: targetUrl,
        render: "js",         // Enable Javascript hydration for accurate visual representations
        screenshot: true,     // Request high-fidelity page screenshot
        viewport_width: 1280, // Optimized desktop viewport for clear UX review
        viewport_height: 800,
        wait_ms: 1500         // Brief delay to allow custom animations/loaders to settle
      } as NimbleWebFetchPayload)
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      console.warn(`[NIMBLE WARNING] Scraper API returned error status ${response.status}:`, errorMsg);
      return null;
    }

    const data = await response.json() as any;

    if (data && data.screenshot) {
      // Nimble returns the screenshot as a clean base64 string
      // Normalize to return only the raw data (removing data uri header if present)
      let rawBase64 = data.screenshot;
      if (rawBase64.startsWith("data:")) {
        rawBase64 = rawBase64.replace(/^data:image\/\w+;base64,/, "");
      }
      return rawBase64;
    }

    console.warn("[NIMBLE WARNING] Scraper completed successfully but no screenshot node was present in response.");
    return null;
  } catch (err: any) {
    console.error("[NIMBLE SERVICE ERROR] Intercept failed:", err.message || err);
    return null;
  }
}
