import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Animated, View } from "react-native";
import { useSplashAnimation } from "../hooks/useSplashAnimation";
import { splashStyles as styles } from "../styles/splashStyles";

export default function SplashScreen() {
  const {
    logoScale,
    logoOpacity,
    textOpacity,
    textTranslate,
    taglineOpacity,
    pulseAnim,
  } = useSplashAnimation();

  return (
    <LinearGradient
      colors={["#00AEEF", "#0284C7", "#0369A1"]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.container}
    >
      <StatusBar style="light" />
      <View style={styles.bgRingOuter} />
      <View style={styles.bgRingInner} />

      <Animated.View
        style={[
          styles.logoWrapper,
          {
            transform: [{ scale: logoScale }],
            opacity: logoOpacity,
          },
        ]}
      >
        <Animated.View
          style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]}
        />
        <View style={styles.iconCircle}>
          <View style={styles.iconOuter}>
            <View style={styles.iconMiddle}>
              <View style={styles.iconInner} />
            </View>
          </View>
        </View>
      </Animated.View>

      <Animated.Text
        style={[
          styles.brandName,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslate }],
          },
        ]}
      >
        VocaLink
      </Animated.Text>

      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        Empowering Communication
      </Animated.Text>

      <Animated.View style={[styles.loaderRow, { opacity: taglineOpacity }]}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
        ))}
      </Animated.View>
    </LinearGradient>
  );
}
