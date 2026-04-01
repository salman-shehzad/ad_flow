import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Table from '../components/Table';
import { ads } from '../data/ads';

const ModeratorDashboard = () => {
  const [moderationAds, setModerationAds] = useState(ads);
  const [note, setNote] = useState('');

  const actions = (id, status) => {
    setModerationAds(prev => prev.map(ad => ad.id === id ? { ...ad, status } : ad));
    setNote('');
  };

  const columns = [
    { key: 'title', title: 'Title' },
    { key: 'seller', title: 'Seller' },
    { key: 'status', title: 'Status' },
    { key: 'action', title: 'Action', render: row => (
      <div className="table-actions">
        <button onClick={() => actions(row.id, 'Approved')}>Approve</button>
        <button onClick={() => actions(row.id, 'Rejected')}>Reject</button>
      </div>
    ) }
  ];

  const sidebarItems = [
    { path: '/dashboard/moderator', label: 'Review queue' },
    { path: '/dashboard/moderator/reports', label: 'Reports' }
  ];

  return (
    <main className="dashboard page">
      <Sidebar items={sidebarItems} />
      <section className="dashboard-content">
        <h2>Moderator Dashboard</h2>
        <p>Use notes for moderation feedback:</p>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add a moderator note (optional)..." />

        <Table columns={columns} data={moderationAds} />
      </section>
    </main>
  );
};

export default ModeratorDashboard;
