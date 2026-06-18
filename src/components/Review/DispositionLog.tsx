import { useState, useMemo } from "react";
import { useLiveStore } from "@/store/useLiveStore";
import { RISK_LABEL_BG } from "@/types";
import type { Disposition } from "@/types";
import { ClipboardList, Search, ArrowUpDown } from "lucide-react";

type SortField = "timestamp" | "riskLabel" | "action";

export default function DispositionLog() {
  const getReviewData = useLiveStore((s) => s.getReviewData);
  const { dispositionLog } = getReviewData();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    let list = [...dispositionLog];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.danmakuContent.toLowerCase().includes(q) ||
          d.action.includes(q) ||
          d.handler.includes(q) ||
          d.riskLabel.includes(q)
      );
    }
    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === "timestamp") cmp = a.timestamp - b.timestamp;
      else if (sortField === "riskLabel") cmp = a.riskLabel.localeCompare(b.riskLabel);
      else if (sortField === "action") cmp = a.action.localeCompare(b.action);
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [dispositionLog, search, sortField, sortAsc]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList size={14} className="text-blue-400" />
          <h3 className="text-sm font-medium text-gray-300">处置日志</h3>
          <span className="text-[10px] text-gray-600">({dispositionLog.length} 条)</span>
        </div>
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索..."
            className="pl-7 pr-3 py-1.5 rounded-lg bg-[#0F1117] border border-[#2A2D3A] text-xs text-gray-300 outline-none placeholder-gray-600 focus:border-blue-500/40 transition-all w-40"
          />
        </div>
      </div>

      <div className="rounded-lg border border-[#2A2D3A] overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#12141C] text-gray-500">
              <th className="text-left px-3 py-2 font-medium">
                <button onClick={() => toggleSort("timestamp")} className="flex items-center gap-1 hover:text-gray-300 transition-colors">
                  时间
                  <ArrowUpDown size={9} />
                </button>
              </th>
              <th className="text-left px-3 py-2 font-medium max-w-[240px]">弹幕原文</th>
              <th className="text-left px-3 py-2 font-medium">
                <button onClick={() => toggleSort("riskLabel")} className="flex items-center gap-1 hover:text-gray-300 transition-colors">
                  风险标签
                  <ArrowUpDown size={9} />
                </button>
              </th>
              <th className="text-left px-3 py-2 font-medium">
                <button onClick={() => toggleSort("action")} className="flex items-center gap-1 hover:text-gray-300 transition-colors">
                  处置动作
                  <ArrowUpDown size={9} />
                </button>
              </th>
              <th className="text-left px-3 py-2 font-medium">处理人</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-600">
                  暂无处置记录
                </td>
              </tr>
            ) : (
              filtered.map((d: Disposition) => (
                <tr
                  key={d.id}
                  className="border-t border-[#1A1D28] hover:bg-[#14161E] transition-colors"
                >
                  <td className="px-3 py-2 text-gray-500 font-mono whitespace-nowrap">
                    {formatTime(d.timestamp)}
                  </td>
                  <td className="px-3 py-2 text-gray-300 max-w-[240px] truncate">
                    {d.danmakuContent}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium border ${RISK_LABEL_BG[d.riskLabel]}`}
                    >
                      {d.riskLabel}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-400">{d.action}</td>
                  <td className="px-3 py-2 text-gray-500">{d.handler}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
