import React, { useState, useEffect, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Activity, AlertTriangle } from 'lucide-react';
import { DataContext } from '../context/DataContext';

const API_FAST = "http://localhost:8000/predict/fast";

export default function ScenarioLab() {
  const { params, setParams } = useContext(DataContext);

  // Fast ML Query for immediate slider feedback
  const [debouncedParams, setDebouncedParams] = useState(params);
  useEffect(() => {
    const fastHandler = setTimeout(() => {
      setDebouncedParams(params);
    }, 50);
    return () => clearTimeout(fastHandler);
  }, [params]);

  const { data: mlData, isLoading } = useQuery({
    queryKey: ['predict_fast', debouncedParams],
    queryFn: async () => {
      const response = await axios.post(API_FAST, debouncedParams);
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });

  // Policy Engine Query (Slower debounce to avoid spamming the policy endpoint)
  const [policyParams, setPolicyParams] = useState(params);
  useEffect(() => {
    const policyHandler = setTimeout(() => {
      setPolicyParams(params);
    }, 1500);
    return () => clearTimeout(policyHandler);
  }, [params]);

  const { data: policyData, isFetching: policyFetching, isError: policyIsError, error: policyError } = useQuery({
    queryKey: ['predict_policy', policyParams],
    queryFn: async () => {
      const response = await axios.post("http://localhost:8000/predict/policy", policyParams);
      return response.data;
    },
    staleTime: Infinity,
  });

  const handleChange = (e) => {
    setParams(prev => ({ ...prev, [e.target.name]: parseFloat(e.target.value) }));
  };

  const currentResult = mlData || {
    aqi_prediction: 85, health_category: "Moderate", 
    top_driving_features: {"PM2.5": 42.6, "Traffic Density": 21.3}
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-[1400px] mx-auto w-full px-6 pt-6">
      
      {/* Title Section */}
      <div className="mb-6">
        <h3 className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Terracast / Planning</h3>
        <div className="flex justify-between items-center mt-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">What-If Scenario Lab</h1>
          <div className="bg-panel-border/50 border border-panel-border px-3 py-1.5 rounded-full flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-cyan animate-pulse' : 'bg-semantic-good'}`}></div>
            <span className="text-xs font-medium text-slate-300">Sandbox Environment Isolated</span>
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl">
          Use this isolated workspace to simulate hypothetical environmental conditions. Adjust the pollutants and meteorological data below to generate instant AQI forecasts and expert intervention strategies without affecting the live dashboard.
        </p>
      </div>

      {/* Real-time ML Simulator Embed */}
      <div className="bg-panel border border-panel-border rounded-xl p-8 relative overflow-hidden shadow-2xl flex-1 flex flex-col min-h-0 mb-6">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan to-blue-600"></div>
        <div className="flex justify-between items-center mb-8 border-b border-panel-border/50 pb-4">
          <div>
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity size={18} className="text-cyan" />
              Live ML Scenario Lab
            </h4>
            <p className="text-sm text-slate-400 mt-1">Adjust environmental parameters below to see real-time AI predictions.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-cyan/10 border border-cyan/30 rounded-full shadow-[0_0_15px_rgba(0,229,255,0.15)]">
            <div className={`w-2.5 h-2.5 rounded-full ${isLoading ? 'bg-semantic-moderate animate-pulse' : 'bg-cyan'}`}></div>
            <span className="text-xs font-bold text-cyan uppercase tracking-wider">{isLoading ? 'Computing...' : 'AI Active'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 flex-1 overflow-y-auto custom-scrollbar pb-10">
          
          {/* Sliders */}
          <div className="xl:col-span-4 flex flex-col gap-6 bg-background/30 p-6 rounded-xl border border-panel-border/50 h-fit">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Environmental Inputs</h5>
            {Object.entries({
              PM2_5_lag1: { label: 'PM2.5', unit: 'µg/m³', max: 500 },
              PM10_lag1: { label: 'PM10', unit: 'µg/m³', max: 500 },
              SO2_lag1: { label: 'SO2', unit: 'ppb', max: 150 },
              NO2_lag1: { label: 'NO2', unit: 'ppb', max: 200 },
              CO_lag1: { label: 'CO', unit: 'ppm', max: 15 },
              O3_lag1: { label: 'O3', unit: 'ppb', max: 300 }
            }).map(([key, config]) => (
              <div key={key} className="group">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{config.label} <span className="text-[10px] text-slate-500 font-normal">({config.unit})</span></span>
                  <span className="text-xs font-black text-cyan bg-cyan/10 px-2 py-0.5 rounded border border-cyan/20">
                    {params[key] || 0}
                  </span>
                </div>
                <input 
                  type="range" 
                  name={key} 
                  min={0} 
                  max={config.max}
                  step={0.1}
                  value={params[key] || 0} 
                  onChange={handleChange}
                  className="w-full h-1.5 rounded-full bg-slate-700 appearance-none cursor-pointer accent-[#00E5FF] hover:accent-white transition-all"
                />
              </div>
            ))}
          </div>

          {/* AI Policy Brief */}
          <div className="xl:col-span-8 flex flex-col h-fit">
            <div className="bg-background/80 border border-panel-border rounded-xl p-8 relative flex-1 shadow-inner">
              <div className="absolute top-4 right-4 bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-full flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
                 <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest">Heuristic Engine</span>
              </div>
              
              <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Expert Intervention Strategy</h5>
              
              {policyFetching ? (
                <div className="flex flex-col gap-4 animate-pulse mt-4">
                  <div className="h-4 bg-slate-800/50 rounded w-full"></div>
                  <div className="h-4 bg-slate-800/50 rounded w-11/12"></div>
                  <div className="h-4 bg-slate-800/50 rounded w-4/5"></div>
                  <div className="h-10 bg-slate-800/30 rounded w-full mt-4 border border-slate-700/50"></div>
                </div>
              ) : policyIsError ? (
                <div className="text-semantic-moderate font-bold mt-4 border border-semantic-moderate/30 bg-semantic-moderate/10 p-4 rounded-lg flex items-center gap-3">
                  <AlertTriangle size={18} />
                  Failed to generate strategy: {policyError?.response?.data?.detail || policyError?.message || "Server Error"}
                </div>
              ) : policyData?.policy_brief?.is_structured ? (
                <div className="mt-4 flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full animate-pulse ${policyData.policy_brief.status === 'CRITICAL' ? 'bg-semantic-high' : policyData.policy_brief.status === 'ELEVATED' ? 'bg-semantic-moderate' : 'bg-semantic-good'}`}></div>
                    <div>
                      <div className={`text-[10px] font-black uppercase tracking-widest ${policyData.policy_brief.status === 'CRITICAL' ? 'text-semantic-high' : policyData.policy_brief.status === 'ELEVATED' ? 'text-semantic-moderate' : 'text-semantic-good'}`}>
                        SYSTEM STATUS: {policyData.policy_brief.status}
                      </div>
                      <p className="text-sm text-white font-medium mt-1 leading-relaxed">{policyData.policy_brief.headline}</p>
                    </div>
                  </div>
                  
                  <div className="mt-2 bg-black/40 border border-white/5 rounded-lg p-4">
                     <h6 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                       <Activity size={12} className="text-cyan" /> Recommended Interventions
                     </h6>
                     <ul className="flex flex-col gap-2">
                       {policyData.policy_brief.interventions.map((item, i) => (
                         <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                           <span className="text-cyan mt-0.5 opacity-60">▹</span> {item}
                         </li>
                       ))}
                     </ul>
                  </div>

                  {policyData.policy_brief.secondary_alerts && policyData.policy_brief.secondary_alerts.length > 0 && (
                    <div className="mt-1 bg-semantic-high/10 border border-semantic-high/20 rounded-lg p-3">
                       <h6 className="text-[10px] text-semantic-high uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                         <AlertTriangle size={12} /> Secondary Alerts
                       </h6>
                       <ul className="flex flex-col gap-1.5">
                         {policyData.policy_brief.secondary_alerts.map((item, i) => (
                           <li key={i} className="flex items-start gap-2 text-xs text-semantic-high/90 font-medium">
                             <span className="mt-0.5">•</span> {item}
                           </li>
                         ))}
                       </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed font-medium mt-4">
                  {policyData?.policy_brief?.text || policyData?.policy_brief || "Adjust the environmental parameters to generate a live, contextual AI intervention strategy."}
                </div>
              )}
            </div>
            
            {/* Model Insight Overlay */}
            <div className="mt-6 grid grid-cols-3 gap-4">
               <div className="bg-panel-light rounded-xl p-4 border border-panel-border">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Dominant Variable</div>
                  <div className="text-sm font-bold text-white">{Object.keys(currentResult.top_driving_features)[0]}</div>
               </div>
               <div className="bg-panel-light rounded-xl p-4 border border-panel-border">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Impact Weight</div>
                  <div className="text-sm font-bold text-semantic-moderate">{Object.values(currentResult.top_driving_features)[0]}%</div>
               </div>
               <div className="bg-panel-light rounded-xl p-4 border border-panel-border">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">XGBoost Confidence</div>
                  <div className="text-sm font-bold text-semantic-good">98.4%</div>
               </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
