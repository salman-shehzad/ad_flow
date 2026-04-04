import { useEffect, useState } from 'react';
import { request } from '../api/http';

export default function ModeratorPanel() {
  const [items, setItems] = useState([]);
  const load = () => request('/api/moderator/review-queue').then(setItems).catch(console.error);
  useEffect(() => { load(); }, []);
  const review = async (id, approved) => { await request(`/api/moderator/ads/${id}/review`, { method: 'PATCH', body: JSON.stringify({ approved }) }); load(); };
  return <div><h2 className="text-2xl mb-3 font-semibold">Moderator Panel</h2>{items.map((ad) => <div key={ad.id} className="bg-white border p-3 rounded mb-2"><p>{ad.title}</p><div className="space-x-2"><button className="bg-green-600 text-white px-2 py-1 rounded" onClick={() => review(ad.id, true)}>Approve</button><button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => review(ad.id, false)}>Reject</button></div></div>)}</div>;
}
