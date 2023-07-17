import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SettingsPage = ({ navigation }) => {
   const [userSettings, setUserSettings] = useState(null);

  useEffect(() => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      const userSettingsRef = firebase
        .firestore()
        .collection("users")
        .doc(currentUser.uid);
      userSettingsRef.get().then((doc) => {
        if (doc.exists) {
          setUserSettings(doc.data());
        } else {
          setUserSettings({ notificationsEnabled: false });
        }
      });
    }
  }, []);

 

  const handleLogout = () => {
    firebase.auth().signOut().then(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    });
  };

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

  const handleViewProfile = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
        <TouchableOpacity onPress={handleViewProfile}>
          <MaterialCommunityIcons name="account" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
     
      <TouchableOpacity style={styles.settingButton} onPress={handleChangePassword}>
        <Text style={styles.settingButtonText}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingButton} onPress={handleLogout}>
        <Text style={styles.settingButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};
export default SettingsPage;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    paddingTop: 50,
  },
  header: {
    backgroundColor: "#1048FF",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 20,
  },
  settingButton: {
    backgroundColor: "#1048FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "center",
    marginVertical: 10,
  },
  settingButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});