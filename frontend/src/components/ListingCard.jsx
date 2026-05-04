import { Link } from 'react-router-dom';

const FALLBACK = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600';

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function ListingCard({ listing }) {
  const img = listing.images?.[0]?.url || FALLBACK;
  return (
    <Link to={`/listings/${listing.id}`} className="card hover:shadow-md transition-shadow group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={img}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-full
          ${listing.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
          {listing.status}
        </span>
      </div>
      <div className="p-4">
        <p className="text-xl font-bold text-primary-600">{fmt(listing.price)}</p>
        <h3 className="font-semibold text-gray-900 mt-1 line-clamp-1">{listing.title}</h3>
        <p className="text-sm text-gray-500 mt-0.5">
          {listing.city}{listing.state ? `, ${listing.state}` : ''}
        </p>
        <div className="flex gap-3 mt-3 text-sm text-gray-600">
          {listing.bedrooms != null && <span>🛏 {listing.bedrooms} bd</span>}
          {listing.bathrooms != null && <span>🚿 {listing.bathrooms} ba</span>}
          {listing.area_sqft != null && (
            <span>📐 {Number(listing.area_sqft).toLocaleString()} sqft</span>
          )}
        </div>
      </div>
    </Link>
  );
}
