// hooks/useProfileForm.ts
import { useEffect, useState } from "react";

interface ProfileFields {
  displayName: string;
  email: string;
}

interface ProfileErrors {
  displayName: string;
  email: string;
}

export function useProfileForm(initialData: ProfileFields) {
  const [fields, setFields] = useState<ProfileFields>(initialData);
  const [errors, setErrors] = useState<ProfileErrors>({ displayName: "", email: "" });
  const [loading, setLoading] = useState(false);

  // 🚨 ADD THIS BLOCK: 
  // This tells the form to overwrite its fields the second the real user data arrives
  useEffect(() => {
    setFields({
      displayName: initialData.displayName,
      email: initialData.email,
    });
  }, [initialData.displayName, initialData.email]); 

  const setField = (key: keyof ProfileFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = (): boolean => {
    const e: ProfileErrors = { displayName: "", email: "" };
    if (!fields.displayName.trim()) e.displayName = "Name is required";
    if (!fields.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(fields.email)) e.email = "Enter a valid email";
    
    setErrors(e);
    return !e.displayName && !e.email;
  };

  const saveProfile = (onSuccess: () => void) => {
    if (!validate()) return;
    setLoading(true);
    
    // Fake API call
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1200);
  };

  return { fields, errors, loading, setField, saveProfile };
}