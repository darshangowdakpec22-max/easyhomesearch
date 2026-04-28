import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import ListingsMap from '../components/Map';
import { useAuth } from '../context/AuthContext';

const FALLBACK = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900';

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .get(`/listings/${id}`)
      .then((r) => setListing(r.data))
      .catch(() => toast.error('Failed to load listing'))
      .finally(() => setLoading(false));
  }, [id]);

  async function toggleSave() {
    if (!user) { toast.info('Please log in to save listings'); return; }
    try {
      if (saved) {
        await api.delete(`/listings/${id}/save`);
        setSaved(false);
        toast.success('Removed from saved');
      } else {
        await api.post(`/listings/${id}/save`);
        setSaved(true);
        toast.success('Listing saved!');
      }
    } catch {
      toast.error('Action failed');
    }
  }

  if (loading) return <div className="flex justify-center py-20 text-gray-400">Loading…</div>;
  if (!listing) return <div className="text-center py-20 text-gray-500">Listing not found.</div>;

  const img = listing.images?.[0]?.url || FALLBACK;
  const singleListing = listing.lat && listing.lng ? [listing] : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link to="/listings" className="text-primary-600 hover:underline text-sm mb-4 inline-block">
        ← Back to listings
      </Link>

      <div className="card overflow-hidden">
        <img src={img} alt={listing.title} className="w-full h-72 object-cover" />
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
              <p className="text-gray-500 mt-1">
                {listing.address}{listing.city ? `, ${listing.city}` : ''}{listing.state ? `, ${listing.state}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary-600">{fmt(listing.price)}</span>
              <button
                onClick={toggleSave}
                className={`text-2xl transition ${saved ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                title="Save listing"
              >
                {saved ? '❤️' : '🤍'}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-6 py-4 border-t border-b border-gray-100 text-sm text-gray-700">
            {listing.bedrooms != null && <div><p className="text-xs text-gray-400">Bedrooms</p><p className="font-semibold">{listing.bedrooms}</p></div>}
            {listing.bathrooms != null && <div><p className="text-xs text-gray-400">Bathrooms</p><p className="font-semibold">{listing.bathrooms}</p></div>}
            {listing.area_sqft != null && <div><p className="text-xs text-gray-400">Area</p><p className="font-semibold">{Number(listing.area_sqft).toLocaleString()} sqft</p></div>}
            {listing.property_type && <div><p className="text-xs text-gray-400">Type</p><p className="font-semibold capitalize">{listing.property_type}</p></div>}
            <div><p className="text-xs text-gray-400">Status</p><p className={`font-semibold capitalize ${listing.status === 'active' ? 'text-green-600' : ''}`}>{listing.status}</p></div>
          </div>

          {/* Description */}
          {listing.description && (
            <div className="mt-6">
              <h2 className="font-semibold mb-2">About this property</h2>
              <p className="text-gray-600 leading-relaxed">{listing.description}</p>
            </div>
          )}

          {/* Agent */}
          {listing.agent_name && (
            <div className="mt-6 flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              {listing.agent_avatar ? (
                <img src={listing.agent_avatar} alt={listing.agent_name} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">
                  {listing.agent_name[0]}
                </div>
              )}
              <div>
                <p className="font-semibold">{listing.agent_name}</p>
                <p className="text-sm text-gray-500">{listing.agent_email}</p>
              </div>
              <a href={`mailto:${listing.agent_email}`} className="btn-primary ml-auto text-sm px-4 py-2">
                Contact Agent
              </a>
            </div>
          )}

          {/* Map */}
          {singleListing.length > 0 && (
            <div className="mt-6">
              <h2 className="font-semibold mb-3">Location</h2>
              <div className="h-64">
                <ListingsMap
                  listings={singleListing}
                  center={[Number(listing.lat), Number(listing.lng)]}
                  zoom={14}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
