import { useEffect, useState } from 'react';
import { request } from '../api/http';

export default function AdminDashboard() {
  const [payments, setPayments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const load = () => { request('/api/admin/payment-queue').then(setPayments).catch(console.error); request('/api/admin/analytics').then(setAnalytics).catch(console.error); };
  useEffect(() => { load(); }, []);
  const verify = async (id, approved) => { await request(`/api/admin/payments/${id}/verify`, { method: 'PATCH', body: JSON.stringify({ approved }) }); load(); };
  return <div><h2 className="text-2xl mb-3 font-semibold">Admin Dashboard</h2>{analytics && <div className="grid md:grid-cols-4 gap-3 mb-4">{[['Total Ads', analytics.totalAds], ['Active Ads', analytics.activeAds], ['Approval Rate', `${analytics.approvalRate}%`], ['Revenue Packages', analytics.revenueByPackage.length]].map(([k, v]) => <div className="bg-white border rounded p-3" key={k}><p className="text-xs text-slate-500">{k}</p><p className="font-bold">{v}</p></div>)}</div>}<h3 className="font-semibold">Payment Queue</h3>{payments.map((p) => <div key={p.id} className="bg-white border p-3 rounded mb-2"><p>{p.title} - ${p.amount}</p><button className="bg-green-600 text-white px-2 py-1 rounded mr-2" onClick={() => verify(p.id, true)}>Verify</button><button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => verify(p.id, false)}>Reject</button></div>)}</div>;
}
