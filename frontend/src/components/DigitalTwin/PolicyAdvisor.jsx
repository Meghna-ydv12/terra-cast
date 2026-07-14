import React from 'react';
import { Terminal, Copy } from 'lucide-react';

export default function PolicyAdvisor({ policy }) {
  const paragraphs = policy.split('\n').filter(p => p.trim() !== '');

  return (
    <div className="glass-panel h-full">
      <div className="flex justify-between items-center mb-6 shrink-0 border-b border-zinc-800 pb-4">
        <div>
          <h3 className="text-zinc-100 text-sm font-semibold tracking-tight">GenAI Action Plan</h3>
          <p className="text-zinc-500 text-xs mt-1">LLM Generated Policy Response</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-zinc-800/50 flex justify-center items-center">
          <Terminal size={14} className="text-zinc-400" />
        </div>
      </div>

      {/* Brought back the brain graphic in a formatted way */}
      <div className="flex justify-center mb-4 shrink-0">
        <div className="h-[80px] w-full rounded-lg relative overflow-hidden bg-black/40 flex justify-center items-center border border-zinc-800/50">
          <img src="/brain_graphic.png" alt="AI Brain" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-t from-panel to-transparent"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar">
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800/50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Report Output</span>
            <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
              <Copy size={12} />
            </button>
          </div>
          
          <div className="text-xs leading-relaxed text-zinc-300 font-mono space-y-4">
            {paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
            {paragraphs.length === 0 && (
              <p className="text-zinc-500 italic">No policy generated.</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="shrink-0 mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
        <span className="text-[10px] text-zinc-500">Model: Gemini Pro</span>
        <button className="bg-zinc-100 text-zinc-900 hover:bg-white px-4 py-2 rounded text-xs font-semibold tracking-tight transition-colors">
          Export Full Report
        </button>
      </div>
    </div>
  );
}
