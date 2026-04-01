import { useMemo } from 'react';
import StatsCard from '../components/StatsCard';
import { ads } from '../data/ads';

const AnalyticsDashboard = () => {
  const summary = useMemo(() => ({
    totalAds: ads.length,
    active: ads.filter(a => a.status === 'Active').length,
    pending: ads.filter(a => a.status === 'Pending').length,
    rejected: ads.filter(a => a.status === 'Rejected').length,
  }), []);

  return (
    <main className="page analytics-page">
      <h2>Analytics Dashboard</h2>
      <div className="grid-4">
        <StatsCard title="Total Ads" value={summary.totalAds} icon="📈" />
        <StatsCard title="Active" value={summary.active} icon="✅" />
        <StatsCard title="Pending" value={summary.pending} icon="⏳" />
        <StatsCard title="Rejected" value={summary.rejected} icon="❌" />
      </div>
      <div className="chart-card">
        <h3>Category Distribution</h3>
        <ul>
          {Object.entries(ads.reduce((acc, ad) => ({ ...acc, [ad.category]: (acc[ad.category] || 0) + 1 }), {})).map(([key, value]) => (
            <li key={key}>{key}: {value}</li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default AnalyticsDashboard;
