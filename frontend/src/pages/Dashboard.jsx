import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ListingCard from '../components/ListingCard';

const TABS = ['Saved Listings', 'My Listings', 'Profile'];

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function Dashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [saved, setSaved] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [loadingMine, setLoadingMine] = useState(false);
  const [profile, setProfile] = useState({ name: user?.name || '', phone: '', bio: '' });

  useEffect(() => {
    if (tab === 0) {
      setLoadingSaved(true);
      api.get('/listings/saved')
        .then((r) => setSaved(r.data))
        .catch(() => toast.error('Failed to load saved listings'))
        .finally(() => setLoadingSaved(false));
    } else if (tab === 1) {
      setLoadingMine(true);
      api.get('/users/my-listings')
        .then((r) => setMyListings(r.data))
        .catch(() => toast.error('Failed to load your listings'))
        .finally(() => setLoadingMine(false));
    } else if (tab === 2) {
      api.get('/users/profile').then((r) => {
        setProfile({ name: r.data.name || '', phone: r.data.phone || '', bio: r.data.bio || '' });
      });
    }
  }, [tab]);

  async function saveProfile(e) {
    e.preventDefault();
    try {
      await api.put('/users/profile', profile);
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    }
  }

  async function removeSaved(id) {
    try {
      await api.delete(`/listings/${id}/save`);
      setSaved((prev) => prev.filter((l) => l.id !== id));
      toast.success('Removed from saved');
    } catch {
      toast.error('Failed to remove');
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-2xl">
          {user?.name?.[0] || '?'}
        </div>
        <div>
          <h1 className="text-xl font-bold">{user?.name}</h1>
          <p className="text-gray-500 text-sm">{user?.email} · <span className="capitalize">{user?.role}</span></p>
        </div>
        {(user?.role === 'agent' || user?.role === 'admin') && (
          <Link to="/listings/new" className="btn-primary ml-auto text-sm px-4 py-2">
            + New Listing
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === i ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Saved Listings tab */}
      {tab === 0 && (
        loadingSaved ? (
          <p className="text-gray-400">Loading…</p>
        ) : saved.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-3xl mb-3">🤍</p>
            <p>No saved listings yet.</p>
            <Link to="/listings" className="btn-primary mt-4 inline-block">Browse listings</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {saved.map((l) => (
              <div key={l.id} className="relative">
                <ListingCard listing={l} />
                <button
                  onClick={() => removeSaved(l.id)}
                  className="absolute top-2 right-2 text-xs bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {/* My Listings tab */}
      {tab === 1 && (
        loadingMine ? (
          <p className="text-gray-400">Loading…</p>
        ) : myListings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-3xl mb-3">🏠</p>
            <p>You haven&apos;t posted any listings yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myListings.map((l) => (
              <div key={l.id} className="card p-4 flex items-center gap-4">
                <img
                  src={l.images?.[0]?.url || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200'}
                  alt={l.title}
                  className="w-20 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{l.title}</p>
                  <p className="text-sm text-gray-500">{l.city}, {l.state}</p>
                  <p className="text-primary-600 font-bold">{fmt(l.price)}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${l.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        )
      )}

      {/* Profile tab */}
      {tab === 2 && (
        <form onSubmit={saveProfile} className="max-w-lg space-y-4">
          <div>
            <label className="label">Full name</label>
            <input className="input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          </div>
          <div>
            <label className="label">Bio</label>
            <textarea className="input" rows={4} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary px-6 py-2">Save changes</button>
        </form>
      )}
    </div>
  );
}
