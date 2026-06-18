import { useLiveStore } from "@/store/useLiveStore";
import { RISK_LABEL_BG } from "@/types";
import { TrendingUp, AlertTriangle } from "lucide-react";

export default function PeakMinutesSummary() {
  const getReviewData = useLiveStore((s) => s.getReviewData);
  const { peakMinutes } = getReviewData();

  if (peakMinutes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-600">
        <AlertTriangle size={24} className="mb-2 opacity-30" />
        <p className="text-sm">暂无高峰数据</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <TrendingUp size={14} className="text-red-400" />
        <h3 className="text-sm font-medium text-gray-300">风险高峰分钟</h3>
        <span className="text-[10px] text-gray-600">（按风险弹幕数排序 TOP 5）</span>
      </div>

      <div className="space-y-2">
        {peakMinutes.map((peak, index) => (
          <div
            key={peak.minute}
            className="flex items-center gap-3 p-3 rounded-lg bg-[#0F1117] border border-[#2A2D3A]"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 text-red-400 font-bold text-sm shrink-0">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-200">
                  第 {peak.minute} 分钟
                </span>
                <span
                  className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium border ${RISK_LABEL_BG[peak.topLabel]}`}
                >
                  {peak.topLabel} 为主
                </span>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-gray-500">
                <span>
                  共 <span className="text-gray-300 font-medium">{peak.total}</span> 条风险
                </span>
                <span>
                  高危 <span className="text-red-400 font-medium">{peak.highRisk}</span>
                </span>
                <span>
                  中危 <span className="text-orange-400 font-medium">{peak.mediumRisk}</span>
                </span>
              </div>
              <div className="mt-2 w-full h-1.5 rounded-full bg-[#1A1D28] overflow-hidden flex">
                <div
                  className="h-full bg-red-500"
                  style={{ width: `${peak.total > 0 ? (peak.highRisk / peak.total) * 100 : 0}%` }}
                />
                <div
                  className="h-full bg-orange-500"
                  style={{ width: `${peak.total > 0 ? (peak.mediumRisk / peak.total) * 100 : 0}%` }}
                />
                <div
                  className="h-full bg-yellow-500"
                  style={{ width: `${peak.total > 0 ? (peak.lowRisk / peak.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {peakMinutes.length > 0 && (
        <div className="mt-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
          <p className="text-xs text-red-300/80">
            💡 交接提示：第 {peakMinutes[0].minute} 分钟风险最高（{peakMinutes[0].total} 条），
            以<span className="font-medium"> {peakMinutes[0].topLabel} </span>
            为主，建议主播在该时段前后注意话术节奏，房管重点盯屏。
          </p>
        </div>
      )}
    </div>
  );
}
