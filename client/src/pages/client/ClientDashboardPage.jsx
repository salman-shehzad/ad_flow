import { useEffect, useMemo, useState } from "react";
import { AD_STATUSES } from "@shared/index";
import { api } from "../../api/http";
import { AdCard } from "../../components/AdCard";
import { StatCard } from "../../components/StatCard";

const initialForm = {
  title: "",
  description: "",
  categoryId: "",
  cityId: "",
  packageId: "",
  publishAt: "",
  mediaUrls: "",
};

const editableStatuses = [AD_STATUSES.DRAFT, AD_STATUSES.REJECTED];

export const ClientDashboardPage = () => {
  const [dashboard, setDashboard] = useState({ summary: {}, ads: [] });
  const [filters, setFilters] = useState({ categories: [], cities: [] });
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [dashboardData, filtersData, packagesData] = await Promise.all([
      api.get("/client/dashboard"),
      api.get("/filters"),
      api.get("/packages"),
    ]);
    setDashboard(dashboardData);
    setFilters(filtersData);
    setPackages(packagesData);
  };

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  const editingAd = useMemo(
    () => dashboard.ads.find((ad) => ad.id === editingId) || null,
    [dashboard.ads, editingId],
  );

  const resetComposer = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const startEdit = (ad) => {
    setEditingId(ad.id);
    setForm({
      title: ad.title,
      description: ad.description,
      categoryId: String(ad.category_id || ""),
      cityId: String(ad.city_id || ""),
      packageId: String(ad.package_id || ""),
      publishAt: ad.publish_at ? new Date(ad.publish_at).toISOString().slice(0, 16) : "",
      mediaUrls: (ad.media || []).map((item) => item.original_url).join(", "),
    });
  };

  const handleCreateOrUpdate = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        categoryId: Number(form.categoryId),
        cityId: Number(form.cityId),
        packageId: Number(form.packageId),
        mediaUrls: form.mediaUrls.split(",").map((item) => item.trim()).filter(Boolean),
        publishAt: form.publishAt || undefined,
      };

      if (editingId) {
        await api.patch(`/client/ads/${editingId}`, payload);
      } else {
        await api.post("/client/ads", payload);
      }

      resetComposer();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForReview = async (adId) => {
    setError("");
    try {
      await api.patch(`/client/ads/${adId}`, { submit: true });
      if (editingId === adId) resetComposer();
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total ads" value={dashboard.summary.totalAds || 0} />
        <StatCard label="Published" value={dashboard.summary.publishedAds || 0} />
        <StatCard label="Pending review" value={dashboard.summary.pendingReview || 0} />
        <StatCard label="Scheduled" value={dashboard.summary.scheduledAds || 0} />
      </div>

      <section className="panel space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{editingAd ? "Revise campaign" : "Create a new ad draft"}</h2>
            <p className="mt-2 text-sm text-slate-500">Use comma-separated media URLs. YouTube links auto-generate thumbnails.</p>
          </div>
          {editingAd ? (
            <button type="button" className="btn-secondary" onClick={resetComposer}>
              Cancel edit
            </button>
          ) : null}
        </div>
        <form className="grid gap-4 lg:grid-cols-2" onSubmit={handleCreateOrUpdate}>
          <input className="input" placeholder="Campaign title" value={form.title} onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))} />
          <select className="input" value={form.packageId} onChange={(e) => setForm((current) => ({ ...current, packageId: e.target.value }))}>
            <option value="">Select package</option>
            {packages.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <select className="input" value={form.categoryId} onChange={(e) => setForm((current) => ({ ...current, categoryId: e.target.value }))}>
            <option value="">Select category</option>
            {filters.categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <select className="input" value={form.cityId} onChange={(e) => setForm((current) => ({ ...current, cityId: e.target.value }))}>
            <option value="">Select city</option>
            {filters.cities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <input className="input lg:col-span-2" type="datetime-local" value={form.publishAt} onChange={(e) => setForm((current) => ({ ...current, publishAt: e.target.value }))} />
          <textarea className="input min-h-32 lg:col-span-2" placeholder="Campaign description" value={form.description} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} />
          <textarea className="input min-h-24 lg:col-span-2" placeholder="Media URLs, comma separated" value={form.mediaUrls} onChange={(e) => setForm((current) => ({ ...current, mediaUrls: e.target.value }))} />
          {error ? <p className="text-sm text-red-600 lg:col-span-2">{error}</p> : null}
          <button className="btn-primary lg:col-span-2 lg:w-fit" disabled={saving} type="submit">
            {saving ? "Saving..." : editingAd ? "Update draft" : "Save draft"}
          </button>
        </form>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Your campaigns</h2>
        <div className="grid gap-6 xl:grid-cols-2">
          {dashboard.ads.map((ad) => (
            <div key={ad.id} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <AdCard ad={ad} showStatus />
              <p className="text-sm text-slate-500">
                Workflow state: {ad.status}. Approved ads are published right away or scheduled for their selected publish time.
              </p>
              <div className="flex flex-wrap gap-3">
                {editableStatuses.includes(ad.status) ? (
                  <button type="button" className="btn-secondary" onClick={() => startEdit(ad)}>
                    {ad.status === AD_STATUSES.REJECTED ? "Revise campaign" : "Edit draft"}
                  </button>
                ) : null}
                {editableStatuses.includes(ad.status) ? (
                  <button type="button" className="btn-primary" onClick={() => handleSubmitForReview(ad.id)}>
                    Submit for review
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
