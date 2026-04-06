import { useEffect, useState } from "react";
import { api } from "../api/http";
import { formatCurrency } from "../utils/formatters";

export const PackagesPage = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    api.get("/packages").then(setPackages).catch(() => setPackages([]));
  }, []);

  return (
    <div className="container-shell space-y-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-teal">Packages</p>
        <h1 className="mt-2 text-4xl font-bold">Choose the reach and ranking weight your campaign needs.</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {packages.map((item) => (
          <div key={item.id} className="panel relative overflow-hidden">
            {item.is_featured ? <span className="absolute right-4 top-4 rounded-full bg-brand-coral px-3 py-1 text-xs font-semibold text-white">Featured</span> : null}
            <h2 className="text-2xl font-bold">{item.name}</h2>
            <p className="mt-4 text-4xl font-extrabold">{formatCurrency(item.price)}</p>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <p>{item.duration_days} days live duration</p>
              <p>Ranking weight: {item.weight}</p>
              <p>{item.is_featured ? "Extra marketplace spotlight" : "Standard listing exposure"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
