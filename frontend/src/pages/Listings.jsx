import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ListingCard from '../components/ListingCard';
import SearchFilters from '../components/SearchFilters';
import ListingsMap from '../components/Map';

const DEFAULT_FILTERS = {
  city: '',
  property_type: '',
  min_price: '',
  max_price: '',
  min_beds: '',
  min_baths: '',
  sort: 'created_at_desc',
};

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    city: searchParams.get('city') || '',
  });

  const fetchListings = useCallback(async (f = filters, p = page) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 12, ...Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '')) };
      const { data } = await api.get('/listings', { params });
      setListings(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  function handleSearch() {
    setPage(1);
    setSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '')));
    fetchListings(filters, 1);
  }

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <SearchFilters filters={filters} onChange={setFilters} onSearch={handleSearch} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-600 text-sm">
          {loading ? 'Loading…' : `${total} listing${total !== 1 ? 's' : ''} found`}
        </p>
        <button
          onClick={() => setShowMap((v) => !v)}
          className="btn-outline text-sm px-3 py-1.5"
        >
          {showMap ? '🗒️ List view' : '🗺️ Map view'}
        </button>
      </div>

      {showMap ? (
        <div className="h-[500px] mb-8">
          <ListingsMap listings={listings} />
        </div>
      ) : (
        <>
          {loading ? (
            <div className="flex justify-center py-16 text-gray-400">Loading listings…</div>
          ) : listings.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-2xl mb-2">🏠</p>
              <p>No listings found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                disabled={page === 1}
                onClick={() => { setPage((p) => p - 1); fetchListings(filters, page - 1); }}
                className="btn-outline px-4 py-2 disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">Page {page} / {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => { setPage((p) => p + 1); fetchListings(filters, page + 1); }}
                className="btn-outline px-4 py-2 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
