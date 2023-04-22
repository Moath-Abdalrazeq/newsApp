import React from "react";
import {
 
  SafeAreaView,
 StyleSheet,
  Text,
 
 
} from "react-native";
function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Home Page </Text>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});
export default HomeScreen;