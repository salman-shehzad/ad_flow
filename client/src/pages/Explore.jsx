import { useEffect, useState } from 'react';
import { request } from '../api/http';
import AdCard from '../components/AdCard';

export default function Explore() {
  const [ads, setAds] = useState([]);
  const [q, setQ] = useState('');
  useEffect(() => { request(`/api/ads?q=${encodeURIComponent(q)}`).then(setAds).catch(console.error); }, [q]);
  return <div><h2 className="text-2xl font-semibold mb-4">Explore Ads</h2><input className="border p-2 rounded mb-4 w-full" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} /><div className="grid md:grid-cols-3 gap-4">{ads.map((ad) => <AdCard key={ad.id} ad={ad} />)}</div></div>;
}
