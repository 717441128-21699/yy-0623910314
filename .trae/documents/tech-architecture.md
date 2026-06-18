## 1. 架构设计

```mermaid
flowchart TB
    subgraph "前端层"
        A["React + Vite + Tailwind"] --> B["配置页"]
        A --> C["实时弹幕窗"]
        A --> D["处置队列"]
        A --> E["复盘记录"]
    end
    subgraph "状态管理层"
        F["Zustand Store"] --> G["弹幕数据流"]
        F --> H["处置队列状态"]
        F --> I["配置信息"]
        F --> J["复盘数据"]
    end
    subgraph "模拟层"
        K["弹幕模拟引擎"] --> L["风险标签分类器"]
        K --> M["定时弹幕生成器"]
    end
    A --> F
    K --> F
```

## 2. 技术说明

- **前端**：React@18 + TypeScript + Tailwind CSS@3 + Vite
- **初始化工具**：vite-init（react-ts 模板）
- **后端**：无（纯前端应用，使用模拟数据）
- **数据库**：无（使用 Zustand + localStorage 持久化）
- **图表库**：recharts（用于折线图、饼图）
- **图标库**：lucide-react

## 3. 路由定义

| 路由 | 用途 |
|------|------|
| `/` | 配置页——输入直播间信息和风险词库 |
| `/monitor` | 盯屏主界面——实时弹幕窗 + 处置队列 + 统计面板 |
| `/review` | 复盘记录——风险时间线 + 词云 + 统计 + 日志 |

## 4. API 定义

无后端 API，使用前端弹幕模拟引擎生成模拟弹幕数据。

### 4.1 弹幕模拟引擎接口

```typescript
interface Danmaku {
  id: string;
  content: string;
  timestamp: number;
  riskLabel: RiskLabel;
  riskLevel: RiskLevel;
  userId: string;
  userName: string;
}

type RiskLabel =
  | "辱骂"
  | "人身攻击"
  | "诱导维权"
  | "涉政擦边"
  | "恶意带节奏"
  | "正常";

type RiskLevel = "high" | "medium" | "low" | "none";

interface Disposition {
  id: string;
  danmakuId: string;
  action: DispositionAction;
  timestamp: number;
  handler: string;
  danmakuContent: string;
  riskLabel: RiskLabel;
}

type DispositionAction =
  | "提醒主播绕开"
  | "请求禁言"
  | "截图留证"
  | "暂不处理";

interface LiveSession {
  roomName: string;
  eventType: string;
  brandBannedWords: string[];
  sensitiveTopics: string[];
  startTime: number;
  endTime?: number;
  isActive: boolean;
}

interface ReviewData {
  riskTimeline: { minute: number; count: number }[];
  topRiskWords: { word: string; count: number }[];
  dispositionStats: {
    total: number;
    processed: number;
    unprocessed: number;
    byAction: Record<DispositionAction, number>;
  };
  dispositionLog: Disposition[];
}
```

## 5. 服务器架构图

不适用（纯前端应用）

## 6. 数据模型

### 6.1 数据模型定义

```mermaid
erDiagram
    "LiveSession" ||--o{ "Danmaku" : "contains"
    "LiveSession" ||--o{ "Disposition" : "has"
    "Danmaku" ||--o| "Disposition" : "disposed_by"

    "LiveSession" {
        string roomName "直播间名称"
        string eventType "活动类型"
        string[] brandBannedWords "品牌禁词"
        string[] sensitiveTopics "敏感话题"
        number startTime "开始时间"
        number endTime "结束时间"
        boolean isActive "是否进行中"
    }

    "Danmaku" {
        string id "弹幕ID"
        string content "弹幕内容"
        number timestamp "时间戳"
        string riskLabel "风险标签"
        string riskLevel "风险等级"
        string userId "用户ID"
        string userName "用户名"
    }

    "Disposition" {
        string id "处置ID"
        string danmakuId "弹幕ID"
        string action "处置动作"
        number timestamp "处置时间"
        string handler "处理人"
    }
```

### 6.2 数据定义语言

不适用（使用 Zustand 内存状态 + localStorage 持久化，无关系型数据库）
