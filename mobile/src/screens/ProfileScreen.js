import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import api, { removeToken } from '../services/api';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    api
      .get('/users/profile')
      .then((r) => setProfile(r.data))
      .catch(() => {
        // Not logged in
        setProfile(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    if (!profile) return;
    setSaving(true);
    try {
      await api.put('/users/profile', {
        name: profile.name,
        phone: profile.phone,
        bio: profile.bio,
      });
      Alert.alert('Success', 'Profile updated!');
    } catch {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await removeToken();
    setLoggedOut(true);
    setProfile(null);
    Alert.alert('Logged out', 'You have been logged out.');
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!profile || loggedOut) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emoji}>👤</Text>
        <Text style={styles.heading}>Not logged in</Text>
        <Text style={styles.sub}>Log in to view and manage your profile.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Avatar placeholder */}
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{profile.name?.[0] || '?'}</Text>
      </View>
      <Text style={styles.email}>{profile.email}</Text>
      <Text style={styles.roleBadge}>{profile.role}</Text>

      <View style={styles.divider} />

      <View style={styles.field}>
        <Text style={styles.label}>Full name</Text>
        <TextInput
          style={styles.input}
          value={profile.name || ''}
          onChangeText={(v) => setProfile((p) => ({ ...p, name: v }))}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={profile.phone || ''}
          onChangeText={(v) => setProfile((p) => ({ ...p, phone: v }))}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={profile.bio || ''}
          onChangeText={(v) => setProfile((p) => ({ ...p, bio: v }))}
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity
        style={[styles.btn, saving && styles.btnDisabled]}
        onPress={save}
        disabled={saving}
      >
        <Text style={styles.btnText}>{saving ? 'Saving…' : 'Save changes'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#fff', alignItems: 'center' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  emoji: { fontSize: 56, marginBottom: 12 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 6 },
  sub: { fontSize: 14, color: '#6b7280', textAlign: 'center' },
  avatarCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#2563eb' },
  email: { fontSize: 14, color: '#6b7280', marginBottom: 4 },
  roleBadge: { fontSize: 12, fontWeight: '600', color: '#2563eb', backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 99, textTransform: 'capitalize', marginBottom: 16 },
  divider: { height: 1, backgroundColor: '#f3f4f6', width: '100%', marginBottom: 20 },
  field: { width: '100%', marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: { width: '100%', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15 },
  textArea: { height: 100, textAlignVertical: 'top' },
  btn: { width: '100%', backgroundColor: '#2563eb', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  logoutBtn: { marginTop: 12, width: '100%', borderWidth: 1, borderColor: '#ef4444', borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  logoutText: { color: '#ef4444', fontWeight: '600', fontSize: 15 },
});
