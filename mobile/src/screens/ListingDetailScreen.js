import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import api from '../services/api';

const FALLBACK = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800';

function fmt(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

export default function ListingDetailScreen() {
  const route = useRoute();
  const { id } = route.params;
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .get(`/listings/${id}`)
      .then((r) => setListing(r.data))
      .catch(() => Alert.alert('Error', 'Failed to load listing'))
      .finally(() => setLoading(false));
  }, [id]);

  async function toggleSave() {
    try {
      if (saved) {
        await api.delete(`/listings/${id}/save`);
        setSaved(false);
      } else {
        await api.post(`/listings/${id}/save`);
        setSaved(true);
      }
    } catch {
      Alert.alert('Error', 'Please log in to save listings');
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Listing not found.</Text>
      </View>
    );
  }

  const img = listing.images?.[0]?.url || FALLBACK;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: img }} style={styles.heroImage} resizeMode="cover" />

      <View style={styles.body}>
        {/* Price & Save */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>{fmt(listing.price)}</Text>
          <TouchableOpacity onPress={toggleSave}>
            <Text style={styles.saveIcon}>{saved ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.address}>
          {listing.address}
          {listing.city ? `, ${listing.city}` : ''}
          {listing.state ? `, ${listing.state}` : ''}
        </Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          {listing.bedrooms != null && (
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Beds</Text>
              <Text style={styles.statValue}>{listing.bedrooms}</Text>
            </View>
          )}
          {listing.bathrooms != null && (
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Baths</Text>
              <Text style={styles.statValue}>{listing.bathrooms}</Text>
            </View>
          )}
          {listing.area_sqft != null && (
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Sqft</Text>
              <Text style={styles.statValue}>{Number(listing.area_sqft).toLocaleString()}</Text>
            </View>
          )}
          {listing.property_type && (
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Type</Text>
              <Text style={[styles.statValue, styles.capitalize]}>{listing.property_type}</Text>
            </View>
          )}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Description */}
        {listing.description ? (
          <>
            <Text style={styles.sectionTitle}>About this property</Text>
            <Text style={styles.description}>{listing.description}</Text>
          </>
        ) : null}

        {/* Agent */}
        {listing.agent_name ? (
          <View style={styles.agentCard}>
            <View style={styles.agentAvatar}>
              <Text style={styles.agentAvatarText}>{listing.agent_name[0]}</Text>
            </View>
            <View style={styles.agentInfo}>
              <Text style={styles.agentName}>{listing.agent_name}</Text>
              <Text style={styles.agentEmail}>{listing.agent_email}</Text>
            </View>
          </View>
        ) : null}

        {/* Status badge */}
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Status: </Text>
          <Text style={[styles.statusValue, listing.status === 'active' && styles.statusActive]}>
            {listing.status}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#6b7280', fontSize: 16 },
  heroImage: { width: '100%', height: 260 },
  body: { padding: 20 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  price: { fontSize: 26, fontWeight: 'bold', color: '#2563eb' },
  saveIcon: { fontSize: 26 },
  title: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 4 },
  address: { fontSize: 14, color: '#6b7280', marginBottom: 16 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  stat: { backgroundColor: '#eff6ff', borderRadius: 8, padding: 10, minWidth: 70, alignItems: 'center' },
  statLabel: { fontSize: 11, color: '#6b7280', marginBottom: 2 },
  statValue: { fontSize: 15, fontWeight: '700', color: '#1d4ed8' },
  capitalize: { textTransform: 'capitalize' },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 8, color: '#111827' },
  description: { fontSize: 14, color: '#374151', lineHeight: 22 },
  agentCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#f9fafb', borderRadius: 12, padding: 14, marginTop: 20 },
  agentAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center' },
  agentAvatarText: { fontSize: 20, fontWeight: 'bold', color: '#2563eb' },
  agentInfo: { flex: 1 },
  agentName: { fontWeight: '600', fontSize: 15 },
  agentEmail: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  statusRow: { flexDirection: 'row', marginTop: 16, alignItems: 'center' },
  statusLabel: { fontSize: 13, color: '#6b7280' },
  statusValue: { fontSize: 13, fontWeight: '600', color: '#6b7280', textTransform: 'capitalize' },
  statusActive: { color: '#16a34a' },
});
