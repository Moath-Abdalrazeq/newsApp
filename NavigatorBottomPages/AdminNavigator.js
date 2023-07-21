import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "react-native-vector-icons";
import SettingsPage from "../src/pages/SettingsPage";
import AdminScreen from "../src/components/WorkflowScreens/AdminScreen";
import Map from "../src/components/Map";
const Tab = createBottomTabNavigator();

const AdminNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "ios-home" : "ios-home-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "ios-settings" : "ios-settings-outline";
          } else if (route.name === "Map") {
            iconName = focused ? "ios-map" : "ios-map-outline";
          }

          // You can add more conditions for other tab icons if needed

          // Return the Ionicons component with the chosen icon
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
 
    >
      <Tab.Screen
        name="Home"
        component={AdminScreen}
        options={{
          headerShown: false, // Hide the header for this screen
        }}
      />
      <Tab.Screen name="Map" component={Map} />
      <Tab.Screen name="Settings" component={SettingsPage} />

      {/* Add more screens as needed */}
    </Tab.Navigator>
  );
};

export default AdminNavigator;
