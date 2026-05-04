import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';

function fmt(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

const FALLBACK = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400';

export default function ListingsScreen() {
  const nav = useNavigation();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const LIMIT = 10;

  async function fetchListings(c = city, p = 1) {
    setLoading(true);
    try {
      const params = { page: p, limit: LIMIT };
      if (c.trim()) params.city = c.trim();
      const { data } = await api.get('/listings', { params });
      setListings(p === 1 ? data.data : (prev) => [...prev, ...data.data]);
      setTotal(data.total || 0);
      setPage(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchListings(); }, []);

  function loadMore() {
    const totalPages = Math.ceil(total / LIMIT);
    if (!loading && page < totalPages) {
      fetchListings(city, page + 1);
    }
  }

  function renderItem({ item }) {
    const img = item.images?.[0]?.url || FALLBACK;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => nav.navigate('ListingDetail', { id: item.id })}
        activeOpacity={0.85}
      >
        <Image source={{ uri: img }} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.cardBody}>
          <Text style={styles.price}>{fmt(item.price)}</Text>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.location} numberOfLines={1}>
            {item.city}{item.state ? `, ${item.state}` : ''}
          </Text>
          <View style={styles.meta}>
            {item.bedrooms != null && <Text style={styles.metaItem}>🛏 {item.bedrooms}</Text>}
            {item.bathrooms != null && <Text style={styles.metaItem}>🚿 {item.bathrooms}</Text>}
            {item.area_sqft != null && (
              <Text style={styles.metaItem}>📐 {Number(item.area_sqft).toLocaleString()} sqft</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Search by city…"
          value={city}
          onChangeText={setCity}
          returnKeyType="search"
          onSubmitEditing={() => fetchListings(city, 1)}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={() => fetchListings(city, 1)}>
          <Text style={styles.searchBtnText}>Go</Text>
        </TouchableOpacity>
      </View>

      {loading && page === 1 ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>No listings found. Try a different city.</Text>
          }
          ListHeaderComponent={
            <Text style={styles.count}>
              {total} listing{total !== 1 ? 's' : ''} found
            </Text>
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            loading && page > 1 ? <ActivityIndicator color="#2563eb" style={{ margin: 16 }} /> : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  searchRow: { flexDirection: 'row', padding: 12, gap: 8, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  input: { flex: 1, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14 },
  searchBtn: { backgroundColor: '#2563eb', paddingHorizontal: 16, borderRadius: 8, justifyContent: 'center' },
  searchBtnText: { color: '#fff', fontWeight: 'bold' },
  list: { padding: 12, gap: 12 },
  count: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
  empty: { textAlign: 'center', marginTop: 40, color: '#9ca3af', fontSize: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 6, elevation: 3 },
  cardImage: { width: '100%', height: 180 },
  cardBody: { padding: 12 },
  price: { fontSize: 18, fontWeight: 'bold', color: '#2563eb' },
  title: { fontSize: 15, fontWeight: '600', marginTop: 2 },
  location: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  meta: { flexDirection: 'row', gap: 12, marginTop: 8 },
  metaItem: { fontSize: 12, color: '#374151' },
});
