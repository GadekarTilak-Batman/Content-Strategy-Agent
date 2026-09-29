import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink, 
  Share2, 
  Eye, 
  TrendingUp,
  AlertCircle,
  Plus,
  RefreshCw,
  Send,
  Heart,
  ShieldCheck,
  Zap,
  Flame,
  Clock
} from 'lucide-react';
import { ContentItem, ContentChannel, FunnelStage, PerformanceTier, RepurposedIdea, ContentOriginalityReport, ContentReachAnalysis } from '../types';
import { generateRepurposedIdeas, analyzeContentOriginalityAndReach, ContentAuditResult } from '../services/aiService';
import { OriginalityAndReachPanel } from './OriginalityAndReachPanel';

interface ContentRepositoryProps {
  items: ContentItem[];
  onAddItem: (newItem: ContentItem) => void;
  onSendIdeaToBrief: (idea: RepurposedIdea, sourceItem: ContentItem) => void;
}

export const ContentRepository: React.FC<ContentRepositoryProps> = ({
  items,
  onAddItem,
  onSendIdeaToBrief
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'views' | 'engagement' | 'conversions' | 'originality' | 'likes' | 'date'>('views');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Selected item for drawer
  const [activeItem, setActiveItem] = useState<ContentItem | null>(null);
  const [isGeneratingRemix, setIsGeneratingRemix] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Post Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newChannel, setNewChannel] = useState<ContentChannel>('LinkedIn');
  const [newStage, setNewStage] = useState<FunnelStage>('TOFU');
  const [newPersona, setNewPersona] = useState('VP of Engineering / Growth Lead');
  const [newViews, setNewViews] = useState('15000');
  const [newEngagements, setNewEngagements] = useState('1200');
  const [newTakeaways, setNewTakeaways] = useState('Key insight on engineering workflows and performance benchmarks.');
  
  // Modal live audit state
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<ContentAuditResult | null>(null);

  // Filter and sort items
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetPersona.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesChannel = selectedChannel === 'all' || item.channel === selectedChannel;
    const matchesStage = selectedStage === 'all' || item.funnelStage === selectedStage;
    const matchesTier = selectedTier === 'all' || item.performanceTier === selectedTier;

    return matchesSearch && matchesChannel && matchesStage && matchesTier;
  }).sort((a, b) => {
    let diff = 0;
    if (sortBy === 'date') {
      diff = new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
    } else if (sortBy === 'views') {
      diff = b.metrics.views - a.metrics.views;
    } else if (sortBy === 'engagement') {
      diff = b.metrics.engagementRatePct - a.metrics.engagementRatePct;
    } else if (sortBy === 'conversions') {
      diff = b.metrics.conversions - a.metrics.conversions;
    } else if (sortBy === 'originality') {
      const origA = a.originalityReport?.overallOriginalityScore || 75;
      const origB = b.originalityReport?.overallOriginalityScore || 75;
      diff = origB - origA;
    } else if (sortBy === 'likes') {
      const likesA = a.reachAnalysis?.predictedLikes.average || a.metrics.engagements;
      const likesB = b.reachAnalysis?.predictedLikes.average || b.metrics.engagements;
      diff = likesB - likesA;
    }
    return sortOrder === 'desc' ? diff : -diff;
  });

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTriggerRemix = async () => {
    if (!activeItem) return;
    setIsGeneratingRemix(true);
    try {
      const ideas = await generateRepurposedIdeas(activeItem);
      const updatedItem = { ...activeItem, repurposedIdeas: ideas };
      setActiveItem(updatedItem);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingRemix(false);
    }
  };

  const handleRunAudit = async () => {
    if (!newTitle.trim()) return;
    setIsAuditing(true);
    try {
      const result = await analyzeContentOriginalityAndReach(
        {
          title: newTitle,
          topic: newTopic || 'Enterprise Growth & Tech',
          channel: newChannel,
          stage: newStage,
          bodyOrTakeaways: newTakeaways,
          targetPersona: newPersona
        },
        items
      );
      setAuditResult(result);
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTopic.trim()) return;

    let finalAudit = auditResult;
    if (!finalAudit) {
      setIsAuditing(true);
      try {
        finalAudit = await analyzeContentOriginalityAndReach(
          {
            title: newTitle,
            topic: newTopic,
            channel: newChannel,
            stage: newStage,
            bodyOrTakeaways: newTakeaways,
            targetPersona: newPersona
          },
          items
        );
      } catch (err) {
        console.error(err);
      } finally {
        setIsAuditing(false);
      }
    }

    const viewsNum = parseInt(newViews, 10) || 15000;
    const engNum = parseInt(newEngagements, 10) || 1200;
    const engRate = viewsNum > 0 ? Number(((engNum / viewsNum) * 100).toFixed(1)) : 5.0;

    const newItem: ContentItem = {
      id: `custom-post-${Date.now()}`,
      title: newTitle.trim(),
      topic: newTopic.trim(),
      channel: newChannel,
      format: newStage === 'TOFU' ? 'Thought Leadership' : newStage === 'MOFU' ? 'Deep-dive Tutorial' : 'Customer Story',
      funnelStage: newStage,
      performanceTier: engRate >= 7.5 ? 'High Performer' : engRate >= 4.5 ? 'Steady' : 'Underperformer',
      publishedDate: new Date().toISOString().split('T')[0],
      targetPersona: newPersona,
      metrics: {
        views: viewsNum,
        engagements: engNum,
        shares: Math.round(engNum * 0.2),
        conversions: Math.round(viewsNum * 0.008),
        bounceRatePct: 36.5,
        engagementRatePct: engRate,
      },
      keyTakeaways: newTakeaways.split('\n').filter(t => t.trim().length > 0),
      aiAnalysis: {
        verdict: 'Logged successfully into memory bank.',
        whyItWorkedOrFailed: engRate >= 7 ? 'Strong hook and audience resonance.' : 'Standard baseline distribution.',
        audienceSignal: 'Engaged with technical breakdown.',
        fatigueRisk: 'Low'
      },
      originalityReport: finalAudit?.originalityReport,
      reachAnalysis: finalAudit?.reachAnalysis
    };

    onAddItem(newItem);
    setShowAddModal(false);
    setNewTitle('');
    setNewTopic('');
    setAuditResult(null);
  };

  return (
    <section className="space-y-4">
      {/* Control Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memory by topic, title, or target persona..."
            className="w-full rounded-lg bg-slate-950 py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 border border-slate-800 focus:border-indigo-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Channel Filter */}
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="rounded-lg bg-slate-950 px-2.5 py-1.5 text-xs text-slate-300 border border-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="all">All Channels</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Technical Blog">Technical Blog</option>
            <option value="Substack Newsletter">Substack Newsletter</option>
            <option value="Twitter/X">Twitter/X</option>
            <option value="Case Study">Case Study</option>
            <option value="YouTube / Video">YouTube / Video</option>
          </select>

          {/* Funnel Stage Filter */}
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="rounded-lg bg-slate-950 px-2.5 py-1.5 text-xs text-slate-300 border border-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="all">All Stages</option>
            <option value="TOFU">TOFU (Awareness)</option>
            <option value="MOFU">MOFU (Evaluation)</option>
            <option value="BOFU">BOFU (Decision)</option>
          </select>

          {/* Performance Tier */}
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="rounded-lg bg-slate-950 px-2.5 py-1.5 text-xs text-slate-300 border border-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="all">All Tiers</option>
            <option value="High Performer">High Performer</option>
            <option value="Steady">Steady</option>
            <option value="Underperformer">Underperformer</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800 px-2 py-1">
            <span className="text-[11px] text-slate-500 mr-1.5">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="views" className="bg-slate-900 text-white">Views</option>
              <option value="originality" className="bg-slate-900 text-white">Originality Score</option>
              <option value="likes" className="bg-slate-900 text-white">Predicted Likes</option>
              <option value="engagement" className="bg-slate-900 text-white">Engagement Rate</option>
              <option value="conversions" className="bg-slate-900 text-white">Conversions</option>
              <option value="date" className="bg-slate-900 text-white">Date</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="ml-1 text-slate-400 hover:text-white"
              title="Toggle sort direction"
            >
              <ArrowUpDown className="h-3 w-3" />
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 transition-colors shadow-sm whitespace-nowrap cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Post & Audit</span>
          </button>
        </div>
      </div>

      {/* Content Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-medium text-slate-400 uppercase tracking-wider bg-slate-950/60">
                <th className="py-3 px-4">Content Title & Topic</th>
                <th className="py-3 px-3">Channel / Stage</th>
                <th className="py-3 px-3 text-center">Originality</th>
                <th className="py-3 px-3 text-right">Predicted Likes</th>
                <th className="py-3 px-3 text-right">Views</th>
                <th className="py-3 px-3 text-right">Engagement</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium text-slate-300">No matching content found</p>
                    <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search query.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => {
                  const isHigh = item.performanceTier === 'High Performer';
                  const isUnder = item.performanceTier === 'Underperformer';
                  const origScore = item.originalityReport?.overallOriginalityScore ?? 84;
                  const predictedLikes = item.reachAnalysis?.predictedLikes.average ?? item.metrics.engagements;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setActiveItem(item)}
                      className="group cursor-pointer hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Title & Topic */}
                      <td className="py-3.5 px-4 max-w-md">
                        <div className="font-medium text-slate-200 group-hover:text-indigo-300 transition-colors line-clamp-1">
                          {item.title}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                          <span className="text-slate-400">{item.topic}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.publishedDate}</span>
                        </div>
                      </td>

                      {/* Channel & Funnel Stage */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="text-slate-300 font-medium">{item.channel}</div>
                        <div className="text-[11px] text-slate-500">{item.funnelStage} · {item.format}</div>
                      </td>

                      {/* Originality Score */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                          origScore >= 80 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                            : origScore >= 60 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}>
                          <ShieldCheck className="w-3 h-3 shrink-0" />
                          <span>{origScore}%</span>
                        </span>
                      </td>

                      {/* Predicted Likes */}
                      <td className="py-3.5 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1 text-rose-300 font-semibold">
                          <Heart className="w-3 h-3 text-rose-400 fill-rose-400/30 shrink-0" />
                          <span>{predictedLikes.toLocaleString()}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {item.reachAnalysis ? `~${item.reachAnalysis.predictedLikes.max.toLocaleString()} max` : 'Actual'}
                        </div>
                      </td>

                      {/* Views */}
                      <td className="py-3.5 px-3 text-right font-mono tabular-nums text-slate-300">
                        {item.metrics.views.toLocaleString()}
                      </td>

                      {/* Engagement */}
                      <td className="py-3.5 px-3 text-right font-mono tabular-nums">
                        <span className={isHigh ? 'text-emerald-400 font-medium' : isUnder ? 'text-amber-400' : 'text-slate-300'}>
                          {item.metrics.engagementRatePct}%
                        </span>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {item.metrics.engagements.toLocaleString()} total
                        </div>
                      </td>

                      {/* Performance Tier */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                          isHigh ? 'text-emerald-400' : isUnder ? 'text-amber-400' : 'text-slate-400'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            isHigh ? 'bg-emerald-400' : isUnder ? 'bg-amber-400' : 'bg-slate-400'
                          }`} />
                          {item.performanceTier}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveItem(item);
                          }}
                          className="text-xs font-medium text-indigo-400 hover:text-indigo-300 underline decoration-indigo-400/40 hover:decoration-indigo-300"
                        >
                          Deep-dive
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL DRAWER / SLIDE-OVER MODAL */}
      {activeItem && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end">
          <div 
            className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full overflow-y-auto p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                    <span className="text-indigo-400 font-medium">{activeItem.channel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeItem.funnelStage} Funnel</span>
                    <span aria-hidden="true">·</span>
                    <span>Published {activeItem.publishedDate}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
                    {activeItem.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Target Persona: <span className="text-slate-300">{activeItem.targetPersona}</span>
                  </p>
                </div>

                <button
                  onClick={() => setActiveItem(null)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[11px] text-slate-400 mb-0.5">Total Views</div>
                  <div className="text-lg font-bold text-white font-mono tabular-nums">
                    {activeItem.metrics.views.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[11px] text-slate-400 mb-0.5">Engagement Rate</div>
                  <div className="text-lg font-bold text-emerald-400 font-mono tabular-nums">
                    {activeItem.metrics.engagementRatePct}%
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[11px] text-slate-400 mb-0.5">Conversions / Leads</div>
                  <div className="text-lg font-bold text-indigo-400 font-mono tabular-nums">
                    {activeItem.metrics.conversions}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[11px] text-slate-400 mb-0.5">Bounce Rate</div>
                  <div className="text-lg font-bold text-slate-300 font-mono tabular-nums">
                    {activeItem.metrics.bounceRatePct}%
                  </div>
                </div>
              </div>

              {/* Key Takeaways */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                  Original Core Takeaways
                </h4>
                <ul className="space-y-2 text-xs text-slate-300 bg-slate-950/70 p-4 rounded-lg border border-slate-800/80">
                  {activeItem.keyTakeaways.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold">·</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Originality & Reach Intelligence Audit Panel */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span>Originality & Predicted Reach Analysis</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">Algorithmic Forecasting</span>
                </div>
                <OriginalityAndReachPanel
                  originality={activeItem.originalityReport}
                  reach={activeItem.reachAnalysis}
                  channelName={activeItem.channel}
                />
              </div>

              {/* AI Strategic Analysis */}
              <div className="mb-6 rounded-xl border border-indigo-950/60 bg-indigo-950/20 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 mb-2">
                  <Sparkles className="h-4 w-4" />
                  <span>AI Memory Engine Diagnosis</span>
                </div>
                <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                  {activeItem.aiAnalysis.whyItWorkedOrFailed}
                </p>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-indigo-900/40 flex items-center justify-between">
                  <span>Audience Signal: <strong className="text-slate-300 font-normal">{activeItem.aiAnalysis.audienceSignal}</strong></span>
                  <span>Fatigue Risk: <strong className={activeItem.aiAnalysis.fatigueRisk === 'High' ? 'text-amber-400' : 'text-emerald-400'}>{activeItem.aiAnalysis.fatigueRisk}</strong></span>
                </div>
              </div>

              {/* Content Remix Engine */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                      Content Remix Engine
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Repurpose this post’s verified findings into 3 new multi-channel formats
                    </p>
                  </div>

                  <button
                    onClick={handleTriggerRemix}
                    disabled={isGeneratingRemix}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-sm"
                  >
                    <RefreshCw className={`h-3 w-3 ${isGeneratingRemix ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingRemix ? 'Generating...' : 'Auto-Generate 3 Remixes'}</span>
                  </button>
                </div>

                {/* Repurposed Ideas List */}
                <div className="space-y-2.5">
                  {(!activeItem.repurposedIdeas || activeItem.repurposedIdeas.length === 0) ? (
                    <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80 text-center">
                      <p className="text-xs text-slate-400">
                        Click <strong className="text-indigo-400 font-medium">Auto-Generate 3 Remixes</strong> to produce derivative assets for LinkedIn, Newsletters, or Case Studies.
                      </p>
                    </div>
                  ) : (
                    activeItem.repurposedIdeas.map(idea => (
                      <div
                        key={idea.id}
                        className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400 mb-1">
                          <span className="font-semibold text-indigo-300">{idea.targetChannel}</span>
                          <span className="text-emerald-400 font-mono">{idea.estimatedLift}</span>
                        </div>
                        <div className="text-xs font-medium text-slate-200 mb-1.5">
                          {idea.proposedHeadline}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                          {idea.angleRationale}
                        </p>
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60 justify-end">
                          <button
                            onClick={() => handleCopyText(idea.proposedHeadline, idea.id)}
                            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-slate-800"
                          >
                            {copiedId === idea.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                            <span>{copiedId === idea.id ? 'Copied' : 'Copy Headline'}</span>
                          </button>
                          <button
                            onClick={() => {
                              onSendIdeaToBrief(idea, activeItem);
                              setActiveItem(null);
                            }}
                            className="flex items-center gap-1 text-[11px] text-indigo-300 hover:text-white px-2.5 py-1 rounded bg-indigo-950/70 border border-indigo-800/60 hover:bg-indigo-900 transition-colors"
                          >
                            <Send className="h-3 w-3" />
                            <span>Send to Strategy Generator</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Bottom Close */}
            <div className="pt-6 border-t border-slate-800 mt-6 flex justify-end">
              <button
                onClick={() => setActiveItem(null)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW POST MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 sticky top-0 bg-slate-900 z-10">
              <h3 className="text-base font-semibold text-white">Log Published Content to Memory</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Post Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. How We Cut Vector Database Latency by 40%"
                  className="w-full rounded-lg bg-slate-950 px-3 py-2 text-xs text-white border border-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Channel
                  </label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value as ContentChannel)}
                    className="w-full rounded-lg bg-slate-950 px-3 py-2 text-xs text-white border border-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Technical Blog">Technical Blog</option>
                    <option value="Substack Newsletter">Substack Newsletter</option>
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
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as FunnelStage)}
                    className="w-full rounded-lg bg-slate-950 px-3 py-2 text-xs text-white border border-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="TOFU">TOFU (Awareness)</option>
                    <option value="MOFU">MOFU (Evaluation)</option>
                    <option value="BOFU">BOFU (Decision)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Topic Category
                </label>
                <input
                  type="text"
                  required
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g. AI Agents & Workflow Orchestration"
                  className="w-full rounded-lg bg-slate-950 px-3 py-2 text-xs text-white border border-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Total Views
                  </label>
                  <input
                    type="number"
                    value={newViews}
                    onChange={(e) => setNewViews(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 px-3 py-2 text-xs text-white border border-slate-800 focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Total Engagements
                  </label>
                  <input
                    type="number"
                    value={newEngagements}
                    onChange={(e) => setNewEngagements(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 px-3 py-2 text-xs text-white border border-slate-800 focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Key Takeaways or Draft Summary (one per line)
                </label>
                <textarea
                  rows={3}
                  value={newTakeaways}
                  onChange={(e) => setNewTakeaways(e.target.value)}
                  placeholder="Outline key metrics, arguments, and failure modes..."
                  className="w-full rounded-lg bg-slate-950 px-3 py-2 text-xs text-white border border-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Instant Audit & Predict Trigger */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>AI Originality & Likes Prediction</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Calculates uniqueness score, library cannibalization risk, and projected likes.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRunAudit}
                  disabled={isAuditing || !newTitle.trim()}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ml-3"
                >
                  <Zap className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : 'text-amber-400'}`} />
                  <span>{isAuditing ? 'Auditing...' : auditResult ? 'Re-Audit Draft' : 'Audit Originality & Likes'}</span>
                </button>
              </div>

              {/* Live Audit Report Preview if Available */}
              {auditResult && (
                <div className="mt-3">
                  <OriginalityAndReachPanel
                    originality={auditResult.originalityReport}
                    reach={auditResult.reachAnalysis}
                    channelName={newChannel}
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setAuditResult(null);
                  }}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAuditing}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save to Content Memory</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
