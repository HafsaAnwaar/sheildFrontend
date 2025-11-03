import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

export default function OtpVerificationScreen({ route, navigation }: any) {
  const { pendingId, email, phone } = route.params || {};
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const BASE_URL = "https://sheildbackend.up.railway.app";

  const handleVerify = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter OTP");
      return;
    }

    setLoading(true);
    try {
      // Backend expects { code } only
      const res = await fetch(`${BASE_URL}/api/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: otp }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", data?.message || "Your account has been verified!");
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", data?.error || data?.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("OTP Verify Error:", error);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email && !phone) {
      Alert.alert("Error", "No email or phone available to resend OTP");
      return;
    }

    setResending(true);
    try {
      // Use existing sendOtp endpoint — send email (preferred for registration OTP)
      const res = await fetch(`${BASE_URL}/api/users/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, type: "email_verif" }),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert("Success", "OTP resent successfully!");
      } else {
        Alert.alert("Error", data?.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP Error:", error);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to your email.
      </Text>

      <TextInput
        style={styles.otpInput}
        placeholder="Enter OTP"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
      />

      <TouchableOpacity
        style={[styles.button, (loading || resending) && { opacity: 0.6 }]}
        onPress={handleVerify}
        disabled={loading || resending}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify OTP</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleResendOtp} disabled={resending || loading}>
        <Text style={styles.resendText}>
          {resending ? "Resending..." : "Resend OTP"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFEFF2",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#e9237f",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 30,
    textAlign: "center",
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 18,
    textAlign: "center",
    width: "60%",
    letterSpacing: 6,
    color: "#000",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#e9237f",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  resendText: {
    marginTop: 20,
    fontSize: 14,
    color: "#e9237f",
    fontWeight: "600",
  },
});
