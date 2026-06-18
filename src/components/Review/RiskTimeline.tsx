import { useLiveStore } from "@/store/useLiveStore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp } from "lucide-react";

export default function RiskTimeline() {
  const getReviewData = useLiveStore((s) => s.getReviewData);
  const { riskTimeline } = getReviewData();

  if (riskTimeline.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-600">
        <TrendingUp size={32} className="mb-2 opacity-30" />
        <p className="text-sm">暂无风险时间线数据</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <TrendingUp size={14} className="text-red-400" />
        <h3 className="text-sm font-medium text-gray-300">风险时间线</h3>
        <span className="text-[10px] text-gray-600">（分钟级粒度）</span>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={riskTimeline}>
            <defs>
              <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="mediumGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="minute"
              tick={{ fill: "#4B5563", fontSize: 10 }}
              axisLine={{ stroke: "#2A2D3A" }}
              tickLine={false}
              tickFormatter={(v) => `${v}m`}
            />
            <YAxis
              tick={{ fill: "#4B5563", fontSize: 10 }}
              axisLine={{ stroke: "#2A2D3A" }}
              tickLine={false}
              width={24}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1D28",
                border: "1px solid #2A2D3A",
                borderRadius: "8px",
                fontSize: "11px",
                color: "#E5E7EB",
              }}
              labelFormatter={(v) => `第 ${v} 分钟`}
            />
            <Area
              type="monotone"
              dataKey="highRisk"
              stroke="#EF4444"
              fill="url(#highGrad)"
              strokeWidth={2}
              name="高危"
            />
            <Area
              type="monotone"
              dataKey="mediumRisk"
              stroke="#F97316"
              fill="url(#mediumGrad)"
              strokeWidth={2}
              name="中危"
            />
            <Line
              type="monotone"
              dataKey="lowRisk"
              stroke="#6B7280"
              strokeWidth={1}
              strokeDasharray="4 2"
              dot={false}
              name="低危"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
