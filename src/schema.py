from pydantic import BaseModel, Field, validator
from typing import List, Optional

# --- ポートフォリオ要件(A) 思考の型（構造）を定義する ---

class IncidentSituation(BaseModel):
    """
    現場の「カオスな状況」を構造化するデータモデル。
    Pydanticを使用し、型安全なデータ受け渡しを保証する。
    """
    tenant_id: str = Field(..., description="会社ID")
    user_id: str = Field(..., description="報告者名")
    account_id: str = Field(..., description="対象アカウントID")
    
    title: str = Field(..., description="事象の概要")
    detail: Optional[str] = Field("", description="詳細状況")
    
    rank: str = Field("free", description="顧客ランク")
    risk: bool = Field(False, description="データ破壊・整合性リスク")
    admin: bool = Field(True, description="操作権限の有無")
    deadline: int = Field(180, description="解決期限（分）")

    @validator('rank')
    def normalize_rank(cls, v):
        """入力の揺れを吸収し、ロジックの堅牢性を確保する"""
        allowed = ['enterprise', 'standard', 'free']
        val = str(v).lower()
        return val if val in allowed else 'free'

class EscalationLogic:
    """
    現場の「判断軸（物差し）」を一元管理するクラス。
    スコアリングの重み定義と、判定ロジックをカプセル化する。
    """
    WEIGHTS = {
        "rank_enterprise": 40,
        "rank_standard": 20,
        "risk_detected": 50,
        "urgent_deadline": 30,  # 60分未満
        "duplicate_alert": 20   # 頻発環境加点
    }

    @classmethod
    def calculate(cls, situation: IncidentSituation, is_duplicate: bool):
        score = 0
        breakdown = []

        # 1. ランク加点
        r_score = cls.WEIGHTS.get(f"rank_{situation.rank}", 0)
        score += r_score
        breakdown.append(f"📈 顧客ランク({situation.rank}): +{r_score}")

        # 2. リスク加点
        if situation.risk:
            score += cls.WEIGHTS["risk_detected"]
            breakdown.append(f"🔥 データ破壊・整合性リスクあり: +{cls.WEIGHTS['risk_detected']}")
        else:
            breakdown.append("✅ データ破壊リスクなし: +0")
        
        # 3. 期限加点
        if situation.deadline < 60:
            score += cls.WEIGHTS["urgent_deadline"]
            breakdown.append(f"👁️‍🗨️ 解決期限が1時間未満: +{cls.WEIGHTS['urgent_deadline']}")

        # 4. 重複加点（頻発アラート）
        if is_duplicate:
            score += cls.WEIGHTS["duplicate_alert"]
            breakdown.append(f"⚠️ 頻発環境アラート: +{cls.WEIGHTS['duplicate_alert']}")

        # 5. 判定補正（権限なし × 重大リスク）
        if not situation.admin and situation.risk:
            old_score = score
            score = int(score * 1.5)
            breakdown.append(f"🛡️ 複合リスク補正(x1.5): +{score - old_score}")

        final_score = min(score, 120)
        status = "🚨 EMERGENCY" if final_score >= 80 else "📋 MONITORED"
        
        return final_score, status, breakdown
