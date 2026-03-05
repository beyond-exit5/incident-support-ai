# --- ポートフォリオ要件(C) 実行：一本の道（パイプライン）で動く ---
from fastapi import FastAPI
import uvicorn
from datetime import datetime, timedelta
from typing import List, Dict

# 自作モジュールのインポート
from src.schema import IncidentSituation
from agents.classifier import IncidentClassifier
from agents.planner import IncidentPlanner

app = FastAPI(title="Trouble Support System V2")

# エージェントの初期化
classifier = IncidentClassifier()
planner = IncidentPlanner()

# 重複チェック用メモリ
history_db: Dict[str, List[datetime]] = {}

@app.post("/analyze")
async def analyze_pipeline(req: IncidentSituation):
    now = datetime.now()
    
    # 1. 前処理：重複チェック
    if req.account_id not in history_db:
        history_db[req.account_id] = []
    
    seven_days_ago = now - timedelta(days=7)
    history_db[req.account_id] = [t for t in history_db[req.account_id] if t > seven_days_ago]
    
    is_duplicate = len(history_db[req.account_id]) >= 2
    history_db[req.account_id].append(now)

    # 2. 実行：判定エージェント (Classifier)
    analysis = classifier.run(req, is_duplicate)

    # 3. 実行：立案エージェント (Planner)
    plans = planner.run(analysis["score"], req.admin)

    # 4. 結果の統合
    return {
        "urgency_score": analysis["score"],
        "status": analysis["status"],
        "action_plan": plans,
        "score_breakdown": analysis["breakdown"],
        "report_text": f"判定完了: {analysis['status']} (Score: {analysis['score']}/120)"
    }

if __name__ == "__main__":
    print("--- 統合判定エンジン V2: 指揮官モード起動 ---")
    uvicorn.run(app, host="0.0.0.0", port=8000)