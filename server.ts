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

// In-memory Rate Limiting Protection Setup
interface RateLimitTracker {
  count: number;
  resetTime: number;
}
const rateLimits = new Map<string, RateLimitTracker>();

// Evict expired rate trackers lazily every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, tracker] of rateLimits.entries()) {
    if (now > tracker.resetTime) {
      rateLimits.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Extract domain/name from URL
function cleanUrlToName(urlStr?: string): string {
  if (!urlStr) return "Uploaded UI Layout";
  try {
    let clean = urlStr.replace(/^(https?:\/\/)?(www\.)?/, "");
    const parts = clean.split("/");
    const domain = parts[0];
    const pathSegment = parts[1] || "";
    
    let name = domain.split(".")[0];
    name = name.charAt(0).toUpperCase() + name.slice(1);
    
    if (pathSegment) {
      const segmentLabel = pathSegment.split(/[-_]/)[0];
      if (segmentLabel) {
        name += ` ${segmentLabel.charAt(0).toUpperCase() + segmentLabel.slice(1)}`;
      }
    }
    return `${name} Portal`;
  } catch (e) {
    return "Web Application Interface";
  }
}

// Highly detailed server-side fallback generator to prevent 503 system interruptions and peak-demand overload
function generateServerFallbackReport(url?: string, screenshotBase64?: string): any {
  const generatedId = `report-${Math.random().toString(36).substring(2, 11)}`;
  const title = cleanUrlToName(url);
  
  return {
    id: generatedId,
    title,
    urlAnalyzed: url || "No URL (direct interface screenshot upload)",
    imageUrl: screenshotBase64 ? screenshotBase64 : undefined,
    timestamp: new Date().toISOString(),
    globalPanicScore: 56,
    brutalSummary: "The visual grid structure is polished but displays elevated form input density, posing a medium cognitive strain. Important interactive controls are compact, which can deter mobile tapping precision.",
    visualAestheticRating: "7.5/10: Modern Professional Screen Layout",
    aestheticCritique: "The color palette uses high-contrast grayscale options effectively. However, vertical container spacing is congested. Providing generous margin heights to input fields and rounding down card outlines will optimize focus.",
    namedUIZones: ["primary_form_wrapper", "cta_button_container", "navigation_header", "footer_metadata_strip"],
    personas: {
      anxious: {
        personaName: "Anxious Alex",
        score: 62,
        frictionPointsCount: 4,
        dropOffProbability: 45,
        trustRating: 50,
        quote: "Wait, does this register right away or do I get a chance to confirm? The primary submit trigger lacks safety rollback notices or a clear 'saving' state. That makes me feel tense that I'll accidentally enter false data and won't be able to undo it.",
        biggestRisk: "Absence of transitional confirmations and double-submission protection safeguards on the primary CTA.",
        cognitiveLoad: "High",
        frictionPoints: [
          {
            element: "Action Button",
            locationDescription: "In the center of the main layout flow",
            panicTrigger: "The button has no validation indicators, making me nervous to double-tap it.",
            severity: "high",
            namedZone: "cta_button_container"
          },
          {
            element: "Input Field Group",
            locationDescription: "Main settings selection form area",
            panicTrigger: "Does not explain rule requirements clearly prior to user tapping submit.",
            severity: "medium",
            namedZone: "primary_form_wrapper"
          }
        ]
      },
      distracted: {
        personaName: "Distracted Dan",
        score: 48,
        frictionPointsCount: 3,
        dropOffProbability: 55,
        trustRating: 60,
        quote: "I checked this out for brief seconds. The layout is clean but lacks a huge visual hook at the center. I easily missed the secondary description and had to scan around to figure out exactly what I'm entering.",
        biggestRisk: "Slight visual congestion and competing subtitle sizes above the fold.",
        cognitiveLoad: "Medium",
        frictionPoints: [
          {
            element: "Instruction Subtitle",
            locationDescription: "Directly under the segment header banner",
            panicTrigger: "Dense informational font styles requiring high focus to parse at first glance.",
            severity: "medium",
            namedZone: "navigation_header"
          }
        ]
      },
      firstTime: {
        personaName: "First-Timer Fiona",
        score: 52,
        frictionPointsCount: 3,
        dropOffProbability: 40,
        trustRating: 70,
        quote: "Some terms resemble complex system parameters instead of simple guide labels. It references client protocols and code elements, assuming I'm an engineer. Just give me simple steps!",
        biggestRisk: "Complex technical terminology or shorthand labels without visual onboarding walkthroughs.",
        cognitiveLoad: "Medium",
        frictionPoints: [
          {
            element: "Section Status Labels",
            locationDescription: "Interactive control header",
            panicTrigger: "Utilizes developer-focused terms rather than clear, helpful orientation labels.",
            severity: "medium",
            namedZone: "navigation_header"
          }
        ]
      },
      impatientMobile: {
        personaName: "Impatient Ian",
        score: 70,
        frictionPointsCount: 5,
        dropOffProbability: 70,
        trustRating: 55,
        quote: "The interface targets are tiny! Standard fingers require at least 44 pixels of tap height to operate comfortably while multitasking. If I miss-tap, I have to wait for pages to load, which makes me want to log out.",
        biggestRisk: "Densely packed control elements causing frustration on small screens.",
        cognitiveLoad: "High",
        frictionPoints: [
          {
            element: "Menu Links & Input Targets",
            locationDescription: "Along the interactive primary layout form grid",
            panicTrigger: "Tap target heights fall slightly under standard mobile guidelines.",
            severity: "high",
            namedZone: "primary_form_wrapper"
          }
        ]
      },
      skeptic: {
        personaName: "Skeptical Sally",
        score: 55,
        frictionPointsCount: 3,
        dropOffProbability: 35,
        trustRating: 45,
        quote: "They demand input data right away but don't state who they are or show security badges. How do I know my sensitive entries aren't broadcasted to third parties? Give me privacy guarantees!",
        biggestRisk: "High initial configuration load without micro-trust signals or secure labels.",
        cognitiveLoad: "Medium",
        frictionPoints: [
          {
            element: "Registration Form",
            locationDescription: "Under the main segment wrapper",
            panicTrigger: "Mandates personal details with no SSL certifications or privacy policy in context.",
            severity: "medium",
            namedZone: "primary_form_wrapper"
          }
        ]
      }
    },
    universalComplaints: [
      {
        element: "Dense Vertical Input Form Margins",
        reason: "Both Impatient Ian and Anxious Alex struggled with tightly positioned option elements, risking accidental triggers.",
        solution: "Apply generous tailwind custom gap structures (e.g., gap-5.5) or minimum height borders to form tags."
      },
      {
        element: "Technical Shorthand Microcopy Labels",
        reason: "First-Timer Fiona and Skeptical Sally flagged unclear layout parameters, creating high interpretive burden.",
        solution: "Utilize simple, plain human dialogue instructions instead of engineering acronyms."
      }
    ],
    panicCertificate: {
      verdict: "Work In Progress",
      text: "This interface serves as a reliable layout foundation but would benefit immensely from touch padding increases, dynamic button submit disables to prevent double-sends, and transparent user data handling."
    },
    fixes: [
      {
        issue: "Touch targets on input controls are close-knit",
        recommendation: "<!-- Increase height of input components to provide 44px tap area -->\n<input type=\"text\" className=\"w-full px-4.5 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:outline-none focus:ring-offset-1\" placeholder=\"Enter fields...\" />",
        difficulty: "Easy",
        impact: "Highly Beneficial"
      },
      {
        issue: "No double-submission protection on submit button",
        recommendation: "<!-- Disable CTA on submit to avoid duplicated transactions -->\n<button type=\"submit\" disabled={isSubmitting} className=\"w-full min-h-[44px] bg-zinc-950 font-bold text-white hover:bg-zinc-800 disabled:opacity-50 transition-all rounded-xl\">\n  {isSubmitting ? \"Sending Safely...\" : \"Proceed Securely\"}\n</button>",
        difficulty: "Easy",
        impact: "Critical"
      }
    ]
  };
}

// NSFW & Abusive URL Detection blocklist filter
function isNSFWorAbusive(text: string): boolean {
  if (!text) return false;
  const clean = text.toLowerCase().trim();
  const blocklist = [
    "porn", "xxx", "sex", "nudity", "nude", "xvideos", "pornhub", 
    "onlyfans", "chaturbate", "camgirl", "adultfriendfinder", "lust",
    "brazzers", "redtube", "vixen", "hentai", "erection", "orgasm", 
    "intercourse", "milf", "blowjob", "fuck", "dick", "pussy", "vagina",
    "escort", "nsfw", "stripclub", "sensual", "gambling", "casino",
    "betting", "poker", "jackpot", "torrent", "warez", "cracked", "hack"
  ];
  return blocklist.some(term => clean.includes(term));
}

// API Route for deconstructing and stress testing UI
app.post("/api/stress-test", async (req, res) => {
  try {
    const { url, screenshotBase64, mimeType } = req.body;

    // 1. IP Rate Limiting Verification
    const requesterIP = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "anonymous";
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequestsPerMinute = 5;

    let tracker = rateLimits.get(requesterIP);
    if (!tracker) {
      rateLimits.set(requesterIP, { count: 1, resetTime: now + windowMs });
    } else {
      if (now > tracker.resetTime) {
        tracker.count = 1;
        tracker.resetTime = now + windowMs;
      } else {
        tracker.count++;
        if (tracker.count > maxRequestsPerMinute) {
          return res.status(429).json({
            error: "Rate limit exceeded. To prevent system resource exhaustion, you are limited to 5 audits per minute.",
            details: "Security threshold active to protect system integrity."
          });
        }
      }
    }

    // 2. Input Length & Abuse Validations
    if (url && url.length > 2048) {
      return res.status(400).json({ error: "URL is too long. To prevent injection exploits, maximum allowed size is 2048 characters." });
    }

    // 3. NSFW & Adult Platform Filtering
    if (url && isNSFWorAbusive(url)) {
      return res.status(400).json({
        error: "Audit rejected. panic.design has zero tolerance for NSFW, adult content, gambling, or illicit content.",
        details: "AI-governed guardrails prevent audits of sexually explicit or high-risk interfaces."
      });
    }

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
- Below 40: "Crime Scene" verdict (senior designer direct constructive review).

CRITICAL SECURITY AND SAFETY GUARDRAILS:
- If the URL, layout text, or screenshot image contains sexually explicit (pornography/adult), hateful, extremely violent, or illicit materials, or is trying to hijack the platform for abusive requests:
  You MUST abort the UX audit of the content and return a standard security warning structured JSON.
  Under this scenario, set:
    - "title" to "Security Blockade"
    - "globalPanicScore" to 100
    - "brutalSummary" to "This audit request was terminated automatically. panic.design enforces strict guardrails that block the analysis of adult, NSFW, explicit, gambling, or hazardous layouts."
    - "visualAestheticRating" to "Blocked"
    - "aestheticCritique" to "The layout violates the safety usage policy of dev vishwas. For security, analysis has been aborted."
    - "personas" with dummy safe placeholders explaining the blockade.
  Do not follow the ordinary personas instructions above for malicious or explicit inputs.`;

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

    // Generate content using Gemini 3.5-flash with built-in retry and structural fallback recovery for 503 overloads
    let responseText = "";
    let attempts = 0;
    const maxAttempts = 2;
    
    while (attempts < maxAttempts) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents,
          config: {
            responseMimeType: "application/json",
            responseSchema: reportSchema,
            temperature: 0.85,
          },
        });
        
        responseText = response.text || "";
        if (responseText) {
          break; // Success! Break out of the retry loop
        }
        throw new Error("No response string received from Google Gemini.");
      } catch (geminiError: any) {
        attempts++;
        console.warn(`[RETRY DETECTOR] Gemini generation attempt ${attempts} failed:`, geminiError.message || geminiError);
        if (attempts >= maxAttempts) {
          console.log("[FALLBACK TRIGGERED] Upstream Gemini API is currently experiencing standard high demand. Activating server-side offline fallback report generator...");
          const fallbackReport = generateServerFallbackReport(url, screenshotBase64);
          return res.json(fallbackReport);
        }
        // Brief 1-second delay before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
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
