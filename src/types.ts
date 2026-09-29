export type ContentChannel = 
  | 'Technical Blog' 
  | 'LinkedIn' 
  | 'Substack Newsletter' 
  | 'Twitter/X' 
  | 'Case Study' 
  | 'YouTube / Video';

export type FunnelStage = 'TOFU' | 'MOFU' | 'BOFU';

export type PerformanceTier = 'High Performer' | 'Steady' | 'Underperformer';

export interface ContentOriginalityReport {
  overallOriginalityScore: number; // 0 to 100
  uniquenessTier: 'Exceptionally Novel' | 'Substantially Original' | 'Moderate / Standard Take' | 'High Overlap Risk';
  historicalMemoryOverlapPct: number; // % overlap with internal library
  overlappingPostTitle?: string;
  semanticFreshness: number; // 0 to 100
  clicheFrequency: 'Very Low' | 'Low' | 'Moderate' | 'High';
  uniqueAngles: string[];
  derivativeRisks: string[];
  suggestedOriginalityBoosters: string[];
}

export interface ContentReachAnalysis {
  predictedLikes: { min: number; max: number; average: number };
  predictedImpressions: { min: number; max: number; average: number };
  predictedShares: { min: number; max: number; average: number };
  predictedComments: { min: number; max: number; average: number };
  viralityScore: number; // 0 to 100
  hookStrengthScore: number; // 0 to 100
  algorithmFitScore: number; // 0 to 100
  audienceResonanceScore: number; // 0 to 100
  whyAudienceWillLike: string[];
  reachMultipliers: Array<{ tactic: string; impact: string; applied?: boolean }>;
  optimalPostingTimes: string[];
  trajectoryHours: Array<{ hour: string; likes: number; reach: number }>;
}

export interface RepurposedIdea {
  id: string;
  targetChannel: ContentChannel | string;
  format: string;
  proposedHeadline: string;
  angleRationale: string;
  estimatedLift: string;
}

export interface ContentItem {
  id: string;
  title: string;
  topic: string;
  channel: ContentChannel;
  format: string;
  funnelStage: FunnelStage;
  performanceTier: PerformanceTier;
  publishedDate: string;
  targetPersona: string;
  metrics: {
    views: number;
    engagements: number;
    shares: number;
    conversions: number;
    bounceRatePct: number;
    engagementRatePct: number;
  };
  keyTakeaways: string[];
  aiAnalysis: {
    verdict: string;
    whyItWorkedOrFailed: string;
    audienceSignal: string;
    fatigueRisk: string;
  };
  repurposedIdeas?: RepurposedIdea[];
  originalityReport?: ContentOriginalityReport;
  reachAnalysis?: ContentReachAnalysis;
}

export interface TopicGapItem {
  id: string;
  topic: string;
  category: string;
  status: 'Critical Gap' | 'Cannibalization Risk' | 'Over-saturated' | 'Optimal';
  funnelStage: FunnelStage;
  searchDemand: 'Very High' | 'High' | 'Moderate' | 'Medium' | 'Niche';
  currentCoverageCount?: number;
  recommendation: string;
  suggestedAngle: string;
  competingPostTitles?: string[];
}

export interface TopicMatrixRow {
  topic: string;
  category: string;
  tofuCount: number;
  mofuCount: number;
  bofuCount: number;
  avgEngagement: number;
  coverageStatus: 'Gap Opportunity' | 'Optimal' | 'Over-saturated';
}

export interface BrandVoiceSettings {
  formalVsCasual: number; // 0 (Formal) to 100 (Casual)
  technicalVsSimple: number; // 0 (Technical) to 100 (Simple)
  boldVsReserved: number; // 0 (Reserved) to 100 (Bold)
  playfulVsSerious: number; // 0 (Serious) to 100 (Playful)
  targetTonePersona: string;
  vocabularyDoList: string[];
  vocabularyAvoidList: string[];
}

export interface BrandAlignmentAnalysis {
  overallScore: number;
  toneDrift: number;
  clarityScore: number;
  actionabilityScore: number;
  verdictSummary: string;
  suggestedRewrittenText: string;
  flaggedPhrases: Array<{ original: string; replacement: string; reason: string }>;
}

