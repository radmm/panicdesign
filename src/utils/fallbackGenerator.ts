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
  const selectedTitle = `${targetName}.design — Layout Stress Summary`;

  // Numerical scale representing interaction cognitive load (stress metrics)
  const globalScore = Math.floor(Math.random() * 8) + 68; // 68 to 75 (high friction)

  const mappedZones = [
    "navigation_dock_sticky",
    "primary_registration_form",
    "active_submission_hud",
    "parameters_sidebar_drawer",
    "footer_attribution_row"
  ];

  const mockFixes: ActionableFix[] = [
    {
      issue: "button.flex-row element density on primary layout wrapper",
      recommendation: `<!-- Replace dense stacked rows with structured dropdown actions -->
<div className="relative inline-block text-left">
  <button type="button" className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 focus:ring-2 focus:ring-zinc-950">
    <span>Actions</span>
    <ChevronDown className="h-3 w-3" />
  </button>
</div>`,
      difficulty: "Easy",
      impact: "Critical"
    },
    {
      issue: "Missing focus-visible ring styles on clickable input.text-field elements",
      recommendation: `/* Target active input fields inside form styles */
input[type="text"]:focus-visible,
input[type="email"]:focus-visible {
  outline: 2px solid #ef4444; /* rose-500 */
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15);
}`,
      difficulty: "Easy",
      impact: "Critical"
    },
    {
      issue: "Amorphous touch hitboxes on a.nav-item anchors",
      recommendation: `<a href="/billing" className="min-h-[44px] min-w-[44px] px-4 py-2.5 flex items-center justify-center text-zinc-650 hover:bg-zinc-100/65 rounded-xl transition-all">
  <CreditCard className="h-4 w-4" />
</a>`,
      difficulty: "Medium",
      impact: "Highly Beneficial"
    },
    {
      issue: "Cumulative Layout Shift (CLS) during asynchronous resource loads",
      recommendation: `<div className="w-full aspect-video min-h-[315px] bg-zinc-100 rounded-2xl animate-pulse flex items-center justify-center">
  <ImageIcon className="h-8 w-8 text-zinc-350" />
</div>`,
      difficulty: "Medium",
      impact: "Highly Beneficial"
    }
  ];

  return {
    id: "rep-fallback-" + Date.now(),
    title: selectedTitle,
    urlAnalyzed: url || "Local Mockup Scan",
    timestamp: new Date().toISOString(),
    globalPanicScore: globalScore,
    brutalSummary: `The user interface demonstrates excellent visual tracking pathways but suffers from dense layout elements and lack of visible focus loops on input fields. This triggers interaction stalls under rapid mobile situations.`,
    visualAestheticRating: `7.2/10: Compact Functional Grid Layout`,
    aestheticCritique: `The visual tracking layout is robust; however, element margins within main content blocks are tightly constrained. Adding explicit Tailwind spacing classes (e.g. gap-6, py-4) and utilizing a consistent gray-900 typography scale will reduce cognitive visual noise, directly improving reading accuracy for desktop and mobile visitors.`,
    namedUIZones: mappedZones,
    personas: {
      anxious: {
        personaName: "Anxious Explorer",
        score: globalScore + 8 > 100 ? 98 : globalScore + 8,
        frictionPointsCount: 3,
        dropOffProbability: 78,
        trustRating: 32,
        quote: `I want to click the primary action button, but there is no exit path or step guarantee. What if clicking this twice double-posts my transaction details to the database server? The form lines have no safety borders, and if the network stalls, I feel absolutely trapped. I need helper tooltips or explicit safe backtrack signals immediately.`,
        cognitiveLoad: "High",
        biggestRisk: "Absence of persistent client-side safeguard dialogs or loading spinner indicators (e.g., button:disabled states during async fetch) causes users to trigger dual submissions or abort key onboarding tasks.",
        frictionPoints: [
          {
            element: "form > button#submit-action",
            locationDescription: "Positioned at the right-hand corner of the main form footer.",
            panicTrigger: "This high-intensity actionable button lacks loading-state styling, microcopy confirmation steps, or fallback rollback safeguards. Add buttonState loading checks.",
            severity: "high",
            namedZone: "active_submission_hud"
          },
          {
            element: "input[type='password'] text field",
            locationDescription: "Centered inside the user credentials container.",
            panicTrigger: "Does not include a standard 'show password' icon toggle or inline password-strength constraints, triggering anxiety during passwords entries.",
            severity: "medium",
            namedZone: "primary_registration_form"
          },
          {
            element: "div.alert-box-container error panel",
            locationDescription: "Appended dynamically beneath the navigation panel.",
            panicTrigger: "Renders as a high-contrast red alert wrapper without a close icon or direct visual reference on how to resolve the validation state.",
            severity: "high",
            namedZone: "navigation_dock_sticky"
          }
        ]
      },
      distracted: {
        personaName: "Distracted User",
        score: Math.max(45, globalScore - 12),
        frictionPointsCount: 2,
        dropOffProbability: 60,
        trustRating: 45,
        quote: `My screen is crowded with inline badges and secondary sidebars. I completely missed the primary check-out flow because it stands right next to five secondary help chips, and a sticky customer support widget is hovering on top of it. I'll just check my emails or check my Slack instead.`,
        cognitiveLoad: "Medium",
        biggestRisk: "Visual hierarchy overcrowding. Important CTAs get lost beneath high-contrast decorative tags, excessive uppercase text badges, and low-contrast description spans.",
        frictionPoints: [
          {
            element: "button.btn-secondary-dismiss link selection",
            locationDescription: "Bottom-left margin inside form layout rows.",
            panicTrigger: "Lacks custom focus-ring outline styles, making it invisible to quick keyboard traversal and eye scanners during system multi-tasking.",
            severity: "high",
            namedZone: "primary_registration_form"
          },
          {
            element: "aside#chat-assistance-overlay",
            locationDescription: "Sticky overlay fixed in the lower right viewport quadrant.",
            panicTrigger: "An unrequested animation loop and lack of absolute background container z-index logic shields primary actionable button labels underneath.",
            severity: "medium",
            namedZone: "footer_attribution_row"
          }
        ]
      },
      firstTime: {
        personaName: "First-Time Visitor",
        score: Math.max(55, globalScore - 4),
        frictionPointsCount: 2,
        dropOffProbability: 65,
        trustRating: 50,
        quote: `What do these abbreviation terms mean? I am greeted by an empty dashboard filled with lines like 'Ingress Metric Gateway'. How do I actually deploy a project? Why does this platform assume I am already an expert? Give me a clear step-one label.`,
        cognitiveLoad: "High",
        biggestRisk: "Proprietary system jargon and empty-state lists lacking onboarding illustrations, dynamic tooltip states, or interactive walkthrough cues.",
        frictionPoints: [
          {
            element: "h2.main-hero-headline > span",
            locationDescription: "The focal point greeting heading centered on the hero splash.",
            panicTrigger: "Employs internal product slang and corporate shortcuts that alienate general visitors seeking direct features. Replace with 'Deploy Your Web Applications in Seconds.'",
            severity: "high",
            namedZone: "navigation_dock_sticky"
          },
          {
            element: "div.empty-state-card list template",
            locationDescription: "Spans the central dashboard core.",
            panicTrigger: "Displays a simple '0 Reports Loaded' text line without helpful visual prompts or a direct, actionable button indicating 'Run Your First Scan'.",
            severity: "high",
            namedZone: "active_submission_hud"
          }
        ]
      },
      impatientMobile: {
        personaName: "Impatient Mobile User",
        score: globalScore + 5,
        frictionPointsCount: 3,
        dropOffProbability: 88,
        trustRating: 38,
        quote: `I'm standing in a grocery line trying to complete this on a tiny screen with one hand. The button target is so miniature I've clicked the footer links three times by mistake! Zooming in shouldn't be a requirement to tap a form button. The cumulative shifting is driving me insane.`,
        cognitiveLoad: "High",
        biggestRisk: "Touch targets fail to achieve minimum WCAG dimensional limits (44px), combined with high element padding density causes persistent misclicks.",
        frictionPoints: [
          {
            element: "a.footer-link-item reference links",
            locationDescription: "Located at the margin of the footer row, directly beneath submit buttons.",
            panicTrigger: "Interactive anchor dimensions are strictly less than 24px wide, leading to persistent misclicks that redirect users during form entry.",
            severity: "high",
            namedZone: "footer_attribution_row"
          },
          {
            element: "div.hamburger-menu-toggle",
            locationDescription: "The absolute top right corner of the header rail.",
            panicTrigger: "Tapping trigger fails to expand instantly due to massive layout redraw shifts during async background metrics fetch.",
            severity: "medium",
            namedZone: "navigation_dock_sticky"
          }
        ]
      },
      skeptic: {
        personaName: "The Skeptic",
        score: globalScore - 2,
        frictionPointsCount: 2,
        dropOffProbability: 70,
        trustRating: 18,
        quote: `Why are there no transparent pricing breakdowns? Why does clicking sign up require me to enter a credit card? Everything is designed as a data grab or dark pattern to trigger automatic billing. If you don't offer an explicit 'Cancel Any Time' disclaimer beside the card grid, I'm out.`,
        cognitiveLoad: "Medium",
        biggestRisk: "Absence of direct safety disclaimers, clear pricing tables, and unhelpful data collection flows which immediately trigger defenses.",
        frictionPoints: [
          {
            element: "section#subscription-pricing-block",
            locationDescription: "Positioned directly inside the registration layout body.",
            panicTrigger: "Hides detailed cancellation policies and transaction safety badges, making the form look highly manipulative.",
            severity: "high",
            namedZone: "primary_registration_form"
          }
        ]
      }
    },
    universalComplaints: [
      {
        element: "form > button#submit-action",
        reason: "Anxious users are paralyzed by form double-submissions; impatient mobile users constantly misclick it due to tiny bounding boxes; first-time visitors have zero vocabulary grounding to understand what it actually triggers.",
        solution: `<button 
  type="submit" 
  disabled={isLoading}
  className="w-full md:w-auto min-h-[44px] px-6 py-2.5 bg-rose-600 text-white font-sans font-bold rounded-xl shadow-md hover:bg-rose-700 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:outline-none"
>
  {isLoading ? (
    <>
      <Spinner className="animate-spin h-4 w-4" />
      <span>Processing...</span>
    </>
  ) : (
    <span>Confirm & Save Changes</span>
  )}
</button>`
      },
      {
        element: "h2.main-hero-headline > span",
        reason: "First-timers fail to understand the core feature description; distracted users bounce upon scanning complex product abbreviations; skeptics immediately assume a data-harvesting scheme.",
        solution: `<h2 className="text-2xl md:text-3xl font-sans font-black tracking-tight text-zinc-900 leading-tight">
  Deploy Your Web Analytics Workspace
  <span className="block text-xs font-sans font-semibold text-zinc-500 mt-1.5 leading-relaxed tracking-normal font-normal">
    Install our secure, open-source metrics tracker in under 60 seconds with a single line of shell script. No credit card required.
  </span>
</h2>`
      }
    ],
    panicCertificate: {
      verdict: "Work In Progress",
      text: "The layout contains elements with robust responsive structural potential but is currently limited by compact touch padding sizes and high micro-copy vocabulary strain. Focus priorities should center immediately on optimizing form buttons target depths and removing internal developer codes."
    },
    fixes: mockFixes
  };
}
