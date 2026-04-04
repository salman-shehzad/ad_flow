import { useEffect, useState } from 'react';
import { request } from '../api/http';

export default function ClientDashboard() {
  const [data, setData] = useState({ ads: [], payments: [] });
  useEffect(() => { request('/api/client/dashboard').then(setData).catch(console.error); }, []);
  return <div><h2 className="text-2xl font-semibold mb-3">Client Dashboard</h2><div className="grid md:grid-cols-2 gap-4"><div className="bg-white border rounded p-4"><h3 className="font-semibold">My Ads</h3>{data.ads.map((a) => <div key={a.id} className="text-sm border-b py-1">{a.title} <span className="text-xs">{a.status}</span></div>)}</div><div className="bg-white border rounded p-4"><h3 className="font-semibold">Payments</h3>{data.payments.map((p) => <div key={p.id} className="text-sm border-b py-1">{p.transaction_ref} - {p.status}</div>)}</div></div></div>;
}