export interface StrategyBrief {
  id: string;
  title: string;
  goal: string;
  targetPersona: string;
  channel: ContentChannel;
  funnelStage: FunnelStage;
  coreThesis: string;
  groundedFromPastPosts: Array<{
    postTitle: string;
    channel: string;
    metricProof: string;
    learningApplied: string;
  }>;
  hookVariations: Array<{ type: string; hookText: string }>;
  outlineSections: Array<{
    heading: string;
    talkingPoints: string[];
    evidenceNeeded: string;
  }>;
  primaryCTA: string;
  secondaryCTA: string;
  distributionChecklist: string[];
  createdAt: string;
}

export interface VideoStoryboardScene {
  sceneNumber: number;
  timeRange: string; // e.g. "0:00 - 0:06"
  phase: 'Hook & Pattern Interrupt' | 'The Problem & Friction' | 'The Breakthrough / Solution' | 'Proof & Telemetry' | 'Call to Action & Follow';
  visualDirection: string; // Visual action/b-roll
  voiceoverScript: string; // Exact words to say
  pacingNotes: string; // Delivery tempo & pauses
  screenOverlayText: string; // Kinetic captions or on-screen graphic
  bRollKeywords: string[];
}

export interface VideoCreationTutorial {
  title: string;
  targetDuration: string; // e.g. "60 Seconds (Shorts/Reels)" or "5-8 Minutes (YouTube)"
  aspectRatio: '9:16 (Vertical)' | '16:9 (Horizontal)' | '1:1 (Square)';
  audioStyle: {
    voiceTone: string;
    backgroundMusicVibe: string;
    soundEffectsCues: string[];
  };
  equipmentChecklist: string[];
  storyboard: VideoStoryboardScene[];
  editingMasterclassSteps: Array<{
    step: number;
    title: string;
    description: string;
    proTip: string;
  }>;
}

export interface CarouselSlide {
  slideNumber: number;
  headline: string;
  contentBulletPoints: string[];
  visualLayoutHint: string;
}

export interface SocialPostTutorial {
  platform: 'LinkedIn' | 'Twitter/X' | 'Substack Newsletter';
  formattedPostText: string;
  hookHeadline: string;
  slideDeckCarousel: CarouselSlide[];
  algorithmPlaybook: {
    firstHourStrategy: string;
    linkPlacementRule: string;
    hashtagRecommendations: string[];
    bestPostingWindow: string;
    engagementBoosterQuestion: string;
  };
}

export interface GoogleContrastComparisonRow {
  dimension: string;
  googleSearchConsensus: string;
  ourDifferentiatedAngle: string;
  efficiencyAdvantage: string;
}

export interface GoogleSerpContrast {
  whatGoogleSearchReturns: string[]; // Generic Page 1 consensus / fluff
  whyGoogleResultsUnderperform: string; // The missing depth in Google search
  ourProprietaryMoatAngle: string; // The contrarian, battle-tested edge
  informationGainScore: number; // 0-100% information gain over Google
  unGoogleableTakeaways: string[]; // 3 proprietary insights impossible to find on generic Google search
  timeSavedEstimate: string; // e.g. "Saves 18+ hours of trial-and-error debugging"
  executiveEfficiencyBrief: {
    oneMinuteSummary: string;
    immediateActionItem: string;
    coreDifferentiator: string;
  };
  comparisonMatrix: GoogleContrastComparisonRow[];
}

export interface FullGeneratedContent {
  id: string;
  topic: string;
  title: string;
  subtitle: string;
  format: 'Deep-dive Article' | 'LinkedIn Post' | 'Substack Newsletter' | 'Case Study Breakdown';
  channel: ContentChannel;
  funnelStage: FunnelStage;
  targetPersona: string;
  estimatedReadTime: string;
  wordCount: number;
  fullMarkdownContent: string;
  googleContrast: GoogleSerpContrast;
  originalityReport: ContentOriginalityReport;
  reachAnalysis: ContentReachAnalysis;
  videoTutorial: VideoCreationTutorial;
  postTutorial: SocialPostTutorial;
  createdAt: string;
}
