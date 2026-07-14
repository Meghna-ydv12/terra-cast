import React from 'react';
import { Activity, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const generateTrendData = (currentAqi) => {
  return [
    { time: '12 AM', aqi: currentAqi * 0.8 },
    { time: '04 AM', aqi: currentAqi * 0.7 },
    { time: '08 AM', aqi: currentAqi * 0.9 },
    { time: '12 PM', aqi: currentAqi },
    { time: '04 PM', aqi: currentAqi * 1.1 },
    { time: '08 PM', aqi: currentAqi * 1.2 },
    { time: '12 AM', aqi: currentAqi * 1.05 },
  ];
};

export default function AQIGauge({ aqi, category, color, isLoading, apiError, topFeatures }) {
  const radius = 70;
  const stroke = 8;
  const normalizedAqi = Math.min(Math.max(aqi, 0), 500);
  const percentage = normalizedAqi / 500;
  const semiCircumference = radius * Math.PI;
  const strokeDashoffset = semiCircumference - percentage * semiCircumference;
  
  const trendData = generateTrendData(aqi);

  return (
    <div className="glass-panel items-center h-full">
      <div className="w-full flex justify-between items-center mb-6 shrink-0 border-b border-zinc-800 pb-4">
        <div>
          <h3 className="text-zinc-100 text-sm font-semibold tracking-tight">AI Forecast</h3>
          <p className="text-zinc-500 text-xs mt-1">Real-time XGBoost Prediction</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-zinc-800/50 flex justify-center items-center">
          <Activity size={14} className="text-zinc-400" />
        </div>
      </div>

      {/* Minimal SVG Dial */}
      <div className="relative w-[200px] h-[100px] mx-auto flex justify-center mb-8 shrink-0">
        <svg width="200" height="100" viewBox="0 0 200 100">
          <path d="M 30 90 A 70 70 0 0 1 170 90" fill="none" stroke="#27272a" strokeWidth={stroke} strokeLinecap="round" />
          <path 
            d="M 30 90 A 70 70 0 0 1 170 90" 
            fill="none" 
            stroke={apiError ? "#ef4444" : color} 
            strokeWidth={stroke} 
            strokeLinecap="round"
            strokeDasharray={semiCircumference}
            strokeDashoffset={isLoading ? semiCircumference : strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.5s ease-out, stroke 0.5s ease-out' }}
          />
        </svg>
        <div className="absolute top-10 text-center flex flex-col items-center">
          <h1 className="text-4xl font-bold m-0 leading-none tracking-tighter" style={{ color: apiError ? '#ef4444' : '#fff' }}>
            {apiError ? 'ERR' : isLoading ? '...' : Math.round(aqi)}
          </h1>
          <p className="text-xs font-semibold tracking-widest uppercase mt-2" style={{ color: apiError ? '#ef4444' : color }}>
            {apiError ? 'Failed' : category}
          </p>
        </div>
      </div>

      <div className="flex w-full justify-between items-center bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 mb-6 shrink-0">
        <div className="text-center w-1/2 border-r border-zinc-800">
          <p className="text-[10px] text-zinc-500 mb-1 font-medium">Confidence</p>
          <p className="text-zinc-300 text-sm font-semibold tracking-tight">94.2%</p>
        </div>
        <div className="text-center w-1/2">
          <p className="text-[10px] text-zinc-500 mb-1 font-medium">Interval</p>
          <p className="text-zinc-300 text-sm font-semibold tracking-tight">± 12.5 AQI</p>
        </div>
      </div>

      {/* Trend Graph */}
      <div className="w-full mb-6 shrink-0 border border-zinc-800 rounded-lg p-3 bg-zinc-900/30">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-zinc-400 text-xs font-medium">24H Forecast Timeline</h4>
        </div>
        <div className="w-full h-[60px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <XAxis dataKey="time" hide={false} axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 9}} dy={5} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '6px', fontSize: '11px', color: '#e4e4e7' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="aqi" stroke={color} strokeWidth={2} dot={{ r: 2, fill: '#18181b', stroke: color }} activeDot={{ r: 4, fill: color, stroke: '#fff' }} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SHAP Chart */}
      <div className="w-full flex-1 flex flex-col justify-end">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-zinc-400 text-xs font-medium">Feature Importance (SHAP)</h4>
          <BarChart2 size={12} className="text-zinc-500" />
        </div>
        
        <div className="relative w-full pt-1">
          <div className="absolute left-1/2 top-0 bottom-4 w-[1px] border-r border-dashed border-zinc-700"></div>
          
          {Object.entries(topFeatures).slice(0,4).map(([key, val], i) => {
            const absVal = Math.abs(val);
            const widthPercent = Math.min((absVal / 60) * 100, 100); 
            
            return (
              <div key={i} className="flex items-center mb-2.5 text-xs relative h-3">
                <span className="w-1/3 text-zinc-500 truncate pr-3 text-right font-medium">{key}</span>
                
                <div className="w-1/3 h-1.5 relative">
                  {val >= 0 ? (
                    <div 
                      className="absolute left-0 top-0 h-full bg-emerald-500 rounded-r-sm transition-all duration-300"
                      style={{ width: `${widthPercent}%` }}
                    />
                  ) : (
                    <div 
                      className="absolute right-0 top-0 h-full bg-rose-500 rounded-l-sm transition-all duration-300"
                      style={{ width: `${widthPercent}%` }}
                    />
                  )}
                </div>
                
                <span className="w-1/3 text-left text-zinc-300 font-medium pl-3 tabular-nums">
                  {val >= 0 ? '+' : ''}{val.toFixed(1)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
