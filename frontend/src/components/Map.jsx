import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix missing default marker icons in Vite bundler
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function ListingsMap({ listings, center = [37.7749, -122.4194], zoom = 10 }) {
  return (
    <MapContainer center={center} zoom={zoom} className="w-full h-full rounded-xl z-0">
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {listings
        .filter((l) => l.lat && l.lng)
        .map((l) => (
          <Marker key={l.id} position={[Number(l.lat), Number(l.lng)]}>
            <Popup>
              <Link to={`/listings/${l.id}`} className="font-semibold text-primary-600 text-sm">
                {l.title}
              </Link>
              <p className="text-xs text-gray-600">{fmt(l.price)}</p>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
