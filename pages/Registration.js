import React, { useState } from "react";
import {View,  Text,  TouchableOpacity,  TextInput,  StyleSheet} from "react-native";
import { firebase } from "../config";
import { Picker } from "@react-native-picker/picker";

const Registration = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("client");

  const registerUser = async () => {
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      await userCredential.user.sendEmailVerification({
        handleCodeInApp: true,
        url: "https://newsapp-32049.firebaseapp.com",
      });
      await firebase.firestore().collection("users").doc(userCredential.user.uid).set({
        firstName,
        lastName,
        email,
        role,
      });
      alert("Verification Email sent");
  
      // Navigate to the appropriate screen based on the selected role
      if (role === "client") {
        navigation.replace("ClientScreen");
      } else if (role === "journalist") {
        navigation.navigate("JournalistScreen");
      }
    } catch (error) {
      alert(error.message);
    }
  };
  
  
  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "bold", fontSize: 23 }}>
        Sign Up
      </Text>
      <View style={{ marginTop: 40 }}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          onChangeText={(firstName) => setFirstName(firstName)}
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          onChangeText={(lastName) => setLastName(lastName)}
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(email) => setEmail(email)}
          autoCorrect={false}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(password) => setPassword(password)}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
        />
        <Picker
          selectedValue={role}
          style={{ height: 50, width: 400 , marginTop: -40 , marginBottom:20 }}
          onValueChange={(itemValue) =>
            setRole(itemValue)
          }>
          <Picker.Item label="Client" value="client" />
          <Picker.Item label="Journalist" value="journalist" />
           
        </Picker>
      </View>
      <TouchableOpacity
        onPress={registerUser}
        style={styles.button}
      >
        <Text style={{ fontWeight: "bold", fontSize: 22, color:'white' }}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Registration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 100,
  },
  input: {
    paddingTop: 20,
    paddingBottom: 10,
    width: 400,
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    marginTop:120,
    height: 70,
    width: 250,
    backgroundColor: "#026efd",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  }
});
