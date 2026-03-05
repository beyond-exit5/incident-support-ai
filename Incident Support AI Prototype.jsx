import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  ClipboardCheck, 
  UserCircle2, 
  FileText,
  ChevronRight,
  Info
} from 'lucide-react';

const App = () => {
  // フォーム状態
  const [formData, setFormData] = useState({
    title: '本番環境でのデータ不整合',
    customerRank: 'Standard',
    deadline: 90,
    hasDataRisk: false,
    noPermission: false
  });

  // 判定結果状態
  const [result, setResult] = useState({
    score: 20,
    status: 'MONITORED',
    color: 'bg-emerald-500',
    breakdown: [],
    actions: []
  });

  // 判定ロジックのシミュレーション
  useEffect(() => {
    let score = 0;
    const breakdown = [];
    const actions = [];

    // 1. 顧客ランク
    const rankScores = {
      'Standard': 20,
      'VIP': 50,
      'Mission-Critical': 80
    };
    const rScore = rankScores[formData.customerRank] || 0;
    score += rScore;
    breakdown.push({ label: `顧客ランク(${formData.customerRank.toLowerCase()})`, val: `+${rScore}`, icon: <ClipboardCheck size={16} className="text-blue-500" /> });

    // 2. データリスク
    if (formData.hasDataRisk) {
      score += 40;
      breakdown.push({ label: 'データ破壊・整合性リスク', val: '+40', icon: <ShieldAlert size={16} className="text-red-500" /> });
    } else {
      breakdown.push({ label: 'データリスクなし', val: '+0', icon: <CheckCircle2 size={16} className="text-emerald-500" /> });
    }

    // 3. 権限リスク
    if (formData.noPermission) {
      score += 10;
      breakdown.push({ label: '操作権限不足による遅延', val: '+10', icon: <Info size={16} className="text-amber-500" /> });
    }

    // ステータス決定
    let status = 'MONITORED';
    let color = 'bg-emerald-500';
    if (score >= 80) {
      status = 'CRITICAL';
      color = 'bg-red-500';
    } else if (score >= 40) {
      status = 'WARNING';
      color = 'bg-amber-500';
    }

    // 推奨アクションの生成
    if (status === 'CRITICAL') {
      actions.push('【体制】即時緊急対策本部(War Room)を立ち上げてください');
      actions.push('【連絡】顧客担当(CS)経由で第一報を5分以内に送信してください');
    } else if (status === 'WARNING') {
      actions.push('【調査】影響範囲の特定を優先し、30分以内に報告してください');
      actions.push('【報告】エンジニアリングマネージャーへ現状をエスカレーションしてください');
    } else {
      actions.push('【監視】1時間おきの状況変化をログに記録してください');
    }

    if (formData.noPermission) {
      actions.push('【権限】管理者へ本番操作の代行または権限付与を申請してください');
    }

    setResult({ score, status, color, breakdown, actions });
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      {/* Header */}
      <header className="max-w-5xl mx-auto flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Incident Support AI <span className="text-sm font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded">v2.0 Beta</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1 italic">現場の「カオス」を構造化し、初動の摩擦をゼロにする。</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
          <UserCircle2 size={16} />
          <span>Logged in: Master_Admin</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-full">
            <div className="flex items-center gap-2 mb-6 text-lg font-bold text-slate-700">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FileText className="text-blue-600" size={20} />
              </div>
              <h2>事象の入力 (Incident Situation)</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">タイトル</label>
                <input 
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">顧客ランク</label>
                  <select 
                    name="customerRank"
                    value={formData.customerRank}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm appearance-none"
                  >
                    <option value="Standard">Standard</option>
                    <option value="VIP">VIP</option>
                    <option value="Mission-Critical">Mission-Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">解決期限 (分)</label>
                  <input 
                    type="number"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox"
                      name="hasDataRisk"
                      checked={formData.hasDataRisk}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">データ破壊・整合性リスクあり</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox"
                      name="noPermission"
                      checked={formData.noPermission}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors font-medium">
                    <span className="text-red-500 font-bold">【重要】</span>操作権限なし (Admin: False)
                  </span>
                </label>
              </div>

              <button className="w-full bg-[#111827] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-all active:scale-[0.98] mt-4">
                判定を実行する
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Output Results */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Status Badge */}
          <div className={`${result.color} rounded-2xl p-6 text-white shadow-lg flex justify-between items-center transition-all duration-500`}>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
                <ClipboardCheck size={32} />
              </div>
              <div>
                <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">緊急度判定結果</p>
                <h2 className="text-3xl font-black tracking-tight">{result.status}</h2>
              </div>
            </div>
            <div className="bg-white text-slate-900 w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl shadow-inner border-4 border-white/30">
              {result.score}
            </div>
          </div>

          {/* Logic Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">判定ロジックのブレイクダウン</h3>
            <div className="space-y-4">
              {result.breakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-100">
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium">{item.label}:</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Plan */}
          <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-6 border-dashed">
            <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-4">推奨アクションプラン</h3>
            <div className="space-y-3">
              {result.actions.map((action, idx) => (
                <div 
                  key={idx} 
                  className="bg-white border border-blue-100 rounded-xl p-4 flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow cursor-default"
                >
                  <ChevronRight size={18} className="text-blue-400 mt-0.5 shrink-0" />
                  <p className="text-sm font-bold text-slate-700 leading-relaxed">{action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto mt-12 text-center text-slate-400 text-[10px] uppercase tracking-widest pb-8">
        © 2026 Incident Support AI Project / Developed by Exit-5
      </footer>
    </div>
  );
};

export default App;