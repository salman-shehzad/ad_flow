import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/http";
import { StatCard } from "../../components/StatCard";
import { formatCurrency, formatDate } from "../../utils/formatters";

export const AdminDashboardPage = () => {
  const [analytics, setAnalytics] = useState({ totalAds: 0, activeAds: 0, revenueByPackage: [], approvalRate: 0 });
  const [payments, setPayments] = useState([]);
  const [readyAds, setReadyAds] = useState([]);
  const [notes, setNotes] = useState({});
  const [publishForms, setPublishForms] = useState({});
  const [error, setError] = useState("");

  const load = async () => {
    const [analyticsData, paymentsData, readyAdsData] = await Promise.all([
      api.get("/admin/analytics"),
      api.get("/admin/payment-queue"),
      api.get("/admin/ads/ready"),
    ]);
    setAnalytics(analyticsData);
    setPayments(paymentsData);
    setReadyAds(readyAdsData);
  };

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  const verifiedRevenue = useMemo(
    () => analytics.revenueByPackage.reduce((sum, item) => sum + Number(item.revenue || 0), 0),
    [analytics.revenueByPackage],
  );

  const reviewPayment = async (paymentId, approved) => {
    setError("");
    try {
      await api.patch(`/admin/payments/${paymentId}/verify`, {
        approved,
        note: notes[paymentId] || "",
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const publishAd = async (adId) => {
    setError("");
    try {
      const payload = publishForms[adId] || {};
      await api.patch(`/admin/ads/${adId}/publish`, {
        publishAt: payload.publishAt || undefined,
        adminBoost: payload.adminBoost ? Number(payload.adminBoost) : undefined,
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total ads" value={analytics.totalAds} />
        <StatCard label="Active ads" value={analytics.activeAds} />
        <StatCard label="Approval rate" value={`${analytics.approvalRate}%`} />
        <StatCard label="Verified revenue" value={formatCurrency(verifiedRevenue)} />
      </div>

      {error ? <div className="panel text-red-600">{error}</div> : null}

      <section className="panel space-y-5">
        <h2 className="text-2xl font-bold">Revenue by package</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {analytics.revenueByPackage.map((item) => (
            <div key={item.package_name} className="rounded-3xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">{item.package_name}</p>
              <p className="mt-2 text-2xl font-bold">{formatCurrency(item.revenue)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel space-y-5">
        <h2 className="text-2xl font-bold">Payment verification queue</h2>
        {payments.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-200 p-5 text-slate-500">No payment proofs are waiting for verification.</div> : null}
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="rounded-3xl border border-slate-200 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">{payment.ad_title}</h3>
                  <p className="text-sm text-slate-500">{payment.owner_name} • {payment.package_name}</p>
                  <a className="mt-2 inline-block text-sm font-semibold text-brand-teal" href={payment.screenshot_url} target="_blank" rel="noreferrer">View screenshot proof</a>
                </div>
                <p className="text-lg font-bold text-brand-ink">{formatCurrency(payment.amount)}</p>
              </div>
              <textarea className="input mt-4 min-h-24" placeholder="Verification note" value={notes[payment.id] || ""} onChange={(e) => setNotes((current) => ({ ...current, [payment.id]: e.target.value }))} />
              <div className="mt-4 flex gap-3">
                <button type="button" className="btn-primary" onClick={() => reviewPayment(payment.id, true)}>Verify</button>
                <button type="button" className="btn-secondary" onClick={() => reviewPayment(payment.id, false)}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel space-y-5">
        <h2 className="text-2xl font-bold">Ready to publish</h2>
        {readyAds.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-200 p-5 text-slate-500">No verified ads are waiting for scheduling or publishing.</div> : null}
        <div className="space-y-4">
          {readyAds.map((ad) => (
            <div key={ad.id} className="rounded-3xl border border-slate-200 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold">{ad.title}</h3>
                  <p className="text-sm text-slate-500">{ad.owner_name} • {ad.package_name}</p>
                  <p className="mt-1 text-sm text-slate-500">Current publish target: {formatDate(ad.publish_at)}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input className="input" type="datetime-local" value={publishForms[ad.id]?.publishAt || ""} onChange={(e) => setPublishForms((current) => ({ ...current, [ad.id]: { ...(current[ad.id] || {}), publishAt: e.target.value } }))} />
                  <input className="input" type="number" placeholder="Admin boost" value={publishForms[ad.id]?.adminBoost || ""} onChange={(e) => setPublishForms((current) => ({ ...current, [ad.id]: { ...(current[ad.id] || {}), adminBoost: e.target.value } }))} />
                </div>
              </div>
              <button type="button" className="btn-primary mt-4" onClick={() => publishAd(ad.id)}>Publish or schedule</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
