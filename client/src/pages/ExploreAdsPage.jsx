import { useEffect, useState } from "react";
import { AdCard } from "../components/AdCard";
import { api } from "../api/http";

export const ExploreAdsPage = () => {
  const [ads, setAds] = useState([]);
  const [filters, setFilters] = useState({ categories: [], cities: [] });
  const [query, setQuery] = useState({ search: "", categoryId: "", cityId: "" });

  const fetchAds = async (params = query) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) search.set(key, value);
    });
    const data = await api.get(`/ads?${search.toString()}`);
    setAds(data);
  };

  useEffect(() => {
    api.get("/filters").then(setFilters).catch(() => undefined);
    fetchAds();
  }, []);

  return (
    <div className="container-shell space-y-8">
      <div className="panel grid gap-4 lg:grid-cols-4">
        <input
          className="input lg:col-span-2"
          placeholder="Search title or description"
          value={query.search}
          onChange={(event) => setQuery((current) => ({ ...current, search: event.target.value }))}
        />
        <select className="input" value={query.categoryId} onChange={(event) => setQuery((current) => ({ ...current, categoryId: event.target.value }))}>
          <option value="">All categories</option>
          {filters.categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <select className="input" value={query.cityId} onChange={(event) => setQuery((current) => ({ ...current, cityId: event.target.value }))}>
          <option value="">All cities</option>
          {filters.cities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <button className="btn-primary lg:col-span-4 lg:w-fit" type="button" onClick={() => fetchAds(query)}>
          Apply filters
        </button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {ads.map((ad) => <AdCard key={ad.id} ad={ad} />)}
      </div>
    </div>
  );
};
