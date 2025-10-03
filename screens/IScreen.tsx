import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { LinearGradient } from 'expo-linear-gradient';   
import IIcon from "../assets/icons/intelligence.svg";
import Dots from "./Dots";
type IScreenNavProp = StackNavigationProp<RootStackParamList, "I">;

type Props = {
  navigation: IScreenNavProp;
};

export default function IScreen({ navigation }: Props) {
   useEffect(() => {
        const timer = setTimeout(() => {
          navigation.navigate("L");
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
          
     <IIcon width={200} height={200} />
      <Text style={styles.text}> I → Intelligence
</Text>
 <Text style={styles.description}>
       Intelligence empowers the system to make smarter safety decisions. It analyzes situations and provides insights for better actions. With intelligence, you are always one step ahead of risks.
      </Text>
       <Dots total={6} current={3}  />
              
                    <TouchableOpacity
                     onPress={() => navigation.navigate("E")}
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
