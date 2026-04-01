import { packages } from '../data/packages';
import { ads } from '../data/ads';
import AdCard from '../components/AdCard';

const Home = () => {
  const featured = ads.slice(0, 3);

  return (
    <main className="page home-page">
      <section className="hero">
        <h1>AdFlow Pro</h1>
        <p>Smart, fast, modern ad management for your business.</p>
      </section>

      <section className="featured-section">
        <h2>Featured Ads</h2>
        <div className="grid-3">
          {featured.map(ad => <AdCard key={ad.id} ad={ad} />)}
        </div>
      </section>

      <section className="packages-section">
        <h2>Packages</h2>
        <div className="grid-3">
          {packages.map(pkg => (
            <article key={pkg.id} className="package-card">
              <h3>{pkg.name}</h3>
              <p className="price">{pkg.price}</p>
              <ul>{pkg.features.map(f => <li key={f}>{f}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
