import { BADGE_TONE_BY_STATUS } from "@shared/index";

export const StatusBadge = ({ status }) => (
  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${BADGE_TONE_BY_STATUS[status] || "bg-slate-100 text-slate-700"}`}>
    {status}
  </span>
);
