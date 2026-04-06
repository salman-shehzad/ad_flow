import { Link } from "react-router-dom";
import { DEFAULT_PLACEHOLDER_IMAGE } from "@shared/index";
import { StatusBadge } from "./StatusBadge";
import { formatCurrency, formatDate } from "../utils/formatters";

export const AdCard = ({ ad, showStatus = false }) => {
  const image = ad.media?.[0]?.thumbnail_url || DEFAULT_PLACEHOLDER_IMAGE;

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card transition hover:-translate-y-1">
      <img
        src={image}
        alt={ad.title}
        className="h-52 w-full object-cover"
        onError={(event) => {
          event.currentTarget.src = DEFAULT_PLACEHOLDER_IMAGE;
        }}
      />
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-brand-teal">{ad.category_name || "Marketplace"}</p>
            <h3 className="mt-1 text-xl font-bold">{ad.title}</h3>
          </div>
          {showStatus ? <StatusBadge status={ad.status} /> : null}
        </div>
        <p className="line-clamp-3 text-sm text-slate-600">{ad.description}</p>
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>{ad.city_name || "Unknown city"}</span>
          <span>{formatCurrency(ad.package_price)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">Publishes {formatDate(ad.publish_at)}</span>
          <Link to={`/ads/${ad.id}`} className="font-semibold text-brand-teal">
            View details
          </Link>
        </div>
      </div>
    </article>
  );
};
