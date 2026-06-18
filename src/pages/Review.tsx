import { useNavigate } from "react-router-dom";
import { useLiveStore } from "@/store/useLiveStore";
import RiskTimeline from "@/components/Review/RiskTimeline";
import WordCloud from "@/components/Review/WordCloud";
import DispositionStats from "@/components/Review/DispositionStats";
import DispositionLog from "@/components/Review/DispositionLog";
import {
  FileText,
  Download,
  RotateCcw,
  MonitorPlay,
  Radio,
  Clock,
  User,
  Tag,
} from "lucide-react";

export default function Review() {
  const navigate = useNavigate();
  const session = useLiveStore((s) => s.session);
  const getReviewData = useLiveStore((s) => s.getReviewData);
  const reset = useLiveStore((s) => s.reset);

  const reviewData = getReviewData();

  if (!session) {
    navigate("/");
    return null;
  }

  const duration = session.endTime
    ? Math.floor((session.endTime - session.startTime) / 60000)
    : Math.floor((Date.now() - session.startTime) / 60000);

  const handleExport = () => {
    const exportData = {
      session: {
        roomName: session.roomName,
        eventType: session.eventType,
        handlerName: session.handlerName,
        startTime: new Date(session.startTime).toISOString(),
        endTime: session.endTime ? new Date(session.endTime).toISOString() : null,
        duration: `${duration}分钟`,
        brandBannedWords: session.brandBannedWords,
        sensitiveTopics: session.sensitiveTopics,
      },
      review: reviewData,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `复盘_${session.roomName}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    reset();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0A0C12]">
      <header className="sticky top-0 z-10 bg-[#12141C]/95 backdrop-blur-sm border-b border-[#2A2D3A]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-blue-400" />
              <h1 className="text-base font-semibold text-gray-200">复盘报告</h1>
            </div>
            <div className="h-4 w-px bg-[#2A2D3A]" />
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <MonitorPlay size={10} />
              {session.roomName}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Radio size={10} />
              {session.eventType}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <User size={10} />
              {session.handlerName}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock size={10} />
              {duration}分钟
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-all"
            >
              <Download size={12} />
              导出报告
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1A1D28] text-gray-400 border border-[#2A2D3A] hover:bg-[#1E2130] hover:text-gray-300 transition-all"
            >
              <RotateCcw size={12} />
              新建盯屏
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-[#1A1D28] border border-[#2A2D3A] p-4">
            <RiskTimeline />
          </div>
          <div className="rounded-xl bg-[#1A1D28] border border-[#2A2D3A] p-4">
            <DispositionStats />
          </div>
        </div>

        <div className="rounded-xl bg-[#1A1D28] border border-[#2A2D3A] p-4">
          <WordCloud />
        </div>

        <div className="rounded-xl bg-[#1A1D28] border border-[#2A2D3A] p-4">
          <DispositionLog />
        </div>

        {session.brandBannedWords.length > 0 && (
          <div className="rounded-xl bg-[#1A1D28] border border-[#2A2D3A] p-4">
            <div className="flex items-center gap-2 mb-3">
              <Tag size={14} className="text-orange-400" />
              <h3 className="text-sm font-medium text-gray-300">配置回顾</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-gray-500 mb-2">品牌禁词</p>
                <div className="flex flex-wrap gap-1.5">
                  {session.brandBannedWords.map((word) => (
                    <span key={word} className="px-2 py-1 rounded-md bg-orange-500/10 text-orange-400 text-[11px] border border-orange-500/20">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 mb-2">敏感话题</p>
                <div className="flex flex-wrap gap-1.5">
                  {session.sensitiveTopics.map((topic) => (
                    <span key={topic} className="px-2 py-1 rounded-md bg-purple-500/10 text-purple-400 text-[11px] border border-purple-500/20">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
