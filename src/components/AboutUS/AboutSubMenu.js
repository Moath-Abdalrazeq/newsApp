import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const AboutSubMenu = ({ navigation }) => {
  const handleOptionPress = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={{ paddingTop: 20 }}>
      <TouchableOpacity
        style={{ flexDirection: "row", marginBottom: 20, paddingTop: 20 }}
        onPress={() => handleOptionPress("Company")}
      >
        <FontAwesome5
          name="building"
          size={24}
          color="black"
          style={{ marginLeft: 10 }}
        />
        <Text style={{ fontSize: 20, marginLeft: 10 }}>Company</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ flexDirection: "row", marginBottom: 20, paddingTop: 20 }}
        onPress={() => handleOptionPress("SocialMedia")}
      >
        <FontAwesome5
          name="thumbs-up"
          size={24}
          color="black"
          style={{ marginLeft: 10 }}
        />
        <Text style={{ fontSize: 20, marginLeft: 10 }}>Social Media</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ flexDirection: "row", marginBottom: 20, paddingTop: 20 }}
        onPress={() => handleOptionPress("Contants")}
      >
        <FontAwesome5
          name="address-book"
          size={24}
          color="black"
          style={{ marginLeft: 10 }}
        />
        <Text style={{ fontSize: 20, marginLeft: 10 }}>Contants</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AboutSubMenu;
