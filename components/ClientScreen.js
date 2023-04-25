import * as React from "react";
  import Menu from "./Menu";
import HomeScreen from './HomeScreen'
 import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

  
export default function ClientScreen() {
 
  return(       
 <HomeScreen/>

    )  
}
