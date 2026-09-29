import { 
  ContentItem, 
  TopicMatrixRow, 
  TopicGapItem, 
  BrandVoiceSettings, 
  StrategyBrief 
} from '../types';

export const INITIAL_CONTENT_ITEMS: ContentItem[] = [
  {
    id: 'cnt-101',
    title: 'Why Kubernetes Multi-Tenancy Fails at 50+ Microservices',
    topic: 'Cloud Infrastructure & Kubernetes',
    channel: 'Technical Blog',
    format: 'Deep-dive Tutorial',
    funnelStage: 'MOFU',
    performanceTier: 'High Performer',
    publishedDate: '2026-08-14',
    targetPersona: 'VP of Infrastructure & Platform Leads',
    metrics: {
      views: 48200,
      engagements: 3940,
      shares: 820,
      conversions: 412,
      bounceRatePct: 34.2,
      engagementRatePct: 8.2
    },
    keyTakeaways: [
      'Namespace isolation degrades past 45 clusters without automated policy control.',
      'Cost attribution gaps account for 28% of budget leakage in unmonitored pods.',
      'Service mesh latency doubles during peak egress spikes unless tuned.'
    ],
    aiAnalysis: {
      verdict: 'Top 5% Performer in Q3',
      whyItWorkedOrFailed: 'Tactical transparency with real YAML configs and production cost teardowns ($84k saved/mo). Organic pickup on Hacker News and Reddit due to lack of corporate fluff.',
      audienceSignal: 'Engineering leaders shared heavily with their DevOps teams.',
      fatigueRisk: 'Low'
    },
    repurposedIdeas: [
      {
        id: 'rmx-101-1',
        targetChannel: 'LinkedIn',
        format: '8-Slide Architecture Carousel',
        proposedHeadline: 'We trimmed $84,000/month off our AWS bill. 4 architecture anti-patterns to unlearn:',
        angleRationale: 'Visual slides contrasting common misconfigurations with optimized Karpenter topologies.',
        estimatedLift: '+42% bookmark rate'
      },
      {
        id: 'rmx-101-2',
        targetChannel: 'Substack Newsletter',
        format: 'Executive Strategic Memo',
        proposedHeadline: 'The CFO vs. VP of Eng Dilemma: How to Slash Cloud Burn Without Waking On-Call',
        angleRationale: 'Strategic framework for engineering leaders presenting cost efficiency to the board.',
        estimatedLift: '3.4x subscriber conversions'
      },
      {
        id: 'rmx-101-3',
        targetChannel: 'Technical Blog',
        format: 'Interactive Cost Calculator',
        proposedHeadline: 'The 2-Minute Cluster Idle Time Waste Audit',
        angleRationale: 'Interactive calculator turning benchmark metrics into a high-intent lead generator.',
        estimatedLift: '+65% demo requests'
      }
    ],
    originalityReport: {
      overallOriginalityScore: 94,
      uniquenessTier: 'Exceptionally Novel',
      historicalMemoryOverlapPct: 6,
      semanticFreshness: 96,
      clicheFrequency: 'Very Low',
      uniqueAngles: [
        'Real production YAML architecture configurations and verified cost audit logs ($84k/mo saved).',
        'Contrarian thesis rejecting standard multi-tenancy recommendations above 45 nodes.',
        'Zero vendor promotional fluff; grounded strictly in system post-mortems.'
      ],
      derivativeRisks: [
        'General Kubernetes tutorials are ubiquitous; maintain strict focus on 50+ cluster thresholds.'
      ],
      suggestedOriginalityBoosters: [
        'Release an open-source Karpenter node autoscaling config benchmark to accompany the article.',
        'Include an anonymized multi-region failure case study.'
      ]
    },
    reachAnalysis: {
      predictedLikes: { min: 2100, max: 3200, average: 2540 },
      predictedImpressions: { min: 42000, max: 58000, average: 48200 },
      predictedShares: { min: 650, max: 980, average: 820 },
      predictedComments: { min: 140, max: 280, average: 195 },
      viralityScore: 92,
      hookStrengthScore: 94,
      algorithmFitScore: 91,
      audienceResonanceScore: 96,
      whyAudienceWillLike: [
        'Saves engineering budgets: VP of Infrastructure bookmark and share with their DevOps teams.',
        'Actionable code configs that engineers can copy-paste straight into Helm templates.',
        'Authentic post-mortem tone triggers massive organic upvotes on Reddit and Hacker News.'
      ],
      reachMultipliers: [
        { tactic: 'Attach annotated Karpenter architecture topology diagram', impact: '+35% Likes & Shares' },
        { tactic: 'Publish benchmark cost breakdown table in the preview snippet', impact: '+28% Click-Through' },
        { tactic: 'Include downloadable Terraform / Helm snippet gist', impact: '+52% Bookmarks' }
      ],
      optimalPostingTimes: [
        'Tuesday 08:30 AM – 10:15 AM EST',
        'Thursday 01:30 PM – 03:00 PM EST'
      ],
      trajectoryHours: [
        { hour: '2h', likes: 320, reach: 5200 },
        { hour: '6h', likes: 980, reach: 18400 },
        { hour: '12h', likes: 1720, reach: 32100 },
        { hour: '24h', likes: 2240, reach: 41800 },
        { hour: '48h', likes: 2540, reach: 48200 }
      ]
    }
  },
  {
    id: 'cnt-102',
    title: 'The Fallacy of Single-Prompt AI: Why Event-Driven Agent Loops Dominate in 2026',
    topic: 'Autonomous Agent Orchestration',
    channel: 'LinkedIn',
    format: 'Thought Leadership',
    funnelStage: 'TOFU',
    performanceTier: 'High Performer',
    publishedDate: '2026-09-02',
    targetPersona: 'AI Engineers & Engineering Directors',
    metrics: {
      views: 92400,
      engagements: 6420,
      shares: 1420,
      conversions: 215,
      bounceRatePct: 41.0,
      engagementRatePct: 6.9
    },
    keyTakeaways: [
      'Zero-shot prompts fail on compound workflows with >3 branching conditions.',
      'Stateful memory scratchpads improve multi-turn deterministic output by 72%.',
      'Winning architectures separate retrieval, reasoning, and tool execution into micro-agents.'
    ],
    aiAnalysis: {
      verdict: 'Highest Inbound Volume',
      whyItWorkedOrFailed: 'Contrarian opening line challenged popular hype. Directly answered engineering frustration with brittle production LLMs using benchmark graphs.',
      audienceSignal: 'High virality among startup CTOs and principal architects.',
      fatigueRisk: 'Medium'
    },
    repurposedIdeas: [
      {
        id: 'rmx-102-1',
        targetChannel: 'Technical Blog',
        format: 'Engineering Reference Blueprint',
        proposedHeadline: 'Architecting Resilient Multi-Agent Loops: State Machines vs. Blackboard Models',
        angleRationale: 'Deep-dive reference architecture with benchmark latency comparisons.',
        estimatedLift: '+55% organic search traffic'
      },
      {
        id: 'rmx-102-2',
        targetChannel: 'Twitter/X',
        format: 'High-Density Chart Thread',
        proposedHeadline: '90% of AI agents breaking in production make this exact memory mistake. The fix:',
        angleRationale: 'Fast-paced breakdown of memory retention graphs and token budgets.',
        estimatedLift: '1,200+ retweets'
      }
    ],
    originalityReport: {
      overallOriginalityScore: 96,
      uniquenessTier: 'Exceptionally Novel',
      historicalMemoryOverlapPct: 4,
      semanticFreshness: 98,
      clicheFrequency: 'Very Low',
      uniqueAngles: [
        'Directly critiques oversimplified "one-prompt" AI tutorials that fail in enterprise production.',
        'Introduces event-driven state machine paradigm with quantitative latency benchmarks.',
        'Presents original taxonomy for deterministic vs heuristic execution stages.'
      ],
      derivativeRisks: [
        'Avoid generalized AI commentary; maintain strict focus on asynchronous production loops.'
      ],
      suggestedOriginalityBoosters: [
        'Compare state machine agents with LangGraph/AutoGen telemetry benchmarks.',
        'Provide error recovery state diagram.'
      ]
    },
    reachAnalysis: {
      predictedLikes: { min: 3800, max: 5400, average: 4620 },
      predictedImpressions: { min: 78000, max: 105000, average: 92400 },
      predictedShares: { min: 1100, max: 1750, average: 1420 },
      predictedComments: { min: 280, max: 520, average: 380 },
      viralityScore: 96,
      hookStrengthScore: 98,
      algorithmFitScore: 95,
      audienceResonanceScore: 94,
      whyAudienceWillLike: [
        'Contrarian stance cuts through generic AI hype and provides engineers with real clarity.',
        'High-status repost: engineering directors share it to signal technical sophistication.',
        'Solves the #1 production headache of unreliable LLM hallucination in loops.'
      ],
      reachMultipliers: [
        { tactic: 'Include side-by-side agent failure vs success latency chart', impact: '+42% Reactions' },
        { tactic: 'Tag leading autonomous agent open-source maintainers', impact: '+31% Executive Reach' },
        { tactic: 'End with debate question: "Are state machines or neural routers winning your stack?"', impact: '+60% Comments' }
      ],
      optimalPostingTimes: [
        'Wednesday 08:15 AM – 09:45 AM EST',
        'Tuesday 12:30 PM – 02:00 PM EST'
      ],
      trajectoryHours: [
        { hour: '2h', likes: 640, reach: 11200 },
        { hour: '6h', likes: 1850, reach: 35000 },
        { hour: '12h', likes: 3100, reach: 64000 },
        { hour: '24h', likes: 4100, reach: 81000 },
        { hour: '48h', likes: 4620, reach: 92400 }
      ]
    }
  },
  {
    id: 'cnt-103',
    title: 'SOC2 Type II Audit in 30 Days: How Fintech Scaleup Passed Zero Exceptions',
    topic: 'Enterprise Compliance & Security',
    channel: 'Case Study',
    format: 'Customer Story',
    funnelStage: 'BOFU',
    performanceTier: 'High Performer',
    publishedDate: '2026-07-28',
    targetPersona: 'CISOs & Security Directors',
    metrics: {
      views: 14200,
      engagements: 1190,
      shares: 310,
      conversions: 94,
      bounceRatePct: 29.5,
      engagementRatePct: 8.4
    },
    keyTakeaways: [
      'Automated continuous evidence collection replaced 180 hours of manual screenshotting.',
      'Granular RBAC enforcement prevented last-minute audit blockers on staging clusters.',
      'Direct sales cycle shortened from 74 days to 31 days once compliance docs were self-serve.'
    ],
    aiAnalysis: {
      verdict: 'Highest Sales Pipeline Velocity',
      whyItWorkedOrFailed: 'High buyer intent. Targeted late-stage prospects evaluating enterprise security requirements with downloadable audit checklist.',
      audienceSignal: 'Direct attribution to enterprise contract closes.',
      fatigueRisk: 'Low'
    },
    repurposedIdeas: [
      {
        id: 'rmx-103-1',
        targetChannel: 'Technical Blog',
        format: 'Gated Readiness Spreadsheet',
        proposedHeadline: 'The 30-Day SOC2 Readiness Audit Matrix (Used by 45+ B2B SaaS Scaleups)',
        angleRationale: 'Tactical spreadsheet template with automated compliance status tracker.',
        estimatedLift: '3.1x MQL capture'
      }
    ],
    originalityReport: {
      overallOriginalityScore: 91,
      uniquenessTier: 'Exceptionally Novel',
      historicalMemoryOverlapPct: 8,
      semanticFreshness: 93,
      clicheFrequency: 'Low',
      uniqueAngles: [
        'Unfiltered documentation of passing SOC2 with zero auditor exceptions in 30 calendar days.',
        'Concrete timeline with automated evidence gathering templates.',
        'High business impact: cut enterprise sales turnaround from 74 to 31 days.'
      ],
      derivativeRisks: [
        'Avoid generic compliance marketing; keep focus on auditor evidence automation.'
      ],
      suggestedOriginalityBoosters: [
        'Attach the exact self-hosted checklist spreadsheet.',
        'Quote the lead external auditor on top disqualifiers.'
      ]
    },
    reachAnalysis: {
      predictedLikes: { min: 620, max: 1100, average: 840 },
      predictedImpressions: { min: 11000, max: 18000, average: 14200 },
      predictedShares: { min: 210, max: 440, average: 310 },
      predictedComments: { min: 45, max: 95, average: 68 },
      viralityScore: 78,
      hookStrengthScore: 88,
      algorithmFitScore: 90,
      audienceResonanceScore: 94,
      whyAudienceWillLike: [
        'Solves intense compliance anxiety for venture-backed founders.',
        'High pragmatic utility: readers immediately forward to their Ops and Security teams.',
        'Clear proof that enterprise sales velocity accelerates by 2.3x.'
      ],
      reachMultipliers: [
        { tactic: 'Include free downloadable audit checklist without email gate', impact: '+45% Likes & Reposts' },
        { tactic: 'Co-post with the featured fintech scaleup founders', impact: '+35% B2B Network Reach' }
      ],
      optimalPostingTimes: [
        'Tuesday 09:00 AM – 11:00 AM EST',
        'Wednesday 01:00 PM – 02:30 PM EST'
      ],
      trajectoryHours: [
        { hour: '2h', likes: 110, reach: 1800 },
        { hour: '6h', likes: 340, reach: 5600 },
        { hour: '12h', likes: 580, reach: 9800 },
        { hour: '24h', likes: 740, reach: 12600 },
        { hour: '48h', likes: 840, reach: 14200 }
      ]
    }
  },
  {
    id: 'cnt-104',
    title: 'Q2 Product Release Notes: 14 Minor Fixes and Dashboard Dark Mode',
    topic: 'Developer Velocity & Tooling',
    channel: 'Technical Blog',
    format: 'Thought Leadership',
    funnelStage: 'TOFU',
    performanceTier: 'Underperformer',
    publishedDate: '2026-06-18',
    targetPersona: 'General Users',
    metrics: {
      views: 6400,
      engagements: 88,
      shares: 12,
      conversions: 4,
      bounceRatePct: 68.4,
      engagementRatePct: 1.4
    },
    keyTakeaways: [
      'Announced minor bug resolutions and CSS polish.',
      'No customer story, problem articulation, or clear reason to upgrade.'
    ],
    aiAnalysis: {
      verdict: 'Underperforming Laundry List',
      whyItWorkedOrFailed: 'Internal feature laundry list without customer outcome framing. Headline was descriptive rather than value-driven.',
      audienceSignal: 'High immediate bounce rate (>68%).',
      fatigueRisk: 'High'
    },
    originalityReport: {
      overallOriginalityScore: 38,
      uniquenessTier: 'High Overlap Risk',
      historicalMemoryOverlapPct: 48,
      semanticFreshness: 32,
      clicheFrequency: 'High',
      uniqueAngles: [
        'Internal changelog notes specific to the v2.4 build.'
      ],
      derivativeRisks: [
        'Reads like every standard SaaS product release changelog.',
        'Zero narrative tension, unique point of view, or takeaway.'
      ],
      suggestedOriginalityBoosters: [
        'Re-frame around "Why we spent 3 sprints rewriting CSS engine for 60fps rendering".',
        'Highlight the customer incident that inspired the dark mode revamp.'
      ]
    },
    reachAnalysis: {
      predictedLikes: { min: 40, max: 95, average: 65 },
      predictedImpressions: { min: 4500, max: 8000, average: 6400 },
      predictedShares: { min: 6, max: 20, average: 12 },
      predictedComments: { min: 2, max: 8, average: 5 },
      viralityScore: 22,
      hookStrengthScore: 28,
      algorithmFitScore: 42,
      audienceResonanceScore: 35,
      whyAudienceWillLike: [
        'Only existing power users looking for specific patch fixes will glance at this.',
        'Lacks emotional or intellectual reward for cold social media audiences.'
      ],
      reachMultipliers: [
        { tactic: 'Turn the release into an interactive video walkthrough of the key workflow', impact: '+320% Likes' },
        { tactic: 'Highlight 1 customer who unblocked a mission-critical workflow', impact: '+150% Reach' }
      ],
      optimalPostingTimes: [
        'Thursday 02:00 PM EST'
      ],
      trajectoryHours: [
        { hour: '2h', likes: 12, reach: 900 },
        { hour: '6h', likes: 28, reach: 2400 },
        { hour: '12h', likes: 45, reach: 4100 },
        { hour: '24h', likes: 58, reach: 5600 },
        { hour: '48h', likes: 65, reach: 6400 }
      ]
    }
  },
  {
    id: 'cnt-105',
    title: 'The Death of "Sync" Meetings: How Async RFCs Doubled Our Engineering Sprint Velocity',
    topic: 'Developer Velocity & Tooling',
    channel: 'Substack Newsletter',
    format: 'Thought Leadership',
    funnelStage: 'TOFU',
    performanceTier: 'High Performer',
    publishedDate: '2026-08-30',
    targetPersona: 'Engineering Managers & CTOs',
    metrics: {
      views: 31200,
      engagements: 2480,
      shares: 670,
      conversions: 89,
      bounceRatePct: 34.0,
      engagementRatePct: 7.9
    },
    keyTakeaways: [
      'Replaced 4 hours of weekly architectural review calls with 48-hour silent review RFCs.',
      'Decision log transparency reduced cross-team rework by 37%.',
      'Preserved 4 consecutive hours of daily uninterrupted deep work time.'
    ],
    aiAnalysis: {
      verdict: 'Viral Newsletter Issue',
      whyItWorkedOrFailed: 'Resonated deeply with remote and hybrid engineering leaders battling calendar exhaustion. Included our raw RFC markdown template.',
      audienceSignal: 'Forwarded across team Slack channels and engineering bookmarks.',
      fatigueRisk: 'Low'
    },
    originalityReport: {
      overallOriginalityScore: 95,
      uniquenessTier: 'Exceptionally Novel',
      historicalMemoryOverlapPct: 5,
      semanticFreshness: 97,
      clicheFrequency: 'Very Low',
      uniqueAngles: [
        'Concrete RFC workflow protocol with actual 48-hour silent review timer guidelines.',
        'Empirical sprint velocity metrics showing 37% rework reduction.',
        'Addresses calendar fatigue without preachy generic "productivity hacks".'
      ],
      derivativeRisks: [
        'Async communication is a common topic; ensure focus stays on the technical RFC specification format.'
      ],
      suggestedOriginalityBoosters: [
        'Open-source our internal Notion / GitHub RFC review bot.',
        'Publish the before-and-after sprint burn-down charts.'
      ]
    },
    reachAnalysis: {
      predictedLikes: { min: 1450, max: 2350, average: 1840 },
      predictedImpressions: { min: 24000, max: 38000, average: 31200 },
      predictedShares: { min: 480, max: 820, average: 670 },
      predictedComments: { min: 95, max: 180, average: 135 },
      viralityScore: 94,
      hookStrengthScore: 96,
      algorithmFitScore: 92,
      audienceResonanceScore: 97,
      whyAudienceWillLike: [
        'Deep catharsis: thousands of engineers hate endless status meetings.',
        'Immediate workplace upgrade: managers can adopt the RFC template by tomorrow morning.',
        'Provocative contrarian title generates massive organic social sharing.'
      ],
      reachMultipliers: [
        { tactic: 'Share a raw anonymized RFC screenshot in the preview card', impact: '+38% Likes' },
        { tactic: 'Poll audience: "How many hours of internal syncs did you sit in this week?"', impact: '+55% Comments' }
      ],
      optimalPostingTimes: [
        'Sunday 06:00 PM EST (Pre-Week Planning)',
        'Monday 08:00 AM EST'
      ],
      trajectoryHours: [
        { hour: '2h', likes: 240, reach: 4200 },
        { hour: '6h', likes: 720, reach: 12800 },
        { hour: '12h', likes: 1250, reach: 21500 },
        { hour: '24h', likes: 1640, reach: 27800 },
        { hour: '48h', likes: 1840, reach: 31200 }
      ]
    }
  },
  {
    id: 'cnt-106',
    title: 'Guide to Kubernetes Cost Optimization for Early Stage Startups',
    topic: 'Cloud Infrastructure & Kubernetes',
    channel: 'Technical Blog',
    format: 'Deep-dive Tutorial',
    funnelStage: 'TOFU',
    performanceTier: 'Steady',
    publishedDate: '2026-08-01',
    targetPersona: 'Early Stage Founders & DevOps Leads',
    metrics: {
      views: 18400,
      engagements: 620,
      shares: 88,
      conversions: 24,
      bounceRatePct: 58.1,
      engagementRatePct: 3.4
    },
    keyTakeaways: [
      'Introductory overview of EC2 vs Fargate pricing.',
      'Basic tips on container sizing and memory limits.'
    ],
    aiAnalysis: {
      verdict: 'Active Cannibalization Hazard',
      whyItWorkedOrFailed: 'Steady search traffic, but cannibalizes traffic from Post #cnt-101 (Cutting Kubernetes Bill by 41%). Google is splitting SERP signals.',
      audienceSignal: 'Confused search intent between beginner and advanced readers.',
      fatigueRisk: 'Medium'
    },
    originalityReport: {
      overallOriginalityScore: 52,
      uniquenessTier: 'Moderate / Standard Take',
      historicalMemoryOverlapPct: 64,
      overlappingPostTitle: 'Why Kubernetes Multi-Tenancy Fails at 50+ Microservices',
      semanticFreshness: 61,
      clicheFrequency: 'Moderate',
      uniqueAngles: [
        'Geared toward early-stage seed/series A founders rather than enterprise platform teams.'
      ],
      derivativeRisks: [
        'Severe cannibalization: 64% keyword overlap with our top-ranking post #cnt-101.',
        'Covers introductory pricing concepts already covered extensively across AWS docs.'
      ],
      suggestedOriginalityBoosters: [
        'Consolidate this post into post #cnt-101 as an introductory sidebar to reclaim unified SEO domain authority.',
        'Pivot focus specifically to automated shutdown of dev/preview environments at 7 PM.'
      ]
    },
    reachAnalysis: {
      predictedLikes: { min: 290, max: 580, average: 420 },
      predictedImpressions: { min: 14000, max: 22000, average: 18400 },
      predictedShares: { min: 55, max: 120, average: 88 },
      predictedComments: { min: 15, max: 35, average: 24 },
      viralityScore: 54,
      hookStrengthScore: 62,
      algorithmFitScore: 68,
      audienceResonanceScore: 66,
      whyAudienceWillLike: [
        'Helpful starter advice for non-technical founders trying to keep AWS bills under $500/mo.',
        'Suffers from lower virality because seasoned engineers already know the fundamentals.'
      ],
      reachMultipliers: [
        { tactic: 'Provide a 1-click Bash script that kills zombie pods automatically', impact: '+75% Likes' }
      ],
      optimalPostingTimes: [
        'Wednesday 10:00 AM EST'
      ],
      trajectoryHours: [
        { hour: '2h', likes: 65, reach: 2100 },
        { hour: '6h', likes: 160, reach: 6400 },
        { hour: '12h', likes: 280, reach: 11800 },
        { hour: '24h', likes: 370, reach: 16200 },
        { hour: '48h', likes: 420, reach: 18400 }
      ]
    }
  }
];

