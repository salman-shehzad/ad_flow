import { useParams } from 'react-router-dom';
import { ads } from '../data/ads';
import EmptyState from '../components/EmptyState';

const AdDetails = () => {
  const { id } = useParams();
  const ad = ads.find(item => String(item.id) === id);

  if (!ad) return <EmptyState message="Ad not found." />;

  return (
    <main className="page ad-details-page">
      <h2>{ad.title}</h2>
      <div className="ad-details-grid">
        <img src={ad.media[0]} alt={ad.title} />
        <div>
          <p>{ad.description}</p>
          <ul>
            <li>Category: {ad.category}</li>
            <li>City: {ad.city}</li>
            <li>Price: {ad.price}</li>
            <li>Seller: {ad.seller}</li>
            <li>Status: {ad.status}</li>
            <li>Expiry: {ad.expiry}</li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default AdDetails;
