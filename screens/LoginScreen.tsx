// LoginScreen.tsx
import React, { useEffect, useState } from "react";
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import styles from "./styles/LoginScreen.styles";
import GoogleIcon from "../assets/icons/google-icon.svg";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AuthNavigator";

import AsyncStorage from "@react-native-async-storage/async-storage";

type LoginScreenNavProp = NativeStackNavigationProp<RootStackParamList, "Login">;
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "964571757451-cth41eldnntbrk50gdpn7tuusg9f1f1f.apps.googleusercontent.com",
    iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
    androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
  });

  const navigation = useNavigation<LoginScreenNavProp>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // just check token here, no navigation (App.tsx handles switch)
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (token) {
          console.debug("User already logged in, App.tsx will switch navigator");
        }
      } catch (e) {
        console.debug("LoginScreen: error checking stored token", e);
      }
    })();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing fields", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    const url = `http://192.168.0.102:5000/api/users/login`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const raw = await res.text();
      let body: any = null;
      try {
        body = raw ? JSON.parse(raw) : null;
      } catch {
        body = null;
      }

      if (!res.ok) {
        const serverMsg =
          (body && (body.error || body.message)) || raw || `HTTP ${res.status}`;
        Alert.alert("Login failed", serverMsg.toString());
        setLoading(false);
        return;
      }

      // Save tokens/user
      try {
        const accessToken =
          body?.accessToken || body?.access_token || body?.token || null;
        const refreshToken =
          body?.refreshToken || body?.refresh_token || null;
        const user = body?.user || body?.data || null;

        if (accessToken) {
          await AsyncStorage.setItem("accessToken", accessToken);
          // debug: show prefix and length (do not log full token in production)
          console.debug(
            "LoginScreen: saved accessToken prefix:",
            accessToken.slice(0, 40),
            "length:",
            accessToken.length
          );
        }
        if (refreshToken) {
          await AsyncStorage.setItem("refreshToken", refreshToken);
          console.debug(
            "LoginScreen: saved refreshToken prefix:",
            refreshToken.slice(0, 40),
            "length:",
            refreshToken.length
          );
        }
        if (user) {
          await AsyncStorage.setItem("user", JSON.stringify(user));
          console.debug("LoginScreen: saved user:", user?.email || user?.id || "user object saved");
        }
      } catch (e) {
        console.warn("LoginScreen: failed to persist tokens/user", e);
      }

      Alert.alert("Welcome", "Signed in successfully!");
// Reset stack so Dashboard is the only screen
navigation.reset({
  index: 0,
  routes: [{ name: "Dashboard" }],
});
      
      // App.tsx will detect token and switch to AppNavigator -> Dashboard automatically.
    } catch (err) {
      console.error("Login network error:", err);
      Alert.alert("Error", "Unable to contact server. Check API URL & network.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      Alert.alert("Welcome", "Signed in with Google!");
      console.log("Google Auth:", authentication);
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email Address"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginButtonText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.divider}>OR</Text>

      <TouchableOpacity
        style={styles.googleButton}
        disabled={!request}
        onPress={() => promptAsync()}
      >
        <GoogleIcon width={24} height={24} />
        <Text style={styles.googleText}>Login with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={styles.signUpButtonText}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}
