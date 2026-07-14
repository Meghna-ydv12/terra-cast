import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const prsaStations = [
    "Aotizhongxin", "Changping", "Dingling", "Dongsi", "Guanyuan", 
    "Gucheng", "Huairou", "Nongzhanguan", "Shunyi", "Tiantan", 
    "Wanliu", "Wanshouxigong"
  ];

  const searchResults = prsaStations.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSelect = (stationName) => {
    setSearchQuery("");
    setIsFocused(false);
    window.dispatchEvent(new CustomEvent('terracast:load_station', { detail: stationName }));
  };

  return (
    <div className="h-[60px] flex justify-between items-center px-6 border-b border-panel-border shrink-0 bg-background relative z-50">
      <div className="flex-1 max-w-md relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input 
          type="text" 
          placeholder="Search sensors, districts, reports..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="w-full bg-panel border border-panel-border rounded-md py-1.5 pl-9 pr-12 text-xs text-white outline-none focus:border-cyan transition-colors"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center bg-panel-border rounded px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
          ⌘K
        </div>

        {/* Search Dropdown */}
        {isFocused && (
          <div className="absolute top-full left-0 w-full mt-2 bg-panel border border-panel-border rounded-lg shadow-2xl overflow-hidden max-h-64 overflow-y-auto custom-scrollbar">
            {searchResults.length > 0 ? (
              searchResults.map((station, i) => (
                <div key={i} onMouseDown={(e) => { e.preventDefault(); handleSelect(station); }} className="px-4 py-3 hover:bg-slate-800 cursor-pointer border-b border-panel-border/50 last:border-0 flex justify-between items-center">
                  <span className="text-sm text-white font-medium">{station}</span>
                  <span className="text-[10px] uppercase text-cyan font-bold bg-cyan/10 px-2 py-0.5 rounded">Sensor</span>
                </div>
              ))
            ) : (
              <div className="px-4 py-4 text-xs text-slate-400 text-center">
                No active stations found for "{searchQuery}" in Beijing dataset.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-dark bg-cyan-dark/10 cursor-pointer hover:bg-cyan-dark/20 transition-colors">
          <MapPin size={12} className="text-cyan" />
          <span className="text-xs font-semibold text-cyan">Beijing PRSA</span>
        </div>
      </div>
    </div>
  );
}
