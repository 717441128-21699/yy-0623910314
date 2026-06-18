import type { Danmaku } from "@/types";
import { RISK_LABEL_BG, RISK_LABEL_BORDER } from "@/types";
import { Flag, User } from "lucide-react";
import { useLiveStore } from "@/store/useLiveStore";

interface DanmakuItemProps {
  danmaku: Danmaku;
}

export default function DanmakuItem({ danmaku }: DanmakuItemProps) {
  const addToQueue = useLiveStore((s) => s.addToQueue);
  const isRisky = danmaku.riskLevel !== "none";

  const handleClick = () => {
    if (isRisky) return;
    addToQueue(danmaku);
  };

  const time = new Date(danmaku.timestamp);
  const timeStr = `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}:${time.getSeconds().toString().padStart(2, "0")}`;

  return (
    <div
      onClick={handleClick}
      className={`group flex items-start gap-3 px-3 py-2 rounded-lg border-l-[3px] transition-all ${
        isRisky
          ? `${RISK_LABEL_BORDER[danmaku.riskLabel]} bg-[#1A1D28] hover:bg-[#1E2130]`
          : "border-l-transparent hover:border-l-gray-600 hover:bg-[#14161E] cursor-pointer"
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs text-gray-500 font-mono">{timeStr}</span>
          <span className="text-xs text-gray-600 flex items-center gap-1">
            <User size={10} />
            {danmaku.userName}
          </span>
          <span
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium border ${RISK_LABEL_BG[danmaku.riskLabel]}`}
          >
            {danmaku.riskLabel !== "正常" && <Flag size={8} />}
            {danmaku.riskLabel}
          </span>
        </div>
        <p className={`text-sm ${isRisky ? "text-gray-100" : "text-gray-400"}`}>
          {danmaku.content}
        </p>
      </div>
      {!isRisky && (
        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-600 hover:text-orange-400 shrink-0 mt-1">
          +入队
        </button>
      )}
    </div>
  );
}
