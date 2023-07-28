import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SocialMedia = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live News Map</Text>
      <View style={styles.contactContainer}>
        <View style={styles.contactItem}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.contactInfo}>info@livenewsmap.com</Text>
        </View>
        <View style={styles.contactItem}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.contactInfo}>+970595264579</Text>
        </View>
      </View>
      <View style={styles.socialMediaContainer}>
        <View style={styles.socialMediaItem}>
          <Text style={styles.label}>Facebook:</Text>
          <Text style={styles.link}>httpss://www.facebook.com/livenewsmap</Text>
        </View>
        <View style={styles.socialMediaItem}>
          <Text style={styles.label}>Instagram:</Text>
          <Text style={styles.link}>httpss://www.instagram.com/livenewsmap</Text>
        </View>
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
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  contactContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 20,
  },
  contactItem: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  contactInfo: {
    fontSize: 16,
    color: "#555",
  },
  socialMediaContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  socialMediaItem: {
    marginBottom: 10,
  },
  link: {
    fontSize: 16,
    color: "#007BFF",
  },
});

export default SocialMedia;
