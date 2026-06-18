import type { Danmaku, DispositionAction } from "@/types";
import { RISK_LABEL_BG, RISK_LABEL_BORDER } from "@/types";
import { useLiveStore } from "@/store/useLiveStore";
import {
  Lightbulb,
  Ban,
  Camera,
  SkipForward,
  Clock,
  User,
} from "lucide-react";

const ACTION_CONFIG: Record<
  DispositionAction,
  { color: string; icon: typeof Lightbulb; label: string }
> = {
  "提醒主播绕开": { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30", icon: Lightbulb, label: "提醒绕开" },
  "请求禁言": { color: "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30", icon: Ban, label: "禁言" },
  "截图留证": { color: "bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30", icon: Camera, label: "截图" },
  "暂不处理": { color: "bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30", icon: SkipForward, label: "跳过" },
};

interface DispositionCardProps {
  danmaku: Danmaku;
}

export default function DispositionCard({ danmaku }: DispositionCardProps) {
  const addDisposition = useLiveStore((s) => s.addDisposition);

  const time = new Date(danmaku.timestamp);
  const timeStr = `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}:${time.getSeconds().toString().padStart(2, "0")}`;

  return (
    <div
      className={`rounded-lg border-l-[3px] ${RISK_LABEL_BORDER[danmaku.riskLabel]} bg-[#1A1D28] p-3 space-y-2 animate-in fade-in slide-in-from-right-2 duration-300`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
            <Clock size={8} />
            {timeStr}
          </span>
          <span className="text-[10px] text-gray-600 flex items-center gap-1">
            <User size={8} />
            {danmaku.userName}
          </span>
        </div>
        <span
          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${RISK_LABEL_BG[danmaku.riskLabel]}`}
        >
          {danmaku.riskLabel}
        </span>
      </div>

      <p className="text-sm text-gray-200 leading-relaxed">{danmaku.content}</p>

      <div className="flex gap-1.5">
        {(Object.keys(ACTION_CONFIG) as DispositionAction[]).map((action) => {
          const config = ACTION_CONFIG[action];
          const Icon = config.icon;
          return (
            <button
              key={action}
              onClick={() => addDisposition(danmaku.id, action)}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-medium border transition-all ${config.color}`}
            >
              <Icon size={11} />
              {config.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
