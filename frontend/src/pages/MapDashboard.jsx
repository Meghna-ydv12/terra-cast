import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Map, Activity, Wind, AlertTriangle } from 'lucide-react';
import LiveMap from '../components/LiveMap';
import { DataContext } from '../context/DataContext';

export default function MapDashboard() {
  const { params, setParams, stationName, dataTimestamp, isLoading } = useContext(DataContext);
  const [mlData, setMlData] = useState({ aqi_prediction: 85, health_category: "Moderate" });

  useEffect(() => {
    const fetchMlData = async () => {
      try {
        const mlRes = await axios.post("http://localhost:8000/predict/fast", params);
        setMlData(mlRes.data);
      } catch (err) {
        console.error("Failed to fetch ML data", err);
      }
    };
    fetchMlData();
  }, [params]);

  return (
    <div className="flex flex-col min-h-full max-w-[1400px] mx-auto w-full pb-10 px-6 pt-6">
      
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h3 className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Terracast / Live Air Map</h3>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1">Geospatial Analysis</h1>
        </div>
        <div className="bg-panel-border/50 border border-panel-border px-3 py-1.5 rounded-full flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-semantic-moderate animate-pulse' : 'bg-semantic-good'}`}></div>
          <span className="text-xs font-medium text-slate-300">
            {isLoading ? "Synchronizing Data..." : `Dataset Snapshot: PRSA (${stationName} - ${dataTimestamp})`}
          </span>
        </div>
      </div>

      <div className="w-full h-[450px] bg-panel border border-panel-border rounded-xl relative z-0 overflow-hidden mb-6 shadow-lg">
         <LiveMap aqi={mlData.aqi_prediction} pm25={params.PM2_5_lag1} stationName={stationName} />
         
         {/* Map Overlay Stats */}
         <div className="absolute bottom-6 left-6 z-10 bg-black/70 backdrop-blur-md border border-white/10 rounded-xl p-4 w-64 shadow-2xl">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-3 opacity-70">Grid Analysis</h4>
            <div className="flex justify-between items-center mb-2">
               <span className="text-xs text-slate-300">Monitored Area</span>
               <span className="text-xs font-bold text-white">16,410 km²</span>
            </div>
            <div className="flex justify-between items-center mb-2">
               <span className="text-xs text-slate-300">Active Nodes</span>
               <span className="text-xs font-bold text-cyan">12 PRSA Sensors</span>
            </div>
            <div className="flex justify-between items-center">
               <span className="text-xs text-slate-300">Interpolation Model</span>
               <span className="text-xs font-bold text-purple-400">TerraCast XG</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-panel border border-panel-border rounded-xl p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-3 text-cyan">
            <Activity size={24} />
            <h3 className="text-lg font-bold">Regional Status</h3>
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Sensor AQI</div>
            <div className="text-4xl font-black text-white mt-1">{Math.round(mlData.aqi_prediction)}</div>
          </div>
          <div>
             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Health Category</div>
             <div className="mt-1 inline-block px-3 py-1 rounded bg-semantic-moderate/10 text-semantic-moderate text-xs font-bold uppercase tracking-wider border border-semantic-moderate/30">
               {mlData.health_category}
             </div>
          </div>
        </div>

        <div className="bg-panel border border-panel-border rounded-xl p-6 flex flex-col justify-between shadow-sm">
           <div>
             <Wind size={20} className="text-slate-400 mb-3" />
             <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">PM2.5 Density</h4>
             <p className="text-xs text-slate-500 mt-2">Highest concentration historically observed near central arteries and southern industrial zones.</p>
           </div>
           <div className="text-2xl font-bold text-white mt-4">{params.PM2_5_lag1} <span className="text-sm font-normal text-slate-500">µg/m³</span></div>
        </div>
        
        <div className="lg:col-span-2 bg-panel border border-panel-border rounded-xl p-6 flex flex-col justify-center shadow-sm">
           <div className="flex items-start gap-4">
              <div className="p-3 bg-semantic-high/10 border border-semantic-high/30 text-semantic-high rounded-full">
                 <AlertTriangle size={24} />
              </div>
              <div>
                 <h4 className="text-sm font-bold text-white mb-2">Geospatial AI Insights</h4>
                 <p className="text-sm text-slate-400 leading-relaxed">
                   The map displays 12 active monitoring nodes across the Beijing region. AI extrapolation suggests that pollution dispersion follows the topography of the northwestern mountains. When a single node is selected, surrounding nodes are dynamically calculated using spatial interpolation relative to {stationName}.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