export const TOPIC_MATRIX_DATA: TopicMatrixRow[] = [
  {
    topic: 'Cloud Infrastructure & Kubernetes',
    category: 'FinOps & Architecture',
    tofuCount: 4,
    mofuCount: 3,
    bofuCount: 1,
    avgEngagement: 6.8,
    coverageStatus: 'Optimal'
  },
  {
    topic: 'Autonomous Agent Orchestration',
    category: 'Applied AI & Systems',
    tofuCount: 6,
    mofuCount: 2,
    bofuCount: 0,
    avgEngagement: 7.2,
    coverageStatus: 'Gap Opportunity'
  },
  {
    topic: 'Enterprise Compliance & Security',
    category: 'Governance & Trust',
    tofuCount: 1,
    mofuCount: 1,
    bofuCount: 2,
    avgEngagement: 8.1,
    coverageStatus: 'Gap Opportunity'
  },
  {
    topic: 'Developer Velocity & Tooling',
    category: 'Engineering Culture',
    tofuCount: 5,
    mofuCount: 2,
    bofuCount: 0,
    avgEngagement: 5.4,
    coverageStatus: 'Gap Opportunity'
  },
  {
    topic: 'Attribution & Growth Analytics',
    category: 'Revenue Operations',
    tofuCount: 3,
    mofuCount: 2,
    bofuCount: 1,
    avgEngagement: 5.9,
    coverageStatus: 'Optimal'
  }
];

