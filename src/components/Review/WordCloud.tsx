import { useLiveStore } from "@/store/useLiveStore";
import { RISK_LABEL_COLORS } from "@/types";
import { Cloud } from "lucide-react";

export default function WordCloud() {
  const getReviewData = useLiveStore((s) => s.getReviewData);
  const { topRiskWords } = getReviewData();

  if (topRiskWords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-600">
        <Cloud size={32} className="mb-2 opacity-30" />
        <p className="text-sm">暂无高频风险词数据</p>
      </div>
    );
  }

  const maxCount = topRiskWords[0]?.count || 1;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Cloud size={14} className="text-purple-400" />
        <h3 className="text-sm font-medium text-gray-300">常见风险词</h3>
        <span className="text-[10px] text-gray-600">（按完整词统计）</span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 py-4 min-h-[120px]">
        {topRiskWords.map((item, index) => {
          const ratio = item.count / maxCount;
          const fontSize = Math.max(12, Math.round(12 + ratio * 20));
          const color = RISK_LABEL_COLORS[item.label] || "#6B7280";
          return (
            <div
              key={item.word}
              className="flex flex-col items-center cursor-default"
              title={`${item.word}: ${item.count}次 (${item.label})`}
            >
              <span
                className="font-medium transition-all hover:scale-110"
                style={{ fontSize: `${fontSize}px`, color }}
              >
                {item.word}
              </span>
              <span className="text-[10px] text-gray-600">{item.count}次</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
