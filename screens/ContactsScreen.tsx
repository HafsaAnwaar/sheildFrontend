// src/screens/ContactsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator,
  Keyboard,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Navbar from "../components/ContactTopBar";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import getAuthHeaders from "../helpers/authHeaders";
import BottomNavBar from "../components/BottomNavBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ContactsScreenNavProp = StackNavigationProp<
  RootStackParamList,
  "ContactsScreen"
>;

type Props = {
  navigation: ContactsScreenNavProp;
};

type Contact = {
  id: string;
  name: string;
  phone: string;
  relation: string | null;
  initials: string;
};

const API_BASE_URL = "http://192.168.0.102:5000"; // set to your backend

const ContactsScreen: React.FC<Props> = ({ navigation }) => {

    const insets = useSafeAreaInsets();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRelation, setNewRelation] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const mapBackendToUI = (c: any): Contact => {
    const name = c.full_name ?? c.name ?? "";
    const initials = name
      .split(" ")
      .map((w: string) => w[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return {
      id: c.id,
      name,
      phone: c.phone ?? "",
      relation: c.relation ?? null,
      initials: initials || "??",
    };
  };

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const headers = await getAuthHeaders();
      console.debug("Outgoing Authorization prefix:", headers.Authorization?.slice(0, 40));
      const res = await fetch(`${API_BASE_URL}/api/contacts`, {
        method: "GET",
        headers,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      const list = Array.isArray(data) ? data.map(mapBackendToUI) : [];
      setContacts(list);
    } catch (err: any) {
      console.error("fetchContacts error:", err);
      Alert.alert("Error", err.message || "Failed to load contacts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAddContact = async () => {
    if (!newName || !newPhone) {
      Alert.alert("Validation", "Please provide name and phone");
      return;
    }

    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      const body = {
        full_name: newName,
        phone: newPhone,
        relation: newRelation || null,
      };

      if (editingId) {
        const res = await fetch(`${API_BASE_URL}/api/contacts/${editingId}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `HTTP ${res.status}`);
        }
        const resp = await res.json();
        const updated = mapBackendToUI(resp.contact ?? resp);
        setContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        setEditingId(null);
        setShowForm(false);
        setNewName("");
        setNewPhone("");
        setNewRelation("");
        Keyboard.dismiss();
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/contacts`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const resp = await res.json();
      const created = mapBackendToUI(resp.contact ?? resp);
      setContacts((prev) => [created, ...prev]);
      setNewName("");
      setNewPhone("");
      setNewRelation("");
      setShowForm(false);
      Keyboard.dismiss();
    } catch (err: any) {
      console.error("save contact error:", err);
      Alert.alert("Error", err.message || "Failed to save contact");
      if ((err.message || "").includes("duplicate")) {
        Alert.alert("Duplicate", "A contact with this phone already exists.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Confirm", "Delete this contact?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const headers = await getAuthHeaders();
            const res = await fetch(`${API_BASE_URL}/api/contacts/${id}`, {
              method: "DELETE",
              headers,
            });
            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              throw new Error(err.error || `HTTP ${res.status}`);
            }
            setContacts((prev) => prev.filter((c) => c.id !== id));
          } catch (err: any) {
            console.error("delete contact error:", err);
            Alert.alert("Error", err.message || "Failed to delete contact");
          }
        },
      },
    ]);
  };

  const handleEdit = (item: Contact) => {
    setEditingId(item.id);
    setNewName(item.name);
    setNewPhone(item.phone);
    setNewRelation(item.relation ?? "");
    setShowForm(true);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchContacts();
  };

  const renderItem = ({ item }: { item: Contact }) => (
    <View style={styles.contactCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.initials}</Text>
      </View>

      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
        <Text style={styles.contactRelation}>{item.relation}</Text>
      </View>

      <View style={styles.icons}>
        <TouchableOpacity onPress={() => handleEdit(item)} style={{ padding: 6 }}>
          <Ionicons name="create-outline" size={20} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ padding: 6 }}>
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Navbar
        title="Support Circle"
        onBack={() => navigation.goBack()}
        logoSource={require("../assets/logo.png")}
      />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="person-circle-outline" size={24} color="#e9237f" />
          <View>
            <Text style={styles.headerTitle}>Trusted Contacts</Text>
            <Text style={styles.headerSubtitle}>
              People notified during emergencies
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            if (showForm && editingId) {
              setEditingId(null);
              setNewName("");
              setNewPhone("");
              setNewRelation("");
            }
            setShowForm((prev) => !prev);
          }}
        >
          <Ionicons name={showForm ? "close" : "add"} size={22} color="#fff" />
          <Text style={styles.addButtonText}>
            {showForm ? "Cancel" : "Add"}
          </Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={newName}
            onChangeText={setNewName}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={newPhone}
            onChangeText={setNewPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Relation"
            value={newRelation}
            onChangeText={setNewRelation}
          />

          <TouchableOpacity
            style={[styles.saveButton, { alignSelf: "flex-end", marginRight: 16, opacity: saving ? 0.8 : 1 }]}
            onPress={handleAddContact}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.saveText}>{editingId ? "Update" : "Save"}</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={{ marginTop: 24 }}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <View style={{ padding: 24, alignItems: "center" }}>
              <Text style={{ color: "#6b7280" }}>No contacts found.</Text>
            </View>
          )}
        />
      )}

      <View
        style={[
          styles.fixedBottom,
          { paddingBottom: insets.bottom ? insets.bottom : 12 },
        ]}
        pointerEvents="box-none"
      >
         <BottomNavBar
                  onHome={() => navigation.navigate("Dashboard")}
                  onLocation={() => navigation.navigate("SafeSpacesScreen")}
                  onSOS={() => navigation.navigate("SOSScreen")}
                onLegal={() => navigation.navigate("LegalSupportScreen")}
                  onContacts={() => navigation.navigate("ContactsScreen")}
                />
      </View>
    </View>
  );
};

export default ContactsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    padding: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
   fixedBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    zIndex: 999,
    elevation: 20,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e9237f",
    shadowColor: "#f08fb1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
    color: "#111827",
  },
  saveButton: {
    backgroundColor: "#e9237f",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveText: {
    color: "#fff",
    fontWeight: "500",
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 1,
    marginHorizontal: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ff7a2f",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "600",
  },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 15, fontWeight: "600", color: "#111827" },
  contactPhone: { fontSize: 13, color: "#374151" },
  contactRelation: { fontSize: 12, color: "#6b7280" },
  icons: { flexDirection: "row", gap: 12 },
});
