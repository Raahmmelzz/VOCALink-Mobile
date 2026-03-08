// app/(dashboard)/profile.tsx
import React from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNav } from '../../components/BottomNav';
import ProfileAvatar from '../../components/ProfileAvatar';
import ProfileForm from '../../components/ProfileForm';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useProfileForm } from '../../hooks/useProfileForm';

// 1. Import the external styles!
import { profileStyles as styles } from '../../styles/profileStyles';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { theme } = useTheme(); 

  const initialData = { 
    displayName: user?.displayName || "Guest", 
    email: user?.email || "guest@vocalink.com" 
  };
  
  const { fields, errors, loading, setField, saveProfile } = useProfileForm(initialData);

  const handleSave = () => {
    saveProfile(() => {
      Alert.alert("Success", "Your profile has been updated!");
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex}>
        <View style={styles.header}>
          <View style={styles.headerAccent} />
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            
            <ProfileAvatar name={fields.displayName} onEditPress={() => Alert.alert("Upload", "Image picker coming soon!")} />
            
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            
            <ProfileForm
              fields={fields}
              errors={errors}
              loading={loading}
              onFieldChange={setField}
              onSubmit={handleSave}
              onCancel={() => Alert.alert("Cancel", "Changes discarded.")}
            />
            
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomNav activeTab="profile" />
    </SafeAreaView>
  );
}