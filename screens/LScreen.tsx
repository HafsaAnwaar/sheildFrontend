import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { LinearGradient } from 'expo-linear-gradient';   
import LIcon from "../assets/icons/location.svg";
import Dots from "./Dots";
type LScreenNavProp = StackNavigationProp<RootStackParamList, "L">;

type Props = {
  navigation: LScreenNavProp;
};

export default function LScreen({ navigation }: Props) {
  useEffect(() => {
        const timer = setTimeout(() => {
          navigation.navigate("D");
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
          
     <LIcon width={200} height={200} />
      <Text style={styles.text}> L → Location
</Text>
 <Text style={styles.description}>
       Location awareness keeps you and your loved ones connected. Real-time tracking ensures accuracy and reliability. Wherever you are, help will always know where to reach you.
      </Text>
    <Dots total={6} current={4}  />
                  
                        <TouchableOpacity
                         onPress={() => navigation.navigate("D")}
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
