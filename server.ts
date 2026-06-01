import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

// Load environment variables
dotenv.config();

// Ensure Express is setup
const app = express();
const PORT = 3000;

// Increase limit to accommodate base64 screenshot uploads
app.use(express.json({ limit: "15mb" }));

// Helper function to lazy-initialize GoogleGenAI
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY environment variable is not configured or holds a placeholder.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Route for deconstructing and stress testing UI
app.post("/api/stress-test", async (req, res) => {
  try {
    const { url, screenshotBase64, mimeType } = req.body;

    if (!url && !screenshotBase64) {
      return res.status(400).json({ error: "Provide either a website URL or a UI screenshot to analyze." });
    }

    const ai = getGenAI();

    // Prepare content parts for Gemini
    const contents: any[] = [];
    
    // UI screenshot part if uploaded
    if (screenshotBase64) {
      contents.push({
        inlineData: {
          mimeType: mimeType || "image/png",
          data: screenshotBase64.replace(/^data:image\/\w+;base64,/, ""),
        },
      });
    }

    // Structured UX audit instructions prompt
    let promptText = `Verify, audit, and deconstruct the user experience of the provided UI `;
    if (screenshotBase64 && url) {
      promptText += `screenshot representing the website ${url}.`;
    } else if (screenshotBase64) {
      promptText += `screenshot.`;
    } else {
      promptText += `website URL: ${url}. (Audit based on your generalized knowledge of this service's standard web layout, onboarding patterns, text fields, and CTAs).`;
    }

    promptText += `
    
You are a highly sophisticated, objective, and supportive Lead UX Auditor. You have high attention to detail for:
1. Form optimization and cognitive complexity (minimizing unnecessary fields like corporate size or phone requirements).
2. Cognitive hierarchy and information layout (ensuring information is structured cleanly with generous room, preventing overwhelming visual density).
3. Clear and universal vocabulary (translating technical jargon and system acronyms into plain, accessible, user-friendly labels).
4. Interactive safeguard loops (providing reassuring confirmation states for critical actions, clear steps, and helpful microcopy guidance).

Evaluate this UI by analyzing how each of these three target user personas reacts to it:
1. Anxious User: Seeks maximum reassurance and clarity. Wants to avoid input errors, data loss, or unintended subscription flows. Experiences friction with compact displays or missing fallback validation guidelines.
2. Distracted User: Multi-tasking, high distraction level, fast attention switching. Misses small interactive controls. Requires elegant visual focus, prominent typography hierarchies, and unmistakable touch targets.
3. First-Time User: Completely alien to your jargon. Doesn't know what the product is or how to start. Gets trapped with empty text states.

Return an audit report containing a "Global Panic Score" (reflecting overall interaction friction, 0-100) and structured feedback for each simulated persona. Keep the tone premium, detailed, objective, and supportive, with exceptional and constructive design recommendations.`;

    contents.push({ text: promptText });

    // Define JSON schema for the audit report response
    const reportSchema = {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: "A short, clean, and professional name identifying this website (e.g., 'Video Processing Dashboard' or 'Payment Settlement Workspace')."
        },
        globalPanicScore: {
          type: Type.INTEGER,
          description: "Global cognitive stress and interaction friction score from 0 (perfect clarity) to 100 (high friction)."
        },
        brutalSummary: {
          type: Type.STRING,
          description: "A professional and objective 2-sentence executive summary detailing the primary friction points found."
        },
        visualAestheticRating: {
          type: Type.STRING,
          description: "A constructive design scoring label (e.g., '8/10: Light Clean Interface', '6/10: Dense Corporate Layout')."
        },
        aestheticCritique: {
          type: Type.STRING,
          description: "A detailed and helpful critique of the fonts, container margins, focus areas, and button pacing."
        },
        personas: {
          type: Type.OBJECT,
          properties: {
            anxious: {
              type: Type.OBJECT,
              properties: {
                personaName: { type: Type.STRING },
                score: { type: Type.INTEGER, description: "Stress level from 0 to 100." },
                quote: { type: Type.STRING, description: "A highly defensive inner monologue. (e.g., 'If I drop a file here, does it automatically post it public? Wait, where is the cancel button?!')" },
                biggestRisk: { type: Type.STRING, description: "The single biggest hazard causing this user to cancel/flee." },
                cognitiveLoad: { type: Type.STRING, description: "Cognitive Load description: High, Medium, or Low" },
                frictionPoints: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      element: { type: Type.STRING, description: "Specific button, form input, small text, badge, or container." },
                      locationDescription: { type: Type.STRING, description: "Where it sits on the screen to help locate it." },
                      panicTrigger: { type: Type.STRING, description: "Why it triggers panic, worry, or loss of control." },
                      severity: { type: Type.STRING, description: "Severity: high, medium, or low" }
                    },
                    required: ["element", "locationDescription", "panicTrigger", "severity"]
                  }
                }
              },
              required: ["personaName", "score", "quote", "biggestRisk", "cognitiveLoad", "frictionPoints"]
            },
            distracted: {
              type: Type.OBJECT,
              properties: {
                personaName: { type: Type.STRING },
                score: { type: Type.INTEGER, description: "Confusion/attention drift level from 0 to 100." },
                quote: { type: Type.STRING, description: "A chaotic inner monologue showing how they ignore features. (e.g., 'Oh look, a yellow border... wait, what was I supposed to drop? Ah, I'll just check Slack...')" },
                biggestRisk: { type: Type.STRING, description: "What primary flow element is so tiny or hidden they will overlook it entirely." },
                cognitiveLoad: { type: Type.STRING },
                frictionPoints: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      element: { type: Type.STRING },
                      locationDescription: { type: Type.STRING },
                      panicTrigger: { type: Type.STRING, description: "Why their attention skips over this entirely." },
                      severity: { type: Type.STRING }
                    },
                    required: ["element", "locationDescription", "panicTrigger", "severity"]
                  }
                }
              },
              required: ["personaName", "score", "quote", "biggestRisk", "cognitiveLoad", "frictionPoints"]
            },
            firstTime: {
              type: Type.OBJECT,
              properties: {
                personaName: { type: Type.STRING },
                score: { type: Type.INTEGER, description: "Alienation and jargon barrier rating from 0 to 100." },
                quote: { type: Type.STRING, description: "Clueless dialogue. (e.g., 'Wait, is this index for videos or index files? Why does it talk about Pegasus? Who's Pegasus?')" },
                biggestRisk: { type: Type.STRING, description: "The single largest jargon barrier or missing step." },
                cognitiveLoad: { type: Type.STRING },
                frictionPoints: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      element: { type: Type.STRING },
                      locationDescription: { type: Type.STRING },
                      panicTrigger: { type: Type.STRING, description: "How internal product slang or complex names make them feel stupid." },
                      severity: { type: Type.STRING }
                    },
                    required: ["element", "locationDescription", "panicTrigger", "severity"]
                  }
                }
              },
              required: ["personaName", "score", "quote", "biggestRisk", "cognitiveLoad", "frictionPoints"]
            }
          },
          required: ["anxious", "distracted", "firstTime"]
        },
        fixes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              issue: { type: Type.STRING, description: "A high-friction element found which stresses Stressed users." },
              recommendation: { type: Type.STRING, description: "Straightforward, highly actionable design solution." },
              difficulty: { type: Type.STRING, description: "Easy, Medium, or Hard" },
              impact: { type: Type.STRING, description: "Critical, Highly Beneficial, or Nice-to-Have" }
            },
            required: ["issue", "recommendation", "difficulty", "impact"]
          }
        }
      },
      required: [
        "title",
        "globalPanicScore",
        "brutalSummary",
        "visualAestheticRating",
        "aestheticCritique",
        "personas",
        "fixes"
      ]
    };

    // Generate content using Gemini 3.5-flash
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: reportSchema,
        temperature: 0.85,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response string received from Google Gemini.");
    }

    const parsedReport = JSON.parse(responseText.trim());
    return res.json(parsedReport);

  } catch (error: any) {
    console.error("Stress Test route error:", error);
    return res.status(500).json({
      error: error.message || "An unexpected error occurred during user simulation.",
      details: "Ensure your GEMINI_API_KEY is configured in Settings > Secrets."
    });
  }
});

// Configure Vite integration for full-stack build/start pipeline
async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    // Dynamically import Vite only in development to prevent bundles from packaging it
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static frontend bundle in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`panic.design server running on http://0.0.0.0:${PORT}`);
  });
}

initializeServer();
