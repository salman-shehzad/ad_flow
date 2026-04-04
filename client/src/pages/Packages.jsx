export default function Packages() {
  const packages = [
    { name: 'Basic', price: '$19.99', details: '7 days listing' },
    { name: 'Standard', price: '$59.99', details: '15 days + weight boost' },
    { name: 'Premium', price: '$129.99', details: '30 days + featured' },
  ];
  return <div><h2 className="text-2xl font-semibold mb-4">Packages</h2><div className="grid md:grid-cols-3 gap-4">{packages.map((p) => <div key={p.name} className="bg-white border rounded p-4"><h3 className="font-bold">{p.name}</h3><p>{p.price}</p><p className="text-sm text-slate-500">{p.details}</p></div>)}</div></div>;
}
