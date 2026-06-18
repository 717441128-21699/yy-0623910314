import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MonitorPlay, Radio, Shield, AlertTriangle } from "lucide-react";
import { useLiveStore } from "@/store/useLiveStore";
import TagInput from "@/components/Config/TagInput";

const EVENT_TYPES = [
  "品牌直播", "促销活动", "新品发布", "达人带货", "日常直播", "节日专场",
];

export default function Config() {
  const navigate = useNavigate();
  const startSession = useLiveStore((s) => s.startSession);
  const startSimulation = useLiveStore((s) => s.startSimulation);

  const [roomName, setRoomName] = useState("");
  const [eventType, setEventType] = useState("");
  const [handlerName, setHandlerName] = useState("");
  const [brandBannedWords, setBrandBannedWords] = useState<string[]>([]);
  const [sensitiveTopics, setSensitiveTopics] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!roomName.trim()) newErrors.roomName = "请输入直播间名称";
    if (!eventType) newErrors.eventType = "请选择活动类型";
    if (!handlerName.trim()) newErrors.handlerName = "请输入房管名称";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStart = () => {
    if (!validate()) return;
    startSession({
      roomName: roomName.trim(),
      eventType,
      brandBannedWords,
      sensitiveTopics,
      startTime: Date.now(),
      isActive: true,
      handlerName: handlerName.trim(),
    });
    startSimulation();
    navigate("/monitor");
  };

  return (
    <div className="min-h-screen bg-[#0A0C12] flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/20 mb-5">
            <MonitorPlay className="text-red-400" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            弹幕盯屏工具
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            直播风控 · 实时处置 · 智能复盘
          </p>
        </div>

        <div className="bg-[#1A1D28] rounded-2xl border border-[#2A2D3A] p-8 space-y-6">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Radio size={14} className="text-red-400" />
            <span>直播配置</span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">直播间名称 *</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="例如：双11品牌专场"
              className="w-full rounded-lg border border-[#2A2D3A] bg-[#0F1117] px-4 py-2.5 text-sm text-gray-200 outline-none placeholder-gray-600 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
            />
            {errors.roomName && (
              <p className="text-xs text-red-400">{errors.roomName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">活动类型 *</label>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setEventType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    eventType === type
                      ? "bg-red-500/20 text-red-400 border border-red-500/40"
                      : "bg-[#0F1117] text-gray-500 border border-[#2A2D3A] hover:border-gray-600 hover:text-gray-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            {errors.eventType && (
              <p className="text-xs text-red-400">{errors.eventType}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">房管名称 *</label>
            <input
              type="text"
              value={handlerName}
              onChange={(e) => setHandlerName(e.target.value)}
              placeholder="你的昵称，用于处置留痕"
              className="w-full rounded-lg border border-[#2A2D3A] bg-[#0F1117] px-4 py-2.5 text-sm text-gray-200 outline-none placeholder-gray-600 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
            />
            {errors.handlerName && (
              <p className="text-xs text-red-400">{errors.handlerName}</p>
            )}
          </div>

          <div className="h-px bg-[#2A2D3A]" />

          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Shield size={14} className="text-orange-400" />
            <span>风险词库</span>
          </div>

          <TagInput
            label="品牌禁词"
            placeholder="输入品牌禁词后回车，如：竞品名"
            tags={brandBannedWords}
            onChange={setBrandBannedWords}
          />

          <TagInput
            label="当晚敏感话题"
            placeholder="输入敏感话题后回车，如：某热点事件"
            tags={sensitiveTopics}
            onChange={setSensitiveTopics}
          />

          <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <AlertTriangle size={14} className="text-orange-400 mt-0.5 shrink-0" />
            <p className="text-xs text-orange-300/80">
              系统已预置辱骂、人身攻击、诱导维权、涉政擦边、恶意带节奏等分类关键词，品牌禁词和敏感话题将作为额外规则叠加生效。
            </p>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold text-sm tracking-wide hover:from-red-500 hover:to-orange-500 transition-all active:scale-[0.98] shadow-lg shadow-red-500/20"
          >
            开启盯屏
          </button>
        </div>

        <p className="text-center text-gray-700 text-xs mt-6">
          弹幕数据为本地模拟，无需连接真实直播间
        </p>
      </div>
    </div>
  );
}
