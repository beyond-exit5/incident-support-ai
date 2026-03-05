class IncidentPlanner:
    """
    判定結果を受け取り、具体的な「アクションプラン」を立案する専門エージェント。
    """
    def run(self, score: int, admin: bool):
        plans = []
        
        if score >= 80:
            plans.append("【止血】該当機能の即時停止を開発者へ相談または依頼してください")
            plans.append("【報告】クライアントへ30分以内に一次返信を実施してください")
        else:
            plans.append("【監視】1時間おきの状況変化をログに記録してください")
        
        if not admin:
            plans.append("【権限】管理者へ本番操作の代行または権限付与を申請してください")
            
        return plans
