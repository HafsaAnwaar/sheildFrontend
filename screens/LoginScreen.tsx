import React, { useEffect } from "react";
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
import { RootStackParamList } from "../navigation/AppNavigator";

type LoginScreenNavProp = NativeStackNavigationProp<RootStackParamList, "Login">;
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
 const [request, response, promptAsync] = Google.useAuthRequest({
  clientId: "964571757451-cth41eldnntbrk50gdpn7tuusg9f1f1f.apps.googleusercontent.com", 
  iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
  androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
});

const navigation = useNavigation<LoginScreenNavProp>();

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      Alert.alert("Welcome", "Signed in with Google!");
      console.log("Google Auth:", authentication);
    }
  }, [response]);

  return (
    
    <View style={styles.container}>
      <TouchableOpacity style={styles.arrowButton} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.arrowText}>→</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Login</Text>

      <TextInput placeholder="Email Address" style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login</Text>
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
