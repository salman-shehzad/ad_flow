import { Link } from 'react-router-dom';

const AdCard = ({ ad }) => {
  return (
    <article className="adcard">
      <img src={ad.media[0]} alt={ad.title} className="adcard-img" />
      <div className="adcard-body">
        <h3>{ad.title}</h3>
        <p className="adcard-category">{ad.category} • {ad.city}</p>
        <p className="adcard-price">{ad.price}</p>
        <p>{ad.description}</p>
        <div className="adcard-meta">Seller: {ad.seller} • Expiry: {ad.expiry}</div>
        <Link to={`/ads/${ad.id}`} className="btn btn-small">View details</Link>
      </div>
    </article>
  );
};

export default AdCard;
