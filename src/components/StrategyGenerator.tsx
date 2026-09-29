import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  BookmarkCheck, 
  ArrowRight, 
  BookOpen, 
  FileText,
  RotateCw
} from 'lucide-react';
import { ContentItem, ContentChannel, FunnelStage, StrategyBrief } from '../types';
import { generateContentStrategyBrief } from '../services/aiService';
import { INITIAL_STRATEGY_BRIEFS } from '../data/mockData';

interface StrategyGeneratorProps {
  pastPosts: ContentItem[];
  prefilledTopic?: string;
  prefilledStage?: FunnelStage;
  prefilledAngle?: string;
}

export const StrategyGenerator: React.FC<StrategyGeneratorProps> = ({
  pastPosts,
  prefilledTopic = '',
  prefilledStage = 'TOFU',
  prefilledAngle = ''
}) => {
  const [goal, setGoal] = useState<string>('Thought Leadership & Inbound Authority');
  const [targetPersona, setTargetPersona] = useState<string>('VP of Engineering / Technical Architect');
  const [channel, setChannel] = useState<ContentChannel>('Technical Blog');
  const [funnelStage, setFunnelStage] = useState<FunnelStage>(prefilledStage);
  const [seedTopic, setSeedTopic] = useState<string>(prefilledTopic || prefilledAngle || 'Why Most Production Agent Workflows Fail Under Concurrency');

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeBrief, setActiveBrief] = useState<StrategyBrief>(INITIAL_STRATEGY_BRIEFS[0]);
  const [savedBriefs, setSavedBriefs] = useState<StrategyBrief[]>(INITIAL_STRATEGY_BRIEFS);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Sync if prefilled changes from outside
  React.useEffect(() => {
    if (prefilledTopic) {
      setSeedTopic(prefilledAngle ? `${prefilledTopic}: ${prefilledAngle}` : prefilledTopic);
    }
    if (prefilledStage) {
      setFunnelStage(prefilledStage);
    }
  }, [prefilledTopic, prefilledStage, prefilledAngle]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const brief = await generateContentStrategyBrief(
        goal,
        targetPersona,
        channel,
        funnelStage,
        seedTopic,
        pastPosts
      );
      setActiveBrief(brief);
      setSavedBriefs(prev => [brief, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleExportMarkdown = () => {
    if (!activeBrief) return;
    const md = `# ${activeBrief.title}
**Goal**: ${activeBrief.goal}  
**Target Persona**: ${activeBrief.targetPersona}  
**Channel**: ${activeBrief.channel} (${activeBrief.funnelStage})  
**Date**: ${activeBrief.createdAt}  

---

## 1. Core Thesis & Strategic Angle
${activeBrief.coreThesis}

### Memory Grounding (Historical Data Proof)
${activeBrief.groundedFromPastPosts.map(p => `- **${p.postTitle}** (${p.channel}): ${p.metricProof} -> ${p.learningApplied}`).join('\n')}

---

## 2. Tested Hook Variations
${activeBrief.hookVariations.map((h, i) => `### Hook ${i + 1} (${h.type})\n> "${h.hookText}"`).join('\n\n')}

---

## 3. Structural Section Outline
${activeBrief.outlineSections.map(sec => `### ${sec.heading}
${sec.talkingPoints.map(t => `- ${t}`).join('\n')}
*Evidence / Artifact Required*: ${sec.evidenceNeeded}`).join('\n\n')}

---

## 4. Calls to Action
- **Primary CTA**: ${activeBrief.primaryCTA}
- **Secondary CTA**: ${activeBrief.secondaryCTA}

---

## 5. Multi-Channel Distribution Checklist
${activeBrief.distributionChecklist.map(c => `- [ ] ${c}`).join('\n')}
`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-brief-${activeBrief.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-8">
      {/* Intro Header */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <span>AI Strategy & Data-Grounded Brief Generator</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Synthesizes historical top-performing posts from your content memory bank to generate battle-tested outlines, hook variants, and distribution plans that convert.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <form onSubmit={handleGenerate} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 pb-3 border-b border-slate-800">
              Brief Parameters
            </h3>

            {/* Topic Input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Seed Topic or Working Title
              </label>
              <textarea
                rows={2}
                required
                value={seedTopic}
                onChange={(e) => setSeedTopic(e.target.value)}
                placeholder="e.g. Asynchronous Agent Error Handling in Production"
                className="w-full rounded-lg bg-slate-950 p-2.5 text-xs text-white border border-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Strategic Goal */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Strategic Marketing Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full rounded-lg bg-slate-950 px-2.5 py-2 text-xs text-slate-200 border border-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="Thought Leadership & Inbound Authority">Thought Leadership & Authority</option>
                <option value="Lead Generation & Pipeline Acceleration">Lead Gen & Pipeline Acceleration</option>
                <option value="Product Adoption & Developer Education">Product Adoption & Dev Education</option>
                <option value="Retention & Enterprise Expansion">Retention & Expansion Proof</option>
              </select>
            </div>

            {/* Target Persona */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Target Persona
              </label>
              <select
                value={targetPersona}
                onChange={(e) => setTargetPersona(e.target.value)}
                className="w-full rounded-lg bg-slate-950 px-2.5 py-2 text-xs text-slate-200 border border-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="VP of Engineering / Technical Architect">VP of Engineering / Tech Architect</option>
                <option value="Chief Information Security Officer (CISO)">CISO / Security Director</option>
                <option value="Head of Growth / Marketing Director">Head of Growth / CMO</option>
                <option value="Lead Platform Engineer / SRE">Platform Engineer / SRE</option>
                <option value="Startup Founder / CTO">Startup Founder / CTO</option>
              </select>
            </div>

            {/* Channel & Funnel Stage */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Primary Channel
                </label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as ContentChannel)}
                  className="w-full rounded-lg bg-slate-950 px-2 py-2 text-xs text-slate-200 border border-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="Technical Blog">Technical Blog</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Substack Newsletter">Substack</option>
                  <option value="Twitter/X">Twitter/X</option>
                  <option value="Case Study">Case Study</option>
                  <option value="YouTube / Video">YouTube / Video</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Funnel Stage
                </label>
                <select
                  value={funnelStage}
                  onChange={(e) => setFunnelStage(e.target.value as FunnelStage)}
                  className="w-full rounded-lg bg-slate-950 px-2 py-2 text-xs text-slate-200 border border-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="TOFU">TOFU (Discovery)</option>
                  <option value="MOFU">MOFU (Evaluation)</option>
                  <option value="BOFU">BOFU (Decision)</option>
                </select>
              </div>
            </div>

            {/* Memory Grounding Preview Indicator */}
            <div className="rounded-lg bg-slate-950/80 p-3 border border-slate-800 text-xs text-slate-400">
              <span className="font-semibold text-indigo-300 block mb-1">
                Active Memory References:
              </span>
              <p className="text-[11px] leading-relaxed">
                Will ground this brief in historical winners: <strong className="text-slate-300 font-normal">Why 72% of RAG Systems Fail</strong> and <strong className="text-slate-300 font-normal">The Death of the Marketing Dashboard</strong>.
              </p>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-semibold text-white transition-colors shadow-sm disabled:opacity-50"
            >
              <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Synthesizing Brief...' : 'Generate Grounded Brief'}</span>
            </button>
          </form>

          {/* Saved Briefs Drawer list */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Briefs Archive ({savedBriefs.length})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {savedBriefs.map(b => (
                <button
                  key={b.id}
                  onClick={() => setActiveBrief(b)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors ${
                    activeBrief.id === b.id
                      ? 'border-indigo-500/50 bg-indigo-950/20 text-white'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-medium text-slate-200 truncate">{b.title}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {b.channel} · {b.funnelStage} · {b.createdAt}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generated Brief Display Column (8 cols) */}
        <div className="lg:col-span-8">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
            {/* Brief Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <span className="text-indigo-400 font-medium">{activeBrief.channel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeBrief.funnelStage} Funnel</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeBrief.targetPersona}</span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {activeBrief.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={handleExportMarkdown}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors border border-slate-700"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export .MD</span>
                </button>
              </div>
            </div>

            {/* Section 1: Strategic Thesis & Historical Grounding */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                01. Core Strategic Thesis & Memory Rationale
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/80 p-4 rounded-lg border border-slate-800/80">
                {activeBrief.coreThesis}
              </p>

              {/* Memory references */}
              <div className="rounded-lg bg-indigo-950/20 border border-indigo-900/30 p-3.5 space-y-2">
                <div className="text-[11px] font-semibold text-indigo-300 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Historical Data Rationale: Why This Will Perform</span>
                </div>
                {activeBrief.groundedFromPastPosts.map((past, i) => (
                  <div key={i} className="text-xs text-slate-300 pl-4 border-l-2 border-indigo-500/40">
                    <span className="font-medium text-white">"{past.postTitle}"</span> ({past.channel}): {past.metricProof}. <em>Applied learning:</em> {past.learningApplied}
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: 3 Tested Hook Variations */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                02. 3 Tested Hook Variations
              </h4>
              <div className="space-y-2.5">
                {activeBrief.hookVariations.map((hook, i) => (
                  <div key={i} className="rounded-lg bg-slate-950 p-3.5 border border-slate-800 flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wide block mb-1">
                        Hook {i + 1}: {hook.type}
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed italic">
                        "{hook.hookText}"
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopyText(hook.hookText, `hook-${i}`)}
                      className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
                      title="Copy hook"
                    >
                      {copiedSection === `hook-${i}` ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Structural Outline */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                03. Content Outline & Evidence Requirements
              </h4>
              <div className="space-y-3">
                {activeBrief.outlineSections.map((section, idx) => (
                  <div key={idx} className="rounded-lg bg-slate-950 p-4 border border-slate-800 space-y-2">
                    <div className="text-xs font-semibold text-white">
                      {section.heading}
                    </div>
                    <ul className="space-y-1 text-xs text-slate-300 pl-4 list-disc marker:text-indigo-400">
                      {section.talkingPoints.map((tp, tIdx) => (
                        <li key={tIdx}>{tp}</li>
                      ))}
                    </ul>
                    <div className="text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/60">
                      <span className="text-indigo-400 font-medium">Evidence Required:</span> {section.evidenceNeeded}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Calls to Action & Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg bg-slate-950 p-4 border border-slate-800">
                <h5 className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider mb-2">
                  Call to Action (CTA) Hierarchy
                </h5>
                <div className="text-xs space-y-2 text-slate-300">
                  <div>
                    <strong className="text-white block text-[11px]">Primary CTA:</strong>
                    {activeBrief.primaryCTA}
                  </div>
                  <div>
                    <strong className="text-white block text-[11px]">Secondary CTA:</strong>
                    {activeBrief.secondaryCTA}
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-slate-950 p-4 border border-slate-800">
                <h5 className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider mb-2">
                  Multi-Channel Distribution Checklist
                </h5>
                <ul className="text-xs space-y-1.5 text-slate-300">
                  {activeBrief.distributionChecklist.map((check, cIdx) => (
                    <li key={cIdx} className="flex items-start gap-1.5">
                      <span className="text-indigo-400 font-bold">✓</span>
                      <span>{check}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
