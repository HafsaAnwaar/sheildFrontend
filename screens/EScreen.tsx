import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity,Dimensions  } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AuthNavigator";
// import { LinearGradient } from 'expo-linear-gradient';
import EIcon from "../assets/icons/emergency.svg";
import Dots from "./Dots";
type EScreenNavProp = StackNavigationProp<RootStackParamList, "E">;

type Props = {
  navigation: EScreenNavProp;
};
const { width } = Dimensions.get("window");
export default function EScreen({ navigation }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("I");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);
  return (
    
    <View style={styles.container}>
      {/* Top Pink Ellipse */}
      <View style={styles.topEllipse} />
      <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate("I")}
        >
          <Text style={styles.nextText}>{"→"}</Text>
        </TouchableOpacity>
      {/* Illustration */}
      <EIcon width={300} height={300} style={styles.icon} />

      {/* Title */}
      <Text style={styles.title}>Emergency</Text>

      {/* Description */}
      <Text style={styles.description}>
        Emergencies require instant response, and that’s what we deliver. With just a tap, you can connect to lifesaving services. Be prepared at all times to face critical situations with confidence.
      </Text>

      {/* Bottom Pink Ellipse */}
      <View style={styles.bottomEllipse} />

      {/* Bottom Navigation Row */}
      <View style={styles.bottomRow}>
        <Dots total={6} current={2} />

       
      </View>
    </View>
  );
}

const CIRCLE_SIZE = width * 1.4; // large enough to create a perfect half-circle

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 90,
    backgroundColor: "#fff",
  },

  // top circle positioned so only the bottom half is visible
  topEllipse: {
    position: "absolute",
    top: -(CIRCLE_SIZE / 2) - 210, // push up so only half shows
    left: (width - CIRCLE_SIZE) / 2, // center horizontally
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "#e9237fff",
    zIndex: 0,
  },

  // bottom circle positioned so only the top half is visible
  bottomEllipse: {
    position: "absolute",
    bottom: -(CIRCLE_SIZE / 2) - 210, // push down so only half shows
    left: (width - CIRCLE_SIZE) / 2, // center horizontally
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "#e9237fff",
    zIndex: 0,
  },

  icon: {
    marginBottom: 30,
    zIndex: 2, // ensure icon is above the circular backgrounds
    alignSelf: "center",
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "left",
    zIndex: 2,
  },

  description: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
    textAlign: "left",
    paddingHorizontal: 5,
    zIndex: 2,
  },

  bottomRow: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    zIndex: 2,
        marginLeft: 20,
  },

  nextButton: {
    position: "absolute",
    top: 30,
    right: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },

  nextText: {
    fontSize: 24,
    color: "#000",
    fontWeight: "bold",
  },
});
