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
    
You are a highly sophisticated, objective, and supportive Lead Fullstack UX Auditor & UI Engineer. You have an extremely high attention to detail for:
1. Form optimization and cognitive complexity (minimizing redundant form inputs, optimizing client-side validation states, explicit autofocus and tab-indexing, keyboard navigation accessibility).
2. Cognitive hierarchy and information layout (preventing Cumulative Layout Shifts, optimizing card flexboxes, applying standard typography scales, maintaining high container spacing, structural margins).
3. Technical vocabulary and intuitive copywriting (translating complex system error stack traces, unhelpful codes, and database acronyms into direct, standard human labels).
4. Guardrails and rollback pipelines (preventing user mistakes, state preservation upon validation reload, micro-action backtracks).

Before generating any persona output, you MUST perform a silent structural scan of the provided screenshot or URL context:
- Identify every interactive element — buttons, forms, links, dropdowns, modals
- Identify the primary CTA and whether it is visually dominant
- Identify the information hierarchy — what the eye lands on first, second, third
- Detect visual noise — how many competing elements exist above the fold
- Detect trust signals or absence of them — pricing visibility, social proof, security badges
- Detect ambiguous labels — any button or link whose action is not 100% clear from its text alone
- Map the entire UI into 3 to 6 named layout zones — each zone gets a label that all personas reference consistently in their feedback reports (e.g., "primary_cta_area", "form_body_wrapper", "sidebar_controls_box").

Now, audit this UI from the perspectives of five simulated, distinct user personas. For each persona's report, you MUST provide highly detailed, realistic, and developer-centric diagnostic feedback.

Persona specifications:
1. Anxious User: Genuinely afraid of making a mistake online. Monologue is raw stream of consciousness, slightly catastrophizing. Finds every unclear label, irreversible action, missing confirmation, or unexplained input. Every complaint ends with exactly what microcopy, safe backtrack, or layout design would have calmed them down.
2. Distracted User: Gave this page 3 seconds of attention before eyes glazed over. Bored, fast, dismissive monologue. Identifies if the landing value proposition is instant, checks if primary CTA is immediately findable, complains about elements needing too much reading. Every complaint ends with what specific visual cue/resize would have held their attention.
3. First Timer: No industry jargon understood, no category knowledge. Curiosity but confusion. Identifies jargon terms, assumptions of context, and missing onboarding steps. Every complaint ends with the one-sentence orientation text that would have saved them.
4. Impatient Mobile User: On a phone, one-handed, bad connection, standing in line. Terse, frustrated monologue. Evaluates tap target sizes (WCAG 44px min), scrolling fatigue, design density, hover traps. Every complaint ends with the single clean layout adjustment to satisfy the mobile viewport.
5. Skeptic: Thinks everything is a trick. Finds dark patterns, hidden costs, vague promises, unverified proof, and excessive data grabs. Sardonic, dry monologue. Every complaint ends with the exact design signal that would have earned a fraction of their trust.

How statistics are calculated:
- Friction Points Count: Specific count of interactive elements flagged as problems (weighted by severity).
- Drop-off Probability: Calculated as the realistic, derived chance (0-100%) this persona abandons before completion.
- Trust Rating (0-100%): Anchored to specific visual trust evidence or lack thereof in the screenshot.
- Score: Overall stress/friction level.
- Panic Score: Adjusted average of all five drop-offs.

UNIVERSAL COMPLAINTS ALGORITHM:
Perform a secondary pass. Any element flagged by three or more personas MUST be elevated to a Universal Complaint, listing why multiple users hit the wall, and providing a single concrete replacement code/spec.

FIX GENERATOR BEHAVIOR:
Provide explicit replacement code or exact microcopy text instead of generic suggestions.

