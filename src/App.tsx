import { useState, useMemo } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  OverviewMetrics 
} from './components/OverviewMetrics';
import { 
  PerformanceChart 
} from './components/PerformanceChart';
import { 
  ContentRepository 
} from './components/ContentRepository';
import { 
  TopicGapFinder 
} from './components/TopicGapFinder';
import { 
  BrandVoiceTrainer 
} from './components/BrandVoiceTrainer';
import { 
  StrategyGenerator 
} from './components/StrategyGenerator';
import { 
  ContentAndVideoStudio 
} from './components/ContentAndVideoStudio';
import { 
  OriginalityAndReachPanel 
} from './components/OriginalityAndReachPanel';

import { 
  INITIAL_CONTENT_ITEMS, 
  AI_GAP_RECOMMENDATIONS 
} from './data/mockData';
import { 
  ContentItem, 
  FunnelStage, 
  RepurposedIdea 
} from './types';
import { 
  analyzeContentOriginalityAndReach, 
  ContentAuditResult 
} from './services/aiService';

import { 
  Plus, 
  Check, 
  X, 
  Calendar,
  Sparkles,
  Zap,
  ShieldCheck,
  Heart,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'repository' | 'gap-finder' | 'brand-voice' | 'strategy-brief'>('overview');
  const [contentItems, setContentItems] = useState<ContentItem[]>(INITIAL_CONTENT_ITEMS);
  const [gaps] = useState(AI_GAP_RECOMMENDATIONS);
  
  // Strategy brief prefill state
  const [prefilledTopic, setPrefilledTopic] = useState('');
  const [prefilledStage, setPrefilledStage] = useState<FunnelStage>('TOFU');
  const [prefilledAngle, setPrefilledAngle] = useState('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Content Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newChannel, setNewChannel] = useState<any>('LinkedIn');
  const [newFormat, setNewFormat] = useState<any>('Deep-dive Tutorial');
  const [newStage, setNewStage] = useState<FunnelStage>('MOFU');
  const [newTier, setNewTier] = useState<any>('High Performer');
  const [newPersona, setNewPersona] = useState('VP of Engineering / Lead ML Architect');
  const [newViews, setNewViews] = useState('34200');
  const [newEngagements, setNewEngagements] = useState('2900');
  const [newConversions, setNewConversions] = useState('240');
  const [newTakeaways, setNewTakeaways] = useState('Production Kubernetes latency benchmarks;\nCost attribution reduced AWS burn by $84k/month;\nFailure mode post-mortem with actual Helm configuration.');

  // Live Audit in Modal
  const [isAuditing, setIsAuditing] = useState(false);
  const [modalAuditResult, setModalAuditResult] = useState<ContentAuditResult | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleAddItem = (newItem: ContentItem) => {
    setContentItems(prev => [newItem, ...prev]);
    const origPct = newItem.originalityReport?.overallOriginalityScore || 88;
    const likes = newItem.reachAnalysis?.predictedLikes.average || newItem.metrics.engagements;
    showToast(`✓ Indexed "${newItem.title.slice(0, 26)}..." into memory: ${origPct}% Originality · ~${likes.toLocaleString()} Predicted Likes`);
  };

  const handleGenerateBriefFromTopic = (topic: string, stage: FunnelStage, suggestedAngle?: string) => {
    setPrefilledTopic(topic);
    setPrefilledStage(stage);
    setPrefilledAngle(suggestedAngle || '');
    setActiveTab('strategy-brief');
    showToast(`Pre-loaded topic "${topic.slice(0, 30)}..." into Content & Video Studio`);
  };

  const handleSendIdeaToBrief = (idea: RepurposedIdea, sourceItem: ContentItem) => {
    setPrefilledTopic(sourceItem.topic);
    setPrefilledStage(sourceItem.funnelStage);
    setPrefilledAngle(`${idea.format} on ${idea.targetChannel}: ${idea.proposedHeadline}`);
    setActiveTab('strategy-brief');
    showToast(`Remix angle routed to Content & Video Studio`);
  };

  const handleQuickGenerateBrief = () => {
    setActiveTab('strategy-brief');
  };

  const handleRunModalAudit = async () => {
    if (!newTitle.trim()) return;
    setIsAuditing(true);
    try {
      const result = await analyzeContentOriginalityAndReach(
        {
          title: newTitle,
          topic: newTopic || 'Enterprise Infrastructure',
          channel: newChannel,
          stage: newStage,
          bodyOrTakeaways: newTakeaways,
          targetPersona: newPersona
        },
        contentItems
      );
      setModalAuditResult(result);
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleSaveModalPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTopic.trim()) return;

    let audit = modalAuditResult;
    if (!audit) {
      setIsAuditing(true);
      try {
        audit = await analyzeContentOriginalityAndReach(
          {
            title: newTitle,
            topic: newTopic,
            channel: newChannel,
            stage: newStage,
            bodyOrTakeaways: newTakeaways,
            targetPersona: newPersona
          },
          contentItems
        );
      } catch (err) {
        console.error(err);
      } finally {
        setIsAuditing(false);
      }
    }

    const views = parseInt(newViews) || 18000;
    const engagements = parseInt(newEngagements) || 1400;
    const conversions = parseInt(newConversions) || 120;
    const engRate = views > 0 ? parseFloat(((engagements / views) * 100).toFixed(1)) : 5.0;

    const newItem: ContentItem = {
      id: `post-${Date.now().toString().slice(-4)}`,
      title: newTitle.trim(),
      topic: newTopic.trim(),
      channel: newChannel,
      format: newFormat,
      funnelStage: newStage,
      performanceTier: newTier,
      publishedDate: new Date().toISOString().split('T')[0],
      targetPersona: newPersona,
      metrics: {
        views,
        engagements,
        shares: Math.floor(engagements * 0.24),
        conversions,
        bounceRatePct: newTier === 'High Performer' ? 32.4 : 48.0,
        engagementRatePct: engRate,
      },
      keyTakeaways: newTakeaways.split('\n').filter(t => t.trim().length > 0),
      aiAnalysis: {
        verdict: `Successfully indexed with ${audit?.originalityReport.overallOriginalityScore || 88}% Originality.`,
        whyItWorkedOrFailed: audit?.reachAnalysis.whyAudienceWillLike[0] || 'Targeted narrative matches high-intent technical problems.',
        audienceSignal: 'Strong tactical uptake and sharing among engineering peers.',
        fatigueRisk: (audit?.originalityReport.historicalMemoryOverlapPct || 0) > 30 ? 'Medium' : 'Low'
      },
      repurposedIdeas: [
        {
          id: `remix-${Date.now()}-1`,
          targetChannel: 'LinkedIn',
          format: 'Executive Summary Carousel',
          proposedHeadline: `Key Findings: ${newTitle.slice(0, 35)}...`,
          angleRationale: 'Synthesizes tactical results for senior leadership.',
          estimatedLift: '+28% reach'
        }
      ],
      originalityReport: audit?.originalityReport,
      reachAnalysis: audit?.reachAnalysis
    };

    handleAddItem(newItem);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewTopic('');
    setModalAuditResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onQuickGenerateBrief={handleQuickGenerateBrief}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Tab 1: Executive Analytics & Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <OverviewMetrics
              items={contentItems}
              gaps={gaps}
              onNavigateToRepository={(stage) => {
                setActiveTab('repository');
              }}
              onNavigateToGaps={() => {
                setActiveTab('gap-finder');
              }}
            />

            <PerformanceChart items={contentItems} />
          </div>
        )}

        {/* Tab 2: Content Memory Repository */}
        {activeTab === 'repository' && (
          <ContentRepository
            items={contentItems}
            onAddItem={handleAddItem}
            onSendIdeaToBrief={handleSendIdeaToBrief}
          />
        )}

        {/* Tab 3: Topic Gap & Cannibalization Finder */}
        {activeTab === 'gap-finder' && (
          <TopicGapFinder
            onGenerateBriefForTopic={handleGenerateBriefFromTopic}
          />
        )}

        {/* Tab 4: Brand Voice Trainer & Style Engine */}
        {activeTab === 'brand-voice' && (
          <BrandVoiceTrainer
            onNotify={showToast}
          />
        )}

        {/* Tab 5: Full Content & Video Creation Studio */}
        {activeTab === 'strategy-brief' && (
          <ContentAndVideoStudio
            pastPosts={contentItems}
            prefilledTopic={prefilledTopic}
            prefilledStage={prefilledStage}
            prefilledAngle={prefilledAngle}
            onSaveToMemory={handleAddItem}
            onNotify={showToast}
          />
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-indigo-500/50 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal: Index New Content */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl animate-fadeIn">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950 sticky top-0 z-10">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Index Published Content into Memory</span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModalPost} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Content Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Why Multi-Region Postgres Fails Without Raft Consensus"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Topic Cluster</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Cloud Architecture & Database Reliability"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Channel</label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  >
                    <option value="Technical Blog">Technical Blog</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Substack Newsletter">Substack Newsletter</option>
                    <option value="Twitter/X">Twitter/X</option>
                    <option value="Case Study">Case Study</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Funnel Stage</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  >
                    <option value="TOFU">TOFU (Awareness)</option>
                    <option value="MOFU">MOFU (Evaluation)</option>
                    <option value="BOFU">BOFU (Decision)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Tier</label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  >
                    <option value="High Performer">High Performer</option>
                    <option value="Consistent Driver">Consistent Driver</option>
                    <option value="Diagnostic Needed">Diagnostic Needed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Views</label>
                  <input
                    type="number"
                    value={newViews}
                    onChange={(e) => setNewViews(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Engagements</label>
                  <input
                    type="number"
                    value={newEngagements}
                    onChange={(e) => setNewEngagements(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Conversions</label>
                  <input
                    type="number"
                    value={newConversions}
                    onChange={(e) => setNewConversions(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Key Takeaways or Draft Text (one per line)</label>
                <textarea
                  rows={2}
                  value={newTakeaways}
                  onChange={(e) => setNewTakeaways(e.target.value)}
                  placeholder="Outline key metrics, architecture lessons, and failure modes..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>

              {/* Instant Audit Originality & Predict Likes Trigger */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>AI Content Originality & Likes Forecast</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Evaluates duplication against memory bank, semantic freshness, and predicts audience reaction.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRunModalAudit}
                  disabled={isAuditing || !newTitle.trim()}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ml-3"
                >
                  <Zap className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : 'text-amber-400'}`} />
                  <span>{isAuditing ? 'Auditing...' : modalAuditResult ? 'Re-Audit Draft' : 'Audit Originality & Likes'}</span>
                </button>
              </div>

              {/* Live Audit Report Preview if Available */}
              {modalAuditResult && (
                <div className="mt-3">
                  <OriginalityAndReachPanel
                    originality={modalAuditResult.originalityReport}
                    reach={modalAuditResult.reachAnalysis}
                    channelName={newChannel}
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setModalAuditResult(null);
                  }}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
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

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Content Strategy Agent</span>
            <span>·</span>
            <span>Enterprise Content Memory & Strategy Orchestration</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Historical Grounding Enabled</span>
            <span>·</span>
            <span>Anti-Cannibalization Guardrails Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
