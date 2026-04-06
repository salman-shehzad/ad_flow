import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/http";
import { AdCard } from "../../components/AdCard";
import { StatCard } from "../../components/StatCard";

export const ModeratorPanelPage = () => {
  const [ads, setAds] = useState([]);
  const [notes, setNotes] = useState({});

  const load = () => api.get("/moderator/review-queue").then(setAds);

  useEffect(() => {
    load().catch(() => setAds([]));
  }, []);

  const summary = useMemo(
    () => ({
      total: ads.length,
      submitted: ads.filter((ad) => ad.status === "Submitted").length,
      underReview: ads.filter((ad) => ad.status === "Under Review").length,
    }),
    [ads],
  );

  const submitReview = async (adId, approved) => {
    await api.patch(`/moderator/ads/${adId}/review`, {
      approved,
      note: notes[adId] || "",
    });
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Queue size" value={summary.total} />
        <StatCard label="Submitted" value={summary.submitted} />
        <StatCard label="Under review" value={summary.underReview} />
      </div>
      <div className="panel">
        <h1 className="text-3xl font-bold">Moderator review queue</h1>
        <p className="mt-2 text-sm text-slate-500">Approve ads into payment flow or reject them with notes for the client.</p>
      </div>
      {ads.length === 0 ? <div className="panel text-slate-500">No ads are waiting for moderation right now.</div> : null}
      <div className="grid gap-6 xl:grid-cols-2">
        {ads.map((ad) => (
          <div key={ad.id} className="panel space-y-4">
            <AdCard ad={ad} showStatus />
            <textarea className="input min-h-24" placeholder="Review note" value={notes[ad.id] || ""} onChange={(e) => setNotes((current) => ({ ...current, [ad.id]: e.target.value }))} />
            <div className="flex gap-3">
              <button type="button" className="btn-primary" onClick={() => submitReview(ad.id, true)}>Approve</button>
              <button type="button" className="btn-secondary" onClick={() => submitReview(ad.id, false)}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
