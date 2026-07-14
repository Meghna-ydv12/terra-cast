import React from 'react';
import { Brain, FileText, Cpu, Activity } from 'lucide-react';

export default function Insights() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <div className="glass-panel" style={{ flex: 1 }}>
        <h2 style={{ color: 'var(--accent-cyan)' }}><Brain /> Deep Learning XAI Insights</h2>
        <p style={{ color: 'var(--text-muted)' }}>Detailed breakdown of how the Dual-Task XGBoost & Random Forest architecture computes AQI predictions.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '30px' }}>
          
          <div style={{ padding: '20px', background: 'rgba(0, 240, 255, 0.05)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '12px' }}>
            <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '16px' }}><Cpu size={20} style={{display:'inline'}}/> Model Interpretability (SHAP)</h3>
            <p style={{ fontSize: '12px', color: '#ccc', lineHeight: '1.6' }}>
              Our XGBoost model utilizes SHapley Additive exPlanations (SHAP) to deconstruct every single prediction. 
              The system calculates the exact marginal contribution of each environmental variable (Temperature, Wind Speed, PM2.5) to the final AQI score.
              This overcomes the 'Black Box' problem common in traditional environmental models.
            </p>
          </div>

          <div style={{ padding: '20px', background: 'rgba(181, 53, 246, 0.05)', border: '1px solid rgba(181, 53, 246, 0.2)', borderRadius: '12px' }}>
            <h3 style={{ color: 'var(--accent-purple)', marginBottom: '16px' }}><Activity size={20} style={{display:'inline'}}/> Generative AI Translation</h3>
            <p style={{ fontSize: '12px', color: '#ccc', lineHeight: '1.6' }}>
              Raw SHAP values are mathematically dense and difficult for city planners to interpret. 
              TerraCast solves this by feeding the extracted SHAP matrix directly into a Large Language Model (LLM) pipeline. 
              The LLM acts as an automated environmental scientist, translating complex mathematical correlations into actionable human policy.
            </p>
          </div>

        </div>

        <div style={{ marginTop: '40px', padding: '20px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'rgba(0,0,0,0.5)' }}>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '20px' }}><FileText size={18} style={{display:'inline'}}/> Live SHAP Output Stream</h4>
          <pre style={{ color: 'var(--accent-green)', fontSize: '10px', overflowX: 'auto', padding: '10px' }}>
{`{
  "timestamp": "2026-07-06T10:30:00Z",
  "base_value": 75.4,
  "features": {
    "PM2.5_lag1": { "value": 156.0, "shap_impact": "+42.6", "direction": "escalating" },
    "Traffic_Density": { "value": 84.0, "shap_impact": "+21.3", "direction": "escalating" },
    "Wind_Speed": { "value": 12.0, "shap_impact": "-12.8", "direction": "mitigating" }
  },
  "llm_prompt_status": "PROCESSED_SUCCESS"
}`}
          </pre>
        </div>

      </div>
    </div>
  );
}
