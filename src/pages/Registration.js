import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const Registration = ({ navigation }) => {
  const handleClientRegistration = () => {
    navigation.navigate("ClientRegistration");
  };

  const handleJournalistRegistration = () => {
    navigation.navigate("JournalistRegistration");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registration</Text>
      <TouchableOpacity
        onPress={handleClientRegistration}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Register as a Client</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleJournalistRegistration}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Register as a Journalist</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Registration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#363636",
  },
  button: {
    backgroundColor: "#026EFD",
    width: 300,
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#026EFD",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});