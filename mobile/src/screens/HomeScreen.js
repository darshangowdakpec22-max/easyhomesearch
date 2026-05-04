import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const nav = useNavigation();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Find Your{'\n'}Dream Home 🏠</Text>
        <Text style={styles.heroSub}>
          Search thousands of listings with powerful filters and an interactive map.
        </Text>
        <TouchableOpacity style={styles.btn} onPress={() => nav.navigate('Listings')}>
          <Text style={styles.btnText}>Browse Listings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.features}>
        {[
          { icon: '🗺️', title: 'Interactive Maps', desc: 'View listings on a live map.' },
          { icon: '🔍', title: 'Smart Filters', desc: 'Filter by price, beds, baths & more.' },
          { icon: '❤️', title: 'Save Favorites', desc: 'Bookmark listings to revisit later.' },
          { icon: '🔒', title: 'Secure Auth', desc: 'JWT-based secure authentication.' },
        ].map(({ icon, title, desc }) => (
          <View key={title} style={styles.featureCard}>
            <Text style={styles.featureIcon}>{icon}</Text>
            <Text style={styles.featureTitle}>{title}</Text>
            <Text style={styles.featureDesc}>{desc}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f9fafb' },
  hero: {
    backgroundColor: '#2563eb',
    padding: 32,
    alignItems: 'center',
  },
  heroTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 12 },
  heroSub: { fontSize: 15, color: '#bfdbfe', textAlign: 'center', marginBottom: 24 },
  btn: { backgroundColor: '#fff', paddingHorizontal: 28, paddingVertical: 12, borderRadius: 8 },
  btnText: { color: '#2563eb', fontWeight: 'bold', fontSize: 16 },
  features: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 12 },
  featureCard: { width: '47%', backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  featureIcon: { fontSize: 28, marginBottom: 8 },
  featureTitle: { fontWeight: '700', fontSize: 14, marginBottom: 4 },
  featureDesc: { fontSize: 12, color: '#6b7280' },
});
