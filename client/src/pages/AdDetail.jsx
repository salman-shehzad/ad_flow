import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { request } from '../api/http';

export default function AdDetail() {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  useEffect(() => { request(`/api/ads/${id}`).then(setAd).catch(console.error); }, [id]);
  if (!ad) return <p>Loading...</p>;
  return <div className="bg-white border rounded p-6"><h1 className="text-2xl font-bold">{ad.title}</h1><p className="mt-4">{ad.description}</p><span className="inline-block mt-4 text-xs bg-emerald-100 px-2 py-1 rounded">{ad.status}</span></div>;
}
