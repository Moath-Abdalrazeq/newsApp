import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, View, Text, Button, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "./config";
import Login from "./src/pages/Login";
import Registration from "./src/pages/Registration";
import Header from "./src/components/Header";
import "firebase/firestore";
import * as Location from "expo-location";
import { Linking } from "react-native";
import ClientScreen from "./src/components/WorkflowScreens/ClientScreen";
const Stack = createStackNavigator();
import JournalistScreen from "./src/components/WorkflowScreens/JournalistScreen";
import AdminScreen from "./src/components/WorkflowScreens/AdminScreen";
import JeninNews from "./src/components/CitiesNews/JeninNews";
import JeninLives from "./src/components/LiveStreams/JeninLives";
import NablusNews from "./src/components/CitiesNews/NablusNews";
import TubasNews from "./src/components/CitiesNews/TubasNews";
import TulkaremNews from "./src/components/CitiesNews/TulkaremNews";
import LatestNews from "./src/components/LatestNews";
import ClientRegistration from "./src/pages/ClientRegistration";
import JournalistRegistration from "./src/pages/JournalistRegistration";
import BottomNavigator from './NavigatorBottomPages/JournalistNavigator';
import AdminNavigator from "./NavigatorBottomPages/AdminNavigator";
import ClientNavigator from "./NavigatorBottomPages/ClientNavigator";

function LocationDeniedScreen() {
  const handleOpenLocationSettings = () => {
    Linking.openSettings();
  };

  return (
    <>
      <View style={styles.container}>
        <Image
          source={require("./assets/images/Logo.png")}
          style={styles.logo}
        />
        <Text style={styles.text}>
          Please grant location access to use this app.
        </Text>
        <Button
          title="Open Location Settings"
          onPress={handleOpenLocationSettings}
        />
      </View>
    </>
  );
}

function App() {
  const [location, setLocation] = useState({});
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [showLocationDeniedScreen, setShowLocationDeniedScreen] =
    useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setShowLocationDeniedScreen(true);
        return;
      }
      const loc = await Location.getCurrentPositionAsync();

      setLocation(loc);
    })();
  }, []);

  function onAuthStateChanged(user) {
    setUser(user);
    if (!user) {
      setUserRole(null);
      setUserStatus(null);
    }
    if (initializing) setInitializing(false);
    if (user) {
      firebase
        .firestore()
        .collection("users")
        .where("email", "==", user.email)
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const role = querySnapshot.docs[0].data().role;
            const status = querySnapshot.docs[0].data().status;
            setUserRole(role);
            setUserStatus(status);
          }
        })
        .catch((error) => {
          console.log("Error getting user role and status:", error);
        });
    }
  }

  const [userRole, setUserRole] = useState(null);
  const [userStatus, setUserStatus] = useState(null);

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (showLocationDeniedScreen) {
    return <LocationDeniedScreen />;
  }

  if (initializing) return null;

  if (userRole === "journalist" && userStatus === "active") {
    return (
      
      <NavigationContainer>
        
        <Stack.Navigator>
        <Stack.Screen name="JournalistScreen" component={BottomNavigator} />
           <Stack.Screen name="JeninNews" component={JeninNews} />
          <Stack.Screen name="JeninLives" component={JeninLives} />
          <Stack.Screen name="NablusNews" component={NablusNews} />
          <Stack.Screen name="TubasNews" component={TubasNews} />
          <Stack.Screen name="TulkaremNews" component={TulkaremNews} />
          <Stack.Screen name="LatestNews" component={LatestNews} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else if (userRole === "client") {
    return (
      <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen name="AdminScreen" component={AdminNavigator}    />
          <Stack.Screen name="JeninNews" component={JeninNews} />
          <Stack.Screen name="JeninLives" component={JeninLives} />
          <Stack.Screen name="NablusNews" component={NablusNews} />
          <Stack.Screen name="TubasNews" component={TubasNews} />
          <Stack.Screen name="TulkaremNews" component={TulkaremNews} />
          <Stack.Screen name="LatestNews" component={LatestNews} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else if (userRole === "admin") {
    return (
      <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen name="CientScreen" component={ClientNavigator}   />
           <Stack.Screen name="JeninNews" component={JeninNews} />
          <Stack.Screen name="JeninLives" component={JeninLives} />
          <Stack.Screen name="NablusNews" component={NablusNews} />
          <Stack.Screen name="TubasNews" component={TubasNews} />
          <Stack.Screen name="TulkaremNews" component={TulkaremNews} />
          <Stack.Screen name="LatestNews" component={LatestNews} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
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
          <Stack.Screen
            name="ClientRegistration"
            component={ClientRegistration}
          />
          <Stack.Screen
            name="JournalistRegistration"
            component={JournalistRegistration}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  logo: {
    marginBottom: 40,
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});
