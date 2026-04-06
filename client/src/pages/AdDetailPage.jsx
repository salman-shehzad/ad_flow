import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DEFAULT_PLACEHOLDER_IMAGE } from "@shared/index";
import { api } from "../api/http";
import { StatusBadge } from "../components/StatusBadge";
import { formatCurrency, formatDate } from "../utils/formatters";

export const AdDetailPage = () => {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/ads/${id}`).then(setAd).catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return <div className="container-shell"><div className="panel text-red-600">{error}</div></div>;
  }

  if (!ad) {
    return <div className="container-shell"><div className="panel">Loading ad...</div></div>;
  }

  const hero = ad.media?.[0]?.thumbnail_url || DEFAULT_PLACEHOLDER_IMAGE;

  return (
    <div className="container-shell grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="panel overflow-hidden p-0">
        <img src={hero} alt={ad.title} className="h-80 w-full object-cover" onError={(e) => { e.currentTarget.src = DEFAULT_PLACEHOLDER_IMAGE; }} />
        <div className="space-y-5 p-8">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={ad.status} />
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{ad.category_name}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{ad.city_name}</span>
          </div>
          <h1 className="text-4xl font-bold">{ad.title}</h1>
          <p className="text-lg leading-8 text-slate-600">{ad.description}</p>
        </div>
      </div>
      <aside className="panel space-y-4">
        <h2 className="text-2xl font-bold">Campaign info</h2>
        <div className="space-y-3 text-sm text-slate-600">
          <p><span className="font-semibold text-slate-900">Owner:</span> {ad.owner_name}</p>
          <p><span className="font-semibold text-slate-900">Package:</span> {ad.package_name}</p>
          <p><span className="font-semibold text-slate-900">Price:</span> {formatCurrency(ad.package_price)}</p>
          <p><span className="font-semibold text-slate-900">Publish at:</span> {formatDate(ad.publish_at)}</p>
          <p><span className="font-semibold text-slate-900">Expire at:</span> {formatDate(ad.expire_at)}</p>
        </div>
      </aside>
    </div>
  );
};
