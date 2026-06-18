import { useLiveStore } from "@/store/useLiveStore";
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

  const colors = [
    "text-red-400", "text-orange-400", "text-amber-400", "text-purple-400",
    "text-blue-400", "text-pink-400", "text-cyan-400", "text-emerald-400",
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Cloud size={14} className="text-purple-400" />
        <h3 className="text-sm font-medium text-gray-300">常见风险词</h3>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 py-4 min-h-[120px]">
        {topRiskWords.map((item, index) => {
          const ratio = item.count / maxCount;
          const fontSize = Math.max(12, Math.round(ratio * 36));
          const colorClass = colors[index % colors.length];
          return (
            <span
              key={item.word}
              className={`${colorClass} font-medium transition-all hover:scale-110 cursor-default`}
              style={{ fontSize: `${fontSize}px` }}
              title={`${item.word}: ${item.count}次`}
            >
              {item.word}
            </span>
          );
        })}
      </div>
    </div>
  );
}
