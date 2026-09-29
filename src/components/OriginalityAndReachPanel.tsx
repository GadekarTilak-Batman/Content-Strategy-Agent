import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Heart, 
  Share2, 
  Eye, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Copy, 
  Check, 
  Flame, 
  SlidersHorizontal 
} from 'lucide-react';
import { ContentOriginalityReport, ContentReachAnalysis } from '../types';

interface OriginalityAndReachPanelProps {
  originality?: ContentOriginalityReport;
  reach?: ContentReachAnalysis;
  channelName?: string;
  isCompact?: boolean;
}

export const OriginalityAndReachPanel: React.FC<OriginalityAndReachPanelProps> = ({
  originality,
  reach,
  channelName = 'LinkedIn',
  isCompact = false
}) => {
  const [activeTab, setActiveTab] = useState<'originality' | 'reach'>('originality');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Interactive multipliers simulation state
  const [activeToggles, setActiveToggles] = useState<Record<number, boolean>>({});

  if (!originality || !reach) {
    return (
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 text-center text-xs text-slate-400">
        <Sparkles className="w-5 h-5 mx-auto mb-2 text-indigo-400 animate-pulse" />
        <p>No originality or reach forecast has been generated for this item yet.</p>
      </div>
    );
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Calculate dynamic likes boost when multipliers are toggled on
  let extraLikesMultiplier = 1.0;
  if (reach.reachMultipliers) {
    reach.reachMultipliers.forEach((item, idx) => {
      if (activeToggles[idx]) {
        const match = item.impact.match(/\+(\d+)%/);
        if (match) {
          extraLikesMultiplier += parseInt(match[1]) / 100;
        } else {
          extraLikesMultiplier += 0.2;
        }
      }
    });
  }

  const simulatedLikes = Math.round(reach.predictedLikes.average * extraLikesMultiplier);
  const simulatedMaxLikes = Math.round(reach.predictedLikes.max * extraLikesMultiplier);
  const simulatedImpressions = Math.round(reach.predictedImpressions.average * (1 + (extraLikesMultiplier - 1) * 0.7));

  // Determine originality color
  const origScore = originality.overallOriginalityScore;
  const origBadgeColor = 
    origScore >= 85 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
    origScore >= 70 ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' :
    origScore >= 50 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
    'bg-rose-500/10 text-rose-400 border-rose-500/30';

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
      {/* Top Section Nav Tabs */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('originality')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'originality'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Content Originality Audit</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono border ${origBadgeColor}`}>
              {origScore}%
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reach')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'reach'
                ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
            <span>Predicted Reach & Likes</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono bg-rose-500/10 text-rose-400 border border-rose-500/30">
              ~{simulatedLikes.toLocaleString()} Likes
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>AI Growth Intelligence</span>
        </div>
      </div>

      {/* TAB 1: CONTENT ORIGINALITY AUDIT */}
      {activeTab === 'originality' && (
        <div className="p-5 space-y-6">
          {/* Main Originality Score Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="sm:col-span-1 flex flex-col items-center justify-center p-2 border-b sm:border-b-0 sm:border-r border-slate-800">
              <div className="text-3xl font-extrabold text-white font-mono tracking-tight flex items-baseline gap-1">
                <span className={origScore >= 80 ? 'text-emerald-400' : origScore >= 60 ? 'text-amber-400' : 'text-rose-400'}>
                  {origScore}
                </span>
                <span className="text-xs text-slate-500 font-sans font-normal">/100</span>
              </div>
              <div className={`mt-1.5 text-[11px] font-medium px-2 py-0.5 rounded-md border ${origBadgeColor} text-center`}>
                {originality.uniquenessTier}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Originality Score</div>
            </div>

            <div className="sm:col-span-3 grid grid-cols-3 gap-3 items-center">
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] uppercase tracking-wider text-slate-400">Memory Overlap</div>
                <div className="text-sm font-semibold text-white font-mono mt-0.5 flex items-center gap-1.5">
                  <span className={originality.historicalMemoryOverlapPct > 35 ? 'text-rose-400' : 'text-emerald-400'}>
                    {originality.historicalMemoryOverlapPct}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {originality.historicalMemoryOverlapPct > 35 ? 'Overlapping' : 'Safe to Use'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                  {originality.overlappingPostTitle 
                    ? `Matched: "${originality.overlappingPostTitle.slice(0, 24)}..."` 
                    : 'Zero internal conflict'}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] uppercase tracking-wider text-slate-400">Semantic Freshness</div>
                <div className="text-sm font-semibold text-white font-mono mt-0.5">
                  <span className="text-indigo-400">{originality.semanticFreshness}%</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Industry novelty metric</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] uppercase tracking-wider text-slate-400">Cliché Presence</div>
                <div className="text-sm font-semibold text-white font-mono mt-0.5">
                  <span className={
                    originality.clicheFrequency === 'Very Low' ? 'text-emerald-400' :
                    originality.clicheFrequency === 'Low' ? 'text-indigo-400' : 'text-amber-400'
                  }>
                    {originality.clicheFrequency}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Buzzword filter rate</div>
              </div>
            </div>
          </div>

          {/* Overlap Warning if applicable */}
          {originality.historicalMemoryOverlapPct > 20 && originality.overlappingPostTitle && (
            <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-200">Thematic Overlap Detected ({originality.historicalMemoryOverlapPct}%): </span>
                <span className="text-amber-300/90">
                  This topic shares core premises with published post <strong>"{originality.overlappingPostTitle}"</strong>. Consider angling towards a deeper technical teardown or distinct persona to prevent audience fatigue.
                </span>
              </div>
            </div>
          )}

          {/* Unique Angles vs Derivative Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>What Makes This Take Original & Usable</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {originality.uniqueAngles.map((angle, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                    <span>{angle}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
                <AlertTriangle className="w-4 h-4" />
                <span>Derivative Risks & Clichés to Watch</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {originality.derivativeRisks.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold shrink-0 mt-0.5">!</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Recommendations to Boost Originality */}
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>AI Recommendations to Boost Content Originality to 98%+</span>
              </div>
              <span className="text-[10px] text-slate-400">Actionable Tweaks</span>
            </div>

            <div className="space-y-2">
              {originality.suggestedOriginalityBoosters.map((booster, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200">
                  <span className="flex-1 pr-3">{booster}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(booster, `booster-${idx}`)}
                    className="shrink-0 p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Copy suggestion"
                  >
                    {copiedText === `booster-${idx}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIENCE REACH & LIKES PREDICTION */}
      {activeTab === 'reach' && (
        <div className="p-5 space-y-6">
          {/* Main Likes & Impressions Forecast Hero */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-rose-300 font-medium">
                <span>Predicted Likes</span>
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400/30" />
              </div>
              <div className="mt-2 text-2xl font-bold font-mono text-white">
                {simulatedLikes.toLocaleString()}
              </div>
              <div className="text-[10px] text-rose-300/80 mt-1">
                Range: {reach.predictedLikes.min.toLocaleString()} – {simulatedMaxLikes.toLocaleString()} reactions
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Expected Reach</span>
                <Eye className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="mt-2 text-2xl font-bold font-mono text-white">
                {simulatedImpressions.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {reach.predictedImpressions.min.toLocaleString()} – {reach.predictedImpressions.max.toLocaleString()} views
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Viral Reposts</span>
                <Share2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2 text-2xl font-bold font-mono text-white">
                {reach.predictedShares.average.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                ~{reach.predictedShares.min} to {reach.predictedShares.max} shares
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Comments / Debates</span>
                <MessageSquare className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-2 text-2xl font-bold font-mono text-white">
                {reach.predictedComments.average.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                High-intent discussions
              </div>
            </div>
          </div>

          {/* Scores Matrix: Virality, Hook Strength, Algorithm Fit */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Virality Index</span>
                <Flame className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-lg font-bold font-mono text-white mt-1">
                {reach.viralityScore}<span className="text-xs text-slate-500 font-normal">/100</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                <div 
                  className="bg-amber-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${reach.viralityScore}%` }} 
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Hook Strength</span>
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="text-lg font-bold font-mono text-white mt-1">
                {reach.hookStrengthScore}<span className="text-xs text-slate-500 font-normal">/100</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                <div 
                  className="bg-indigo-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${reach.hookStrengthScore}%` }} 
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Algorithmic Fit ({channelName})</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-lg font-bold font-mono text-white mt-1">
                {reach.algorithmFitScore}<span className="text-xs text-slate-500 font-normal">/100</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                <div 
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${reach.algorithmFitScore}%` }} 
                />
              </div>
            </div>
          </div>

          {/* 48-Hour Likes & Reach Trajectory Progression */}
          {reach.trajectoryHours && reach.trajectoryHours.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>48-Hour Velocity & Likes Trajectory Simulation</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Channel: {channelName}</span>
              </div>

              <div className="grid grid-cols-5 gap-2 pt-2">
                {reach.trajectoryHours.map((step, idx) => {
                  const stepLikes = Math.round(step.likes * extraLikesMultiplier);
                  return (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-center">
                      <div className="text-[10px] font-mono text-slate-400 font-semibold">{step.hour}</div>
                      <div className="text-xs font-bold font-mono text-rose-400 mt-1">
                        {stepLikes.toLocaleString()} <span className="text-[9px] text-slate-500 font-normal">likes</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {step.reach.toLocaleString()} views
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Why Audience Will Hit 'Like' & Upvote */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30" />
              <span>Why Readers Will Like & React to This Post</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {reach.whyAudienceWillLike.map((driver, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold mt-0.5">•</span>
                  <span>{driver}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Reach Multipliers: How to Multiply Likes */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-200">
                <SlidersHorizontal className="w-4 h-4 text-rose-400" />
                <span>Interactive Growth Levers: How to Boost Likes & Reach</span>
              </div>
              <span className="text-[10px] text-rose-300 font-mono">
                {extraLikesMultiplier > 1 ? `+${Math.round((extraLikesMultiplier - 1) * 100)}% Boost Applied!` : 'Toggle below to simulate'}
              </span>
            </div>

            <div className="space-y-2">
              {reach.reachMultipliers.map((multiplier, idx) => {
                const isChecked = !!activeToggles[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveToggles(prev => ({ ...prev, [idx]: !prev[idx] }))}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-rose-900/30 border-rose-500/50 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by parent onClick
                        className="rounded border-slate-700 text-rose-500 focus:ring-0 cursor-pointer"
                      />
                      <span>{multiplier.tactic}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0 ml-2">
                      {multiplier.impact}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Optimal Posting Windows */}
          {reach.optimalPostingTimes && reach.optimalPostingTimes.length > 0 && (
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Recommended Posting Windows for {channelName}:</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200 font-mono text-[11px]">
                {reach.optimalPostingTimes.map((time, idx) => (
                  <span key={idx} className="bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                    {time}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
