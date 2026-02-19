import { ReviewVerdict } from "@/lib/types";
import { VERDICT_CONFIG } from "@/lib/constants";

interface BadgeProps {
  verdict: ReviewVerdict;
}

export default function Badge({ verdict }: BadgeProps) {
  const config = VERDICT_CONFIG[verdict];
  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider ${config.color} ${config.textColor}`}
    >
      {config.label}
    </span>
  );
}
