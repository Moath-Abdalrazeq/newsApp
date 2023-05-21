import * as React from "react";
  import Menu from "./Menu";
  import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

  
export default function JournalistScreen() {
  const user = { isAdmin: false };

  return(       
    <Menu user={user} />


    )  
}
