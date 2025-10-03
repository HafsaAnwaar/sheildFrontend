import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { LinearGradient } from 'expo-linear-gradient';
import EIcon from "../assets/icons/emergency.svg";
import Dots from "./Dots";
type EScreenNavProp = StackNavigationProp<RootStackParamList, "E">;

type Props = {
  navigation: EScreenNavProp;
};

export default function EScreen({ navigation }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("I");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);
  return (
    <LinearGradient
      colors={["#FFFFFF", "#FFFFFF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >

      <EIcon width={200} height={200} />
      <Text style={styles.text}> E → Emergency
      </Text>
      <Text style={styles.description}>
        Emergencies require instant response, and that’s what we deliver. With just a tap, you can connect to lifesaving services. Be prepared at all times to face critical situations with confidence.
      </Text>
      <Dots total={6} current={2} />

      <TouchableOpacity
        onPress={() => navigation.navigate("L")}
      >

      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
       flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 90,
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    textAlign: "left",
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "left",
    justifyContent: "center",

    color: "#555",
    lineHeight: 22,
    paddingHorizontal: 10,
  },
});