export const AI_GAP_RECOMMENDATIONS: TopicGapItem[] = [
  {
    id: 'gap-001',
    topic: 'Enterprise SLA & Security Benchmarks for Agentic Pipelines',
    category: 'Applied AI & Systems',
    status: 'Critical Gap',
    funnelStage: 'BOFU',
    searchDemand: 'Very High',
    recommendation: 'Autonomous Agent Orchestration has 6 top-of-funnel posts driving 140k visits, but zero late-stage buyer enablement collateral explaining audit logging, token budgets, and data residency.',
    suggestedAngle: 'A CISO Buyer Guide: Security Invariants and SLA Guarantees When Deploying Autonomous Agents in Production'
  },
  {
    id: 'gap-002',
    topic: 'Kubernetes Cloud Cost Optimization Guides',
    category: 'FinOps & Architecture',
    status: 'Cannibalization Risk',
    funnelStage: 'MOFU',
    searchDemand: 'High',
    competingPostTitles: [
      'Why Kubernetes Multi-Tenancy Fails at 50+ Microservices',
      'Guide to Kubernetes Cost Optimization for Early Stage Startups'
    ],
    recommendation: 'Two articles are competing for the exact same SERP queries with 78% overlapping keyword profiles, causing ranking dilution.',
    suggestedAngle: 'Merge both URLs into one authoritative Pillar Asset and 301-redirect the secondary post to concentrate backlink juice.'
  },
  {
    id: 'gap-003',
    topic: 'Developer Velocity ROI Calculator',
    category: 'Engineering Culture',
    status: 'Critical Gap',
    funnelStage: 'BOFU',
    searchDemand: 'High',
    recommendation: 'Engineering leaders love our async RFC manifesto, but lack quantitative tooling to justify tooling budget to their CFO.',
    suggestedAngle: 'The Engineering Efficiency Equation: Calculating the Financial Cost of Blocked PRs and Staging Deadlocks'
  },
  {
    id: 'gap-004',
    topic: 'Superficial Prompt Engineering Listicles',
    category: 'Applied AI & Systems',
    status: 'Over-saturated',
    funnelStage: 'TOFU',
    searchDemand: 'Moderate',
    recommendation: 'Audience fatigue detected: Articles focusing on basic prompt tricks show a 64% drop in average time-on-page over the last 90 days.',
    suggestedAngle: 'Pause generic prompt lists. Pivot pipeline to stateful agent loop architectures and deterministic verification.'
  }
];

