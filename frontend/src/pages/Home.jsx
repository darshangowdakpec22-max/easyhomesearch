import { Link, useNavigate } from 'react-router-dom';

const HERO_FEATURES = [
  { icon: '🗺️', title: 'Interactive Maps', desc: 'Explore listings on a live map with PostGIS geo-search.' },
  { icon: '🔍', title: 'Smart Filters', desc: 'Filter by price, beds, baths, type, and location radius.' },
  { icon: '❤️', title: 'Save Favorites', desc: 'Bookmark listings and revisit them from your dashboard.' },
  { icon: '🔒', title: 'Secure Auth', desc: 'JWT-based authentication with bcrypt password hashing.' },
];

export default function Home() {
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    const city = e.target.city.value.trim();
    navigate(`/listings${city ? `?city=${encodeURIComponent(city)}` : ''}`);
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Find Your Dream Home
          </h1>
          <p className="text-primary-100 text-lg mb-10">
            Search thousands of listings with powerful filters and an interactive map.
          </p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
            <input
              name="city"
              placeholder="Enter city, neighborhood, or zip…"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button type="submit" className="bg-white text-primary-700 font-semibold px-6 py-3 rounded-lg hover:bg-primary-50 transition">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-bold text-center mb-10">Why EasyHomeSearch?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HERO_FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="card p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">{icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-50 py-16 text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-gray-600 mb-8">Browse all listings or create a free account.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/listings" className="btn-primary px-6 py-3">Browse Listings</Link>
          <Link to="/register" className="btn-outline px-6 py-3">Create Account</Link>
        </div>
      </section>
    </div>
  );
}
