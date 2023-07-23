import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SocialMedia = () => {
  return (
    <View style={styles.container}>
      <View style={styles.socialMediaItem}>
        <Text style={styles.label}>Facebook:</Text>
        <Text style={styles.link}>httpss://www.facebook.com/livenewsmap</Text>
      </View>
      <View style={styles.socialMediaItem}>
        <Text style={styles.label}>Instagram:</Text>
        <Text style={styles.link}>httpss://www.instagram.com/livenewsmap</Text>
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
  socialMediaItem: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  link: {
    fontSize: 16,
    color: "#007BFF",
  },
});

export default SocialMedia;
