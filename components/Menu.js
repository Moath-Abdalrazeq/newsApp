import * as React from "react";
import {View,Text, TouchableOpacity } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { FontAwesome5 } from "@expo/vector-icons";
import { firebase } from "../config";
import LatestNews from './LatestNews'
import Map from './Map'
const Drawer = createDrawerNavigator();
 
export default function Menu() {
  const handleChangePassword = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(firebase.auth().currentUser.email)
      .then(() => {
        alert("Password reset email sent successfully");
      })
      .catch((error) => {
        alert(error);
      });
  };
  return (
    <Drawer.Navigator useLegacyImplementation
      drawerContent={({ navigation }) => (
        <View style={{ flex: 1, paddingTop: 20 }}>

          <TouchableOpacity style={{ marginBottom: 20 , paddingTop: 20 }}onPress={() => navigation.navigate("LatestNews")}>
            <FontAwesome5 name="newspaper" size={24} color="black" style={{  marginLeft: 10 }}>   
              <Text style={{ fontSize: 20 }}>Latest News</Text> 
            </FontAwesome5>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginBottom: 20 , paddingTop: 20 }} onPress={() => navigation.navigate("Map")}>
            <FontAwesome5 name="map-marker-alt" size={24} color="black" style={{  marginLeft: 10 }}>   
              <Text style={{ fontSize: 20 }}>Map</Text> 
            </FontAwesome5>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginBottom: 20 , paddingTop: 20 }} onPress={() => navigation.navigate("")}>
            <FontAwesome5  name="plus" size={24} color="black" style={{ marginLeft: 10 }}>   
              <Text style={{ fontSize: 20 }}>Add news</Text> 
            </FontAwesome5>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginBottom: 20 , paddingTop: 20 }} onPress={() => navigation.navigate("")}>
            <FontAwesome5 name="search" size={24} color="black" style={{  marginLeft: 10 }}>   
              <Text style={{ fontSize: 20 }}>Search</Text> 
            </FontAwesome5>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginBottom: 20 , paddingTop: 20 }} onPress={() => navigation.navigate("")}>
            <FontAwesome5 name="cog" size={24} color="black" style={{  marginLeft: 10 }}>   
              <Text style={{ fontSize: 20 }}>Settings</Text> 
            </FontAwesome5>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginBottom: 20 , paddingTop: 20 }} onPress={handleChangePassword}>
            <FontAwesome5  name="key" size={24} color="black" style={{  marginLeft: 10 }}>
              <Text style={{ fontSize: 20 }}>Change Password</Text>
            </FontAwesome5>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginBottom: 20 , paddingTop: 20 }} onPress={() => firebase.auth().signOut()}>
            <FontAwesome5 name="sign-out-alt" size={24} color="black" style={{  marginLeft: 10 }}>
              <Text style={{ fontSize: 20 }}>Sign Out</Text>
            </FontAwesome5>
          </TouchableOpacity>
        </View>
      )}
    >
            <Drawer.Screen name='Latest News' component={LatestNews} />
            <Drawer.Screen name='Map' component={Map} />

    </Drawer.Navigator>
  );
}
 
