import React, { useState } from 'react';
import { 
  Sliders, 
  Sparkles, 
  Check, 
  Copy, 
  AlertTriangle, 
  ArrowRight, 
  RotateCcw, 
  Plus, 
  X,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { BrandVoiceSettings, BrandAlignmentAnalysis } from '../types';
import { INITIAL_BRAND_VOICE, SAMPLE_DRAFTS } from '../data/mockData';
import { analyzeBrandVoiceOffline } from '../services/aiService';

interface BrandVoiceTrainerProps {
  onNotify?: (msg: string) => void;
}

export const BrandVoiceTrainer: React.FC<BrandVoiceTrainerProps> = ({ onNotify }) => {
  const [settings, setSettings] = useState<BrandVoiceSettings>(INITIAL_BRAND_VOICE);
  const [draftInput, setDraftInput] = useState<string>(SAMPLE_DRAFTS[0].text);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<BrandAlignmentAnalysis | null>(() => 
    analyzeBrandVoiceOffline(SAMPLE_DRAFTS[0].text, INITIAL_BRAND_VOICE)
  );
  const [copiedRewrite, setCopiedRewrite] = useState(false);
  const [newAvoidWord, setNewAvoidWord] = useState('');
  const [newDoWord, setNewDoWord] = useState('');

  // Preset handler
  const handleApplyPreset = (presetName: string) => {
    if (presetName === 'Pragmatic Engineering Leader') {
      setSettings(INITIAL_BRAND_VOICE);
    } else if (presetName === 'Empathetic Challenger') {
      setSettings({
        ...settings,
        formalVsCasual: 65,
        technicalVsSimple: 55,
        boldVsReserved: 15,
        playfulVsSerious: 50,
        targetTonePersona: 'Empathetic Challenger'
      });
    } else if (presetName === 'Technical Authority') {
      setSettings({
        ...settings,
        formalVsCasual: 30,
        technicalVsSimple: 15,
        boldVsReserved: 40,
        playfulVsSerious: 85,
        targetTonePersona: 'Technical Authority'
      });
    } else if (presetName === 'B2B SaaS Pragmatist') {
      setSettings({
        ...settings,
        formalVsCasual: 50,
        technicalVsSimple: 40,
        boldVsReserved: 30,
        playfulVsSerious: 60,
        targetTonePersona: 'B2B SaaS Pragmatist'
      });
    }
  };

  const handleAnalyze = () => {
    if (!draftInput.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = analyzeBrandVoiceOffline(draftInput, settings);
      setAnalysisResult(result);
      setIsAnalyzing(false);
    }, 300);
  };

  const handleApplySampleDraft = (draftText: string) => {
    setDraftInput(draftText);
    const result = analyzeBrandVoiceOffline(draftText, settings);
    setAnalysisResult(result);
  };

  const handleAddAvoidWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAvoidWord.trim()) return;
    if (!settings.vocabularyAvoidList.includes(newAvoidWord.trim())) {
      setSettings({
        ...settings,
        vocabularyAvoidList: [...settings.vocabularyAvoidList, newAvoidWord.trim()]
      });
    }
    setNewAvoidWord('');
  };

  const handleRemoveAvoidWord = (word: string) => {
    setSettings({
      ...settings,
      vocabularyAvoidList: settings.vocabularyAvoidList.filter(w => w !== word)
    });
  };

  const handleCopyRewritten = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(analysisResult.suggestedRewrittenText);
    setCopiedRewrite(true);
    setTimeout(() => setCopiedRewrite(false), 2000);
  };

  return (
    <section className="space-y-8">
      {/* Header Info */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-base font-semibold text-white tracking-tight">
          Brand Voice Trainer & Style Engine
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Calibrate your editorial tone matrix and run draft copy through the real-time brand simulator to eliminate clichés, align technical depth, and enforce brand consistency across all marketing authors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Tone Matrix & Vocabulary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Sliders Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Tone Matrix Sliders
              </h3>
              <span className="text-[11px] text-indigo-400 font-medium">
                {settings.targetTonePersona}
              </span>
            </div>

            {/* Presets */}
            <div>
              <label className="text-[11px] text-slate-400 block mb-1.5">Quick Presets:</label>
              <div className="flex flex-wrap gap-1.5">
                {['Pragmatic Engineering Leader', 'Empathetic Challenger', 'Technical Authority', 'B2B SaaS Pragmatist'].map(preset => (
                  <button
                    key={preset}
                    onClick={() => handleApplyPreset(preset)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                      settings.targetTonePersona === preset
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 1: Formal vs Casual */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Formal & Structured (0)</span>
                <span className="font-mono text-slate-200">{settings.formalVsCasual}%</span>
                <span className="text-slate-400">Conversational & Casual (100)</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.formalVsCasual}
                onChange={(e) => setSettings({ ...settings, formalVsCasual: Number(e.target.value) })}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Slider 2: Technical vs Simple */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Deep Engineering (0)</span>
                <span className="font-mono text-slate-200">{settings.technicalVsSimple}%</span>
                <span className="text-slate-400">Plain English (100)</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.technicalVsSimple}
                onChange={(e) => setSettings({ ...settings, technicalVsSimple: Number(e.target.value) })}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Slider 3: Bold vs Reserved */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Bold & Contrarian (0)</span>
                <span className="font-mono text-slate-200">{settings.boldVsReserved}%</span>
                <span className="text-slate-400">Measured & Safe (100)</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.boldVsReserved}
                onChange={(e) => setSettings({ ...settings, boldVsReserved: Number(e.target.value) })}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Slider 4: Playful vs Serious */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Witty & Playful (0)</span>
                <span className="font-mono text-slate-200">{settings.playfulVsSerious}%</span>
                <span className="text-slate-400">Grounded & Serious (100)</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.playfulVsSerious}
                onChange={(e) => setSettings({ ...settings, playfulVsSerious: Number(e.target.value) })}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Banned Clichés & Style Lexicon */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Banned Clichés / AI Buzzwords
              </h3>
              <p className="text-[11px] text-slate-500">
                Phrases that automatically trigger alignment score deductions:
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {settings.vocabularyAvoidList.map((word) => (
                <span
                  key={word}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-rose-950/40 text-rose-300 border border-rose-800/40"
                >
                  <span>{word}</span>
                  <button 
                    onClick={() => handleRemoveAvoidWord(word)} 
                    className="hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddAvoidWord} className="flex gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                value={newAvoidWord}
                onChange={(e) => setNewAvoidWord(e.target.value)}
                placeholder="Add banned phrase..."
                className="flex-1 rounded-lg bg-slate-950 px-2.5 py-1.5 text-xs text-white border border-slate-800 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white"
              >
                Add
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Brand Voice Simulator (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            {/* Header & Sample Draft Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Brand Voice Simulator
                </h3>
                <span className="text-[11px] text-slate-500">
                  Test your copy against configured tone parameters
                </span>
              </div>

              {/* Sample Draft Buttons */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-500">Load sample:</span>
                {SAMPLE_DRAFTS.map((draft, i) => (
                  <button
                    key={draft.id}
                    onClick={() => handleApplySampleDraft(draft.text)}
                    className="px-2 py-0.5 text-[11px] rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                  >
                    Draft {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Draft Box */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Draft Marketing Text / Social Hook:
              </label>
              <textarea
                rows={5}
                value={draftInput}
                onChange={(e) => setDraftInput(e.target.value)}
                placeholder="Paste or write draft copy here to evaluate tone alignment..."
                className="w-full rounded-lg bg-slate-950 p-3 text-xs text-slate-200 border border-slate-800 focus:border-indigo-500 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Run Button */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                {draftInput.trim().split(/\s+/).filter(Boolean).length} words
              </span>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white transition-colors shadow-sm"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isAnalyzing ? 'Evaluating...' : 'Analyze & Align'}</span>
              </button>
            </div>

            {/* Simulation Results */}
            {analysisResult && (
              <div className="pt-4 border-t border-slate-800 space-y-4">
                {/* Score bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div>
                    <div className="text-[11px] text-slate-400 mb-0.5">Brand Alignment Score</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold font-mono tabular-nums text-white">
                        {analysisResult.overallScore}%
                      </span>
                      <span className={`text-xs font-medium ${
                        analysisResult.overallScore >= 80 ? 'text-emerald-400' :
                        analysisResult.overallScore >= 60 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {analysisResult.overallScore >= 80 ? 'Aligned' :
                         analysisResult.overallScore >= 60 ? 'Moderate Drift' : 'High Drift'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-slate-400">
                    <div>
                      <span className="text-slate-500 block text-[10px]">CLARITY</span>
                      <span className="text-white">{analysisResult.clarityScore}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">ACTIONABILITY</span>
                      <span className="text-white">{analysisResult.actionabilityScore}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">TONE DRIFT</span>
                      <span className="text-amber-400">{analysisResult.toneDrift}%</span>
                    </div>
                  </div>
                </div>

                {/* Verdict text */}
                <p className="text-xs text-slate-300 italic px-1">
                  "{analysisResult.verdictSummary}"
                </p>

                {/* Flagged Clichés */}
                {analysisResult.flaggedPhrases.length > 0 && (
                  <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40 text-xs">
                    <div className="font-semibold text-rose-300 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>{analysisResult.flaggedPhrases.length} Banned Phrasings Detected</span>
                    </div>
                    <div className="space-y-1.5">
                      {analysisResult.flaggedPhrases.map((flag, idx) => (
                        <div key={idx} className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="line-through text-rose-400">"{flag.original}"</span>
                          <ArrowRight className="h-3 w-3 text-slate-500" />
                          <span className="text-emerald-400 font-medium">"{flag.replacement}"</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Side-by-side / Before and After Rewrite */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Suggested Voice-Aligned Rewrite
                    </span>
                    <button
                      onClick={handleCopyRewritten}
                      className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded bg-slate-950 border border-slate-800"
                    >
                      {copiedRewrite ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedRewrite ? 'Copied' : 'Copy Rewrite'}</span>
                    </button>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-indigo-900/40 text-xs text-slate-200 leading-relaxed">
                    {analysisResult.suggestedRewrittenText}
                  </div>

                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => {
                        setDraftInput(analysisResult.suggestedRewrittenText);
                        const refreshed = analyzeBrandVoiceOffline(analysisResult.suggestedRewrittenText, settings);
                        setAnalysisResult(refreshed);
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 underline decoration-indigo-400/40"
                    >
                      Apply Rewrite into Editor
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