export const INITIAL_BRAND_VOICE: BrandVoiceSettings = {
  formalVsCasual: 45, // Conversational authority, direct, unpretentious
  technicalVsSimple: 30, // Deep technical with practical analogies
  boldVsReserved: 25, // Bold, contrarian, evidence-backed
  playfulVsSerious: 75, // Serious, high-signal, zero corporate cringe
  targetTonePersona: 'Pragmatic Engineering Leader',
  vocabularyDoList: [
    'deterministic loops',
    'tactical architecture',
    'tangible savings',
    'zero-fluff',
    'production-grade',
    'first-principles',
    'empirical benchmarks',
    'verified telemetry'
  ],
  vocabularyAvoidList: [
    'game-changer',
    'revolutionize',
    'supercharge',
    'harness the power',
    'in today’s fast-paced world',
    'delve into',
    'look no further',
    'it goes without saying',
    'seamlessly integrate'
  ]
};

export const SAMPLE_DRAFTS = [
  {
    id: 'draft-corporate',
    title: 'Sample 1: Corporate Buzzword Draft (Violates Guidelines)',
    text: `In today’s fast-paced business world, digital transformation is a true game-changer. We are thrilled to unleash our revolutionary, cutting-edge AI platform that will seamlessly integrate with your existing workflow. Delve into the next generation of productivity and look no further for your automation needs. It goes without saying that synergy across cross-functional stakeholders will unlock unprecedented value.`
  },
  {
    id: 'draft-academic',
    title: 'Sample 2: Academic & Passive Draft (Needs Clarity & Directness)',
    text: `It is hypothesized that the proliferation of distributed microservices within heterogeneous cloud environments invariably precipitates non-trivial latency anomalies. Pursuant to an empirical investigation across multi-tenant clusters, our observations indicate that suboptimal pod scheduling parameters contribute non-negligibly to fiscal expenditure inefficiency.`
  },
  {
    id: 'draft-aligned',
    title: 'Sample 3: High-Signal Engineering Draft (Strong Alignment)',
    text: `Engineering teams scaling multi-tenant clusters face a predictable trap: misconfigured pod scheduling quietly burns 41% of compute budgets during idle off-hours. Rather than relying on speculative rules, our infrastructure team benchmarked 100+ production workloads across spot fleets. Here are the 3 architectural invariants that reduced idle overhead without dropping 99.99% SLA availability.`
  }
];

