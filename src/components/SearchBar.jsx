const SearchBar = ({ value, onChange, placeholder = 'Search ads...' }) => {
  return (
    <div className="searchbar">
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
      />
    </div>
  );
};

export default SearchBar;
