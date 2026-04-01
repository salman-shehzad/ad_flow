import { useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Table from '../components/Table';
import { ads } from '../data/ads';

const initialForm = { title: '', category: '', city: '', price: '' };

const ClientDashboard = () => {
  const [clientAds, setClientAds] = useState(ads);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAd, setNewAd] = useState(initialForm);

  const recently = useMemo(() => clientAds.slice(0, 5), [clientAds]);

  const addAd = e => {
    e.preventDefault();
    if (!newAd.title || !newAd.category || !newAd.city) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setClientAds(prev => [...prev, { ...newAd, id: Date.now(), status: 'Pending', expiry: '2026-07-31', seller: 'Client C', media: ['https://via.placeholder.com/400x250?text=New'] }]);
      setNewAd(initialForm);
      setIsSubmitting(false);
    }, 500);
  };

  const sidebarItems = [
    { path: '/dashboard/client', label: 'Overview' },
    { path: '/dashboard/client/create', label: 'Create Ad' },
    { path: '/dashboard/client/list', label: 'My Ads' }
  ];

  const columns = [
    { key: 'title', title: 'Title' },
    { key: 'category', title: 'Category' },
    { key: 'city', title: 'City' },
    { key: 'status', title: 'Status' }
  ];

  return (
    <main className="dashboard page">
      <Sidebar items={sidebarItems} />
      <section className="dashboard-content">
        <h2>Client Dashboard</h2>
        <div className="grid-2">
          <div className="card">
            <h3>Create New Ad</h3>
            <form onSubmit={addAd}>
              <input placeholder="Title" value={newAd.title} onChange={e => setNewAd(prev => ({ ...prev, title: e.target.value }))} />
              <input placeholder="Category" value={newAd.category} onChange={e => setNewAd(prev => ({ ...prev, category: e.target.value }))} />
              <input placeholder="City" value={newAd.city} onChange={e => setNewAd(prev => ({ ...prev, city: e.target.value }))} />
              <input placeholder="Price" type="number" value={newAd.price} onChange={e => setNewAd(prev => ({ ...prev, price: e.target.value }))} />
              <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Adding...' : 'Add Ad'}</button>
            </form>
          </div>

          <div className="card">
            <h3>Ad Status</h3>
            <Table columns={columns} data={recently} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default ClientDashboard;
