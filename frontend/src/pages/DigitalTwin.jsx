import React, { useState, useEffect, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Cloud, Wind, Droplets, Eye, Activity, BarChart2, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DataContext } from '../context/DataContext';

const API_FAST = "http://localhost:8000/predict/fast";

const TrendGraph = ({ data, color, dataKey, gradientId }) => (
  <div className="h-[140px] w-full mt-4">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="time" hide={false} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 9}} dy={10} />
        <Tooltip contentStyle={{ backgroundColor: '#151923', border: '1px solid #2A303C', borderRadius: '8px', fontSize: '11px', color: '#fff' }} />
        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} fillOpacity={1} fill={`url(#${gradientId})`} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default function DigitalTwin() {
  const { params, setParams, stationName, dataTimestamp, isLoading: dataLoading, loadRealData } = useContext(DataContext);

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



  const currentResult = mlData || {
    aqi_prediction: 85, health_category: "Moderate", 
    top_driving_features: {"PM2.5": 42.6, "Traffic Density": 21.3}
  };

  const aqiColor = currentResult.aqi_prediction > 200 ? '#EF4444' : currentResult.aqi_prediction > 100 ? '#F59E0B' : '#FBBF24';

  const mockTrendData = [
    { time: '00:00', aqi: currentResult.aqi_prediction * 0.5, pm: params.PM2_5_lag1 * 0.4, temp: params.TEMP - 4 },
    { time: '05:00', aqi: currentResult.aqi_prediction * 0.8, pm: params.PM2_5_lag1 * 0.7, temp: params.TEMP - 2 },
    { time: '09:00', aqi: currentResult.aqi_prediction * 1.2, pm: params.PM2_5_lag1 * 1.1, temp: params.TEMP + 1 },
    { time: '14:00', aqi: currentResult.aqi_prediction * 0.9, pm: params.PM2_5_lag1 * 0.8, temp: params.TEMP + 3 },
    { time: '18:00', aqi: currentResult.aqi_prediction * 0.4, pm: params.PM2_5_lag1 * 0.3, temp: params.TEMP },
    { time: '23:00', aqi: currentResult.aqi_prediction * 0.6, pm: params.PM2_5_lag1 * 0.5, temp: params.TEMP - 2 },
  ];

  return (
    <div className="flex flex-col min-h-full max-w-[1400px] mx-auto w-full pb-10 px-6 pt-6">
      
      {/* Title Section */}
      <div className="mb-4">
        <h3 className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Terracast / Overview</h3>
        <div className="flex justify-between items-center mt-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">City Air Quality Overview</h1>
          <div className="flex gap-4">
            <button onClick={() => loadRealData()} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg border border-slate-600 transition-colors shadow-sm flex items-center gap-2">
              <Cloud size={14} /> Load PRSA Historical Snapshot
            </button>
            <div className="bg-panel-border/50 border border-panel-border px-3 py-1.5 rounded-full flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${dataLoading ? 'bg-semantic-moderate animate-pulse' : 'bg-semantic-good'}`}></div>
              <span className="text-xs font-medium text-slate-300">Data Source: PRSA ({stationName} - {dataTimestamp})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="w-full min-h-[300px] rounded-2xl bg-hero-gradient bg-cover bg-center border border-panel-border p-8 md:p-10 flex justify-between items-center relative overflow-hidden mb-8 shadow-2xl">
        <div className="max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-semantic-moderate/30 bg-semantic-moderate/10 mb-4">
            <Activity size={14} className="text-semantic-moderate" />
            <span className="text-sm font-semibold text-semantic-moderate">Moderate air quality</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">Air is {currentResult.health_category.toLowerCase()} across<br/>the metro region</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-lg">
            PM2.5 is the dominant pollutant, driven by evening traffic and low wind dispersion. Sensitive groups should limit prolonged outdoor exertion after 6 PM.
          </p>
          <div className="flex gap-4">
            <span className="px-4 py-2 rounded-full bg-black/60 border border-white/10 text-sm font-semibold text-white backdrop-blur-sm">Dominant: PM2.5</span>
            <span className="px-4 py-2 rounded-full bg-black/60 border border-white/10 text-sm font-semibold text-white backdrop-blur-sm">Trend: +4 vs yesterday</span>
          </div>
        </div>

        {/* Hero Gauge */}
        <div className="relative w-[230px] h-[230px] z-10 flex justify-center items-center mr-16 drop-shadow-2xl">
          <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100">
            <path d="M 20 80 A 45 45 0 1 1 80 80" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" strokeLinecap="round" />
            <path d="M 20 80 A 45 45 0 1 1 80 80" fill="none" stroke={aqiColor} strokeWidth="9" strokeLinecap="round" strokeDasharray="210" strokeDashoffset={210 - (Math.min(currentResult.aqi_prediction, 500) / 500) * 210} style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }} />
          </svg>
          <div className="text-center mt-6">
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300 tracking-tighter leading-none drop-shadow-lg" style={{ filter: `drop-shadow(0 0 25px ${aqiColor}60)` }}>
              {Math.round(currentResult.aqi_prediction)}
            </div>
            <div className="text-[11px] text-slate-300 font-bold uppercase tracking-[0.3em] mt-3 opacity-80">AQI Index</div>
            <div className="mt-3 inline-block px-4 py-1.5 rounded-full text-black text-[11px] font-black uppercase tracking-widest shadow-lg" style={{ backgroundColor: aqiColor }}>
              {currentResult.health_category}
            </div>
            <div className="text-[10px] text-slate-400 mt-4 font-medium uppercase tracking-widest">Dominant: PM2.5</div>
            <div className="flex justify-center items-center gap-2 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse shadow-[0_0_12px_#00E5FF]"></div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">LIVE SENSOR</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Weather Card */}
        <div className="lg:col-span-4 bg-panel border border-panel-border rounded-xl p-6">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Current Weather</h4>
          <div className="flex items-center gap-4 mb-6">
            <Cloud size={40} className="text-cyan" />
            <div>
              <div className="text-3xl font-bold text-white">{params.TEMP}°C</div>
              <div className="text-xs text-slate-400">Hazy sunshine • Feels like {params.TEMP}°</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-panel-light rounded p-2.5 flex justify-between items-center">
              <span className="text-xs text-slate-500">Humidity</span>
              <span className="text-xs font-semibold text-white">{params.DEWP}%</span>
            </div>
            <div className="bg-panel-light rounded p-2.5 flex justify-between items-center">
              <span className="text-xs text-slate-500">Wind</span>
              <span className="text-xs font-semibold text-white">{params.WSPM} km/h</span>
            </div>
            <div className="bg-panel-light rounded p-2.5 flex justify-between items-center">
              <span className="text-xs text-slate-500">Pressure</span>
              <span className="text-xs font-semibold text-white">{params.PRES} hPa</span>
            </div>
            <div className="bg-panel-light rounded p-2.5 flex justify-between items-center">
              <span className="text-xs text-slate-500">Rain</span>
              <span className="text-xs font-semibold text-white">{params.RAIN} mm</span>
            </div>
          </div>
        </div>

        {/* Pollutants Grid */}
        <div className="lg:col-span-8 grid grid-cols-3 gap-4">
          {[
            { name: 'PM2.5', value: params.PM2_5_lag1, unit: 'µg/m³', status: params.PM2_5_lag1 > 75 ? 'High' : 'Normal', color: params.PM2_5_lag1 > 75 ? 'bg-semantic-moderate' : 'bg-semantic-good', bar: `${Math.min((params.PM2_5_lag1 / 300) * 100, 100)}%` },
            { name: 'PM10', value: params.PM10_lag1, unit: 'µg/m³', status: params.PM10_lag1 > 150 ? 'High' : 'Normal', color: params.PM10_lag1 > 150 ? 'bg-semantic-high' : 'bg-cyan', bar: `${Math.min((params.PM10_lag1 / 500) * 100, 100)}%` },
            { name: 'NO2', value: params.NO2_lag1, unit: 'ppb', status: params.NO2_lag1 > 50 ? 'High' : 'Normal', color: params.NO2_lag1 > 50 ? 'bg-semantic-moderate' : 'bg-semantic-good', bar: `${Math.min((params.NO2_lag1 / 200) * 100, 100)}%` },
            { name: 'SO2', value: params.SO2_lag1, unit: 'ppb', status: params.SO2_lag1 > 20 ? 'High' : 'Normal', color: params.SO2_lag1 > 20 ? 'bg-semantic-high' : 'bg-cyan', bar: `${Math.min((params.SO2_lag1 / 100) * 100, 100)}%` },
            { name: 'CO', value: params.CO_lag1, unit: 'ppm', status: params.CO_lag1 > 2 ? 'High' : 'Normal', color: params.CO_lag1 > 2 ? 'bg-semantic-moderate' : 'bg-semantic-good', bar: `${Math.min((params.CO_lag1 / 10) * 100, 100)}%` },
            { name: 'O3', value: params.O3_lag1, unit: 'ppb', status: params.O3_lag1 > 100 ? 'High' : 'Normal', color: params.O3_lag1 > 100 ? 'bg-semantic-high' : 'bg-cyan', bar: `${Math.min((params.O3_lag1 / 200) * 100, 100)}%` },
          ].map((pol, idx) => (
            <div key={idx} className="bg-panel border border-panel-border rounded-xl p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400">{pol.name}</span>
                {pol.status && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${pol.status === 'High' ? 'text-semantic-moderate bg-semantic-moderate/10' : 'text-semantic-good bg-semantic-good/10'}`}>{pol.status}</span>}
              </div>
              <div className="mt-4">
                <span className="text-2xl font-bold text-white">{pol.value}</span>
                <span className="text-[10px] text-slate-500 ml-1">{pol.unit}</span>
              </div>
              <div className="w-full h-1 bg-panel-light mt-4 rounded-full overflow-hidden">
                <div className={`h-full ${pol.color}`} style={{ width: pol.bar }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-panel border border-panel-border rounded-xl p-8">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">24-Hour AQI Trend</h4>
          <TrendGraph data={mockTrendData} color="#00E5FF" dataKey="aqi" gradientId="aqiGrad" />
        </div>
        <div className="bg-panel border border-panel-border rounded-xl p-8">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">PM2.5 Concentration</h4>
          <TrendGraph data={mockTrendData} color="#8B5CF6" dataKey="pm" gradientId="pmGrad" />
        </div>
      </div>



    </div>
  );
}
