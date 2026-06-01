export interface FrictionPoint {
  element: string;
  locationDescription: string;
  panicTrigger: string;
  severity: "high" | "medium" | "low";
}

export interface PersonaReport {
  personaName: string; // "Anxious", "Distracted", "First-Time"
  score: number; // 0 to 100 representing stress/frustration level
  quote: string; // Simulated inner monologue
  frictionPoints: FrictionPoint[];
  biggestRisk: string; // The #1 reason this user leaves/churns
  cognitiveLoad: "High" | "Medium" | "Low";
}

export interface ActionableFix {
  issue: string;
  recommendation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  impact: "Critical" | "Highly Beneficial" | "Nice-to-Have";
}

export interface StressTestReport {
  id: string;
  title: string;
  urlAnalyzed?: string;
  imageUrl?: string;
  timestamp: string;
  globalPanicScore: number; // 0-100 overall
  brutalSummary: string; // Honest critique text
  personas: {
    anxious: PersonaReport;
    distracted: PersonaReport;
    firstTime: PersonaReport;
  };
  fixes: ActionableFix[];
  visualAestheticRating: string; // e.g. "3/10" or "Chaotic"
  aestheticCritique: string; // feedback on visual design
}

export interface SavedReportMeta {
  id: string;
  title: string;
  timestamp: string;
  globalPanicScore: number;
  imageUrl?: string;
  urlAnalyzed?: string;
}
