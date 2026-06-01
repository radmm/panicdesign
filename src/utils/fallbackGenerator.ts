import { StressTestReport, ActionableFix } from "../types";

/**
 * Generates an extremely detailed and professional simulated UX Cognitive Load and Stress audit report 
 * using precise developer keywords and clear layout diagnostics.
 */
export function generateFallbackReport(url: string | undefined, originalFileName: string | undefined): StressTestReport {
  const targetName = url 
    ? url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]
    : originalFileName 
    ? originalFileName.replace(/\.[^/.]+$/, "") 
    : "interface";

  // Clean title
  const selectedTitle = `${targetName}.design — Interface Stress Report`;

  // Numerical scale representing interaction cognitive load (stress metrics)
  const globalScore = Math.floor(Math.random() * 10) + 72; // 72 to 81 (high friction)

  const mockFixes: ActionableFix[] = [
    {
      issue: "button.flex-row element density on primary layout wrapper",
      recommendation: "Replace bundled action bars with standard dropdown menus or collapsible action sets. Group secondary actions behind a 'More Options' icon button button.icon-only to decrease cognitive complexity and focus visual hierarchy on the primary CTA.",
      difficulty: "Easy",
      impact: "Critical"
    },
    {
      issue: "Missing focus-visible ring styles on clickable input.text-field elements",
      recommendation: "Apply focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none class values. Ensure keyboard-only power users can visually trace Tab key focuses across separate form items without guessing status.",
      difficulty: "Easy",
      impact: "Critical"
    },
    {
      issue: "Amorphous touch hitboxes on a.nav-item anchors",
      recommendation: "Ensure and enforce a minimum of min-h-[44px] and min-w-[44px] touch targets across all mobile anchors. Increase padding on navigation anchors from px-2 py-1 to px-4 py-2.5 to comply with WCAG 2.1 touch dimension guides.",
      difficulty: "Medium",
      impact: "Highly Beneficial"
    },
    {
      issue: "Cumulative Layout Shift (CLS) during asynchronous resource loads",
      recommendation: "Assign explicit aspect-ratio attributes or fallback min-h blocks to image components and dynamic analytics widget containers. This prevents rapid layout shifting that forces visitors to make unintended button clicks.",
      difficulty: "Medium",
      impact: "Highly Beneficial"
    },
    {
      issue: "Cryptic status abbreviations used as system-feed labels",
      recommendation: "Translate technical system indicators like 'CODE_200_RUNNING' or 'SYS_STATE_ACTIVE' into natural human microcopy such as 'Ready' or 'System active.' Keep non-developer team members oriented.",
      difficulty: "Easy",
      impact: "Nice-to-Have"
    }
  ];

  return {
    id: "rep-fallback-" + Date.now(),
    title: selectedTitle,
    urlAnalyzed: url || "Local Mockup Scan",
    timestamp: new Date().toISOString(),
    globalPanicScore: globalScore,
    brutalSummary: `The user interface demonstrates excellent visual tracking pathways but suffers from dense inline layout elements and lack of visible focus loops on input fields. This triggers interaction stalls, particularly during rapid multi-tasking sessions.`,
    visualAestheticRating: `7.2/10: Compact Functional Grid Layout`,
    aestheticCritique: `The visual tracking layout is robust, however, element margins within main content blocks are tightly constrained. Adding explicit Tailwind spacing classes (e.g. gap-6, py-4) and utilizing a consistent gray-900 typography scale will reduce cognitive visual noise, directly improving reading accuracy for desktop and mobile visitors.`,
    personas: {
      anxious: {
        personaName: "Anxious Explorer",
        score: globalScore + 8 > 100 ? 98 : globalScore + 8,
        quote: `I want to click submit, but there is no back button or status guarantee. What if the request triggers twice, or clears my entire form state upon a network stall? I need a clear step indicator or action safeguard!`,
        cognitiveLoad: "High",
        biggestRisk: "Absence of persistent client-side safeguard dialogs or loading spinner indicators (e.g., button:disabled states during async fetch) causes users to trigger dual submissions or cancel key onboarding flows.",
        frictionPoints: [
          {
            element: "form > button#submit-action",
            locationDescription: "Positioned at the right-hand corner of the main form footer.",
            panicTrigger: "This high-intensity actionable button lacks loading-state styling, microcopy confirmation steps, or fallback rollback safeguards.",
            severity: "high"
          },
          {
            element: "input[type='password'] input field",
            locationDescription: "Centered inside the user credentials container.",
            panicTrigger: "Does not include a standard 'show password' icon toggle or inline password-strength constraints help-text, inducing submission failure anxiety.",
            severity: "medium"
          },
          {
            element: "div.alert-box-container error panels",
            locationDescription: "Apmended dynamically to the top of form wrappers.",
            panicTrigger: "Renders as high-contrast red alerts without a close icon or direct instructions on how to remedy the validation error.",
            severity: "high"
          }
        ]
      },
      distracted: {
        personaName: "Distracted User",
        score: Math.max(45, globalScore - 12),
        quote: `My screen is crowded with popups and secondary sidebars. I completely missed the primary payment button because it gets covered by the sticky chatbot widget!`,
        cognitiveLoad: "Medium",
        biggestRisk: "Visual hierarchy overcrowding. Important CTAs get lost beneath high-contrast decorative tags, excessive uppercase text badges, and low-contrast description spans.",
        frictionPoints: [
          {
            element: "button.btn-secondary-dismiss link selection",
            locationDescription: "Bottom-left margin inside form layout rows.",
            panicTrigger: "Lacks custom focus-ring outline styles, making it invisible to quick keyboard traversal and eye scanners during system multi-tasking.",
            severity: "high"
          },
          {
            element: "aside#chat-assistance-overlay",
            locationDescription: "Sticky overlay fixed in the lower right viewport quadrant.",
            panicTrigger: "An unrequested animation loop and lack of absolute background container z-index logic shields primary actionable button labels underneath.",
            severity: "medium"
          }
        ]
      },
      firstTime: {
        personaName: "First-Time Visitor",
        score: Math.max(55, globalScore - 4),
        quote: `What do these acronyms mean? I am greeted by an empty dashboard filled with words like 'Ingress Metric Gateway'. How do I start?`,
        cognitiveLoad: "High",
        biggestRisk: "Proprietary system jargon and empty-state lists lacking onboarding illustrations, dynamic tooltip states, or interactive walkthrough cues.",
        frictionPoints: [
          {
            element: "h2.main-hero-headline > span",
            locationDescription: "The focal point greeting heading centered on the hero splash.",
            panicTrigger: "Employs internal product slang and corporate shortcuts that alienate general visitors seeking direct features.",
            severity: "high"
          },
          {
            element: "div.empty-state-card list template",
            locationDescription: "Spans the central dashboard core.",
            panicTrigger: "Displays a simple '0 Reports Loaded' text line without helpful visual prompts or a direct, actionable button indicating 'Run Your First Scan'.",
            severity: "high"
          }
        ]
      }
    },
    fixes: mockFixes
  };
}
