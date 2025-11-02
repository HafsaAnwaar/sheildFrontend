// SettingsScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Navbar from "../components/SettingTopBar";
import { StackNavigationProp } from "@react-navigation/stack";
import { BackHandler } from "react-native";
import { RootStackParamList } from "../navigation/AppNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SettingsScreenNavProp = StackNavigationProp<
  RootStackParamList,
  "SettingsScreen"
>;

type Props = {
  navigation: SettingsScreenNavProp;
};

export default function SettingsScreen({ navigation }: Props) {
  const [voice, setVoice] = useState(false);
  const [location, setLocation] = useState(false);
  const [recording, setRecording] = useState(false);
  const [vibration, setVibration] = useState(false);
  const [pin, setPin] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    // prevent double taps
    if (signingOut) return;
    setSigningOut(true);

    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      // If you want to change the logout URL, edit this line
      const url = "http://192.168.0.102:5000/api/users/logout";

      if (refreshToken) {
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          if (!res.ok) {
            // server returned error — still proceed to clear local storage
            const text = await res.text().catch(() => "");
            console.warn("Logout API returned non-ok:", res.status, text);
            Alert.alert("Signed out locally", "Could not notify server, but you were signed out locally.");
          } else {
            Alert.alert("Signed out", "You have been logged out.");
          }
        } catch (err) {
          // network error — still clear storage and continue
          console.warn("Logout network error:", err);
          Alert.alert("Signed out locally", "Could not contact server, but you were signed out locally.");
        }
      } else {
        // no refresh token found — just clear local storage
        console.debug("No refreshToken found; clearing local session");
      }
    } finally {
      // Clear local session data (always)
      try {
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");
        await AsyncStorage.removeItem("user");
      } catch (e) {
        console.warn("Failed to clear AsyncStorage on logout:", e);
      }

      // Replace navigation so user cannot go back to authenticated screens
      navigation.replace("Login");
setSigningOut(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Navbar */}
      <Navbar
        title="Settings"
        onBack={() => navigation.goBack()}
        logoSource={require("../assets/logo.png")}
      />

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileCircle}>
          <Text style={styles.profileInitial}>MJ</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>Maya Johnson</Text>
          <Text style={styles.profileEmail}>maya.johnson@email.com</Text>
          <Text style={styles.profileSince}>Empowered since Jan 2024</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Support Settings Card */}
      <View style={styles.supportCard}>
        <View style={styles.headerRow}>
          <Ionicons
            name="shield-checkmark"
            size={22}
            color="#e9237f"
            style={styles.iconLeft}
          />
          <View>
            <Text style={styles.sectionTitle}>Support Settings</Text>
            <Text style={styles.sectionSubtitle}>
              Configure your safety preferences
            </Text>
          </View>
        </View>

        {/* Voice Activation */}
        <View style={styles.settingRow}>
          <View style={styles.leftRow}>
            <Ionicons name="mic-outline" size={20} color="#333" />
            <View style={styles.textBlock}>
              <Text style={styles.settingLabel}>Voice Activation</Text>
              <Text style={styles.settingDesc}>
                Trigger SOS with voice commands
              </Text>
            </View>
          </View>
          <Switch
            value={voice}
            onValueChange={setVoice}
            trackColor={{ false: "#ccc", true: "#363033ff" }}
          />
        </View>

        {/* Auto Location Sharing */}
        <View style={styles.settingRow}>
          <View style={styles.leftRow}>
            <Ionicons name="location-outline" size={20} color="#333" />
            <View style={styles.textBlock}>
              <Text style={styles.settingLabel}>Auto Location Sharing</Text>
              <Text style={styles.settingDesc}>
                Share location during emergencies
              </Text>
            </View>
          </View>
          <Switch
            value={location}
            onValueChange={setLocation}
            trackColor={{ false: "#ccc", true: "#363033ff" }}
          />
        </View>

        {/* Audio Recording */}
        <View style={styles.settingRow}>
          <View style={styles.leftRow}>
            <Ionicons name="volume-high-outline" size={20} color="#333" />
            <View style={styles.textBlock}>
              <Text style={styles.settingLabel}>Audio Recording</Text>
              <Text style={styles.settingDesc}>
                Record audio during incidents
              </Text>
            </View>
          </View>
          <Switch
            value={recording}
            onValueChange={setRecording}
            trackColor={{ false: "#ccc", true: "#363033ff" }}
          />
        </View>

        {/* Vibration Alerts */}
        <View style={styles.settingRow}>
          <View style={styles.leftRow}>
            <MaterialCommunityIcons name="vibrate" size={20} color="#333" />
            <View style={styles.textBlock}>
              <Text style={styles.settingLabel}>Vibration Alerts</Text>
              <Text style={styles.settingDesc}>
                Silent emergency notifications
              </Text>
            </View>
          </View>
          <Switch
            value={vibration}
            onValueChange={setVibration}
            trackColor={{ false: "#ccc", true: "#363033ff" }}
          />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Emergency PIN */}
        <View style={styles.pinSection}>
          <View style={styles.leftRow}>
            <Ionicons name="lock-closed-outline" size={20} color="#333" />
            <Text style={[styles.settingLabel, { marginLeft: 10 }]}>
              Emergency PIN
            </Text>
          </View>

          <View style={styles.pinInputWrapper}>
            <TextInput
              style={styles.pinInput}
              value={pin}
              onChangeText={setPin}
              maxLength={4}
              secureTextEntry={true}
              keyboardType="numeric"
              placeholder="••••"
              placeholderTextColor="#bbb"
            />
            <Ionicons
              name="eye-outline"
              size={20}
              color="#666"
              style={styles.eyeIcon}
            />
          </View>
          <Text style={styles.pinHint}>4-digit PIN to cancel false alarms</Text>
        </View>
      </View>

      {/* 🔴 Sign Out Button */}
      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}
        disabled={signingOut}
      >
        <View>
          <Text style={styles.signOutText}>
            {signingOut ? "Signing out..." : "Sign Out"}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },

  profileCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
  },
  profileCircle: {
    backgroundColor: "#ff4081",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  profileInitial: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  profileName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  profileEmail: { fontSize: 13, color: "#e9237f" },
  profileSince: { fontSize: 12, color: "#999" },
  editButton: {
    backgroundColor: "#ff4081",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editText: { color: "#fff", fontSize: 12 },

  supportCard: {
    backgroundColor: "#fff",
    margin: 20,
    marginTop: 0,
    padding: 18,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  iconLeft: { marginRight: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  sectionSubtitle: { fontSize: 12, color: "#e9237f" },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  leftRow: { flexDirection: "row", alignItems: "center" },
  textBlock: { marginLeft: 10 },
  settingLabel: { fontSize: 14, color: "#333", fontWeight: "500" },
  settingDesc: { fontSize: 12, color: "#777" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 12 },

  pinSection: {},
  pinInputWrapper: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  pinInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    letterSpacing: 4,
    color: "#333",
  },
  eyeIcon: { marginLeft: 5 },
  pinHint: { fontSize: 11, color: "#888", marginTop: 5 },

  // 🔴 Sign Out Button Styles
  signOutButton: {
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#ff4d4d",
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#ff4d4d",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  signOutButtonPressed: {
    backgroundColor: "#e9237f",
    color: "#fff",
    borderColor: "#e9237f",
  },
  signOutText: {
    color: "#ff4d4d",
    fontSize: 15,
    fontWeight: "500",
  },
});
