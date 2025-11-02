import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import DashboardScreen from "../screens/Dashboard";
import SettingsScreen from "../screens/SettingsScreen";
import ContactsScreen from "../screens/ContactsScreen";
import LegalSupportScreen from "../screens/LegalSupportScreen";
import SafeSpacesScreen from '../screens/SafeSpacesScreen';
import SOSScreen from "../screens/SOSScreen";
export type RootStackParamList = {
  Dashboard: undefined;
  SettingsScreen: undefined;
  ContactsScreen: undefined;
  LegalSupportScreen: undefined;
   SafeSpacesScreen: undefined;
   SOSScreen: undefined;
  // If you need Location and SOS, add them here:
  // Location: undefined;
  // SOS: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
    
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="ContactsScreen" component={ContactsScreen} />
      <Stack.Screen name="LegalSupportScreen" component={LegalSupportScreen} />
     <Stack.Screen name="SafeSpacesScreen" component={SafeSpacesScreen} />
<Stack.Screen name="SOSScreen" component={SOSScreen} />
    </Stack.Navigator>
  );
}
