// screens/SOSScreen.tsx
/**
 * SOSScreen.tsx
 *
 * - Drop-in replacement.
 * - Requires:
 *    npx expo install expo-audio expo-location @react-native-async-storage/async-storage
 * - Keep your click.mp3 at assets/sounds/click.mp3
 *
 * Behavior:
 *  - Uses canonical location saved under 'CURRENT_LOCATION_V1' if present
 *  - Falls back to fresh device location + reverse-geocode if needed
 *  - Shows DMS and address when available
 *  - Plays tick sound on initial "3" and all digits
 */

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Platform,
  Linking,
  Alert,
  FlatList,
  ActivityIndicator,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getAuthHeaders from "../helpers/authHeaders";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type SOSScreenNavProp = StackNavigationProp<RootStackParamList, "SOSScreen">;
type Props = { navigation: SOSScreenNavProp; };
type ContactItem = { id?: string; name?: string; phone?: string; email?: string };

const API_BASE_URL = "https://sheild-backend-production.up.railway.app";
const STORAGE_KEY_CURRENT_LOCATION = "CURRENT_LOCATION_V1";

export default function SOSScreen({ navigation }: Props) {
  const [countdown, setCountdown] = useState<number | null>(3); // 3,2,1 then null
  const [isCounting, setIsCounting] = useState(true);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationMeta, setLocationMeta] = useState<{ dms?: string; address?: string; timestamp?: string } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [sendingSos, setSendingSos] = useState(false);
  const [contacts, setContacts] = useState<ContactItem[] | null>(null);
  const [sendingToContacts, setSendingToContacts] = useState(false);

  // animations
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const textScale = useRef(new Animated.Value(1)).current;

  const COUNT_START = 3;

  /**
   * Audio players using expo-audio
   * useAudioPlayer preloads the asset for us
   */
  const tickPlayer = useAudioPlayer(require("../assets/sounds/click.mp3"));
  const alarmPlayer = useAudioPlayer(require("../assets/sounds/click.mp3")); // reuse click if no alarm

  // small guard to avoid multiple intervals when unmounted
  const countdownIntervalRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: false,
        });
      } catch (e) {
        console.warn("setAudioModeAsync failed", e);
      }

      // fade-in animation
      Animated.timing(opacityAnim, { toValue: 1, duration: 300, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

      // try to load canonical location into state (non-blocking)
      await loadCanonicalLocationIntoState();

      // start countdown (plays tick on initial '3')
      startCountdown();

      // pre-fetch current device location in background (so we have fallback)
      fetchFreshLocationIfNeeded();
    })();

    return () => {
      // cleanup interval
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Location helpers ----
  const toDMS = (lat: number, lng: number) => {
    const format = (deg: number, isLat: boolean) => {
      const absolute = Math.abs(deg);
      const degrees = Math.floor(absolute);
      const minutesFloat = (absolute - degrees) * 60;
      const minutes = Math.floor(minutesFloat);
      const seconds = (minutesFloat - minutes) * 60;
      const direction = isLat ? (deg >= 0 ? "N" : "S") : (deg >= 0 ? "E" : "W");
      return `${degrees}°${minutes}'${seconds.toFixed(1)}"${direction}`;
    };
    return `${format(lat, true)} ${format(lng, false)}`;
  };

  const loadCanonicalLocationIntoState = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY_CURRENT_LOCATION);
      if (!raw) return;
      const obj = JSON.parse(raw);
      if (obj && typeof obj.latitude === "number" && typeof obj.longitude === "number") {
        setLocation({ latitude: obj.latitude, longitude: obj.longitude });
        setLocationMeta({ dms: obj.dms, address: obj.address, timestamp: obj.timestamp });
      }
    } catch (e) {
      console.warn("load canonical location failed", e);
    }
  };

  // If canonical not present, or we want fresh, fetch device location and reverse geocode
  const fetchFreshLocationIfNeeded = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY_CURRENT_LOCATION);
      if (raw) return; // already have canonical - don't force here
      await fetchAndSaveCurrentLocation();
    } catch (e) {
      console.warn("fetchFreshLocationIfNeeded fail", e);
    }
  };

  const fetchAndSaveCurrentLocation = async () => {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // permission denied: no location
        setLoadingLocation(false);
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setLocation({ latitude: lat, longitude: lng });

      // reverse geocode
      let address = "";
      try {
        const [place] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng }) || [];
        if (place) {
          const parts = [
            place.name || "",
            place.street || "",
            place.city || "",
            place.region || "",
            place.postalCode || "",
            place.country || ""
          ].filter(Boolean);
          address = parts.join(", ");
        }
      } catch (e) {
        console.warn("reverse geocode failed", e);
      }

      const dms = toDMS(lat, lng);
      const saved = {
        latitude: lat,
        longitude: lng,
        dms,
        address,
        timestamp: new Date().toISOString(),
      };
      setLocationMeta({ dms, address, timestamp: saved.timestamp });
      await AsyncStorage.setItem(STORAGE_KEY_CURRENT_LOCATION, JSON.stringify(saved));
    } catch (e) {
      console.warn("fetchAndSaveCurrentLocation error", e);
    } finally {
      setLoadingLocation(false);
    }
  };

  // ---- Countdown & audio ----
  const playTick = async () => {
    try {
      if (!tickPlayer) return;
      try { tickPlayer.seekTo?.(0); } catch (e) {}
      await tickPlayer.play?.();
    } catch (e) {
      // If immediate play fails (not yet loaded), try a tiny retry so initial tick works on slow devices
      try {
        setTimeout(async () => {
          try { tickPlayer.seekTo?.(0); } catch (err) {}
          await tickPlayer.play?.();
        }, 120);
      } catch {}
    }
  };

  const startCountdown = () => {
    setIsCounting(true);
    setCountdown(COUNT_START);

    // immediate pop animation + immediate tick for "3"
    Animated.sequence([
      Animated.timing(textScale, { toValue: 1.3, duration: 140, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.timing(textScale, { toValue: 1, duration: 140, easing: Easing.in(Easing.ease), useNativeDriver: true }),
    ]).start();

    // try to play immediate tick (non-blocking)
    playTick();

    // set up interval for subsequent ticks/updates
    let tick = COUNT_START;
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    countdownIntervalRef.current = setInterval(async () => {
      tick -= 1;
      if (tick <= 0) {
        // final tick, play and trigger SOS
        try { tickPlayer.seekTo?.(0); } catch (e) {}
        await playTick();
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
        setCountdown(null);
        setIsCounting(false);
        triggerSOS();
      } else {
        setCountdown(tick);
        // animate
        Animated.sequence([
          Animated.timing(textScale, { toValue: 1.3, duration: 140, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(textScale, { toValue: 1, duration: 140, easing: Easing.in(Easing.ease), useNativeDriver: true }),
        ]).start();
        // play tick
        await playTick();
      }
    }, 1000);
  };

  // ---- Location sharing / SOS logic ----
  const composeMessage = (loc: { latitude: number; longitude: number } | null, meta: { dms?: string; address?: string } | null) => {
    if (!loc) return `🚨 SOS — I need help. Location not available.`;
    const maps = `https://www.google.com/maps/search/?api=1&query=${loc.latitude},${loc.longitude}`;
    let lines = [`🚨 SOS — I need help.`, `Location: ${maps}`];
    if (meta?.address) lines.push(`Address: ${meta.address}`);
    else if (meta?.dms) lines.push(`Coords: ${meta.dms}`);
    lines.push(`(Shared from SHEILD app)`);
    return lines.join("\n");
  };

  const triggerSOS = async () => {
    setSendingSos(true);
    try {
      // ensure we have a location (try canonical / fresh)
      if (!location) {
        await loadCanonicalLocationIntoState();
        if (!location) await fetchAndSaveCurrentLocation();
      }
      // build payload using meta when available
      const headers = await getAuthHeaders().catch(() => ({}));
      const body = {
        type: "SOS",
        timestamp: new Date().toISOString(),
        location: location ?? null,
        meta: locationMeta ?? null,
      };

      // send to backend (best-effort)
      try {
        await fetch(`${API_BASE_URL}/api/alerts`, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        }).catch((e) => {
          console.warn("sos post failed", e);
        });
      } catch (e) {
        console.warn("sos send error", e);
      }

      // play alarm (optional)
      try {
        alarmPlayer.seekTo?.(0);
        await alarmPlayer.play?.();
      } catch (e) {}

    } finally {
      setSendingSos(false);
      // keep screen open for share options
    }
  };

  // Load local contacts
  const loadContacts = async () => {
    if (contacts) return;
    setContacts(null);
    try {
      const raw = await AsyncStorage.getItem("CONTACTS_V1");
      if (raw) {
        const parsed = JSON.parse(raw);
        setContacts(parsed);
        return;
      }
      // fallback: fetch backend
      const headers = await getAuthHeaders().catch(() => ({}));
      const res = await fetch(`${API_BASE_URL}/api/contacts?mine=true`, { headers }).catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        setContacts(Array.isArray(data) ? data : []);
      } else {
        setContacts([]);
      }
    } catch (e) {
      console.warn("loadContacts error", e);
      setContacts([]);
    }
  };

  const shareViaWhatsApp = async () => {
    const msg = composeMessage(location, locationMeta);
    const maa = `whatsapp://send?text=${encodeURIComponent(msg)}`;
    try {
      const supported = await Linking.canOpenURL(maa);
      if (supported) return Linking.openURL(maa);
      return Linking.openURL(`https://wa.me/?text=${encodeURIComponent(msg)}`);
    } catch (e) {
      Alert.alert("WhatsApp not available", "Could not open WhatsApp.");
    }
  };

  const shareNative = async () => {
    const msg = composeMessage(location, locationMeta);
    try {
      await Share.share({ message: msg });
    } catch (e) {
      console.warn("share failed", e);
    }
  };

  const sendSmsToPhone = async (phone?: string) => {
    if (!phone) {
      Alert.alert("No phone number", "Contact has no phone number.");
      return;
    }
    const body = composeMessage(location, locationMeta);
    const url = Platform.select({
      ios: `sms:${phone}&body=${encodeURIComponent(body)}`,
      android: `sms:${phone}?body=${encodeURIComponent(body)}`,
    });
    try {
      if (url) await Linking.openURL(url);
    } catch (e) {
      Alert.alert("Failed", "Could not open SMS app.");
    }
  };

  const sendToSelectedContacts = async (selected: ContactItem[]) => {
    if (!selected || selected.length === 0) return;
    setSendingToContacts(true);
    try {
      // server-side dispatch attempt
      try {
        const headers = await getAuthHeaders();
        await fetch(`${API_BASE_URL}/api/alerts/send-to-contacts`, {
          method: "POST",
          headers,
          body: JSON.stringify({ contacts: selected, location, meta: locationMeta }),
        }).catch(() => {});
      } catch (e) {}

      // fallback: open sms for each contact
      for (const c of selected) {
        if (c.phone) {
          await sendSmsToPhone(c.phone);
          await new Promise((r) => setTimeout(r, 400));
        } else {
          await shareNative();
        }
      }
      Alert.alert("Sent", "Share prompts opened for selected contacts (one-by-one).");
    } catch (e) {
      console.warn("sendToContacts error", e);
      Alert.alert("Error", "Failed to send to contacts.");
    } finally {
      setSendingToContacts(false);
    }
  };

  // UI: render contacts picker
  const renderContactsPicker = () => {
    return (
      <View style={styles.contactsWrap}>
        <View style={styles.contactsHeader}>
          <Text style={styles.contactsTitle}>Choose contacts to notify</Text>
          <TouchableOpacity onPress={() => setContacts(null)}><Text style={{ color: "#007aff" }}>Close</Text></TouchableOpacity>
        </View>

        {contacts === null ? (
          <View style={{ padding: 12 }}><ActivityIndicator /></View>
        ) : contacts.length === 0 ? (
          <View style={{ padding: 12 }}><Text style={{ color: "#666" }}>No saved contacts.</Text></View>
        ) : (
          <FlatList
            data={contacts}
            keyExtractor={(it, i) => (it.id || it.phone || it.name || String(i))}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.contactRow} onPress={() => sendToSelectedContacts([item])}>
                <View>
                  <Text style={styles.contactName}>{item.name ?? item.phone ?? "Unknown"}</Text>
                  <Text style={styles.contactPhone}>{item.phone ?? "No phone"}</Text>
                </View>
                <Text style={{ color: "#007aff" }}>Notify</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        <Animated.View style={[styles.modalCard, { transform: [{ scale: scaleAnim }] }]}>
          {isCounting ? (
            <View style={styles.countdownWrap}>
              <Animated.Text style={[styles.countText, { transform: [{ scale: textScale }] }]}>
                {countdown ?? ""}
              </Animated.Text>
              <Text style={styles.countSubtitle}>SOS will trigger automatically</Text>
              <Text style={styles.smallNote}>Tap anywhere to cancel</Text>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  // cancel countdown and go back
                  setIsCounting(false);
                  setCountdown(null);
                  // cleanup interval
                  if (countdownIntervalRef.current) { clearInterval(countdownIntervalRef.current); countdownIntervalRef.current = null; }
                  navigation.goBack();
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.postWrap}>
              <Text style={styles.postTitle}>SOS triggered</Text>

              <View style={styles.locationBox}>
                <Text style={styles.locationLabel}>Current location</Text>
                <Text style={styles.locationCoords}>
                  {location ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` : "Location unavailable"}
                </Text>
                <Text style={{ marginTop: 6, color: "#444", fontWeight: "600" }}>
                  {locationMeta?.dms ?? ""}
                </Text>
                <Text style={{ marginTop: 6, color: "#666", fontSize: 12 }}>
                  {locationMeta?.address ?? (loadingLocation ? "Resolving address..." : "Address unavailable")}
                </Text>
              </View>

              <View style={{ marginTop: 12 }}>
                <TouchableOpacity style={styles.actionBtn} onPress={async () => { await loadContacts(); }}>
                  <Text style={styles.actionBtnText}>Notify Saved Contacts</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionBtn, { marginTop: 10 }]} onPress={shareViaWhatsApp}>
                  <Text style={styles.actionBtnText}>Share via WhatsApp</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionBtn, { marginTop: 10 }]} onPress={shareNative}>
                  <Text style={styles.actionBtnText}>Share via other apps</Text>
                </TouchableOpacity>
              </View>

              {contacts !== null && renderContactsPicker()}

              <TouchableOpacity style={[styles.closeBtn, { marginTop: 16 }]} onPress={() => navigation.goBack()}>
                <Text style={{ color: "#333" }}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "transparent" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" },
  modalCard: { width: "88%", backgroundColor: "#fff", borderRadius: 14, padding: 18, alignItems: "center" },
  countdownWrap: { alignItems: "center", width: "100%" },
  countText: { fontSize: 82, fontWeight: "900", color: "#ff2e63" },
  countSubtitle: { marginTop: 8, fontSize: 14, color: "#333" },
  smallNote: { fontSize: 12, color: "#777", marginTop: 6 },
  cancelBtn: { marginTop: 14, backgroundColor: "#333", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
  postWrap: { width: "100%", alignItems: "center" },
  postTitle: { fontSize: 20, fontWeight: "800" },
  locationBox: { marginTop: 12, width: "100%", padding: 12, backgroundColor: "#fafafa", borderRadius: 10 },
  locationLabel: { fontSize: 12, color: "#666" },
  locationCoords: { marginTop: 6, fontSize: 14, fontWeight: "700" },
  actionBtn: { marginTop: 6, width: "100%", paddingVertical: 12, borderRadius: 10, backgroundColor: "#ff007f", alignItems: "center" },
  actionBtnText: { color: "#fff", fontWeight: "700" },
  contactsWrap: { marginTop: 12, width: "100%", maxHeight: 260 },
  contactsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 6, marginBottom: 6 },
  contactsTitle: { fontWeight: "700" },
  contactRow: { paddingVertical: 12, paddingHorizontal: 6, flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#eee" },
  contactName: { fontWeight: "600" },
  contactPhone: { color: "#666", marginTop: 6 },
  closeBtn: { padding: 8, borderRadius: 8 },
});