export const INITIAL_STRATEGY_BRIEFS: StrategyBrief[] = [
  {
    id: 'brief-001',
    title: 'Strategic Brief: Enterprise SLA & Security Benchmarks for Agentic Pipelines',
    goal: 'Lead Generation (BOFU High Intent)',
    targetPersona: 'Enterprise CISO / Security Director',
    channel: 'Technical Blog',
    funnelStage: 'BOFU',
    coreThesis: 'Enterprise buyers are exhausted by superficial AI promise. High engagement and contract signatures are won by demonstrating explicit trade-offs, credential sandboxing, and audit telemetry.',
    groundedFromPastPosts: [
      {
        postTitle: 'SOC2 Type II Audit in 30 Days: How Fintech Scaleup Passed Zero Exceptions',
        channel: 'Case Study',
        metricProof: '14,200 views with 8.4% engagement rate and 94 direct conversions',
        learningApplied: 'Downloadable audit checklists and zero-fluff regulatory answers shortened enterprise sales cycles by 43 days.'
      }
    ],
    hookVariations: [
      {
        type: 'Contrarian Question',
        hookText: 'Why are 80% of enterprise teams building chat windows when users just want their operational tickets resolved without conversation?'
      },
      {
        type: 'Telemetry & Cost First',
        hookText: 'We benchmarked 10,000 asynchronous agent executions. Here is why unhandled tool timeouts cost an average of $3,400/month in stalled cloud runs.'
      },
      {
        type: 'Behind-the-Scenes Post-Mortem',
        hookText: 'The 3 silent security invariants that saved our SOC-2 audit when we introduced autonomous workflow bots.'
      }
    ],
    outlineSections: [
      {
        heading: '01. The Problem Space: Why Generic LLM Wrappers Fail Enterprise Audits',
        talkingPoints: [
          'Highlight the hidden risk of unmonitored tool-calling tokens.',
          'Quantify the data residency liability when third-party endpoints cache customer prompts.',
          'Establish the need for deterministic sandboxes with strict credential rotation.'
        ],
        evidenceNeeded: 'Data flow diagram showing egress boundaries and ephemeral auth tokens.'
      },
      {
        heading: '02. Architectural Solution: The 4 Invariants of Compliant Agent Execution',
        talkingPoints: [
          'Invariant 1: Ephemeral JWT generation with 5-minute TTL for every external tool call.',
          'Invariant 2: Full-duplex audit trail recording input hashes and execution state.',
          'Invariant 3: Automated circuit breakers on cost and retry ceilings.'
        ],
        evidenceNeeded: 'Reproducible configuration snippet and system architecture schematic.'
      },
      {
        heading: '03. Implementation Playbook & 30-Day Transition Checklist',
        talkingPoints: [
          'Step-by-step rollout across staging, sandbox, and production environments.',
          'Sample procurement questionnaire answers ready for legal review.'
        ],
        evidenceNeeded: 'Downloadable 1-page readiness audit matrix.'
      }
    ],
    primaryCTA: 'Download the Enterprise Agent Security Audit Matrix & Spec Sheets (Zero gate friction)',
    secondaryCTA: 'Schedule a 1-on-1 architecture teardown with our principal security engineer',
    distributionChecklist: [
      'Publish primary technical deep-dive on Technical Blog (SEO canonical source).',
      'Extract Section 02 into an 8-slide PDF carousel for LinkedIn technical decision-makers.',
      'Send executive summary to Substack newsletter subscribers with link to the spreadsheet.',
      'Distribute key architectural diagrams to Reddit r/devops and r/cloud.'
    ],
    createdAt: '2026-09-28'
  }
];
