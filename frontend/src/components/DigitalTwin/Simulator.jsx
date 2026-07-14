import React from 'react';
import { Settings2, Loader2, AlertCircle } from 'lucide-react';

const MinimalSlider = ({ name, label, min, max, value, unit, onChange }) => {
  return (
    <div className="mb-5">
      <div className="flex justify-between text-xs mb-2">
        <span className="text-zinc-400 font-medium tracking-wide">{label}</span>
        <span className="text-zinc-100 font-semibold">{value} {unit}</span>
      </div>
      <input 
        type="range" 
        name={name} 
        min={min} 
        max={max} 
        value={value} 
        onChange={onChange}
        className="minimal-slider"
      />
    </div>
  );
};

export default function Simulator({ params, handleChange, isLoading, apiError }) {
  return (
    <div className="glass-panel h-full">
      <div className="flex justify-between items-center mb-6 shrink-0 border-b border-zinc-800 pb-4">
        <div>
          <h3 className="text-zinc-100 text-sm font-semibold tracking-tight">Simulation Parameters</h3>
          <p className="text-zinc-500 text-xs mt-1">Adjust variables to see real-time impact</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-zinc-800/50 flex justify-center items-center">
          {apiError ? (
            <AlertCircle size={14} className="text-red-500" />
          ) : isLoading ? (
            <Loader2 size={14} className="text-emerald-500 animate-spin" />
          ) : (
            <Settings2 size={14} className="text-zinc-400" />
          )}
        </div>
      </div>
      
      {/* Scrollable Sliders container */}
      <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar space-y-1 pb-2">
        <div className="mb-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Meteorological Data</div>
        <MinimalSlider name="TEMP" label="Temperature" min={-10} max={50} value={params.TEMP} unit="°C" onChange={handleChange} />
        <MinimalSlider name="DEWP" label="Humidity (DEWP)" min={0} max={40} value={params.DEWP} unit="°C" onChange={handleChange} />
        <MinimalSlider name="WSPM" label="Wind Speed" min={0} max={50} value={params.WSPM} unit="km/h" onChange={handleChange} />
        
        <div className="mt-6 mb-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Pollutants</div>
        <MinimalSlider name="PM2_5_lag1" label="PM2.5 Concentration" min={0} max={500} value={params.PM2_5_lag1} unit="µg" onChange={handleChange} />
        <MinimalSlider name="PM10_lag1" label="PM10 Concentration" min={0} max={500} value={params.PM10_lag1} unit="µg" onChange={handleChange} />
        <MinimalSlider name="NO2_lag1" label="Nitrogen Dioxide" min={0} max={200} value={params.NO2_lag1} unit="µg" onChange={handleChange} />
        <MinimalSlider name="SO2" label="Sulfur Dioxide" min={0} max={100} value={params.SO2} unit="µg" onChange={handleChange} />
        <MinimalSlider name="CO" label="Carbon Monoxide" min={0} max={10} value={params.CO} unit="mg" onChange={handleChange} />
        <MinimalSlider name="O3" label="Ozone" min={0} max={200} value={params.O3} unit="µg" onChange={handleChange} />
        
        <div className="mt-6 mb-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Urban Dynamics (LLM Context)</div>
        <MinimalSlider name="Traffic_Density" label="Traffic Density" min={0} max={100} value={params.Traffic_Density} unit="%" onChange={handleChange} />
        <MinimalSlider name="Industrial_Activity" label="Industrial Output" min={0} max={100} value={params.Industrial_Activity} unit="%" onChange={handleChange} />
        <MinimalSlider name="Green_Cover" label="Green Cover" min={0} max={100} value={params.Green_Cover} unit="%" onChange={handleChange} />
      </div>
    </div>
  );
}
