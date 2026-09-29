import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Film, 
  FileText, 
  Share2, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  Play, 
  Pause, 
  Maximize2, 
  Video, 
  CheckSquare, 
  Sliders, 
  Clock, 
  Eye, 
  Heart, 
  ShieldCheck, 
  TrendingUp, 
  Lightbulb, 
  BookmarkCheck, 
  Zap, 
  ChevronRight,
  RotateCcw,
  Volume2,
  Search,
  Scale,
  Code,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  SlidersHorizontal
} from 'lucide-react';
import { 
  ContentItem, 
  ContentChannel, 
  FunnelStage, 
  FullGeneratedContent, 
  VideoStoryboardScene 
} from '../types';
import { generateFullContentAndVideoTutorial } from '../services/aiService';
import { OriginalityAndReachPanel } from './OriginalityAndReachPanel';

interface ContentAndVideoStudioProps {
  pastPosts: ContentItem[];
  prefilledTopic?: string;
  prefilledStage?: FunnelStage;
  prefilledAngle?: string;
  onSaveToMemory: (newItem: ContentItem) => void;
  onNotify: (msg: string) => void;
}

export const ContentAndVideoStudio: React.FC<ContentAndVideoStudioProps> = ({
  pastPosts,
  prefilledTopic = '',
  prefilledStage = 'TOFU',
  prefilledAngle = '',
  onSaveToMemory,
  onNotify
}) => {
  const [topicInput, setTopicInput] = useState<string>(
    prefilledTopic || prefilledAngle || 'Why 72% of Production RAG Systems Fail at Scale (And How We Fixed Ours)'
  );
  const [selectedChannel, setSelectedChannel] = useState<ContentChannel>('Technical Blog');
  const [selectedFormat, setSelectedFormat] = useState<any>('Deep-dive Article');
  const [selectedPersona, setSelectedPersona] = useState<string>('VP of Engineering / Principal AI Architect');
  const [videoDuration, setVideoDuration] = useState<'60 Seconds (Shorts/Reels)' | '5-8 Minutes (YouTube)'>('60 Seconds (Shorts/Reels)');
  
  // Differentiation & Efficiency Mode
  const [moatFocus, setMoatFocus] = useState<'Un-Googleable Battle Scars & Telemetry' | 'Contrarian Industry Playbook' | 'Zero-Fluff Production Blueprints'>('Un-Googleable Battle Scars & Telemetry');
  const [efficiencyMode, setEfficiencyMode] = useState<'High-Density (60s TL;DR + Code)' | 'Comprehensive Field Manual' | 'Executive Decision Matrix'>('High-Density (60s TL;DR + Code)');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<FullGeneratedContent | null>(null);
  const [activeStudioTab, setActiveStudioTab] = useState<'google-contrast' | 'content' | 'video' | 'post'>('google-contrast');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Content reading filter
  const [readingFilter, setReadingFilter] = useState<'all' | 'brief' | 'code'>('all');

  // Teleprompter state
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);
  const [teleprompterSpeed, setTeleprompterSpeed] = useState<number>(35); // seconds per scroll
  const [isTeleprompterPlaying, setIsTeleprompterPlaying] = useState(false);
  const teleprompterScrollRef = useRef<HTMLDivElement>(null);

  // Teleprompter auto-scroll effect
  useEffect(() => {
    let animationFrameId: number;
    if (isTeleprompterPlaying && isTeleprompterOpen && teleprompterScrollRef.current) {
      const scrollStep = () => {
        if (teleprompterScrollRef.current) {
          teleprompterScrollRef.current.scrollTop += (45 / teleprompterSpeed);
          animationFrameId = requestAnimationFrame(scrollStep);
        }
      };
      animationFrameId = requestAnimationFrame(scrollStep);
    }
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isTeleprompterPlaying, isTeleprompterOpen, teleprompterSpeed]);

  // Sync if prefilled changes from outside
  useEffect(() => {
    if (prefilledTopic) {
      setTopicInput(prefilledAngle ? `${prefilledTopic}: ${prefilledAngle}` : prefilledTopic);
    }
  }, [prefilledTopic, prefilledAngle]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;

    setIsGenerating(true);
    try {
      const result = await generateFullContentAndVideoTutorial(
        {
          topic: topicInput,
          channel: selectedChannel,
          format: selectedFormat,
          targetPersona: selectedPersona,
          videoDuration
        },
        pastPosts
      );
      setGeneratedContent(result);
      setActiveStudioTab('google-contrast');
      onNotify(`Generated differentiated content & video masterclass for "${result.title.slice(0, 30)}..."`);
    } catch (err) {
      console.error(err);
      onNotify('Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!generatedContent) return;
    const blob = new Blob([generatedContent.fullMarkdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedContent.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify('Downloaded full content markdown file');
  };

  const handleIndexIntoMemory = () => {
    if (!generatedContent) return;
    const views = generatedContent.reachAnalysis.predictedImpressions.average;
    const engagements = generatedContent.reachAnalysis.predictedLikes.average;

    const newItem: ContentItem = {
      id: `generated-${Date.now().toString().slice(-4)}`,
      title: generatedContent.title,
      topic: generatedContent.topic,
      channel: generatedContent.channel,
      format: generatedContent.format,
      funnelStage: generatedContent.funnelStage,
      performanceTier: 'High Performer',
      publishedDate: new Date().toISOString().split('T')[0],
      targetPersona: generatedContent.targetPersona,
      metrics: {
        views,
        engagements,
        shares: generatedContent.reachAnalysis.predictedShares.average,
        conversions: Math.round(views * 0.008),
        bounceRatePct: 32.0,
        engagementRatePct: parseFloat(((engagements / views) * 100).toFixed(1))
      },
      keyTakeaways: generatedContent.googleContrast.unGoogleableTakeaways || [
        'Complete architectural teardown addressing primary system failure vectors.',
        'Measured production benchmark improvements with concrete proof.',
        'Production rollout guide and failure budget specifications.'
      ],
      aiAnalysis: {
        verdict: `Un-Googleable Content Asset (${generatedContent.googleContrast.informationGainScore}% Info Gain)`,
        whyItWorkedOrFailed: generatedContent.reachAnalysis.whyAudienceWillLike[0] || 'High utility framework grounded in real failure modes.',
        audienceSignal: 'Engineering leaders bookmark and forward to platform teams.',
        fatigueRisk: 'Low'
      },
      originalityReport: generatedContent.originalityReport,
      reachAnalysis: generatedContent.reachAnalysis
    };

    onSaveToMemory(newItem);
  };

  const topicSuggestions = [
    'Why 72% of Production RAG Systems Fail at Scale',
    'How Event-Driven AI Agent Loops Beat Single Prompts',
    'We Cut Our Kubernetes AWS Bill by 41% with Karpenter',
    'The Death of Sync Meetings: How Async RFCs Doubled Sprint Velocity',
    'Passing SOC2 Type II Audit in 30 Days with Zero Auditor Exceptions'
  ];

  return (
    <div className="space-y-6">
      {/* Studio Header & Topic Generator Form */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Full Content Engine · Video Masterclass · Google Contrast</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Topic-to-Content & Video Creation Masterclass
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Give any topic: the engine generates the full article, contrasts it directly against generic Google search fluff with verified un-googleable depth, builds a scene-by-scene video storyboard with teleprompter voiceover scripts, and teaches you how to film, edit, and publish for maximum reach.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>Google Information Gain & Anti-Slop Active</span>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-300">
                What topic do you want to cover?
              </label>
              <span className="text-[11px] text-slate-500">Pick a suggested high-intent topic or enter your own</span>
            </div>

            <div className="relative">
              <input
                type="text"
                required
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="e.g. Why Multi-Region Postgres Systems Fail Under Partitioning..."
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none placeholder-slate-500"
              />
            </div>

            {/* Quick Suggestion Pills */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              <span className="text-[11px] text-slate-500 font-medium mr-1">Quick Picks:</span>
              {topicSuggestions.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTopicInput(t)}
                  className="text-[11px] px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors cursor-pointer"
                >
                  {t.length > 40 ? `${t.slice(0, 40)}...` : t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Target Channel</label>
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value as ContentChannel)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 cursor-pointer"
              >
                <option value="Technical Blog">Technical Blog</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Substack Newsletter">Substack Newsletter</option>
                <option value="Twitter/X">Twitter/X</option>
                <option value="Case Study">Case Study</option>
                <option value="YouTube / Video">YouTube / Video</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Content Format</label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 cursor-pointer"
              >
                <option value="Deep-dive Article">Deep-dive Article</option>
                <option value="LinkedIn Carousel & Post">LinkedIn Carousel & Post</option>
                <option value="Substack Newsletter">Substack Newsletter</option>
                <option value="Architecture Breakdown">Architecture Breakdown</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Target Persona</label>
              <input
                type="text"
                value={selectedPersona}
                onChange={(e) => setSelectedPersona(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Video Duration</label>
              <select
                value={videoDuration}
                onChange={(e) => setVideoDuration(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 cursor-pointer"
              >
                <option value="60 Seconds (Shorts/Reels)">60 Seconds (Shorts/Reels/TikTok)</option>
                <option value="5-8 Minutes (YouTube)">5-8 Minutes (YouTube Horizontal)</option>
              </select>
            </div>
          </div>

          {/* Differentiated & Efficiency Control Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <div>
              <label className="block text-[11px] font-semibold text-emerald-400 mb-1 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                <span>Moat Focus (Differentiation vs. Google)</span>
              </label>
              <select
                value={moatFocus}
                onChange={(e) => setMoatFocus(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 cursor-pointer"
              >
                <option value="Un-Googleable Battle Scars & Telemetry">Un-Googleable Battle Scars & Telemetry</option>
                <option value="Contrarian Industry Playbook">Contrarian Industry Playbook (Challenge Consensus)</option>
                <option value="Zero-Fluff Production Blueprints">Zero-Fluff Production Blueprints (Ready Configs)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-indigo-400 mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Efficiency & Speed Profile</span>
              </label>
              <select
                value={efficiencyMode}
                onChange={(e) => setEfficiencyMode(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 cursor-pointer"
              >
                <option value="High-Density (60s TL;DR + Code)">High-Density (60s Executive TL;DR + Manifests)</option>
                <option value="Comprehensive Field Manual">Comprehensive Field Manual (Full Telemetry)</option>
                <option value="Executive Decision Matrix">Executive Decision Matrix (Leadership ROI)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-rose-600 hover:from-indigo-500 hover:to-rose-500 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Generating Differentiated Content & Video Tutorial...' : 'Generate Full Content & Video Tutorial'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* GENERATED CONTENT WORKSPACE & MASTERCLASS TABS */}
      {generatedContent && (
        <div className="space-y-6 animate-fadeIn">
          {/* Studio Top Control Nav Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/90 shadow-md">
            {/* View Switcher Tabs (4 Primary Modes) */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveStudioTab('google-contrast')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeStudioTab === 'google-contrast'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
                }`}
              >
                <Scale className="w-4 h-4 text-amber-400" />
                <span>1. Google Contrast & Moat</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full font-mono font-bold">
                  {generatedContent.googleContrast.informationGainScore}% Gain
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStudioTab('content')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeStudioTab === 'content'
                    ? 'bg-indigo-600 text-white shadow-sm border border-indigo-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>2. Full Written Content</span>
                <span className="text-[10px] bg-indigo-950 px-1.5 py-0.5 rounded-full text-indigo-200 font-mono">
                  {generatedContent.wordCount}w
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStudioTab('video')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeStudioTab === 'video'
                    ? 'bg-rose-600 text-white shadow-sm border border-rose-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>3. Video Masterclass</span>
                <span className="text-[10px] bg-rose-950 px-1.5 py-0.5 rounded-full text-rose-200 font-mono">
                  {generatedContent.videoTutorial.storyboard.length} Scenes
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStudioTab('post')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeStudioTab === 'post'
                    ? 'bg-emerald-600 text-white shadow-sm border border-emerald-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span>4. Social Post & Carousel</span>
                <span className="text-[10px] bg-emerald-950 px-1.5 py-0.5 rounded-full text-emerald-200 font-mono">
                  Ready
                </span>
              </button>
            </div>

            {/* Quick Action Tools */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDownloadMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
                title="Download complete markdown file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .MD</span>
              </button>

              <button
                type="button"
                onClick={handleIndexIntoMemory}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all cursor-pointer"
                title="Index directly into Content Memory Repository"
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Index to Memory Bank</span>
              </button>
            </div>
          </div>

          {/* TAB 1: GOOGLE CONTRAST & UN-GOOGLEABLE EFFICIENCY MOAT */}
          {activeStudioTab === 'google-contrast' && (
            <div className="space-y-6">
              {/* Moat Banner: Information Gain & Efficiency Lift */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/30 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                      <Scale className="w-4 h-4" />
                      <span>Google Search Contrast & Information Gain Audit</span>
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      Why This Content Wins When Google Search Fails
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                      Anyone can type a keyword into Google. But generic Google rankings prioritize surface-level definitions, keyword stuffing, and corporate marketing fluff. Here is the verified contrast analysis showing our proprietary information gain and execution efficiency.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 text-center">
                      <div className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Information Gain</div>
                      <div className="text-2xl font-black text-amber-300 font-mono">
                        {generatedContent.googleContrast.informationGainScore}%
                      </div>
                      <div className="text-[10px] text-amber-400/80">vs Google Page 1</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-center">
                      <div className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Efficiency Lift</div>
                      <div className="text-sm font-bold text-emerald-300 mt-1">
                        {generatedContent.googleContrast.timeSavedEstimate}
                      </div>
                      <div className="text-[10px] text-emerald-400/80">Immediate ROI</div>
                    </div>
                  </div>
                </div>

                {/* 60-Second Executive Efficiency Playbook (TL;DR) */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                      <Zap className="w-4 h-4 text-indigo-400" />
                      <span>60-Second Executive Efficiency Playbook (Instant Action)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const briefText = `EXECUTIVE 60-SECOND BRIEF: ${generatedContent.title}\n\n1-MIN SUMMARY:\n${generatedContent.googleContrast.executiveEfficiencyBrief.oneMinuteSummary}\n\nIMMEDIATE ACTION ITEM:\n${generatedContent.googleContrast.executiveEfficiencyBrief.immediateActionItem}\n\nCORE DIFFERENTIATOR:\n${generatedContent.googleContrast.executiveEfficiencyBrief.coreDifferentiator}`;
                        handleCopy(briefText, 'exec-brief');
                      }}
                      className="text-xs text-indigo-300 hover:text-white px-2.5 py-1 rounded bg-indigo-950/60 border border-indigo-800/60 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'exec-brief' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied Brief!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy 60s Brief</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 space-y-1">
                      <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        1-Minute Synthesis
                      </span>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        {generatedContent.googleContrast.executiveEfficiencyBrief.oneMinuteSummary}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                      <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Immediate Action Item
                      </span>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        {generatedContent.googleContrast.executiveEfficiencyBrief.immediateActionItem}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/20 space-y-1">
                      <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        Core Differentiator
                      </span>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        {generatedContent.googleContrast.executiveEfficiencyBrief.coreDifferentiator}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Side-by-Side Comparison Matrix */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Scale className="w-4 h-4 text-amber-400" />
                      <span>Side-by-Side Dimension Matrix: Google Search Consensus vs. Our Differentiated Engine</span>
                    </h4>
                    <span className="text-[11px] text-slate-400">Validated against Top 10 SERP results</span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                          <th className="p-3 w-1/5 font-semibold">Evaluation Dimension</th>
                          <th className="p-3 w-2/5 font-semibold text-rose-300">What Google Search Returns (Fluff)</th>
                          <th className="p-3 w-2/5 font-semibold text-emerald-300">Our Differentiated Engine (Truth)</th>
                          <th className="p-3 w-1/5 font-semibold text-indigo-300">Efficiency Advantage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
                        {generatedContent.googleContrast.comparisonMatrix.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                            <td className="p-3 font-semibold text-white align-top">
                              {row.dimension}
                            </td>
                            <td className="p-3 text-slate-400 align-top leading-relaxed text-[11px]">
                              <div className="flex items-start gap-1.5">
                                <span className="text-rose-400 font-bold shrink-0">✕</span>
                                <span>{row.googleSearchConsensus}</span>
                              </div>
                            </td>
                            <td className="p-3 text-emerald-200 align-top leading-relaxed text-[11px] bg-emerald-950/10">
                              <div className="flex items-start gap-1.5">
                                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                                <span>{row.ourDifferentiatedAngle}</span>
                              </div>
                            </td>
                            <td className="p-3 text-indigo-300 font-mono text-[10px] align-top bg-indigo-950/10">
                              {row.efficiencyAdvantage}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3 Un-Googleable Secrets & Takeaways */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>3 Proprietary "Un-Googleable" Insights (Impossible to Find via Standard Search)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {generatedContent.googleContrast.unGoogleableTakeaways.map((takeaway, tidx) => (
                      <div key={tidx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-mono text-amber-400">
                          <span>SECRET #{tidx + 1}</span>
                          <span className="text-slate-500">Un-Googleable</span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed font-medium">
                          {takeaway}
                        </p>
                        <div className="text-[10px] text-emerald-400 pt-2 border-t border-slate-800/80 flex items-center gap-1 font-mono">
                          <Check className="w-3 h-3" /> Zero search duplication
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Why Google Search Results Underperform Teardown */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Root Cause: Why Top Google Search Results Fail Senior Practitioners</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {generatedContent.googleContrast.whyGoogleResultsUnderperform}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                    {generatedContent.googleContrast.whatGoogleSearchReturns.map((point, pidx) => (
                      <div key={pidx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold shrink-0">!</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FULL WRITTEN CONTENT */}
          {activeStudioTab === 'content' && (
            <div className="space-y-6">
              {/* Content Header & Reading View Switcher */}
              <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                    <span className="text-indigo-400 font-semibold">{generatedContent.channel}</span>
                    <span>·</span>
                    <span>{generatedContent.format}</span>
                    <span>·</span>
                    <span className="font-mono">{generatedContent.estimatedReadTime}</span>
                    <span>·</span>
                    <span className="font-mono">{generatedContent.wordCount} words</span>
                    <span>·</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {generatedContent.googleContrast.informationGainScore}% Info Gain vs Google
                    </span>
                  </div>

                  {/* Reading View Filter */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800 p-0.5 text-xs">
                      <button
                        type="button"
                        onClick={() => setReadingFilter('all')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                          readingFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Full Prose
                      </button>
                      <button
                        type="button"
                        onClick={() => setReadingFilter('brief')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                          readingFilter === 'brief' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        60s TL;DR Only
                      </button>
                      <button
                        type="button"
                        onClick={() => setReadingFilter('code')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                          readingFilter === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Code & Configs
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(generatedContent.fullMarkdownContent, 'full-content')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-950 border border-slate-800 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedKey === 'full-content' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-medium">Copied Full Text!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Content</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <h1 className="text-2xl font-extrabold text-white tracking-tight leading-snug">
                    {generatedContent.title}
                  </h1>
                  <p className="text-sm text-slate-400 mt-1 italic">
                    {generatedContent.subtitle}
                  </p>
                </div>

                {/* Quick Google Contrast Summary Strip */}
                <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-slate-300">
                      <strong className="text-amber-300">Why this beats Google:</strong> {generatedContent.googleContrast.ourProprietaryMoatAngle}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveStudioTab('google-contrast')}
                    className="text-amber-400 hover:text-amber-300 font-medium text-[11px] underline cursor-pointer"
                  >
                    View Side-by-Side Matrix →
                  </button>
                </div>

                {/* Integrated Originality & Likes Forecast Panel */}
                <div className="pt-2">
                  <OriginalityAndReachPanel
                    originality={generatedContent.originalityReport}
                    reach={generatedContent.reachAnalysis}
                    channelName={generatedContent.channel}
                  />
                </div>

                {/* 60s TL;DR View */}
                {readingFilter === 'brief' && (
                  <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                      <Zap className="w-4 h-4" />
                      <span>High-Efficiency 60-Second Executive Summary</span>
                    </div>
                    <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                      <p className="text-sm text-white font-medium">
                        {generatedContent.googleContrast.executiveEfficiencyBrief.oneMinuteSummary}
                      </p>
                      <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-300">
                        <strong>Action Item:</strong> {generatedContent.googleContrast.executiveEfficiencyBrief.immediateActionItem}
                      </div>
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                        <strong>Differentiator:</strong> {generatedContent.googleContrast.executiveEfficiencyBrief.coreDifferentiator}
                      </div>
                    </div>
                  </div>
                )}

                {/* Code & Configs Only View */}
                {readingFilter === 'code' && (
                  <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      <Code className="w-4 h-4" />
                      <span>Production Blueprints & Verified Configurations</span>
                    </div>
                    {generatedContent.fullMarkdownContent.split('\n\n')
                      .filter(b => b.startsWith('```'))
                      .map((block, cidx) => (
                        <div key={cidx} className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                            <span>Snippet #{cidx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(block.replace(/```[a-z]*\n?/g, ''), `code-${cidx}`)}
                              className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 cursor-pointer"
                            >
                              {copiedKey === `code-${cidx}` ? 'Copied Code!' : 'Copy Code'}
                            </button>
                          </div>
                          <pre className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
                            <code>{block.replace(/```[a-z]*\n?/g, '')}</code>
                          </pre>
                        </div>
                      ))}
                  </div>
                )}

                {/* Rendered Full Prose Content Viewer */}
                {readingFilter === 'all' && (
                  <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed text-sm space-y-4">
                    <div className="prose prose-invert max-w-none space-y-4">
                      {generatedContent.fullMarkdownContent.split('\n\n').map((block, idx) => {
                        if (block.startsWith('# ')) {
                          return <h1 key={idx} className="text-xl font-bold text-white border-b border-slate-800 pb-2">{block.replace('# ', '')}</h1>;
                        }
                        if (block.startsWith('## ')) {
                          return <h2 key={idx} className="text-lg font-bold text-indigo-300 mt-6 mb-2">{block.replace('## ', '')}</h2>;
                        }
                        if (block.startsWith('### ')) {
                          return <h3 key={idx} className="text-base font-semibold text-slate-200 mt-4 mb-1">{block.replace('### ', '')}</h3>;
                        }
                        if (block.startsWith('```')) {
                          return (
                            <div key={idx} className="relative group my-3">
                              <button
                                type="button"
                                onClick={() => handleCopy(block.replace(/```[a-z]*\n?/g, ''), `code-inline-${idx}`)}
                                className="absolute top-2 right-2 px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                              >
                                {copiedKey === `code-inline-${idx}` ? 'Copied!' : 'Copy Config'}
                              </button>
                              <pre className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
                                <code>{block.replace(/```[a-z]*\n?/g, '')}</code>
                              </pre>
                            </div>
                          );
                        }
                        if (block.startsWith('- ') || block.startsWith('* ')) {
                          return (
                            <ul key={idx} className="space-y-1.5 my-2 pl-4 list-disc text-slate-300">
                              {block.split('\n').map((li, lidx) => (
                                <li key={lidx}>{li.replace(/^[-*]\s+/, '')}</li>
                              ))}
                            </ul>
                          );
                        }
                        if (block.startsWith('|')) {
                          return (
                            <div key={idx} className="overflow-x-auto my-3">
                              <table className="w-full text-xs text-left border-collapse border border-slate-800">
                                <tbody>
                                  {block.split('\n').filter(r => !r.includes('---')).map((row, ridx) => (
                                    <tr key={ridx} className={ridx === 0 ? 'bg-slate-900 font-semibold text-white' : 'border-t border-slate-800/60'}>
                                      {row.split('|').filter(c => c.trim().length > 0).map((cell, cidx) => (
                                        <td key={cidx} className="p-2 border-r border-slate-800/60">{cell.trim()}</td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          );
                        }
                        return <p key={idx} className="text-slate-300 leading-relaxed">{block}</p>;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: VIDEO CREATION MASTERCLASS & STORYBOARD */}
          {activeStudioTab === 'video' && (
            <div className="space-y-6">
              {/* Video Production Setup Overview */}
              <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">
                      <Film className="w-4 h-4" />
                      <span>Video Production Blueprint (Pattern-Interrupt the Google Consensus)</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {generatedContent.videoTutorial.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsTeleprompterOpen(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-sm cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Open Teleprompter Rehearsal View</span>
                    </button>
                  </div>
                </div>

                {/* Specs Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider">Format & Aspect Ratio</div>
                    <div className="text-sm font-semibold text-white mt-1">
                      {generatedContent.videoTutorial.aspectRatio}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Target duration: {generatedContent.videoTutorial.targetDuration}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider">Voice Tone & Delivery</div>
                    <div className="text-sm font-semibold text-rose-300 mt-1">
                      {generatedContent.videoTutorial.audioStyle.voiceTone}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Zero corporate monotone
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider">Background Music Vibe</div>
                    <div className="text-sm font-semibold text-indigo-300 mt-1">
                      {generatedContent.videoTutorial.audioStyle.backgroundMusicVibe}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Ducking: -22dB under speech
                    </div>
                  </div>
                </div>

                {/* Equipment Checklist */}
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-xs font-semibold text-slate-200 mb-2.5 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                    <span>Filming Setup & Pre-Flight Checklist</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    {generatedContent.videoTutorial.equipmentChecklist.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scene-by-Scene Storyboard */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Video className="w-4 h-4 text-rose-400" />
                    <span>Scene-by-Scene Storyboard & Voiceover Scripts</span>
                  </h4>
                  <span className="text-xs text-slate-400">{generatedContent.videoTutorial.storyboard.length} Visual Sequence Cues</span>
                </div>

                <div className="space-y-3">
                  {generatedContent.videoTutorial.storyboard.map((scene, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-600/20 text-rose-300 border border-rose-500/30">
                            Scene {scene.sceneNumber}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            {scene.timeRange}
                          </span>
                          <span className="text-xs font-semibold text-white">
                            {scene.phase}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <span>Overlay: {scene.screenOverlayText}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Visual & Camera Direction */}
                        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Visual Shot & B-Roll Cue</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {scene.visualDirection}
                          </p>
                          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                            {scene.bRollKeywords.map((tag, tidx) => (
                              <span key={tidx} className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-400 border border-slate-800">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Exact Voiceover Script & Pacing */}
                        <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-[11px] font-semibold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                              <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                              <span>Word-for-Word Voiceover Line</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy(scene.voiceoverScript, `voiceover-${idx}`)}
                              className="text-[10px] text-slate-400 hover:text-white"
                            >
                              {copiedKey === `voiceover-${idx}` ? 'Copied!' : 'Copy Line'}
                            </button>
                          </div>
                          <p className="text-xs text-white font-medium leading-relaxed italic">
                            "{scene.voiceoverScript}"
                          </p>
                          <div className="text-[11px] text-rose-300/80 mt-2 font-mono">
                            ⚡ Pacing: {scene.pacingNotes}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 15-Minute Video Editing Masterclass Tutorial */}
              <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <span>15-Minute Video Editing Masterclass (CapCut / Premiere / DaVinci)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {generatedContent.videoTutorial.editingMasterclassSteps.map((step) => (
                    <div key={step.step} className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 text-xs font-bold flex items-center justify-center">
                          {step.step}
                        </span>
                        <h5 className="text-xs font-bold text-white">{step.title}</h5>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {step.description}
                      </p>
                      <div className="text-[11px] text-amber-300 font-mono bg-amber-500/10 p-2 rounded border border-amber-500/20">
                        💡 Pro Tip: {step.proTip}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SOCIAL POST & CAROUSEL DISTRIBUTION GUIDE */}
          {activeStudioTab === 'post' && (
            <div className="space-y-6">
              {/* Formatted Post Text Ready to Copy */}
              <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                      <Share2 className="w-4 h-4" />
                      <span>Ready-to-Publish Formatted Social Post</span>
                    </div>
                    <h3 className="text-base font-bold text-white">
                      Optimized for {generatedContent.postTutorial.platform} Algorithm
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(generatedContent.postTutorial.formattedPostText, 'social-post')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm cursor-pointer"
                  >
                    {copiedKey === 'social-post' ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Formatted Post</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-wrap select-all">
                  {generatedContent.postTutorial.formattedPostText}
                </div>
              </div>

              {/* 6-Slide Carousel Blueprint */}
              <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <span>6-Slide Carousel Document Blueprint</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Export these slides into Canva or Figma as a PDF carousel document for 3.4x higher reach
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const carouselMarkdown = generatedContent.postTutorial.slideDeckCarousel
                        .map(s => `## Slide ${s.slideNumber}: ${s.headline}\n${s.contentBulletPoints.map(b => `- ${b}`).join('\n')}\n*Design hint: ${s.visualLayoutHint}*\n`)
                        .join('\n---\n\n');
                      handleCopy(carouselMarkdown, 'carousel-copy');
                    }}
                    className="text-xs text-indigo-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer"
                  >
                    {copiedKey === 'carousel-copy' ? 'Copied All Slides!' : 'Copy All Slides'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {generatedContent.postTutorial.slideDeckCarousel.map((slide) => (
                    <div
                      key={slide.slideNumber}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-indigo-400 mb-2">
                          <span className="font-bold">SLIDE {slide.slideNumber}</span>
                          <span className="text-slate-500">PDF Page {slide.slideNumber}/6</span>
                        </div>
                        <h5 className="text-xs font-bold text-white leading-snug">
                          {slide.headline}
                        </h5>
                        <ul className="space-y-1.5 mt-2.5 text-xs text-slate-300">
                          {slide.contentBulletPoints.map((point, pidx) => (
                            <li key={pidx} className="flex items-start gap-1.5">
                              <span className="text-indigo-400">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 italic">
                        🎨 {slide.visualLayoutHint}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Algorithm Playbook: How to Get Maximum Likes and Reach */}
              <div className="p-6 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-300 uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Algorithm Playbook: How to Maximize Likes & Comments</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-semibold text-emerald-300">The 1st-Hour Velocity Protocol</span>
                    <p className="text-slate-300 leading-relaxed">
                      {generatedContent.postTutorial.algorithmPlaybook.firstHourStrategy}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-semibold text-emerald-300">External Link Placement Rule</span>
                    <p className="text-slate-300 leading-relaxed">
                      {generatedContent.postTutorial.algorithmPlaybook.linkPlacementRule}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-semibold text-emerald-300">Best Distribution Window</span>
                    <p className="text-slate-300 leading-relaxed font-mono">
                      {generatedContent.postTutorial.algorithmPlaybook.bestPostingWindow}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-semibold text-emerald-300">Engagement-Driver Closing Hook</span>
                    <p className="text-slate-300 leading-relaxed italic">
                      "{generatedContent.postTutorial.algorithmPlaybook.engagementBoosterQuestion}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TELEPROMPTER FULLSCREEN MODAL */}
      {isTeleprompterOpen && generatedContent && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col p-6 animate-fadeIn">
          {/* Teleprompter Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-rose-600 text-white font-mono text-xs font-bold uppercase tracking-wider">
                Teleprompter Live Studio
              </span>
              <span className="text-sm font-semibold text-slate-300 truncate max-w-md">
                {generatedContent.title}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Speed Controller */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Speed:</span>
                <input
                  type="range"
                  min="15"
                  max="60"
                  value={teleprompterSpeed}
                  onChange={(e) => setTeleprompterSpeed(parseInt(e.target.value))}
                  className="w-24 accent-rose-500 cursor-pointer"
                />
                <span className="font-mono">{teleprompterSpeed}s</span>
              </div>

              {/* Play/Pause */}
              <button
                type="button"
                onClick={() => setIsTeleprompterPlaying(!isTeleprompterPlaying)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                {isTeleprompterPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                <span>{isTeleprompterPlaying ? 'Pause Scroll' : 'Start Auto-Scroll'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsTeleprompterPlaying(false);
                  setIsTeleprompterOpen(false);
                }}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer text-xs px-3 py-1.5"
              >
                ✕ Close
              </button>
            </div>
          </div>

          {/* Scrolling Script Canvas */}
          <div 
            ref={teleprompterScrollRef}
            className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full px-4 py-8 space-y-12 text-center select-none"
          >
            {generatedContent.videoTutorial.storyboard.map((scene, idx) => (
              <div key={idx} className="space-y-3 border-b border-slate-900 pb-8">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-rose-400 uppercase tracking-widest bg-rose-950/40 px-3 py-1 rounded-full border border-rose-500/20">
                  <span>Scene {scene.sceneNumber}</span>
                  <span>·</span>
                  <span>{scene.timeRange}</span>
                  <span>·</span>
                  <span>{scene.phase}</span>
                </div>

                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-relaxed font-sans max-w-3xl mx-auto tracking-wide">
                  "{scene.voiceoverScript}"
                </div>

                <div className="text-sm text-slate-400 font-mono">
                  Visual Direction: {scene.visualDirection}
                </div>
                <div className="text-xs text-rose-400 font-mono">
                  Overlay Text: {scene.screenOverlayText}
                </div>
              </div>
            ))}

            <div className="pt-8 text-slate-500 text-sm font-mono">
              — End of Voiceover Script —
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
