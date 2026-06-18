import { useLiveStore } from "@/store/useLiveStore";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { PieChartIcon, CheckCircle2, AlertCircle } from "lucide-react";
import type { DispositionAction } from "@/types";

const ACTION_COLORS: Record<DispositionAction, string> = {
  "提醒主播绕开": "#10B981",
  "请求禁言": "#EF4444",
  "截图留证": "#F59E0B",
  "暂不处理": "#6B7280",
};

export default function DispositionStats() {
  const getReviewData = useLiveStore((s) => s.getReviewData);
  const { dispositionStats } = getReviewData();

  const pieData = Object.entries(dispositionStats.byAction)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));

  const processRate =
    dispositionStats.total > 0
      ? ((dispositionStats.processed / dispositionStats.total) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <PieChartIcon size={14} className="text-amber-400" />
        <h3 className="text-sm font-medium text-gray-300">处置统计</h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-1 flex items-center justify-center">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={28}
                  outerRadius={48}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={ACTION_COLORS[entry.name as DispositionAction]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A1D28",
                    border: "1px solid #2A2D3A",
                    borderRadius: "8px",
                    fontSize: "11px",
                    color: "#E5E7EB",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-gray-600 text-xs text-center py-8">暂无数据</div>
          )}
        </div>

        <div className="col-span-2 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-emerald-500/10 border border-[#2A2D3A] p-2">
              <div className="flex items-center gap-1">
                <CheckCircle2 size={10} className="text-emerald-400" />
                <span className="text-[10px] text-gray-500">已处理</span>
              </div>
              <p className="text-lg font-bold text-emerald-400">
                {dispositionStats.processed}
              </p>
            </div>
            <div className="rounded-lg bg-red-500/10 border border-[#2A2D3A] p-2">
              <div className="flex items-center gap-1">
                <AlertCircle size={10} className="text-red-400" />
                <span className="text-[10px] text-gray-500">未处理</span>
              </div>
              <p className="text-lg font-bold text-red-400">
                {dispositionStats.unprocessed}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500">处置率</span>
              <span className="text-[11px] font-medium text-emerald-400">
                {processRate}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#0F1117]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${processRate}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            {(Object.entries(dispositionStats.byAction) as [DispositionAction, number][])
              .filter(([, v]) => v > 0)
              .map(([action, count]) => (
                <div key={action} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: ACTION_COLORS[action] }}
                    />
                    <span className="text-[10px] text-gray-400">{action}</span>
                  </div>
                  <span className="text-[10px] text-gray-500">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
