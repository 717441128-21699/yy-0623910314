import { useLiveStore } from "@/store/useLiveStore";
import DispositionCard from "./DispositionCard";
import { ShieldAlert, CheckCircle2, ClipboardList } from "lucide-react";

export default function DispositionQueue() {
  const queueItems = useLiveStore((s) => s.queueItems);
  const dispositions = useLiveStore((s) => s.dispositions);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A2D3A]">
        <div className="flex items-center gap-2">
          <ShieldAlert size={16} className="text-orange-400" />
          <h2 className="text-sm font-semibold text-gray-200">处置队列</h2>
          {queueItems.length > 0 && (
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold animate-pulse">
              {queueItems.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-gray-500">
          <span className="flex items-center gap-1">
            <CheckCircle2 size={10} className="text-emerald-400" />
            已处置 {dispositions.length}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {queueItems.length === 0 && dispositions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-600">
            <ClipboardList size={32} className="mb-2 opacity-30" />
            <p className="text-sm">暂无待处置弹幕</p>
          </div>
        ) : (
          <>
            {queueItems.map((danmaku) => (
              <DispositionCard key={danmaku.id} danmaku={danmaku} />
            ))}
            {dispositions.length > 0 && (
              <div className="border-t border-[#2A2D3A] pt-2 mt-2">
                <p className="text-[10px] text-gray-600 mb-2 px-1">
                  已处置记录 ({dispositions.length})
                </p>
                <div className="space-y-1">
                  {dispositions.slice(0, 10).map((disp) => (
                    <div
                      key={disp.id}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-[#0F1117] text-xs"
                    >
                      <CheckCircle2 size={10} className="text-emerald-500/50" />
                      <span className="text-gray-500 truncate flex-1">
                        {disp.danmakuContent}
                      </span>
                      <span className="text-gray-600 shrink-0">
                        {disp.action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
