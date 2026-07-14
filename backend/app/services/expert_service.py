import json
from app.core.config import settings

class ExpertSystemService:
    def generate_policy_brief(self, aqi, category, top_features, extended_context):
        # Dynamic Rule-Based Offline Simulator
        top_factor = list(top_features.keys())[0] if top_features else "Unknown"
        
        status = "NORMAL"
        headline = f"⚡ [TerraCast Heuristic Engine] The simulated AQI has shifted to {aqi} ({category}), driven primarily by elevated {top_factor} levels."
        interventions = []
        secondary_alerts = []
        
        if aqi <= 100:
            status = "STABLE"
            interventions.append("No immediate industrial or traffic interventions are necessary.")
            interventions.append("Recommend maintaining standard monitoring protocols and ensuring green-zone compliance.")
        elif aqi <= 200:
            status = "ELEVATED"
            headline = f"⚡ [TerraCast Heuristic Engine] With {top_factor} dominating the predictive model, we advise a localized Tier-1 intervention."
            if top_factor in ["PM2.5", "PM10"]:
                interventions.append("Consider temporary restrictions on heavy diesel traffic in the downtown corridor.")
                interventions.append("Mandate dust suppression at major construction sites.")
            elif top_factor in ["SO2", "NO2"]:
                interventions.append("Advise power plants and heavy manufacturing in the industrial sector to switch to low-emission reserves for the next 12-24 hours.")
            else:
                interventions.append("Recommend issuing preliminary health advisories for sensitive groups.")
                interventions.append("Enhance public transport frequency to reduce private vehicle emissions.")
        else:
            status = "CRITICAL"
            headline = f"⚡ [TerraCast Heuristic Engine] Extreme {category} conditions detected. {top_factor} levels are severely impacting regional air quality."
            interventions.append("Immediate Tier-3 Intervention recommended.")
            interventions.append("Halt all non-essential industrial output.")
            interventions.append("Enforce strict odd-even license plate restrictions and issue mandatory indoor sheltering alerts.")
            
            if extended_context.O3_lag1 > 100:
                secondary_alerts.append(f"Dangerous secondary Ozone levels ({extended_context.O3_lag1} ppb) require immediate suspension of all outdoor public activities.")
            if extended_context.CO_lag1 > 5:
                secondary_alerts.append(f"High Carbon Monoxide ({extended_context.CO_lag1} ppm) indicates severe local traffic bottlenecking; dispatch traffic control immediately.")
                
        return {
            "is_structured": True,
            "status": status,
            "headline": headline,
            "interventions": interventions,
            "secondary_alerts": secondary_alerts
        }

llm_service = ExpertSystemService()
