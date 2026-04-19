// styles/profileStyles.ts
import { StyleSheet } from "react-native";

const C = {
  primary: "#00AEEF",
  white: "#FFFFFF",
  grayLight: "#F3F9FF",
  gray: "#6B7280",
};

export const profileStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#EEF7FF" }, 
  flex: { flex: 1 },
  header: { 
    backgroundColor: C.primary, 
    paddingHorizontal: 20, 
    paddingTop: 8,       
    // 1. Shrunk this from 60 down to 30!
    paddingBottom: 30,   
    position: "relative", 
    overflow: "hidden" 
  },
  headerAccent: { position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: "rgba(255,255,255,0.12)" },
  
  headerTitle: { 
    fontSize: 13, 
    fontWeight: "700", 
    color: "rgba(255,255,255,0.75)", 
    letterSpacing: 1.5, 
    textTransform: "uppercase", 
    marginBottom: 16 
  },
  
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },
  
  card: { 
    backgroundColor: C.white, 
    borderRadius: 20, 
    padding: 24, 
    // 2. Pulled this up to -15 so it still overlaps the newly shrunk header perfectly
    marginTop: -15, 
    shadowColor: "#0090C8", 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 12, 
    elevation: 5 
  },
  divider: { height: 1, backgroundColor: "#E0EFF9", marginVertical: 24 }, 
});