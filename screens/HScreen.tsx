import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { LinearGradient } from 'expo-linear-gradient';
import HelpIcon from "../assets/icons/help.svg";
import Dots from "./Dots";
type HScreenNavProp = StackNavigationProp<RootStackParamList, "H">;

type Props = {
  navigation: HScreenNavProp;
};

export default function HScreen({ navigation }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("E");
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

      <HelpIcon width={200} height={200} />
      <Text style={styles.text}>H → Help
      </Text>
      <Text style={styles.description}>
        Help is always within reach, offering support in times of need. Whether it’s guidance or quick response, assistance is never far away. You are never alone when help is built into your system.
      </Text>
      <Dots total={6} current={1} />

      <TouchableOpacity
        onPress={() => navigation.navigate("H")}
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
  letter: {
    fontSize: 100,
    fontWeight: "bold",
    color: "#4A90E2",
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
