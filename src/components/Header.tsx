import React from 'react';
import { Layers, Plus, Sparkles, SlidersHorizontal, BookOpen, Compass, BarChart3 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'overview' | 'repository' | 'gap-finder' | 'brand-voice' | 'strategy-brief';
  setActiveTab: (tab: 'overview' | 'repository' | 'gap-finder' | 'brand-voice' | 'strategy-brief') => void;
  onOpenAddModal: () => void;
  onQuickGenerateBrief: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onQuickGenerateBrief
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Layers className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            Content Strategy Agent
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 rounded-lg bg-slate-900/80 p-1 border border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Executive Analytics
          </button>

          <button
            onClick={() => setActiveTab('repository')}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'repository'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Content Memory
          </button>

          <button
            onClick={() => setActiveTab('gap-finder')}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'gap-finder'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            Gap & Cannibalization
          </button>

          <button
            onClick={() => setActiveTab('brand-voice')}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'brand-voice'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Brand Voice Engine
          </button>

          <button
            onClick={() => setActiveTab('strategy-brief')}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'strategy-brief'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-rose-400" />
            <span>Content & Video Studio</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Log Published Post</span>
          </button>
          
          <button
            onClick={onQuickGenerateBrief}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Generate Content & Video</span>
          </button>
        </div>
      </div>

      {/* Mobile nav drawer strip */}
      <div className="flex md:hidden overflow-x-auto border-t border-slate-800 bg-slate-900/50 px-4 py-2 gap-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${activeTab === 'overview' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('repository')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${activeTab === 'repository' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
        >
          Memory
        </button>
        <button
          onClick={() => setActiveTab('gap-finder')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${activeTab === 'gap-finder' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
        >
          Gaps & Heatmap
        </button>
        <button
          onClick={() => setActiveTab('brand-voice')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${activeTab === 'brand-voice' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
        >
          Brand Voice
        </button>
        <button
          onClick={() => setActiveTab('strategy-brief')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${activeTab === 'strategy-brief' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
        >
          Content & Video Studio
        </button>
      </div>
    </header>
  );
};
