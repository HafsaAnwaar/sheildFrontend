import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { LinearGradient } from "expo-linear-gradient";
import SafetyIcon from "../assets/icons/safetyicon.svg";
import Dots from "./Dots";

type SScreenNavProp = StackNavigationProp<RootStackParamList, "S">;

type Props = {
  navigation: SScreenNavProp;
};

export default function SScreen({ navigation }: Props) {

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("H");
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
      <SafetyIcon width={200} height={200} />

      {/* Main Title */}
      <Text style={styles.text}>S → Safety</Text>

      {/* Description */}
      <Text style={styles.description}>
        Safety is the foundation of our mission, ensuring protection in every situation. It empowers people to live with confidence without fear of harm. With proactive measures, we make sure safety always comes first.
      </Text>

      {/* Dots Indicator */}
      <Dots total={6} current={0} />
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
