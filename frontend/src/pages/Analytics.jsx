import React from 'react';
import { BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { time: '12 AM', PM2_5: 45, AQI: 70 },
  { time: '04 AM', PM2_5: 55, AQI: 85 },
  { time: '08 AM', PM2_5: 120, AQI: 156 },
  { time: '12 PM', PM2_5: 110, AQI: 145 },
  { time: '04 PM', PM2_5: 90, AQI: 120 },
  { time: '08 PM', PM2_5: 130, AQI: 165 },
  { time: '11 PM', PM2_5: 80, AQI: 110 },
];

export default function Analytics() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <div className="glass-panel" style={{ flex: 1 }}>
        <h2 style={{ color: 'var(--accent-purple)' }}><BarChart2 /> Historical Analytics</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>24-Hour trends for Air Quality Index vs PM2.5 Concentration</p>
        
        <div style={{ width: '100%', height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--accent-cyan)' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="AQI" stroke="var(--accent-cyan)" strokeWidth={3} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="PM2_5" name="PM2.5" stroke="var(--accent-purple)" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
