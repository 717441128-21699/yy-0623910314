import { useLiveStore } from "@/store/useLiveStore";
import { ALL_RISK_LABELS, RISK_LABEL_BG } from "@/types";
import type { RiskLabel } from "@/types";

export default function FilterBar() {
  const selectedLabels = useLiveStore((s) => s.selectedLabels);
  const toggleLabel = useLiveStore((s) => s.toggleLabel);

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-xs text-gray-600 mr-1">筛选：</span>
      {ALL_RISK_LABELS.map((label: RiskLabel) => {
        const isActive = selectedLabels.includes(label);
        return (
          <button
            key={label}
            onClick={() => toggleLabel(label)}
            className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all border ${
              isActive
                ? RISK_LABEL_BG[label]
                : "bg-[#0F1117] text-gray-600 border-[#2A2D3A] hover:border-gray-600"
            }`}
          >
            {label}
          </button>
        );
      })}
      {selectedLabels.length > 0 && (
        <button
          onClick={() => {
            selectedLabels.forEach((l) => toggleLabel(l));
          }}
          className="px-2 py-1 rounded-md text-[11px] text-gray-500 hover:text-gray-300 transition-colors"
        >
          清除
        </button>
      )}
    </div>
  );
}
