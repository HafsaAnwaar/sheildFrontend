import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import SScreen from "../screens/SScreen";
import HScreen from "../screens/HScreen";
import EScreen from "../screens/EScreen";
import IScreen from "../screens/IScreen";
import LScreen from "../screens/LScreen";
import DScreen from "../screens/DScreen";
import HomeScreen from '../screens/HomeScreen';
import AddContactScreen from '../screens/AddContactScreen';
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  S: undefined;
  H: undefined;
  E: undefined;
  I: undefined;
  L: undefined;
  D: undefined;
  Home: undefined;
  AddContact: undefined;  
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="S" component={SScreen} />
      <Stack.Screen name="H" component={HScreen} />
      <Stack.Screen name="E" component={EScreen} />
      <Stack.Screen name="I" component={IScreen} />
      <Stack.Screen name="L" component={LScreen} />
      <Stack.Screen name="D" component={DScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddContact" component={AddContactScreen} />
    </Stack.Navigator>
  );
}
