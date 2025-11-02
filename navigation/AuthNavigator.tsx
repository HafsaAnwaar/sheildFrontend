import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import OtpVerificationScreen from "../screens/OtpVerificationScreen";
import DashboardScreen  from "../screens/Dashboard"
import SScreen from "../screens/SScreen";
import HScreen from "../screens/HScreen";
import EScreen from "../screens/EScreen";
import IScreen from "../screens/IScreen";
import LocationScreen from "../screens/LocationScreen";
import DScreen from "../screens/DScreen";
import ContactsScreen from '../screens/ContactsScreen';
import SettingsScreen from "../screens/SettingsScreen";
import LegalSupportScreen from "../screens/LegalSupportScreen";
import SafeSpacesScreen from '../screens/SafeSpacesScreen';
import SOSScreen from "../screens/SOSScreen";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  S: undefined;
  H: undefined;
  E: undefined;
  I: undefined;
  Location: undefined;
  D: undefined;
 OtpVerificationScreen : undefined;
 Dashboard: undefined;
 ContactsScreen: undefined;
   SettingsScreen: undefined;
     LegalSupportScreen: undefined;
        SafeSpacesScreen: undefined;
           SOSScreen: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();
export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="OtpVerificationScreen" component={OtpVerificationScreen} />
        <Stack.Screen name="S" component={SScreen} />
      <Stack.Screen name="H" component={HScreen} />
      <Stack.Screen name="E" component={EScreen} />
      <Stack.Screen name="I" component={IScreen} />
      <Stack.Screen name="Location" component={LocationScreen} />
      <Stack.Screen name="D" component={DScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="ContactsScreen" component={ContactsScreen} />
       <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
          <Stack.Screen name="LegalSupportScreen" component={LegalSupportScreen} />
           <Stack.Screen name="SafeSpacesScreen" component={SafeSpacesScreen} />
           <Stack.Screen name="SOSScreen" component={SOSScreen} />
    </Stack.Navigator>
  );
}