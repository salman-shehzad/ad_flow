import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/http";
import { AdCard } from "../components/AdCard";

export const HomePage = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    api.get("/ads?limit=6").then(setAds).catch(() => setAds([]));
  }, []);

  return (
    <div className="container-shell space-y-16">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-brand-mist px-4 py-2 text-sm font-semibold text-brand-teal">
            Workflow-first sponsored ads marketplace
          </span>
          <h1 className="max-w-3xl text-5xl font-extrabold leading-tight sm:text-6xl">
            Launch, moderate, schedule, and rank ads with production-ready control.
          </h1>
          <p className="max-w-2xl text-lg text-slate-600">
            AdFlow Pro gives clients a guided ad pipeline while moderators and admins control quality, publishing windows, and marketplace visibility.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/explore" className="btn-primary">Explore live ads</Link>
            <Link to="/register" className="btn-secondary">Create client account</Link>
          </div>
        </div>
        <div className="panel bg-white/70">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Draft to Expired", "Complete lifecycle control"],
              ["Moderator approval", "Ads go live after review"],
              ["Role-based access", "Client, moderator, admin, super admin"],
              ["Ranking engine", "Featured + freshness + admin boost"],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-3xl border border-slate-100 bg-white p-5">
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm text-slate-500">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-teal">Featured marketplace</p>
            <h2 className="mt-2 text-3xl font-bold">Published ads sorted by rank</h2>
          </div>
          <Link to="/explore" className="btn-secondary">See all</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {ads.map((ad) => <AdCard key={ad.id} ad={ad} />)}
        </div>
      </section>
    </div>
  );
};
