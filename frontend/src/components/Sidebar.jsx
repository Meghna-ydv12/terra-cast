import React from 'react';
import { LayoutGrid, Map, Cloud, FlaskConical } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isOverview = location.pathname.includes('/overview');
  const isMap = location.pathname.includes('/map');
  const isLab = location.pathname.includes('/lab');

  return (
    <div className="w-[220px] bg-background border-r border-panel-border flex flex-col py-8 shrink-0 h-full">
      <div className="flex items-center gap-3 px-8 mb-12">
        <div className="w-10 h-10 rounded-xl border border-cyan/30 bg-cyan/10 text-cyan flex justify-center items-center shadow-[0_0_15px_rgba(0,229,255,0.15)]">
          <Cloud size={20} />
        </div>
        <span className="font-bold text-white text-xl tracking-wide">TerraCast</span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 custom-scrollbar">
        <div className="mb-8">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-3 mb-4">Core Modules</h4>
          <div className="flex flex-col gap-2">
            <div 
              onClick={() => navigate('/overview')}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${isOverview ? 'bg-panel border border-panel-border text-cyan shadow-sm' : 'text-slate-400 hover:text-white hover:bg-panel-light'}`}
            >
              <LayoutGrid size={18} />
              <span className="text-sm font-semibold">Overview & AI</span>
            </div>
            <div 
              onClick={() => navigate('/map')}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${isMap ? 'bg-panel border border-panel-border text-cyan shadow-sm' : 'text-slate-400 hover:text-white hover:bg-panel-light'}`}
            >
              <Map size={18} />
              <span className="text-sm font-semibold">Live Air Map</span>
            </div>
            <div 
              onClick={() => navigate('/lab')}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${isLab ? 'bg-panel border border-panel-border text-cyan shadow-sm' : 'text-slate-400 hover:text-white hover:bg-panel-light'}`}
            >
              <FlaskConical size={18} />
              <span className="text-sm font-semibold">Scenario Lab</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 mt-auto">
        <div className="border border-panel-border rounded-xl p-4 bg-panel shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-semantic-good animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-sm font-bold text-white">All sensors online</span>
          </div>
          <p className="text-xs text-slate-500 leading-tight">42 of 42 stations reporting</p>
        </div>
      </div>
    </div>
  );
}
