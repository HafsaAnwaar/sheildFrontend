import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { LinearGradient } from 'expo-linear-gradient';   
import DIcon from "../assets/icons/defense.svg";
import Dots from "./Dots";
type DScreenNavProp = StackNavigationProp<RootStackParamList, "D">;

type Props = {
  navigation: DScreenNavProp;
};

export default function DScreen({ navigation }: Props) {
  useEffect(() => {
        const timer = setTimeout(() => {
          navigation.navigate("Login");
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
          
     <DIcon width={180} height={180} />
      <Text style={styles.text}> D → Defense
</Text>
 <Text style={styles.description}>
       Defense is your shield against any possible threat. It builds strong protection to secure your peace of mind. With defense at your side, you remain guarded at all times.
      </Text>
      <Dots total={6} current={5}  />
                      
                            <TouchableOpacity
                             onPress={() => navigation.navigate("Login")}
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
