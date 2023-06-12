import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { FontAwesome5 } from "@expo/vector-icons";
import { firebase } from "../../config";
import LatestNews from './LatestNews'
import Map from './Map'
import AddNews from "./AddNews";
import LiveStraem from './LiveStream'
import AcceptJournalist from "./AcceptJournalist"
import AdminAcceptNews from "./AdminAcceptNews"
import profilePageJournalist from './profilePageJournalist';

const Drawer = createDrawerNavigator();

export default function Menu({ user }) {
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

          <TouchableOpacity style={{ marginBottom: 20 , paddingTop: 20 }} onPress={() => navigation.navigate("AddNews")}>
            <FontAwesome5  name="plus" size={24} color="black" style={{ marginLeft: 10 }}>   
              <Text style={{ fontSize: 20 }}>Add news</Text> 
            </FontAwesome5>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginBottom: 20 , paddingTop: 20 }} onPress={() => navigation.navigate("LiveStraem")}>
            <FontAwesome5 name="stream" size={24} color="black" style={{  marginLeft: 10 }}>   
              <Text style={{ fontSize: 20 }}>Add LiveStream</Text> 
            </FontAwesome5>
          </TouchableOpacity>

          {user.isJournalist   && (
            <TouchableOpacity style={{ marginBottom: 20, paddingTop: 20 }} onPress={() => navigation.navigate("Profile")}>
              <FontAwesome5 name="user" size={24} color="black" style={{ marginLeft: 10 }}>
                <Text style={{ fontSize: 20 }}>Profile</Text>
              </FontAwesome5>
            </TouchableOpacity>
          )}

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

          {user.isAdmin && (
            <> 
              <TouchableOpacity style={{ marginBottom: 20, paddingTop: 20 }} onPress={() => navigation.navigate("AcceptJournalist")}>
                <FontAwesome5 name="users" size={24} color="black" style={{ marginLeft: 10 }}>
                  <Text style={{ fontSize: 20 }}>Accept the Journalist</Text>
                </FontAwesome5>
              </TouchableOpacity>

              <TouchableOpacity style={{ marginBottom: 20, paddingTop: 20 }} onPress={() => navigation.navigate("AdminAcceptNews")}>
                <FontAwesome5 name="users" size={24} color="black" style={{ marginLeft: 10 }}>
                  <Text style={{ fontSize: 20 }}>Accept the news</Text>
                </FontAwesome5>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    >
      <Drawer.Screen name='Latest News' component={LatestNews} />
      <Drawer.Screen name='Map' component={Map} />
      <Drawer.Screen name='AddNews' component={AddNews} />
      <Drawer.Screen name='AcceptJournalist' component={AcceptJournalist} />
      <Drawer.Screen name='AdminAcceptNews' component={AdminAcceptNews} />
      <Drawer.Screen name='LiveStraem' component={LiveStraem} />
      <Drawer.Screen name='Profile' component={profilePageJournalist} />
    </Drawer.Navigator>
  );
}
