import shap
from app.services.model_service import model_service

class ShapService:
    def __init__(self):
        self.explainer = None
        if model_service.reg_model:
            self.explainer = shap.TreeExplainer(model_service.reg_model)
            
    def get_top_features(self, input_data, top_n=6):
        if not self.explainer:
            return {}
            
        shap_values = self.explainer.shap_values(input_data)
        feature_impacts = dict(zip(model_service.feature_names, shap_values[0]))
        sorted_impacts = sorted(feature_impacts.items(), key=lambda x: abs(x[1]), reverse=True)
        return {k: float(round(v, 2)) for k, v in sorted_impacts[:top_n]}

shap_service = ShapService()
