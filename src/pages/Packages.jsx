import { packages } from '../data/packages';

const Packages = () => (
  <main className="page packages-page">
    <h2>Packages</h2>
    <div className="grid-3">
      {packages.map(pkg => (
        <article className="package-card" key={pkg.id}>
          <h3>{pkg.name}</h3>
          <p className="price">{pkg.price}</p>
          <ul>{pkg.features.map(f => <li key={f}>{f}</li>)}</ul>
        </article>
      ))}
    </div>
  </main>
);

export default Packages;
