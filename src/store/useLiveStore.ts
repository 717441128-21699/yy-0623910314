import { create } from "zustand";
import type {
  Danmaku,
  Disposition,
  LiveSession,
  ReviewData,
  RiskLabel,
  DispositionAction,
} from "@/types";
import { generateDanmaku } from "@/utils/danmakuSimulator";

interface LiveStore {
  session: LiveSession | null;
  danmakuList: Danmaku[];
  queueItems: Danmaku[];
  dispositions: Disposition[];
  selectedLabels: RiskLabel[];
  isSimulating: boolean;
  simulationInterval: ReturnType<typeof setInterval> | null;

  startSession: (session: LiveSession) => void;
  endSession: () => void;
  startSimulation: () => void;
  stopSimulation: () => void;
  addDanmaku: (danmaku: Danmaku) => void;
  addToQueue: (danmaku: Danmaku) => void;
  removeFromQueue: (danmakuId: string) => void;
  addDisposition: (danmakuId: string, action: DispositionAction) => void;
  toggleLabel: (label: RiskLabel) => void;
  setDanmakuList: (list: Danmaku[]) => void;
  getReviewData: () => ReviewData;
  reset: () => void;
}

export const useLiveStore = create<LiveStore>((set, get) => ({
  session: null,
  danmakuList: [],
  queueItems: [],
  dispositions: [],
  selectedLabels: [],
  isSimulating: false,
  simulationInterval: null,

  startSession: (session) => {
    set({
      session: { ...session, startTime: Date.now(), isActive: true },
      danmakuList: [],
      queueItems: [],
      dispositions: [],
      selectedLabels: [],
    });
  },

  endSession: () => {
    const { session, simulationInterval } = get();
    if (simulationInterval) {
      clearInterval(simulationInterval);
    }
    if (session) {
      set({
        session: { ...session, endTime: Date.now(), isActive: false },
        isSimulating: false,
        simulationInterval: null,
      });
    }
  },

  startSimulation: () => {
    const { session, simulationInterval } = get();
    if (simulationInterval) clearInterval(simulationInterval);
    if (!session) return;

    const interval = setInterval(() => {
      const state = get();
      if (!state.session?.isActive) return;

      const count = Math.random() < 0.3 ? Math.floor(Math.random() * 3) + 2 : 1;
      for (let i = 0; i < count; i++) {
        const danmaku = generateDanmaku(state.session);
        state.addDanmaku(danmaku);
      }
    }, 800 + Math.random() * 600);

    set({ isSimulating: true, simulationInterval: interval });
  },

  stopSimulation: () => {
    const { simulationInterval } = get();
    if (simulationInterval) {
      clearInterval(simulationInterval);
    }
    set({ isSimulating: false, simulationInterval: null });
  },

  addDanmaku: (danmaku) => {
    set((state) => {
      const newList = [danmaku, ...state.danmakuList].slice(0, 500);
      const newQueue =
        danmaku.riskLevel === "high" || danmaku.riskLevel === "medium"
          ? [danmaku, ...state.queueItems]
          : state.queueItems;
      return { danmakuList: newList, queueItems: newQueue };
    });
  },

  addToQueue: (danmaku) => {
    set((state) => {
      const exists = state.queueItems.some((d) => d.id === danmaku.id);
      if (exists) return state;
      return { queueItems: [danmaku, ...state.queueItems] };
    });
  },

  removeFromQueue: (danmakuId) => {
    set((state) => ({
      queueItems: state.queueItems.filter((d) => d.id !== danmakuId),
    }));
  },

  addDisposition: (danmakuId, action) => {
    const state = get();
    const danmaku = state.danmakuList.find((d) => d.id === danmakuId);
    if (!danmaku) return;

    const disposition: Disposition = {
      id: Math.random().toString(36).substring(2, 10) + Date.now().toString(36),
      danmakuId,
      action,
      timestamp: Date.now(),
      handler: state.session?.handlerName || "未知",
      danmakuContent: danmaku.content,
      riskLabel: danmaku.riskLabel,
    };

    set((state) => ({
      dispositions: [...state.dispositions, disposition],
      queueItems: state.queueItems.filter((d) => d.id !== danmakuId),
    }));
  },

  toggleLabel: (label) => {
    set((state) => {
      const exists = state.selectedLabels.includes(label);
      return {
        selectedLabels: exists
          ? state.selectedLabels.filter((l) => l !== label)
          : [...state.selectedLabels, label],
      };
    });
  },

  setDanmakuList: (list) => set({ danmakuList: list }),

  getReviewData: () => {
    const { danmakuList, dispositions, queueItems, session } = get();
    const startTime = session?.startTime || Date.now();

    const minuteMap = new Map<number, { highRisk: number; mediumRisk: number; lowRisk: number }>();
    const riskDanmaku = danmakuList.filter((d) => d.riskLevel !== "none");
    const maxMinute = Math.max(
      1,
      Math.floor((Date.now() - startTime) / 60000)
    );

    for (let m = 0; m <= maxMinute; m++) {
      minuteMap.set(m, { highRisk: 0, mediumRisk: 0, lowRisk: 0 });
    }

    riskDanmaku.forEach((d) => {
      const minute = Math.floor((d.timestamp - startTime) / 60000);
      const entry = minuteMap.get(minute);
      if (entry) {
        if (d.riskLevel === "high") entry.highRisk++;
        else if (d.riskLevel === "medium") entry.mediumRisk++;
        else if (d.riskLevel === "low") entry.lowRisk++;
      }
    });

    const riskTimeline = Array.from(minuteMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([minute, counts]) => ({ minute, ...counts }));

    const wordCount = new Map<string, number>();
    const stopWords = new Set(["的", "了", "是", "在", "我", "你", "他", "她", "它", "们", "这", "那", "有", "不", "就", "都", "也", "和", "与", "吗", "吧", "啊", "呢", "哦", "哈"]);
    riskDanmaku.forEach((d) => {
      const words = d.content.split("").filter((w) => w.trim() && !stopWords.has(w));
      words.forEach((w) => {
        wordCount.set(w, (wordCount.get(w) || 0) + 1);
      });
    });

    const topRiskWords = Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([word, count]) => ({ word, count }));

    const disposedIds = new Set(dispositions.map((d) => d.danmakuId));
    const unprocessed = queueItems.length + riskDanmaku.filter((d) => !disposedIds.has(d.id) && !queueItems.some((q) => q.id === d.id)).length;

    const byAction: Record<DispositionAction, number> = {
      "提醒主播绕开": 0,
      "请求禁言": 0,
      "截图留证": 0,
      "暂不处理": 0,
    };
    dispositions.forEach((d) => {
      byAction[d.action]++;
    });

    return {
      riskTimeline,
      topRiskWords,
      dispositionStats: {
        total: riskDanmaku.length,
        processed: dispositions.length,
        unprocessed,
        byAction,
      },
      dispositionLog: [...dispositions].sort((a, b) => b.timestamp - a.timestamp),
    };
  },

  reset: () => {
    const { simulationInterval } = get();
    if (simulationInterval) clearInterval(simulationInterval);
    set({
      session: null,
      danmakuList: [],
      queueItems: [],
      dispositions: [],
      selectedLabels: [],
      isSimulating: false,
      simulationInterval: null,
    });
  },
}));
