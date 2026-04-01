// components/ProfileModal.tsx
import React from "react";
import { Modal, Platform, StyleSheet, Text, View } from "react-native";
import { useProfileForm } from "../hooks/useProfileForm";
import ProfileAvatar from "./ProfileAvatar";
import ProfileForm from "./ProfileForm";

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  initialData: { displayName: string; email: string };
  // We'll pass a callback so the main Settings screen knows when to update its state
  onSaveSuccess: (newData: { displayName: string; email: string }) => void;
}

export default function ProfileModal({
  visible,
  onClose,
  initialData,
  onSaveSuccess,
}: ProfileModalProps) {
  // 1. Bring in our logic hook
  const { fields, errors, loading, setField, saveProfile } = useProfileForm(initialData);

  // 2. Wrap the success callback so it closes the modal AND updates the parent
  const handleSave = () => {
    saveProfile(() => {
      onSaveSuccess(fields);
      onClose();
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          
          <Text style={styles.title}>Edit Profile</Text>
          
          {/* Our Isolated UI Components */}
          <ProfileAvatar 
            name={fields.displayName} 
            onEditPress={() => console.log("Open image picker")} 
          />
          
          <ProfileForm
            fields={fields}
            errors={errors}
            loading={loading}
            onFieldChange={setField}
            onSubmit={handleSave}
            onCancel={onClose}
          />
          
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.45)", 
    justifyContent: "flex-end" 
  },
  sheet: {
    backgroundColor: "#FFFFFF", 
    borderTopLeftRadius: 28, 
    borderTopRightRadius: 28,
    paddingHorizontal: 24, 
    paddingBottom: Platform.OS === "ios" ? 40 : 28, 
    paddingTop: 12,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2, 
    backgroundColor: "#D1D5DB", alignSelf: "center", 
    marginBottom: 20,
  },
  title: { 
    fontSize: 20, fontWeight: "800", color: "#1A1A2E", 
    marginBottom: 20, textAlign: "center" 
  },
});