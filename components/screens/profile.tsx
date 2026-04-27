// components/screens/profile.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext'; // Check this path!
import { router } from 'expo-router';

export default function ProfileUI() {
  const { user, logout } = useAuth();
  const initial = user?.first_name ? user.first_name.charAt(0).toUpperCase() : (user?.username ? user.username.charAt(0).toUpperCase() : "S");

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login" as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Header Card */}
        <LinearGradient colors={["#00AEEF", "#0284C7"]} style={styles.headerCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.greetingText}>Hello, {user?.first_name || user?.username || "Student"}!</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Student Account</Text>
          </View>
        </LinearGradient>

        {/* Read-Only Data Form */}
        <View style={styles.formPanel}>
          <Text style={styles.sectionTitle}>Account Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <View style={styles.readOnlyInput}><Text style={styles.inputText}>{user?.first_name || "Not provided"}</Text></View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <View style={styles.readOnlyInput}><Text style={styles.inputText}>{user?.last_name || "Not provided"}</Text></View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.readOnlyInput}><Text style={styles.inputText}>{user?.username || "Not provided"}</Text></View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.readOnlyInput}><Text style={styles.inputText}>{user?.email || "Not provided"}</Text></View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Disability Type</Text>
            <View style={styles.readOnlyInput}>
              <Text style={[styles.inputText, user?.disability_type ? { color: '#0369A1', fontWeight: '600' } : {}]}>
                {user?.disability_type || "None specified"}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.editButton} onPress={() => router.push("/edit-profile" as any)}>
            <Text style={styles.editButtonText}>Edit Profile Details</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ... (Paste all the styles from the previous message down here!)
const styles = StyleSheet.create({
  // ... all the styles from before ...
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  container: { padding: 20 },
  headerCard: { borderRadius: 20, padding: 30, alignItems: 'center', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: '#00AEEF' },
  greetingText: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  badge: { backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  formPanel: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  readOnlyInput: { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16 },
  inputText: { fontSize: 16, color: '#6B7280' },
  editButton: { backgroundColor: '#00AEEF', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  editButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  logoutButton: { backgroundColor: '#FEE2E2', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  logoutButtonText: { color: '#DC2626', fontSize: 16, fontWeight: 'bold' }
});