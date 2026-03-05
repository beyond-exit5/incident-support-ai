from src.schema import IncidentSituation, EscalationLogic

class IncidentClassifier:
    """
    状況を分析し、緊急度スコアと根拠を算出する専門エージェント。
    """
    def __init__(self):
        self.logic = EscalationLogic()

    def run(self, situation: IncidentSituation, is_duplicate: bool):
        # 思考構造(Schema)に基づいて計算を実行
        score, status, breakdown = self.logic.calculate(situation, is_duplicate)
        
        return {
            "score": score,
            "status": status,
            "breakdown": breakdown
        }
