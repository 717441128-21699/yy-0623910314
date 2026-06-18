import type { Danmaku, RiskLabel, RiskLevel, LiveSession } from "@/types";
import { RISK_LEVELS } from "@/types";

export const RISK_KEYWORDS: Record<RiskLabel, string[]> = {
  "辱骂": ["垃圾", "废物", "滚", "傻", "蠢", "死", "恶心", "烂", "废", "贱", "狗", "猪"],
  "人身攻击": ["丑", "肥", "矮", "穷", "老", "秃", "瞎", "残疾", "长相", "外貌", "身材", "脸"],
  "诱导维权": ["退款", "维权", "投诉", "举报", "315", "消费者", "欺诈", "假货", "欺骗", "赔偿"],
  "涉政擦边": ["政治", "领导", "体制", "腐败", "民主", "自由", "人权", "敏感", "审查", "封锁"],
  "恶意带节奏": ["别买", "智商税", "割韭菜", "骗局", "套路", "坑人", "水军", "托", "演戏", "剧本"],
  "正常": [],
};

const NORMAL_PHRASES = [
  "哈哈哈哈", "666", "好厉害", "加油", "来了来了", "主播好美",
  "冲冲冲", "支持", "好看", "太棒了", "点赞", "牛啊",
  "第一次来", "关注了", "已下单", "好喜欢", "羡慕", "绝了",
  "上链接", "还有吗", "多少钱", "哪里买", "发货快吗", "质量怎么样",
];

const USER_NAMES = [
  "追光者", "小星星", "月光族", "暴富梦", "快乐水", "柠檬精",
  "干饭人", "夜猫子", "摸鱼王", "打工人", "颜值控", "剁手党",
  "吃瓜群众", "老铁", "路人甲", "潜水员", "冒泡鱼", "闯关者",
  "守护星", "追梦人", "开心果", "甜筒", "奶茶控", "小太阳",
];

function randomId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function classifyContent(
  content: string,
  session: LiveSession
): { label: RiskLabel; level: RiskLevel } {
  for (const topic of session.sensitiveTopics) {
    if (topic && content.includes(topic)) {
      return { label: "涉政擦边", level: "high" };
    }
  }

  for (const word of session.brandBannedWords) {
    if (word && content.includes(word)) {
      return { label: "恶意带节奏", level: "medium" };
    }
  }

  for (const [label, keywords] of Object.entries(RISK_KEYWORDS)) {
    if (label === "正常") continue;
    for (const keyword of keywords) {
      if (content.includes(keyword)) {
        return { label: label as RiskLabel, level: RISK_LEVELS[label as RiskLabel] };
      }
    }
  }

  return { label: "正常", level: "none" };
}

function generateContent(session: LiveSession): string {
  const riskRoll = Math.random();
  if (riskRoll < 0.15) {
    const riskLabels: RiskLabel[] = ["辱骂", "人身攻击", "诱导维权", "涉政擦边", "恶意带节奏"];
    const label = randomItem(riskLabels);
    const keywords = RISK_KEYWORDS[label];
    if (keywords.length > 0) {
      const keyword = randomItem(keywords);
      const templates = [
        `这个${keyword}东西`,
        `${keyword}了吧`,
        `真的${keyword}`,
        `太${keyword}了`,
        `${keyword}${keyword}的`,
        `别说了${keyword}`,
        `你们${keyword}吗`,
      ];
      return randomItem(templates);
    }
  }

  if (session.brandBannedWords.length > 0 && Math.random() < 0.1) {
    const word = randomItem(session.brandBannedWords);
    return `别买${word}了，智商税`;
  }

  if (session.sensitiveTopics.length > 0 && Math.random() < 0.05) {
    const topic = randomItem(session.sensitiveTopics);
    return `关于${topic}你怎么看`;
  }

  return randomItem(NORMAL_PHRASES);
}

export function generateDanmaku(session: LiveSession): Danmaku {
  const content = generateContent(session);
  const { label, level } = classifyContent(content, session);

  return {
    id: randomId(),
    content,
    timestamp: Date.now(),
    riskLabel: label,
    riskLevel: level,
    userId: randomId(),
    userName: randomItem(USER_NAMES),
  };
}

export function generateBatchDanmaku(session: LiveSession, count: number): Danmaku[] {
  return Array.from({ length: count }, () => generateDanmaku(session));
}
