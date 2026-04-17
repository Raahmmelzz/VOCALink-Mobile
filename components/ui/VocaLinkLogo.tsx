import React from "react";
import { Text, View } from "react-native";
import Svg, { Line, Path, Rect } from "react-native-svg";
import { Colors as C, FontSize } from "../../constants/tokens";

interface VocaLinkLogoProps {
  size?: number;
  showLabel?: boolean;
  color?: string;
}

const VocaLinkLogo: React.FC<VocaLinkLogoProps> = ({
  size = 36,
  showLabel = true,
  color = C.purple,
}) => (
  <View style={{ alignItems: "center", flexDirection: "row", gap: 10 }}>
    <View
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.28),
        backgroundColor: C.purpleLight,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg
        width={size * 0.55}
        height={size * 0.55}
        viewBox="0 0 20 20"
        fill="none"
      >
        <Rect x="6" y="2" width="8" height="10" rx="4" fill={color} />
        <Path
          d="M3 10a7 7 0 0 0 14 0"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <Line
          x1="10"
          y1="17"
          x2="10"
          y2="14"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <Line
          x1="7"
          y1="17"
          x2="13"
          y2="17"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </Svg>
    </View>

    {showLabel && (
      <Text
        style={{
          fontSize: FontSize.lg,
          fontWeight: "700",
          color: C.text,
          letterSpacing: -0.5,
        }}
      >
        VocaLink
      </Text>
    )}
  </View>
);

export default VocaLinkLogo;
