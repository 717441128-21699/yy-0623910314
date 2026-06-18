import { useLiveStore } from "@/store/useLiveStore";
import {
  BarChart3,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function StatsPanel() {
  const danmakuList = useLiveStore((s) => s.danmakuList);
  const queueItems = useLiveStore((s) => s.queueItems);
  const dispositions = useLiveStore((s) => s.dispositions);
  const session = useLiveStore((s) => s.session);

  const riskCount = danmakuList.filter((d) => d.riskLevel !== "none").length;
  const highCount = danmakuList.filter((d) => d.riskLevel === "high").length;
  const mediumCount = danmakuList.filter((d) => d.riskLevel === "medium").length;

  const elapsed = session
    ? Math.floor((Date.now() - session.startTime) / 60000)
    : 0;
  const ratePerMin = elapsed > 0 ? (danmakuList.length / elapsed).toFixed(1) : "0.0";

  const labelCounts: Record<string, number> = {};
  danmakuList.forEach((d) => {
    if (d.riskLevel !== "none") {
      labelCounts[d.riskLabel] = (labelCounts[d.riskLabel] || 0) + 1;
    }
  });

  const stats = [
    {
      icon: MessageSquare,
      label: "总弹幕",
      value: danmakuList.length,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      icon: AlertTriangle,
      label: "风险弹幕",
      value: riskCount,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      icon: Clock,
      label: "条/分钟",
      value: ratePerMin,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      icon: CheckCircle2,
      label: "已处置",
      value: dispositions.length,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#2A2D3A]">
        <BarChart3 size={16} className="text-blue-400" />
        <h2 className="text-sm font-semibold text-gray-200">实时统计</h2>
      </div>

      <div className="px-4 py-3 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`rounded-lg ${stat.bg} border border-[#2A2D3A] p-3`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={12} className={stat.color} />
                  <span className="text-[10px] text-gray-500">{stat.label}</span>
                </div>
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          <p className="text-[11px] text-gray-500">风险分布</p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-red-400">高危</span>
              <span className="text-[11px] text-gray-500">{highCount}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#0F1117]">
              <div
                className="h-full rounded-full bg-red-500 transition-all duration-500"
                style={{
                  width: `${danmakuList.length > 0 ? (highCount / danmakuList.length) * 100 : 0}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-orange-400">中危</span>
              <span className="text-[11px] text-gray-500">{mediumCount}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#0F1117]">
              <div
                className="h-full rounded-full bg-orange-500 transition-all duration-500"
                style={{
                  width: `${danmakuList.length > 0 ? (mediumCount / danmakuList.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-[11px] text-gray-500">标签统计</p>
          {Object.entries(labelCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([label, count]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-[11px] text-gray-400">{label}</span>
                <span className="text-[11px] text-gray-500">{count}</span>
              </div>
            ))}
          {Object.keys(labelCounts).length === 0 && (
            <p className="text-[11px] text-gray-700">暂无数据</p>
          )}
        </div>

        <div className="pt-2 border-t border-[#2A2D3A]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-500">待处置</span>
            <span className="text-lg font-bold text-red-400">{queueItems.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
