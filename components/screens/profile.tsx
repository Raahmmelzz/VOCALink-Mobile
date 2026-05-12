import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';

export default function ProfileUI() {
  const { user, logout } = useAuth();
  const isTeacher = user?.status === "TEACHER";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{user?.first_name || "—"} {user?.last_name || ""}</Text>
        
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email}</Text>

        {!isTeacher ? (
          <>
            <Text style={styles.label}>Grade Level:</Text>
            <Text style={styles.value}>{user?.grade_level || "Not set"}</Text>
            
            <Text style={styles.label}>Disability Type:</Text>
            <Text style={styles.value}>{user?.disability_type || "Not set"}</Text>
          </>
        ) : (
          <>
            <Text style={styles.label}>Department:</Text>
            <Text style={styles.value}>{user?.department || "Not set"}</Text>
            
            <Text style={styles.label}>Grades Handled:</Text>
            <Text style={styles.value}>{user?.grade_handled || "Not set"}</Text>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.editBtn} onPress={() => router.push("/edit-profile" as any)}>
        <Text style={styles.editBtnText}>Edit Profile</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutBtnText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F3F4F6" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: { backgroundColor: "white", padding: 20, borderRadius: 12, marginBottom: 20 },
  label: { fontSize: 12, color: "gray", marginTop: 10 },
  value: { fontSize: 16, fontWeight: "500", marginBottom: 5 },
  editBtn: { backgroundColor: "#1AADDC", padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 10 },
  editBtnText: { color: "white", fontWeight: "bold" },
  logoutBtn: { backgroundColor: "#EF4444", padding: 15, borderRadius: 10, alignItems: "center" },
  logoutBtnText: { color: "white", fontWeight: "bold" }
});