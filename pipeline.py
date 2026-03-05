# --- ポートフォリオ要件(C) 実行：一本の道（パイプライン）で動く証明 ---
from src.schema import IncidentSituation
from agents.classifier import IncidentClassifier
from agents.planner import IncidentPlanner

def run_sample_pipeline():
    """
    サーバーを介さず、プログラム内部で思考構造の全工程を実行するデモ。
    """
    # エージェントの準備
    classifier = IncidentClassifier()
    planner = IncidentPlanner()

    # 1. 入力データの作成（ポートフォリオ用のサンプルケース）
    # 複合リスク補正が発動する条件
    sample_input = IncidentSituation(
        tenant_id="EMERGENCY_CORP",
        user_id="Master_Admin",
        account_id="ACC_777",
        title="本番環境でのデータ不整合（バグの疑い）",
        rank="enterprise",
        risk=True,      # 重大リスクあり
        admin=False,    # 権限なし（補正発動の条件）
        deadline=30,    # 1時間未満の期限
        detail="連休前の最終チェックで発覚。至急の止血が必要。"
    )

    print("=== [MOCK] 思考構造パイプライン 実行開始 ===")
    print(f"入力事象: {sample_input.title}")

    # 2. 判定工程 (Classifier)
    # 重複なし（False）として実行
    analysis = classifier.run(sample_input, is_duplicate=False)
    
    print(f"\n--- 判定結果: {analysis['status']} (Score: {analysis['score']}) ---")
    print("判定根拠:")
    for line in analysis['breakdown']:
        print(f"  {line}")

    # 3. 立案工程 (Planner)
    plans = planner.run(analysis["score"], sample_input.admin)

    print("\n--- 提案アクションプラン ---")
    for plan in plans:
        print(f"  {plan}")

    print("\n=== パイプライン実行完了 ===")
    
    # 【重要】Windowsで画面が勝手に閉じないための待機処理
    print("\n" + "="*40)
    input("確認できたら [Enter] キーを押して終了してください...")

if __name__ == "__main__":
    run_sample_pipeline()