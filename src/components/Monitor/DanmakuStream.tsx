import { useEffect, useRef } from "react";
import { useLiveStore } from "@/store/useLiveStore";
import DanmakuItem from "./DanmakuItem";
import FilterBar from "./FilterBar";
import { MessageSquare, Activity } from "lucide-react";

export default function DanmakuStream() {
  const danmakuList = useLiveStore((s) => s.danmakuList);
  const selectedLabels = useLiveStore((s) => s.selectedLabels);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = selectedLabels.length > 0
    ? danmakuList.filter((d) => selectedLabels.includes(d.riskLabel))
    : danmakuList;

  const riskCount = danmakuList.filter((d) => d.riskLevel !== "none").length;
  const riskRate = danmakuList.length > 0
    ? ((riskCount / danmakuList.length) * 100).toFixed(1)
    : "0.0";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [danmakuList.length]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A2D3A]">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-red-400" />
          <h2 className="text-sm font-semibold text-gray-200">实时弹幕</h2>
          <span className="text-[10px] text-gray-600 bg-[#0F1117] px-2 py-0.5 rounded-full">
            {danmakuList.length} 条
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Activity size={12} className="text-orange-400" />
            <span className="text-[11px] text-gray-500">风险占比</span>
            <span className="text-sm font-bold text-orange-400">{riskRate}%</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 border-b border-[#2A2D3A]">
        <FilterBar />
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-2 py-2 space-y-1"
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-600">
            <MessageSquare size={32} className="mb-2 opacity-30" />
            <p className="text-sm">等待弹幕中...</p>
          </div>
        ) : (
          filtered.map((danmaku) => (
            <DanmakuItem key={danmaku.id} danmaku={danmaku} />
          ))
        )}
      </div>
    </div>
  );
}
