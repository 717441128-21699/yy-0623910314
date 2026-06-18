import { useNavigate } from "react-router-dom";
import { useLiveStore } from "@/store/useLiveStore";
import DanmakuStream from "@/components/Monitor/DanmakuStream";
import DispositionQueue from "@/components/Monitor/DispositionQueue";
import StatsPanel from "@/components/Monitor/StatsPanel";
import {
  Radio,
  Square,
  FileText,
  MonitorPlay,
  Clock,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Monitor() {
  const navigate = useNavigate();
  const session = useLiveStore((s) => s.session);
  const endSession = useLiveStore((s) => s.endSession);
  const stopSimulation = useLiveStore((s) => s.stopSimulation);
  const startSimulation = useLiveStore((s) => s.startSimulation);
  const isSimulating = useLiveStore((s) => s.isSimulating);

  const [elapsedStr, setElapsedStr] = useState("00:00:00");

  useEffect(() => {
    if (!session?.isActive) {
      navigate("/");
      return;
    }
  }, [session, navigate]);

  useEffect(() => {
    if (!session?.isActive) return;
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
      const h = Math.floor(elapsed / 3600).toString().padStart(2, "0");
      const m = Math.floor((elapsed % 3600) / 60).toString().padStart(2, "0");
      const s = (elapsed % 60).toString().padStart(2, "0");
      setElapsedStr(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, [session]);

  const handleEnd = () => {
    endSession();
    navigate("/review");
  };

  const toggleSimulation = () => {
    if (isSimulating) {
      stopSimulation();
    } else {
      startSimulation();
    }
  };

  if (!session) return null;

  return (
    <div className="h-screen flex flex-col bg-[#0A0C12]">
      <header className="flex items-center justify-between px-4 py-2 bg-[#12141C] border-b border-[#2A2D3A]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <MonitorPlay size={18} className="text-red-400" />
            <span className="text-sm font-semibold text-gray-200">{session.roomName}</span>
          </div>
          <div className="h-4 w-px bg-[#2A2D3A]" />
          <span className="text-xs text-gray-500">{session.eventType}</span>
          <div className="h-4 w-px bg-[#2A2D3A]" />
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <User size={10} />
            {session.handlerName}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={12} />
            <span className="font-mono">{elapsedStr}</span>
          </div>

          <button
            onClick={toggleSimulation}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isSimulating
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30"
                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
            }`}
          >
            {isSimulating ? (
              <>
                <Square size={10} />
                暂停模拟
              </>
            ) : (
              <>
                <Radio size={10} />
                继续模拟
              </>
            )}
          </button>

          <button
            onClick={handleEnd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all"
          >
            <Square size={10} />
            结束盯屏
          </button>

          <button
            onClick={() => navigate("/review")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-all"
          >
            <FileText size={10} />
            查看复盘
          </button>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        <div className="flex-[3] border-r border-[#2A2D3A] min-w-0">
          <DanmakuStream />
        </div>
        <div className="flex-[2] border-r border-[#2A2D3A] min-w-0">
          <DispositionQueue />
        </div>
        <div className="w-[240px] shrink-0">
          <StatsPanel />
        </div>
      </div>
    </div>
  );
}