Panic Certificate Logic:
- Above 80: "Panic-Proof" verdict (confident, specific praise).
- Between 40 and 80: "Work In Progress" verdict (highlights top 2-3 modifications).
- Below 40: "Crime Scene" verdict (senior designer direct constructive review).`;

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
          description: "Global cognitive stress score representing friction/abandonment from 0 (perfect clarity) to 100 (high friction)."
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
        namedUIZones: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Labels of mapped UI areas from the silient structural scan."
        },
        personas: {
          type: Type.OBJECT,
          properties: {
            anxious: {
              type: Type.OBJECT,
              properties: {
                personaName: { type: Type.STRING },
                score: { type: Type.INTEGER },
                frictionPointsCount: { type: Type.INTEGER },
                dropOffProbability: { type: Type.INTEGER },
                trustRating: { type: Type.INTEGER },
                quote: { type: Type.STRING },
                biggestRisk: { type: Type.STRING },
                cognitiveLoad: { type: Type.STRING },
                frictionPoints: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      element: { type: Type.STRING },
                      locationDescription: { type: Type.STRING },
                      panicTrigger: { type: Type.STRING },
                      severity: { type: Type.STRING },
                      namedZone: { type: Type.STRING }
                    },
                    required: ["element", "locationDescription", "panicTrigger", "severity", "namedZone"]
                  }
                }
              },
              required: ["personaName", "score", "frictionPointsCount", "dropOffProbability", "trustRating", "quote", "biggestRisk", "cognitiveLoad", "frictionPoints"]
            },
            distracted: {
              type: Type.OBJECT,
              properties: {
                personaName: { type: Type.STRING },
                score: { type: Type.INTEGER },
                frictionPointsCount: { type: Type.INTEGER },
                dropOffProbability: { type: Type.INTEGER },
                trustRating: { type: Type.INTEGER },
                quote: { type: Type.STRING },
                biggestRisk: { type: Type.STRING },
                cognitiveLoad: { type: Type.STRING },
                frictionPoints: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      element: { type: Type.STRING },
                      locationDescription: { type: Type.STRING },
                      panicTrigger: { type: Type.STRING },
                      severity: { type: Type.STRING },
                      namedZone: { type: Type.STRING }
                    },
                    required: ["element", "locationDescription", "panicTrigger", "severity", "namedZone"]
                  }
                }
              },
              required: ["personaName", "score", "frictionPointsCount", "dropOffProbability", "trustRating", "quote", "biggestRisk", "cognitiveLoad", "frictionPoints"]
            },
            firstTime: {
              type: Type.OBJECT,
              properties: {
                personaName: { type: Type.STRING },
                score: { type: Type.INTEGER },
                frictionPointsCount: { type: Type.INTEGER },
                dropOffProbability: { type: Type.INTEGER },
                trustRating: { type: Type.INTEGER },
                quote: { type: Type.STRING },
                biggestRisk: { type: Type.STRING },
                cognitiveLoad: { type: Type.STRING },
                frictionPoints: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      element: { type: Type.STRING },
                      locationDescription: { type: Type.STRING },
                      panicTrigger: { type: Type.STRING },
                      severity: { type: Type.STRING },
                      namedZone: { type: Type.STRING }
                    },
                    required: ["element", "locationDescription", "panicTrigger", "severity", "namedZone"]
                  }
                }
              },
              required: ["personaName", "score", "frictionPointsCount", "dropOffProbability", "trustRating", "quote", "biggestRisk", "cognitiveLoad", "frictionPoints"]
            },
            impatientMobile: {
              type: Type.OBJECT,
              properties: {
                personaName: { type: Type.STRING },
                score: { type: Type.INTEGER },
                frictionPointsCount: { type: Type.INTEGER },
                dropOffProbability: { type: Type.INTEGER },
                trustRating: { type: Type.INTEGER },
                quote: { type: Type.STRING },
                biggestRisk: { type: Type.STRING },
                cognitiveLoad: { type: Type.STRING },
                frictionPoints: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      element: { type: Type.STRING },
                      locationDescription: { type: Type.STRING },
                      panicTrigger: { type: Type.STRING },
                      severity: { type: Type.STRING },
                      namedZone: { type: Type.STRING }
                    },
                    required: ["element", "locationDescription", "panicTrigger", "severity", "namedZone"]
                  }
                }
              },
              required: ["personaName", "score", "frictionPointsCount", "dropOffProbability", "trustRating", "quote", "biggestRisk", "cognitiveLoad", "frictionPoints"]
            },
            skeptic: {
              type: Type.OBJECT,
              properties: {
                personaName: { type: Type.STRING },
                score: { type: Type.INTEGER },
                frictionPointsCount: { type: Type.INTEGER },
                dropOffProbability: { type: Type.INTEGER },
                trustRating: { type: Type.INTEGER },
                quote: { type: Type.STRING },
                biggestRisk: { type: Type.STRING },
                cognitiveLoad: { type: Type.STRING },
                frictionPoints: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      element: { type: Type.STRING },
                      locationDescription: { type: Type.STRING },
                      panicTrigger: { type: Type.STRING },
                      severity: { type: Type.STRING },
                      namedZone: { type: Type.STRING }
                    },
                    required: ["element", "locationDescription", "panicTrigger", "severity", "namedZone"]
                  }
                }
              },
              required: ["personaName", "score", "frictionPointsCount", "dropOffProbability", "trustRating", "quote", "biggestRisk", "cognitiveLoad", "frictionPoints"]
            }
          },
          required: ["anxious", "distracted", "firstTime", "impatientMobile", "skeptic"]
        },
        universalComplaints: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              element: { type: Type.STRING },
              reason: { type: Type.STRING },
              solution: { type: Type.STRING }
            },
            required: ["element", "reason", "solution"]
          }
        },
        panicCertificate: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING, description: "Exactly 'Panic-Proof', 'Work In Progress', or 'Crime Scene'." },
            text: { type: Type.STRING }
          },
          required: ["verdict", "text"]
        },
        fixes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              issue: { type: Type.STRING, description: "A high-friction element found." },
              recommendation: { type: Type.STRING, description: "Exact replacement codebase text/microcopy change." },
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
        "namedUIZones",
        "personas",
        "universalComplaints",
        "panicCertificate",
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
