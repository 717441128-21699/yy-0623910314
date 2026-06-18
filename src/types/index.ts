export type RiskLabel =
  | "辱骂"
  | "人身攻击"
  | "诱导维权"
  | "涉政擦边"
  | "恶意带节奏"
  | "正常";

export type RiskLevel = "high" | "medium" | "low" | "none";

export type DispositionAction =
  | "提醒主播绕开"
  | "请求禁言"
  | "截图留证"
  | "暂不处理";

export interface Danmaku {
  id: string;
  content: string;
  timestamp: number;
  riskLabel: RiskLabel;
  riskLevel: RiskLevel;
  userId: string;
  userName: string;
}

export interface Disposition {
  id: string;
  danmakuId: string;
  action: DispositionAction;
  timestamp: number;
  handler: string;
  danmakuContent: string;
  riskLabel: RiskLabel;
}

export interface LiveSession {
  roomName: string;
  eventType: string;
  brandBannedWords: string[];
  sensitiveTopics: string[];
  startTime: number;
  endTime?: number;
  isActive: boolean;
  handlerName: string;
}

export interface PeakMinuteInfo {
  minute: number;
  total: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  topLabel: RiskLabel;
  labelDistribution: { label: RiskLabel; count: number }[];
}

export interface ReviewData {
  riskTimeline: { minute: number; highRisk: number; mediumRisk: number; lowRisk: number }[];
  peakMinutes: PeakMinuteInfo[];
  topRiskWords: { word: string; count: number; label: RiskLabel }[];
  dispositionStats: {
    total: number;
    processed: number;
    unprocessed: number;
    byAction: Record<DispositionAction, number>;
  };
  dispositionLog: Disposition[];
}

export const RISK_LABEL_COLORS: Record<RiskLabel, string> = {
  "辱骂": "#EF4444",
  "人身攻击": "#F97316",
  "诱导维权": "#EAB308",
  "涉政擦边": "#A855F7",
  "恶意带节奏": "#3B82F6",
  "正常": "#6B7280",
};

export const RISK_LABEL_BG: Record<RiskLabel, string> = {
  "辱骂": "bg-red-500/20 text-red-400 border-red-500/30",
  "人身攻击": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "诱导维权": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "涉政擦边": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "恶意带节奏": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "正常": "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export const RISK_LABEL_BORDER: Record<RiskLabel, string> = {
  "辱骂": "border-l-red-500",
  "人身攻击": "border-l-orange-500",
  "诱导维权": "border-l-yellow-500",
  "涉政擦边": "border-l-purple-500",
  "恶意带节奏": "border-l-blue-500",
  "正常": "border-l-gray-500",
};

export const RISK_LEVELS: Record<RiskLabel, RiskLevel> = {
  "辱骂": "high",
  "人身攻击": "high",
  "诱导维权": "medium",
  "涉政擦边": "high",
  "恶意带节奏": "medium",
  "正常": "none",
};

export const ALL_RISK_LABELS: RiskLabel[] = [
  "辱骂",
  "人身攻击",
  "诱导维权",
  "涉政擦边",
  "恶意带节奏",
  "正常",
];
