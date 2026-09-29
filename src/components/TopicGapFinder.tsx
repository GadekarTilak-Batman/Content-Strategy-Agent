import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  ShieldAlert, 
  TrendingDown, 
  Copy, 
  Check 
} from 'lucide-react';
import { TOPIC_MATRIX_DATA, AI_GAP_RECOMMENDATIONS } from '../data/mockData';
import { TopicGapItem } from '../types';

interface TopicGapFinderProps {
  onGenerateBriefForTopic: (topic: string, stage: 'TOFU' | 'MOFU' | 'BOFU', suggestedAngle?: string) => void;
}

export const TopicGapFinder: React.FC<TopicGapFinderProps> = ({
  onGenerateBriefForTopic
}) => {
  const [recommendations, setRecommendations] = useState<TopicGapItem[]>(AI_GAP_RECOMMENDATIONS);
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);
  const [selectedTopicNote, setSelectedTopicNote] = useState<string | null>(null);

  const handleResolve = (id: string) => {
    setResolvedIds(prev => [...prev, id]);
  };

  return (
    <section className="space-y-8">
      {/* Intro Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
              <span>Topic Gap & Cannibalization Matrix</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Maps published content distribution against buyer journey intent. Identifies high-commercial keyword voids before competitors rank, and flags internal keyword competition splitting organic authority.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 self-start md:self-auto">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-rose-500/20 border border-rose-500/40" />
              <span>0 (Critical Gap)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500/20 border border-emerald-500/40" />
              <span>1–3 (Optimal)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-amber-500/20 border border-amber-500/40" />
              <span>4+ (Over-saturated)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Gap Matrix / Heatmap */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Funnel Intent Heatmap Matrix
          </h3>
          <span className="text-[11px] text-slate-500">
            Click any cell to trigger brief creation
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-medium text-slate-400 uppercase tracking-wider bg-slate-950/60">
                <th className="py-3 px-4 w-1/3">Topic Category</th>
                <th className="py-3 px-3 text-center">TOFU (Discovery)</th>
                <th className="py-3 px-3 text-center">MOFU (Evaluation)</th>
                <th className="py-3 px-3 text-center">BOFU (Decision)</th>
                <th className="py-3 px-3 text-right">Avg. Engagement</th>
                <th className="py-3 px-4 text-right">Coverage Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {TOPIC_MATRIX_DATA.map((row, idx) => {
                const getCellColor = (count: number) => {
                  if (count === 0) return 'bg-rose-950/40 border border-rose-800/60 text-rose-300 hover:bg-rose-900/50';
                  if (count >= 4) return 'bg-amber-950/40 border border-amber-800/60 text-amber-300 hover:bg-amber-900/50';
                  return 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/50';
                };

                return (
                  <tr 
                    key={idx} 
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-medium text-slate-200">
                      <div>{row.topic}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{row.category}</div>
                    </td>

                    {/* TOFU Cell */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => onGenerateBriefForTopic(row.topic, 'TOFU')}
                        className={`inline-flex items-center justify-center h-8 w-14 rounded font-mono text-xs font-semibold transition-all ${getCellColor(row.tofuCount)}`}
                        title={`Click to generate TOFU brief (${row.tofuCount} posts)`}
                      >
                        {row.tofuCount} {row.tofuCount === 0 ? '· Gap' : ''}
                      </button>
                    </td>

                    {/* MOFU Cell */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => onGenerateBriefForTopic(row.topic, 'MOFU')}
                        className={`inline-flex items-center justify-center h-8 w-14 rounded font-mono text-xs font-semibold transition-all ${getCellColor(row.mofuCount)}`}
                        title={`Click to generate MOFU brief (${row.mofuCount} posts)`}
                      >
                        {row.mofuCount} {row.mofuCount === 0 ? '· Gap' : ''}
                      </button>
                    </td>

                    {/* BOFU Cell */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => onGenerateBriefForTopic(row.topic, 'BOFU')}
                        className={`inline-flex items-center justify-center h-8 w-14 rounded font-mono text-xs font-semibold transition-all ${getCellColor(row.bofuCount)}`}
                        title={`Click to generate BOFU brief (${row.bofuCount} posts)`}
                      >
                        {row.bofuCount} {row.bofuCount === 0 ? '· Gap' : ''}
                      </button>
                    </td>

                    {/* Metrics */}
                    <td className="py-3.5 px-3 text-right font-mono tabular-nums text-slate-300">
                      {row.avgEngagement}%
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className={`text-[11px] font-medium ${
                        row.coverageStatus === 'Gap Opportunity'
                          ? 'text-rose-400'
                          : row.coverageStatus === 'Over-saturated'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}>
                        {row.coverageStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Recommendations Feed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>AI Content Intelligence Alerts & Action Feed</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated heuristics detecting cannibalization, pipeline voids, and audience fatigue
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map(rec => {
            const isResolved = resolvedIds.includes(rec.id);
            const isCritical = rec.status === 'Critical Gap';
            const isCannibal = rec.status === 'Cannibalization Risk';
            const isSaturated = rec.status === 'Over-saturated';

            return (
              <div
                key={rec.id}
                className={`rounded-xl border p-5 transition-all flex flex-col justify-between ${
                  isResolved
                    ? 'border-slate-800 bg-slate-950/40 opacity-60'
                    : isCritical
                    ? 'border-rose-900/50 bg-rose-950/15'
                    : isCannibal
                    ? 'border-amber-900/50 bg-amber-950/15'
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`font-semibold ${
                        isCritical ? 'text-rose-400' : isCannibal ? 'text-amber-400' : 'text-slate-300'
                      }`}>
                        {rec.status}
                      </span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-slate-400">{rec.funnelStage} Funnel</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-slate-400">{rec.searchDemand} Search Demand</span>
                    </div>

                    {isResolved && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Resolved
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-semibold text-white mb-1.5 leading-snug">
                    {rec.topic}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {rec.recommendation}
                  </p>

                  {/* Competing posts notice if cannibalization */}
                  {rec.competingPostTitles && (
                    <div className="mb-3 rounded-lg bg-slate-950/80 p-2.5 border border-slate-800/80">
                      <div className="text-[11px] font-medium text-amber-300/90 mb-1 flex items-center gap-1">
                        <ShieldAlert className="h-3 w-3" />
                        <span>Competing URLs splitting page authority:</span>
                      </div>
                      <ul className="text-[11px] text-slate-400 space-y-1">
                        {rec.competingPostTitles.map((t, i) => (
                          <li key={i} className="truncate">· {t}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggested angle */}
                  <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800/60 text-xs">
                    <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wide block mb-1">
                      Recommended Strategic Angle:
                    </span>
                    <span className="text-slate-200 italic">"{rec.suggestedAngle}"</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/60">
                  <button
                    onClick={() => handleResolve(rec.id)}
                    disabled={isResolved}
                    className="text-xs text-slate-400 hover:text-slate-200 disabled:opacity-40"
                  >
                    {isResolved ? 'Marked complete' : 'Dismiss / Mark resolved'}
                  </button>

                  <button
                    onClick={() => onGenerateBriefForTopic(rec.topic, rec.funnelStage, rec.suggestedAngle)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-sm cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Create Content & Video</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
