import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Contants = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live News Map</Text>
      <View style={styles.contactContainer}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.contactInfo}>info@livenewsmap.com</Text>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.contactInfo}>+970595264579</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  contactContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  contactInfo: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
});

export default Contants;
