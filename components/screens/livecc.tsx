import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import { API_BASE_URL } from "../../constants/api";
import { Colors as C, FontSize, Spacing } from "../../constants/tokens";

interface CCLine {
  id: number;
  text: string;
  speaker: string;
  time: string;
}

const LiveCC: React.FC = () => {
  const { token, user } = useAuth();
  const scrollRef = useRef<ScrollView>(null);
  
  const [lines, setLines] = useState<CCLine[]>([]);
  const [connected, setConnected] = useState(false);
  const teacherName = (user as any)?.teacher_name || "Teacher";

  useEffect(() => {
    if (!token) return;

    let ws: WebSocket;
    let reconnectTimer: NodeJS.Timeout;

    const connectWebSocket = () => {
      // Bulletproof HTTP to WS conversion
      const wsUrl = API_BASE_URL.replace(/^http/, "ws").replace(/\/api\/?$/, "/ws/cc");
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        ws.send(token); 
        setConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const newLine: CCLine = {
            id: Date.now(), 
            text: data.text,
            speaker: data.speaker,
            time: data.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          
          setLines((prev) => [...prev, newLine]);
        } catch (e) {
          console.log("Error parsing websocket message");
        }
      };

      ws.onclose = () => {
        setConnected(false);
        // Auto-reconnect after 3 seconds if it drops
        reconnectTimer = setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = () => {
        setConnected(false);
      };
    };

    connectWebSocket();

    return () => {
      clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
  }, [token]);

  // G-Meet Style: Only show the most recent 6 lines to keep it clean
  const visibleLines = lines.slice(-6);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* Dark minimalist header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Live Captions</Text>
          <Text style={styles.headerSub}>
            {connected ? `● Live from ${teacherName}` : "○ Reconnecting to class..."}
          </Text>
        </View>
      </View>

      {/* G-Meet Style Captions Area */}
      <View style={styles.ccContainer}>
        <ScrollView 
          ref={scrollRef} 
          contentContainerStyle={styles.feed} 
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {visibleLines.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>Waiting for {teacherName} to speak...</Text>
            </View>
          ) : (
            visibleLines.map((line, i) => {
              const isLatest = i === visibleLines.length - 1;
              // Fade out older messages just like G-Meet
              const opacity = isLatest ? 1 : 0.4 + (i / visibleLines.length) * 0.4;
              
              return (
                <View key={line.id} style={[styles.ccRow, { opacity }]}>
                  {isLatest && <View style={styles.activeIndicator} />}
                  <Text style={[styles.ccText, isLatest && styles.ccTextLatest]}>
                    {line.text}
                  </Text>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // G-Meet uses a dark background for focus
  safe: { flex: 1, backgroundColor: "#202124" }, 
  header: { 
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", 
    padding: Spacing.lg, paddingBottom: Spacing.md, 
    borderBottomWidth: 1, borderBottomColor: "#3C4043", backgroundColor: "#202124" 
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: "700", color: "#FFFFFF" },
  headerSub: { fontSize: FontSize.sm, color: "#9AA0A6", marginTop: 4, fontWeight: "600" },
  
  ccContainer: {
    flex: 1,
    justifyContent: "flex-end", // Pushes captions to the bottom
    paddingBottom: 40,
  },
  feed: { padding: Spacing.lg, gap: 16, justifyContent: "flex-end", flexGrow: 1 },
  emptyWrap: { alignItems: "center", marginTop: 60 },
  emptyText: { fontSize: FontSize.md, color: "#9AA0A6", fontStyle: "italic" },
  
  ccRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingLeft: 10,
  },
  activeIndicator: {
    width: 4,
    height: "100%",
    backgroundColor: "#8AB4F8", // Google Blue
    position: "absolute",
    left: -2,
    borderRadius: 2,
  },
  ccText: { 
    fontSize: 24, // Large text for readability
    color: "#E8EAED", 
    lineHeight: 32,
    fontWeight: "500",
  },
  ccTextLatest: { 
    color: "#FFFFFF", 
    fontWeight: "700", 
  },
});

export default LiveCC;