import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
      <TouchableOpacity style={styles.settingButton} onPress={handleViewProfile}>
        <MaterialCommunityIcons name="account" size={28} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingButton} onPress={handleChangePassword}>
        <Text style={styles.settingButtonText}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingButton} onPress={handleLogout}>
        <Text style={styles.settingButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 50,
    alignItems: "center",
  },
  settingButton: {
    backgroundColor: "#1048FF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  settingButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SettingsPage;
