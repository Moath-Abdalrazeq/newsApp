import * as React from "react";
import {View,Text,SafeAreaView,TouchableOpacity,StyleSheet,} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { FontAwesome5 } from "@expo/vector-icons";
import { firebase } from "../../config";
const Drawer = createDrawerNavigator();
import HomeScreen from './HomeScreen'
export default function AdminScreen() {
 
  return (
 <HomeScreen />
 
  );
}
