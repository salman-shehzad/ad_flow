import { useEffect, useMemo, useState } from 'react';
import AdCard from '../components/AdCard';
import FilterPanel from '../components/FilterPanel';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { ads } from '../data/ads';
import useDebouncedValue from '../hooks/useDebouncedValue';

const PER_PAGE = 3;

const ExploreAds = () => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ category: '', city: '', status: '' });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearch = useDebouncedValue(search, 250);

  const categories = [...new Set(ads.map(a => a.category))];
  const cities = [...new Set(ads.map(a => a.city.trim()))];
  const statuses = [...new Set(ads.map(a => a.status))];

  useEffect(() => {
    const id = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(id);
  }, [debouncedSearch, filters, page]);

  const filtered = useMemo(() => {
    const base = ads.filter(ad =>
      (filters.category ? ad.category === filters.category : true) &&
      (filters.city ? ad.city.trim() === filters.city : true) &&
      (filters.status ? ad.status === filters.status : true) &&
      (debouncedSearch ? ad.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || ad.description.toLowerCase().includes(debouncedSearch.toLowerCase()) : true)
    );
    return base;
  }, [debouncedSearch, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const visibleAds = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => setPage(1), [debouncedSearch, filters]);

  return (
    <main className="page explore-page">
      <h2>Explore Ads</h2>
      <SearchBar value={search} onChange={setSearch} />
      <FilterPanel categories={categories} cities={cities} statuses={statuses} selected={filters} setSelected={setFilters} />

      {isLoading ? <Loading /> : visibleAds.length === 0 ? <EmptyState message="No ads found." /> : (
        <div className="grid-3">
          {visibleAds.map(ad => <AdCard key={ad.id} ad={ad} />)}
        </div>
      )}

      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage(x => x - 1)}>Prev</button>
        <span>{page} / {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(x => x + 1)}>Next</button>
      </div>
    </main>
  );
};

export default ExploreAds;
