import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Table from '../components/Table';
import { ads } from '../data/ads';

const AdminDashboard = () => {
  const [paymentStatus, setPaymentStatus] = useState('Pending');
  const [schedule, setSchedule] = useState('Now');

  const sidebarItems = [
    { path: '/dashboard/admin', label: 'Payments' },
    { path: '/dashboard/admin/schedule', label: 'Schedule Ads' }
  ];

  const columns = [
    { key: 'title', title: 'Title' },
    { key: 'seller', title: 'Seller' },
    { key: 'status', title: 'Status' },
    { key: 'action', title: 'Verify', render: row => <button onClick={() => setPaymentStatus('Verified')}>Verify</button> }
  ];

  return (
    <main className="dashboard page">
      <Sidebar items={sidebarItems} />
      <section className="dashboard-content">
        <h2>Admin Dashboard</h2>
        <div className="card">
          <h3>Payments</h3>
          <p>Current payment status: {paymentStatus}</p>
          <Table columns={columns} data={ads} />
        </div>

        <div className="card">
          <h3>Schedule Ads</h3>
          <select value={schedule} onChange={e => setSchedule(e.target.value)}>
            <option>Now</option>
            <option>Next Week</option>
            <option>Next Month</option>
          </select>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;
