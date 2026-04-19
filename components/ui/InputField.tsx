import React from "react";
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { Colors as C, FontSize, Radius } from "../../constants/tokens";

interface InputFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: string;
  style?: ViewStyle;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  error,
  style,
}) => (
  <View style={[styles.wrapper, style]}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, error ? styles.inputError : undefined]}
      placeholder={placeholder}
      placeholderTextColor={C.text3}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      autoCorrect={false}
    />
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {},
  label: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: C.text2,
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  input: {
    width: "100%",
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: C.gray2,
    borderRadius: Radius.md,
    fontSize: FontSize.base,
    color: C.text,
    backgroundColor: "#fafafa",
  },
  inputError: {
    borderColor: C.red,
  },
  errorText: {
    fontSize: FontSize.xs,
    color: C.red,
    marginTop: 4,
  },
});

export default InputField;
