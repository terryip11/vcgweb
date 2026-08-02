import {
  getMemberProgressIndex,
  getMemberProgressVariant,
  MEMBER_PROGRESS_STEPS,
} from "@/lib/member/constants";
import type { LeadStatus } from "@/types";

interface LeadProgressBarProps {
  status: LeadStatus | string;
}

export default function LeadProgressBar({ status }: LeadProgressBarProps) {
  const leadStatus = status as LeadStatus;
  const currentIndex = getMemberProgressIndex(leadStatus);
  const variant = getMemberProgressVariant(leadStatus);
  const finalLabel =
    leadStatus === "closed_lost"
      ? "已結束"
      : leadStatus === "closed_won"
        ? "已完成"
        : MEMBER_PROGRESS_STEPS[3].label;

  return (
    <div className="w-full">
      <div className="flex items-center">
        {MEMBER_PROGRESS_STEPS.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isLast = index === MEMBER_PROGRESS_STEPS.length - 1;
          const label =
            isLast && (leadStatus === "closed_won" || leadStatus === "closed_lost")
              ? finalLabel
              : step.label;

          return (
            <div key={step.label} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                    isComplete
                      ? variant === "success"
                        ? "bg-emerald-600 text-white"
                        : variant === "muted"
                          ? "bg-slate-400 text-white"
                          : "bg-blue-600 text-white"
                      : isCurrent
                        ? variant === "success"
                          ? "bg-emerald-600 text-white ring-4 ring-emerald-100"
                          : variant === "muted"
                            ? "bg-slate-500 text-white ring-4 ring-slate-100"
                            : "bg-blue-600 text-white ring-4 ring-blue-100"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {isComplete ? "✓" : index + 1}
                </div>
                <p
                  className={`mt-2 hidden text-center text-xs font-medium sm:block ${
                    isCurrent ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {label}
                </p>
              </div>
              {!isLast && (
                <div
                  className={`mx-1 h-0.5 flex-1 sm:mx-2 ${
                    index < currentIndex
                      ? variant === "success"
                        ? "bg-emerald-400"
                        : variant === "muted"
                          ? "bg-slate-300"
                          : "bg-blue-400"
                      : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center text-xs font-medium text-slate-600 sm:hidden">
        {MEMBER_PROGRESS_STEPS[currentIndex]?.label}
        {leadStatus === "closed_lost" && " · 已結束"}
      </p>
    </div>
  );
}
