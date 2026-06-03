export interface FrictionPoint {
  element: string;
  locationDescription: string;
  panicTrigger: string;
  severity: "high" | "medium" | "low";
  namedZone?: string;
}

export interface PersonaReport {
  personaName: string; // e.g. "The Anxious User", "The Distracted User"
  score: number; // overall stress/frustration rating
  frictionPointsCount: number; // derived heavy-weighted score
  dropOffProbability: number; // 0-100% chance they abandon 
  trustRating: number; // 0-100% security/reassurance rating
  quote: string; // detailed Stream-Of-Consciousness inner monologue
  frictionPoints: FrictionPoint[];
  biggestRisk: string; // definitive technical reason for failure
  cognitiveLoad: "High" | "Medium" | "Low";
}

export interface ActionableFix {
  issue: string; // Specific button/form selector/element
  recommendation: string; // actual codebase replacement suggestion
  difficulty: "Easy" | "Medium" | "Hard";
  impact: "Critical" | "Highly Beneficial" | "Nice-to-Have";
}

export interface UniversalComplaint {
  element: string;
  reason: string; // explains why three or more user personas hit this wall
  solution: string; // code-level done thing that fixes it for everyone
}

export interface PanicCertificate {
  verdict: "Panic-Proof" | "Chaos-Proof" | "Crime Scene";
  text: string; // senior designer style detailed verdict text
}

export interface StressTestReport {
  id: string;
  title: string;
  urlAnalyzed?: string;
  imageUrl?: string;
  timestamp: string;
  globalPanicScore: number; // average drop-off adjusted up/down based on density and trust signals
  brutalSummary: string; // honest critique
  namedUIZones: string[]; // Mapped regions from the silent structural scan
  personas: {
    anxious: PersonaReport;
    distracted: PersonaReport;
    firstTime: PersonaReport;
    impatientMobile: PersonaReport;
    skeptic: PersonaReport;
  };
  universalComplaints: UniversalComplaint[];
  panicCertificate: PanicCertificate;
  fixes: ActionableFix[];
  visualAestheticRating: string; // e.g. "7/10: Compact Form Grid"
  aestheticCritique: string; // review of spacing, typography matching structure
}

export interface SavedReportMeta {
  id: string;
  title: string;
  timestamp: string;
  globalPanicScore: number;
  imageUrl?: string;
  urlAnalyzed?: string;
}
