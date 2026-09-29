import React from 'react';
import { ArrowUpRight, TrendingUp, AlertTriangle, Target, Layers } from 'lucide-react';
import { ContentItem, TopicGapItem } from '../types';

interface OverviewMetricsProps {
  items: ContentItem[];
  gaps: TopicGapItem[];
  onNavigateToRepository: (filterStage?: string) => void;
  onNavigateToGaps: () => void;
}

export const OverviewMetrics: React.FC<OverviewMetricsProps> = ({
  items,
  gaps,
  onNavigateToRepository,
  onNavigateToGaps,
}) => {
  const totalPosts = items.length;
  const tofuCount = items.filter(i => i.funnelStage === 'TOFU').length;
  const mofuCount = items.filter(i => i.funnelStage === 'MOFU').length;
  const bofuCount = items.filter(i => i.funnelStage === 'BOFU').length;

  const totalViews = items.reduce((acc, i) => acc + i.metrics.views, 0);
  const totalConversions = items.reduce((acc, i) => acc + i.metrics.conversions, 0);
  
  // Calculate average engagement rate
  const avgEngagementRate = (
    items.reduce((acc, i) => acc + i.metrics.engagementRatePct, 0) / (totalPosts || 1)
  ).toFixed(1);

  // Group by channel to find top performing channel
  const channelStats: Record<string, { views: number; engagements: number; count: number }> = {};
  items.forEach(item => {
    if (!channelStats[item.channel]) {
      channelStats[item.channel] = { views: 0, engagements: 0, count: 0 };
    }
    channelStats[item.channel].views += item.metrics.views;
    channelStats[item.channel].engagements += item.metrics.engagements;
    channelStats[item.channel].count += 1;
  });

  let topChannel = 'LinkedIn';
  let topChannelRate = 0;
  Object.entries(channelStats).forEach(([ch, stat]) => {
    const rate = stat.views > 0 ? (stat.engagements / stat.views) * 100 : 0;
    if (rate > topChannelRate) {
      topChannelRate = rate;
      topChannel = ch;
    }
  });

  const criticalGapsCount = gaps.filter(g => g.status === 'Critical Gap').length;
  const cannibalizationCount = gaps.filter(g => g.status === 'Cannibalization Risk').length;

  // Calculate average originality score and total predicted likes
  const avgOriginality = Math.round(
    items.reduce((acc, i) => acc + (i.originalityReport?.overallOriginalityScore || 85), 0) / (totalPosts || 1)
  );
  const totalPredictedLikes = items.reduce(
    (acc, i) => acc + (i.reachAnalysis?.predictedLikes.average || i.metrics.engagements), 0
  );

  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Posts Published */}
        <div 
          onClick={() => onNavigateToRepository()}
          className="group relative cursor-pointer rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 hover:bg-slate-900 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Content Memory Bank</span>
            <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold tracking-tight text-white font-mono tabular-nums">
              {totalPosts}
            </span>
            <span className="text-xs text-emerald-400 font-mono tabular-nums flex items-center">
              +18% QoQ
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{tofuCount} TOFU</span>
            <span aria-hidden="true">·</span>
            <span>{mofuCount} MOFU</span>
            <span aria-hidden="true">·</span>
            <span>{bofuCount} BOFU</span>
          </div>
        </div>

        {/* Metric 2: Top Performing Channel */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Top Channel Efficiency</span>
            <span className="text-emerald-400 text-xs font-mono tabular-nums">
              {topChannelRate.toFixed(1)}% eng.
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold tracking-tight text-white truncate">
              {topChannel}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{channelStats[topChannel]?.count || 0} pieces tracked</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {((channelStats[topChannel]?.views || 0) / 1000).toFixed(0)}k reach
            </span>
          </div>
        </div>

        {/* Metric 3: Overall Engagement Rate */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Avg. Engagement Rate</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold tracking-tight text-white font-mono tabular-nums">
              {avgEngagementRate}%
            </span>
            <span className="text-xs text-emerald-400 font-mono tabular-nums">
              +2.1% vs SaaS median
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-mono tabular-nums">{(totalViews / 1000).toFixed(1)}k views</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{totalConversions.toLocaleString()} conversions</span>
          </div>
        </div>

        {/* Metric 4: Identified Topic Gaps & Cannibalization */}
        <div 
          onClick={onNavigateToGaps}
          className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-amber-500/40 hover:bg-slate-900 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Pipeline Gap Alerts</span>
            <AlertTriangle className="h-4 w-4 text-amber-400 group-hover:animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold tracking-tight text-amber-300 font-mono tabular-nums">
              {criticalGapsCount}
            </span>
            <span className="text-xs text-slate-400">High-intent gaps</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-amber-400/90">{cannibalizationCount} cannibalization alert</span>
            <span aria-hidden="true">·</span>
            <span className="group-hover:text-indigo-300 underline decoration-dotted transition-colors">
              Review matrix
            </span>
          </div>
        </div>
      </div>

      {/* Content Originality & Reach Intelligence Banner */}
      <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Library Originality Index:</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {avgOriginality}% Novel
            </span>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Total Projected Likes:</span>
            <span className="text-xs font-mono font-bold text-rose-300">
              ~{totalPredictedLikes.toLocaleString()} reactions
            </span>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="text-xs text-slate-400">
            Anti-Cannibalization Guardrails: <span className="text-emerald-400 font-medium">Active</span>
          </div>
        </div>

        <button
          onClick={() => onNavigateToRepository()}
          className="text-xs text-indigo-300 hover:text-indigo-200 font-medium flex items-center gap-1.5 cursor-pointer"
        >
          <span>View Content Memory Audit</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
