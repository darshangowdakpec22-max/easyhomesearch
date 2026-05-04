export default function SearchFilters({ filters, onChange, onSearch }) {
  function handle(e) {
    onChange({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <input
          className="input col-span-2 sm:col-span-3 lg:col-span-2"
          name="city"
          placeholder="City or address…"
          value={filters.city || ''}
          onChange={handle}
        />
        <select className="input" name="property_type" value={filters.property_type || ''} onChange={handle}>
          <option value="">All types</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="condo">Condo</option>
          <option value="townhouse">Townhouse</option>
          <option value="land">Land</option>
          <option value="commercial">Commercial</option>
        </select>
        <input
          className="input"
          type="number"
          name="min_price"
          placeholder="Min price"
          value={filters.min_price || ''}
          onChange={handle}
        />
        <input
          className="input"
          type="number"
          name="max_price"
          placeholder="Max price"
          value={filters.max_price || ''}
          onChange={handle}
        />
        <button onClick={onSearch} className="btn-primary">
          Search
        </button>
      </div>
      <div className="flex gap-3 mt-3 flex-wrap">
        <label className="flex items-center gap-1 text-sm text-gray-600">
          Min beds
          <select className="input w-20" name="min_beds" value={filters.min_beds || ''} onChange={handle}>
            <option value="">Any</option>
            {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}+</option>)}
          </select>
        </label>
        <label className="flex items-center gap-1 text-sm text-gray-600">
          Min baths
          <select className="input w-20" name="min_baths" value={filters.min_baths || ''} onChange={handle}>
            <option value="">Any</option>
            {[1,2,3].map((n) => <option key={n} value={n}>{n}+</option>)}
          </select>
        </label>
        <label className="flex items-center gap-1 text-sm text-gray-600">
          Sort
          <select className="input w-36" name="sort" value={filters.sort || 'created_at_desc'} onChange={handle}>
            <option value="created_at_desc">Newest</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
            <option value="beds_desc">Most beds</option>
          </select>
        </label>
      </div>
    </div>
  );
}
