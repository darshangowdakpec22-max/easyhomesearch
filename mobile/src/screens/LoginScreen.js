import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api, { storeToken } from '../services/api';

export default function LoginScreen() {
  const nav = useNavigation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (!form.email || !form.password) {
      Alert.alert('Validation', 'Email and password are required.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      });
      await storeToken(data.token);
      Alert.alert('Success', `Welcome back${data.user?.name ? `, ${data.user.name}` : ''}!`);
      nav.goBack();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.sub}>Log in to your account</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            value={form.email}
            onChangeText={(v) => update('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={form.password}
            onChangeText={(v) => update('password', v)}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.btnText}>{loading ? 'Logging in…' : 'Log in'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => nav.navigate('Register')} style={styles.toggle}>
          <Text style={styles.toggleText}>Don&apos;t have an account? Sign up</Text>
        </TouchableOpacity>

        {/* Demo hint */}
        <View style={styles.demo}>
          <Text style={styles.demoTitle}>Demo credentials</Text>
          <Text style={styles.demoText}>Email: buyer@demo.com</Text>
          <Text style={styles.demoText}>Password: password123</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#fff' },
  heading: { fontSize: 26, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  sub: { fontSize: 14, color: '#6b7280', marginBottom: 28 },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15 },
  btn: { backgroundColor: '#2563eb', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  toggle: { marginTop: 16, alignItems: 'center' },
  toggleText: { color: '#2563eb', fontSize: 14 },
  demo: { marginTop: 28, padding: 14, backgroundColor: '#eff6ff', borderRadius: 10 },
  demoTitle: { fontWeight: '700', fontSize: 12, marginBottom: 4, color: '#1d4ed8' },
  demoText: { fontSize: 12, color: '#374151' },
});
