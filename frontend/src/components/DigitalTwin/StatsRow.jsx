import React from 'react';
import { Layers, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

export default function StatsRow() {
  return (
    <div className="flex flex-wrap gap-6 mt-2">
      
      {/* Card 1: Data Sources */}
      <div className="glass-panel flex-1 min-w-[200px] flex-row items-center gap-4 py-4 px-6">
        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex justify-center items-center shrink-0 border border-zinc-700">
          <Layers size={18} className="text-zinc-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-[10px] text-zinc-500 font-semibold tracking-widest uppercase mb-1">Data Sources</h4>
          <div className="text-sm text-zinc-100 mb-1"><strong className="font-bold">12</strong> Active Sensors</div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-medium">
            Live Data Stream
          </div>
        </div>
      </div>

      {/* Card 2: Model Accuracy */}
      <div className="glass-panel flex-1 min-w-[200px] flex-row items-center gap-4 py-4 px-6">
        <div className="w-10 h-10 rounded-full border border-emerald-500/30 flex justify-center items-center shrink-0">
          <div className="w-8 h-8 rounded-full border border-emerald-500/50 border-t-emerald-400 animate-spin" style={{ animationDuration: '3s' }}></div>
        </div>
        <div className="flex-1">
          <h4 className="text-[10px] text-zinc-500 font-semibold tracking-widest uppercase mb-1">Model Accuracy</h4>
          <div className="text-sm text-zinc-100 mb-1"><strong className="font-bold">94.7%</strong></div>
          <div className="text-[10px] text-zinc-400 font-medium">AI Prediction Score</div>
        </div>
      </div>

      {/* Card 3: Next Update */}
      <div className="glass-panel flex-1 min-w-[200px] flex-row items-center gap-4 py-4 px-6">
        <div className="w-10 h-10 rounded-full bg-zinc-800 flex justify-center items-center shrink-0 border border-zinc-700">
          <Clock size={16} className="text-zinc-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-[10px] text-zinc-500 font-semibold tracking-widest uppercase mb-1">Next Update</h4>
          <div className="text-sm text-zinc-100 mb-1"><strong className="font-bold">02:30</strong></div>
          <div className="text-[10px] text-zinc-400 font-medium">Min Remaining</div>
        </div>
      </div>

      {/* Card 4: Alert Status */}
      <div className="glass-panel flex-1 min-w-[200px] flex-row items-center gap-4 py-4 px-6">
        <div className="shrink-0">
          <AlertTriangle size={24} className="text-amber-500" />
        </div>
        <div className="flex-1">
          <h4 className="text-[10px] text-zinc-500 font-semibold tracking-widest uppercase mb-1">Alert Status</h4>
          <div className="text-sm text-amber-500 mb-1"><strong className="font-bold">2</strong> Active Alerts</div>
          <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium cursor-pointer hover:text-zinc-200 transition-colors">
            View Alerts <ArrowRight size={10} />
          </div>
        </div>
      </div>

    </div>
  );
}
