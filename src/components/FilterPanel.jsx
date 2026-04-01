const FilterPanel = ({ categories, cities, selected, setSelected, statuses }) => {
  return (
    <div className="filterpanel">
      <select value={selected.category} onChange={e => setSelected(prev => ({ ...prev, category: e.target.value }))}>
        <option value="">All categories</option>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={selected.city} onChange={e => setSelected(prev => ({ ...prev, city: e.target.value }))}>
        <option value="">All cities</option>
        {cities.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={selected.status} onChange={e => setSelected(prev => ({ ...prev, status: e.target.value }))}>
        <option value="">All status</option>
        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  );
};

export default FilterPanel;
