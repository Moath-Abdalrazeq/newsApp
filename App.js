import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {StyleSheet , View, Text , Button} from 'react-native'
import React, { useState, useEffect } from "react";
import { firebase } from "./config";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Menu from "./components/Menu";
import Header from "./components/Header";
import * as Location from 'expo-location'
import { Linking } from 'react-native';


const Stack = createStackNavigator();

function LocationDeniedScreen() {
  const handleOpenLocationSettings = () => {
    Linking.openSettings();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Please grant location access to use this app.</Text>
      <Button title="Open Location Settings" onPress={handleOpenLocationSettings} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});

function App() {
  const [location, setLocation] = useState({});
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [showLocationDeniedScreen, setShowLocationDeniedScreen] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setShowLocationDeniedScreen(true);
        return;
      }
      const loc = await Location.getCurrentPositionAsync()
      console.log(loc)
      setLocation(loc)
    })()
  }, [])

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (showLocationDeniedScreen) {
    return <LocationDeniedScreen />;
  }

  if (initializing) return null;

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerTitle: () => <Header name="Live News Map" />,
              headerStyle: {
                height: 150,
                borderBottomLeftRadius: 50,
                borderBottomRightRadius: 50,
                backgroundColor: "#1048FF",
                elevation: 25,
                shadowColor: "#000",
              },
            }}
          />
          <Stack.Screen
            name="Registration"
            component={Registration}
            options={{
              headerTitle: () => <Header name="Live News Map" />,
              headerStyle: {
                height: 150,
                borderBottomLeftRadius: 50,
                borderBottomRightRadius: 50,
                backgroundColor: "#1048FF",
                elevation: 25,
                shadowColor: "#000",
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator> 
        <Stack.Screen name="Menu" component={Menu}
        options={{
          headerStyle: {
            height: 50,
            backgroundColor: "white",
            elevation: 25,
          },
        }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default () => {
  return <App />;
};
