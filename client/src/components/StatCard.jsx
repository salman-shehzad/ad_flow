export const StatCard = ({ label, value, helper }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">{label}</p>
    <p className="mt-3 text-3xl font-bold text-brand-ink">{value}</p>
    {helper ? <p className="mt-2 text-sm text-slate-500">{helper}</p> : null}
  </div>
);
