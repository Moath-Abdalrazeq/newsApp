import * as React from "react";
  import Menu from "../Menu";
  import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

  
export default function ClientScreen() {
  const user = { isClient: true};

  return(       
    <Menu user={user} />

    )  
}
