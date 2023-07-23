import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Company = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Live News Map is a leading independent global news and information site
        dedicated to factual reporting of a variety of important topics including
        conflicts, human rights issues, protests, terrorism, weapons deployment,
        health matters, natural disasters, and weather-related stories, among
        others, from a vast array of sources. We are passionate about what we do
        and are energized by the positive impact we bring, as demonstrated by
        the loyalty and recommendations of our growing viewers across the globe.
        Our innovative map-centric approach to organization of information will
        allow our viewers to quickly find the stories most relevant to them, and
        in geographies of their interest. We provide open online access to a
        complete chronological archive of our site information, enabling the
        viewers to research past events and historical trends. We aspire to be
        the authoritative reference for the news and topics we cover by bringing
        clarity and transparency of information demanded by our viewers across
        the world. As dedicated and impartial reporters, we consider ourselves
        citizens of the greater
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  text: {
    fontSize: 18,
    lineHeight: 24,
    color: "#333",
    textAlign: "center",
    fontStyle: "italic",
    marginVertical: 10,
  },
});

export default Company;
