import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { firebase } from "../config";

const Dashboard = () => {
  const [name, setName] = useState('');

  // change the password
  const changePassword =()=>{
    firebase.auth().sendPasswordResetEmail(firebase.auth().currentUser.email)
    .then(() => {
        alert("Password reset email sent successfully");
      }).catch((error)=>{
        alert(error);
      })
  }

  useEffect(() => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      firebase.firestore().collection('users')
      .doc(currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setName(snapshot.data());
        } else {
          console.log("User does not exist");
        }
      })
      .catch((error) => {
        console.error("Error getting user data:", error);
      });
    }
  }, []);

  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(() => {
        console.log("User signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
        Hello, {name.firstName}
      </Text>
      <TouchableOpacity
        onPress={()=>{
          changePassword();
        }}
        style={styles.button}
      >
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleSignOut}
        style={styles.button}
      >
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 100,
  },
  button: {
    marginTop: 50,
    height: 70,
    width: 250,
    backgroundColor: "#026efd",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
});
