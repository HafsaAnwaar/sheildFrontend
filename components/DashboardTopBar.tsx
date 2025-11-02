// components/DashboardTopBar.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  GestureResponderEvent,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = {
  onPressBell?: (e: GestureResponderEvent) => void;
  onPressSettings?: (e: GestureResponderEvent) => void;
  logoSource?: any; // require(...) or { uri: ... }
};

const DashboardTopBar: React.FC<Props> = ({
  onPressBell,
  onPressSettings,
  logoSource,
}) => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.container}>
      {/* Left: icon + title */}
      
      <View style={styles.left}>

        <View style={styles.iconWrapOuter}>
          {/* Outer layer to mimic soft gradient border */}
          
          <View style={styles.iconWrapInner}>
            {logoSource ? (
               <Image source={require('../assets/logo.png')} style={styles.logoImage} />
            ) : (
              <Text style={styles.logoFallback}>❤</Text>
            )}
          </View>
        </View>

        <View style={styles.titleWrap}>
          <Text style={styles.title}>Sheild</Text>
          <Text style={styles.subtitle}>Women's Safety App</Text>
        </View>
      </View>

      {/* Right: icons */}
      <View style={styles.right}>
        <TouchableOpacity onPress={onPressBell} style={styles.iconButton}>
          <View>
            <Ionicons name="chatbubbles-outline" size={22} style={styles.icon} />
            {/* small pink badge */}
            <View style={styles.badge} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("SettingsScreen")} style={[styles.iconButton, { marginLeft: 14 }]}>
          <Ionicons name="settings-outline" size={22} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DashboardTopBar;

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    height: 72,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // subtle bottom border like in screenshot
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EFEFF2",
    backgroundColor: "#FFFFFF",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconWrapOuter: {
    width: 56,
    height: 56,
    borderRadius: 14,
    // simulate outer gradient-ish touch: soft pink blur feel
    backgroundColor: "#ffd7e7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  iconWrapInner: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    // approximate inner gradient with a strong pink
    backgroundColor: "#e9237fff",
    shadowColor: "#f08fb1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  logoImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    tintColor: "#fff",
  },

  logoFallback: {
    fontSize: 18,
    color: "#fff",
    lineHeight: Platform.OS === "android" ? 24 : 18,
    includeFontPadding: false,
  },

  titleWrap: {
    flexDirection: "column",
    justifyContent: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    // pink text similar to screenshot
    color: "#e9237fff",
    letterSpacing: 0.2,
  },

  subtitle: {
    fontSize: 12,
    color: "#f08fb1",
    marginTop: 2,
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconButton: {
    padding: 6,
    borderRadius: 8,
  },

  icon: {
    color: "#324A5F",
    opacity: 0.9,
  },

  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ff2d7a", // bright pink dot
    borderWidth: 2,
    borderColor: "#fff",
  },
});
