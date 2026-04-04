import { Link } from 'react-router-dom';

export default function AdCard({ ad }) {
  return (
    <div className="bg-white border rounded p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{ad.title}</h3>
        <span className="text-xs px-2 py-1 rounded bg-blue-100">{ad.status}</span>
      </div>
      <p className="text-sm text-slate-600 line-clamp-2">{ad.description}</p>
      <p className="text-xs mt-2 text-slate-500">{ad.city_name} • score {ad.rank_score}</p>
      <Link className="text-blue-600 text-sm" to={`/ads/${ad.id}`}>View details</Link>
    </div>
  );
}
