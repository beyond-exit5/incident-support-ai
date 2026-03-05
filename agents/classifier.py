# --- ポートフォリオ要件(B) 役割：判定（Classifier） ---
from src.schema import IncidentSituation, EscalationLogic

class IncidentClassifier:
    """
    現場の状況を分析し、緊急度スコアを算出するエージェント。
    """
    def __init__(self):
        self.logic = EscalationLogic()

    def run(self, situation: IncidentSituation, is_duplicate: bool):
        # 思考構造に基づき計算を実行
        score, status, breakdown = self.logic.calculate(situation, is_duplicate)
        
        return {
            "score": score,
            "status": status,
            "breakdown": breakdown
        }