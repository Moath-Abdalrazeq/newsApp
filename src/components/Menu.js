import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { FontAwesome5 } from "@expo/vector-icons";
import { firebase } from "../../config";
import LatestNews from "./LatestNews";
import Map from "./Map";
import AddNews from "./AddNews";
import LiveStream from "./LiveStream";
import AcceptJournalist from "./AdminWorkflow/AcceptJournalist";
import AdminAcceptNews from "./AdminWorkflow/AdminAcceptNews";
import ProfilePageJournalist from "../pages/profilePageJournalist";
import ArchiveNewsPage from "./ArchiveNewsPage";
import LiveStreamDisplay from "./LiveStreams/LiveStreamPage";
import SettingsPage from "../pages/SettingsPage";
import AboutSubMenu from "./AboutUS/AboutSubMenu";
import Company from "./AboutUS/Company";
import SocialMedia from "./AboutUS/SocialMedia";
import Contants from "./AboutUS/Contants";
 
const Drawer = createDrawerNavigator();

const Menu = ({ user }) => {
  const [isAboutSubMenuOpen, setIsAboutSubMenuOpen] = useState(false);

  const handleAboutUsPress = () => {
    setIsAboutSubMenuOpen(!isAboutSubMenuOpen);
  };

  return (
    <Drawer.Navigator
      useLegacyImplementation
      drawerContent={({ navigation }) => (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <TouchableOpacity
            style={{ flexDirection: "row", marginBottom: 20, paddingTop: 20 }}
            onPress={() => navigation.navigate("LatestNews")}
          >
            <FontAwesome5
              name="newspaper"
              size={24}
              color="black"
              style={{ marginLeft: 10 }}
            />
            <Text style={{ fontSize: 20, marginLeft: 10 }}>Latest News</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: "row", marginBottom: 20, paddingTop: 20 }}
            onPress={() => navigation.navigate("ArchiveNewsPage")}
          >
            <FontAwesome5
              name="newspaper"
              size={24}
              color="black"
              style={{ marginLeft: 10 }}
            />
            <Text style={{ fontSize: 20, marginLeft: 10 }}>Archive News</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: "row", marginBottom: 20, paddingTop: 20 }}
            onPress={() => navigation.navigate("Map")}
          >
            <FontAwesome5
              name="map-marker-alt"
              size={24}
              color="black"
              style={{ marginLeft: 10 }}
            />
            <Text style={{ fontSize: 20, marginLeft: 10 }}>Map</Text>
          </TouchableOpacity>
          {(user.isJournalist   || user.isClient)  && (
            <>
              <TouchableOpacity
                style={{ marginBottom: 20, paddingTop: 20 }}
                onPress={() => navigation.navigate("AddNews")}
              >
                <FontAwesome5
                  name="plus"
                  size={24}
                  color="black"
                  style={{ marginLeft: 10 }}
                >
                  <Text style={{ fontSize: 20 }}>Add news</Text>
                </FontAwesome5>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ marginBottom: 20, paddingTop: 20 }}
                onPress={() => navigation.navigate("LiveStraem")}
              >
                <FontAwesome5
                  name="stream"
                  size={24}
                  color="black"
                  style={{ marginLeft: 10 }}
                >
                  <Text style={{ fontSize: 20 }}>Add LiveStream</Text>
                </FontAwesome5>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            style={{ flexDirection: "row", marginBottom: 20, paddingTop: 20 }}
            onPress={() => navigation.navigate("LiveStreamDisplay")}
          >
            <FontAwesome5
              name="eye"
              size={24}
              color="black"
              style={{ marginLeft: 10 }}
            />
            <Text style={{ fontSize: 20, marginLeft: 10 }}>
              View Livestream
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: "row", marginBottom: 20, paddingTop: 20 }}
            onPress={() => navigation.navigate("SettingsPage")}
          >
            <FontAwesome5
              name="cog"
              size={24}
              color="black"
              style={{ marginLeft: 10 }}
            />
            <Text style={{ fontSize: 20, marginLeft: 10 }}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: "row", marginBottom: 20, paddingTop: 20 }}
            onPress={handleAboutUsPress}
          >
            <FontAwesome5
              name="info-circle"
              size={24}
              color="black"
              style={{ marginLeft: 10 }}
            />
            <Text style={{ fontSize: 20, marginLeft: 10 }}>About</Text>
          </TouchableOpacity>

          {isAboutSubMenuOpen && <AboutSubMenu navigation={navigation} />}

          <TouchableOpacity
            style={{ flexDirection: "row", marginBottom: 20, paddingTop: 20 }}
            onPress={() => firebase.auth().signOut()}
          >
            <FontAwesome5
              name="sign-out-alt"
              size={24}
              color="black"
              style={{ marginLeft: 10 }}
            />
            <Text style={{ fontSize: 20, marginLeft: 10 }}>Sign Out</Text>
          </TouchableOpacity>

          {user.isAdmin && (
            <>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  marginBottom: 20,
                  paddingTop: 20,
                }}
                onPress={() => navigation.navigate("AcceptJournalist")}
              >
                <FontAwesome5
                  name="users"
                  size={24}
                  color="black"
                  style={{ marginLeft: 10 }}
                />
                <Text style={{ fontSize: 20, marginLeft: 10 }}>
                  Accept the Journalist
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  marginBottom: 20,
                  paddingTop: 20,
                }}
                onPress={() => navigation.navigate("AdminAcceptNews")}
              >
                <FontAwesome5
                  name="newspaper"
                  size={24}
                  color="black"
                  style={{ marginLeft: 10 }}
                />
                <Text style={{ fontSize: 20, marginLeft: 10 }}>
                  Accept the News
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    >
      <Drawer.Screen name="LatestNews" component={LatestNews} />
      <Drawer.Screen name="Map" component={Map} />
      <Drawer.Screen name="AddNews" component={AddNews} />
      <Drawer.Screen name="AcceptJournalist" component={AcceptJournalist} />
      <Drawer.Screen name="AdminAcceptNews" component={AdminAcceptNews} />
      <Drawer.Screen name="LiveStream" component={LiveStream} />
      <Drawer.Screen name="Profile" component={ProfilePageJournalist} />
      <Drawer.Screen name="ArchiveNewsPage" component={ArchiveNewsPage} />
      <Drawer.Screen name="LiveStreamDisplay" component={LiveStreamDisplay} />
      <Drawer.Screen name="SettingsPage" component={SettingsPage} />
      <Drawer.Screen name="Company" component={Company} />
      <Drawer.Screen name="SocialMedia" component={SocialMedia} />
      <Drawer.Screen name="Contants" component={Contants} />
      
    </Drawer.Navigator>
  );
};

export default Menu;
