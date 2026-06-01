import { StressTestReport, ActionableFix } from "../types";

/**
 * Generates a professional simulated UX Cognitive Load and Stress audit report based on a URL or screenshot name.
 */
export function generateFallbackReport(url: string | undefined, originalFileName: string | undefined): StressTestReport {
  const targetName = url 
    ? url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]
    : originalFileName 
    ? originalFileName.replace(/\.[^/.]+$/, "") 
    : "Interactive Workspace";

  // Professional UX-derived design titles
  const titles = [
    `${targetName} Cognitive Load Index`,
    `${targetName} Interface Conversion Pathway`,
    `${targetName} Usability & Accessibility Review`,
    `${targetName} Workspace Interaction Analysis`,
  ];
  const selectedTitle = titles[Math.floor(Math.random() * titles.length)];

  // Numerical scale representing interaction cognitive load (stress metrics)
  const globalScore = Math.floor(Math.random() * 15) + 65; // 65 to 80

  const mockFixes: ActionableFix[] = [
    {
      issue: "High density of primary action buttons",
      recommendation: "Structure the buttons using clear secondary hierarchies. A user navigating is presented with multiple primary inputs simultaneously, raising decision fatigue.",
      difficulty: "Easy",
      impact: "Critical"
    },
    {
      issue: "Compact skipping mechanics in walkthrough sequences",
      recommendation: "Provide a prominent, accessible direct link to skip standard intro frames. This allows experienced users to quickly enter their main workspace without distraction.",
      difficulty: "Easy",
      impact: "Highly Beneficial"
    },
    {
      issue: "Advanced backend system abbreviations in headings",
      recommendation: "Translate technical code indicators like 'V3_INDEX_RUNNING' into general human-centered status text. This keeps non-technical team members orientated.",
      difficulty: "Medium",
      impact: "Critical"
    },
    {
      issue: "High-contrast action cells missing dynamic safety states",
      recommendation: "Integrate non-disruptive, standard verification sheets when confirming destructive changes. This lowers user hesitation before clicking major action frames.",
      difficulty: "Medium",
      impact: "Highly Beneficial"
    },
    {
      issue: "Minimal onboarding cues in empty dashboard states",
      recommendation: "Enrich empty state folders with gentle guidance tooltips or responsive placeholder outlines rather than blank list tables.",
      difficulty: "Easy",
      impact: "Nice-to-Have"
    }
  ];

  return {
    id: "rep-fallback-" + Date.now(),
    title: selectedTitle,
    urlAnalyzed: url || "Workspace Image Scan",
    timestamp: new Date().toISOString(),
    globalPanicScore: globalScore,
    brutalSummary: `The interface demonstrates high-quality responsive spacing but exhibits opportunities regarding cognitive layout structure. Interactive elements are grouped tightly, creating potential friction during rapid operational tasks.`,
    visualAestheticRating: `8/10: Balanced Professional Typography`,
    aestheticCritique: `The visual tracking pathway is structured well, although the spacing around specific data lists can be expanded. Aligning major touch targets with uniform container lines and using subtle off-whites will reduce visual noise and improve reading speeds for mobile visitors.`,
    personas: {
      anxious: {
        personaName: "Anxious Persona (Clarity-Seeding)",
        score: globalScore + 8 > 100 ? 98 : globalScore + 8,
        quote: url 
          ? `I want to proceed, but I'm unsure if clicking this button automatically commits my draft. Are there any confirmation warnings before making this change?`
          : `This action view does not explicitly state how to rollback changes. I need concrete reassurance that my spreadsheet data is safely saved.`,
        cognitiveLoad: "High",
        biggestRisk: "Absence of persistent helper icons or inline safety guidelines triggers user hesitation.",
        frictionPoints: [
          {
            element: "Action Cell Row Selection",
            locationDescription: "Positioned within the central action container list.",
            panicTrigger: "Renders in a high-intensity solid container without secondary backtracks or clear cancel buttons.",
            severity: "high"
          },
          {
            element: "Undefined system parameter fields",
            locationDescription: "Centered vertically within the input container block.",
            panicTrigger: "Requests custom database codes with complex wording, making the user worry about format errors.",
            severity: "medium"
          }
        ]
      },
      distracted: {
        personaName: "Distracted Persona (Rapid-Traversal)",
        score: Math.max(45, globalScore - 10),
        quote: `I am multitasking actively at the moment. This compact note text below the chart is quite small, making it easy to miss because my focus keeps jumping back to the primary header.`,
        cognitiveLoad: "Medium",
        biggestRisk: "Fine-print descriptions can get lost beneath heavy visual header margins and color accents.",
        frictionPoints: [
          {
            element: "Skip tutorial hypertext link",
            locationDescription: "Bottom-right side of the presentation rows.",
            panicTrigger: "Sized in a small font, requiring deliberate focus to notice during quick browsing sessions.",
            severity: "high"
          },
          {
            element: "Secondary settings toggle row",
            locationDescription: "Aligned left on the primary data dashboard table structure.",
            panicTrigger: "Positioned close to decorative separators, leading the eye to skip past these toggles during fast tabbing.",
            severity: "medium"
          }
        ]
      },
      firstTime: {
        personaName: "First-Time Persona (Onboarding-Dependent)",
        score: Math.max(55, globalScore - 5),
        quote: `I am looking for the starting point on this dashboard. What are the key distinctions between these models, and how can I test my first file upload?`,
        cognitiveLoad: "High",
        biggestRisk: "Specialized system jargon and abstract terminology without immediate guidance tips.",
        frictionPoints: [
          {
            element: "Product Feature Acronym Header",
            locationDescription: "Top-left header area of the interface.",
            panicTrigger: "Utilizes proprietary acronyms, creating an onboarding hurdle for new visitors.",
            severity: "high"
          },
          {
            element: "Unpopulated grid list display",
            locationDescription: "Fills the lower workspace canvas area.",
            panicTrigger: "Presents no distinct tooltip guides or initial call-to-actions to prompt the first upload.",
            severity: "medium"
          }
        ]
      }
    },
    fixes: mockFixes
  };
}
