import React, { useState } from "react";
import { StyleSheet, View, Modal, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import JeninNews from "../components/CitiesNews/JeninNews";
import JeninLives from "../components/LiveStreams/JeninLives";
import NablusNews from "../components/CitiesNews/NablusNews";
import TubasNews from "../components/CitiesNews/TubasNews";
import TulkaremNews from "../components/CitiesNews/TulkaremNews";
const Stack = createStackNavigator();

const Map = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const navigation = useNavigation();
  const palestine = {
    latitude: 31.9522,
    longitude: 35.2332,
    latitudeDelta: 1,
    longitudeDelta: 1,
  };

  const cities = [
    {
      latitude: 32.4637,
      longitude: 35.2951,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      markerTitle: "Jenin",
      id: "jenin-marker",
      newsUrl: "JeninNews",
      livesUrl: "JeninLives",
    },
    {
      latitude: 32.2226,
      longitude: 35.2594,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      markerTitle: "Nablus",
      id: "nablus-marker",
      newsUrl: "NablusNews",
    },
    {
      latitude: 32.3104,
      longitude: 35.3688,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
      markerTitle: "Tubas",
      id: "tubas-marker",
      newsUrl: "TubasNews",
      livesUrl: "TubasLives",
    },
    {
      latitude: 32.3158,
      longitude: 35.0286,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      markerTitle: "Tulkarem",
      id: "tulkarem-marker",
      newsUrl: "TulkaremNews",
      livesUrl: "TulkaremLives",
    },
    {
      latitude: 31.9012,
      longitude: 35.2063,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      markerTitle: "Ramallah",
      id: "ramallah-marker",
      newsUrl: "RamallahNews",   
      livesUrl: "RamallahLives",  
    },
    {
      latitude: 32.1913,
      longitude: 34.9839,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      markerTitle: "Qalqilya",
      id: "qalqilya-marker",
      newsUrl: "QalqilyaNews",  
      livesUrl: "QalqilyaLives",  
    },
    {
      latitude: 31.7043,
      longitude: 35.2024,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      markerTitle: "Bethlehem",
      id: "bethlehem-marker",
      newsUrl: "BethlehemNews",  
      livesUrl: "BethlehemLives",  
    },
    {
      latitude: 31.8562,
      longitude: 35.4533,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      markerTitle: "Jericho",
      id: "jericho-marker",
      newsUrl: "JerichoNews",  
      livesUrl: "JerichoLives",  
    },
    {
      latitude: 31.7798,
      longitude: 35.2137,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      markerTitle: "Jerusalem",
      id: "jerusalem-marker",
      newsUrl: "JerusalemNews",  
      livesUrl: "JerusalemLives",  
    },
   
  ];

  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker);
  };

  const handleCloseModal = () => {
    setSelectedMarker(null);
  };

  const handleNewsButtonPress = () => {
    if (selectedMarker) {
      navigation.navigate(selectedMarker.newsUrl);
      setSelectedMarker(null);
    }
  };
  const handleLiveStreamsButtonPress = () => {
    if (selectedMarker) {
      navigation.navigate(selectedMarker.livesUrl);
      setSelectedMarker(null);
    }
  };

  return (
    
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={palestine}>
        {cities.map((city) => (
          <Marker
            key={city.id}
            coordinate={{
              latitude: city.latitude,
              longitude: city.longitude,
            }}
            identifier={city.id}
            onPress={() => handleMarkerPress(city)}
          />
        ))}
      </MapView>
      <Modal
        visible={!!selectedMarker}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{selectedMarker?.markerTitle}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleNewsButtonPress}
              >
                <Text style={styles.modalButtonText}>News</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLiveStreamsButtonPress}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Livestream's</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
 
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    flex: 1,
    width: "100%",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowOpacity: 0.25,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 100,
    marginLeft: 30,
    marginRight: 30,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalCloseButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  modalCloseButtonText: {
    color: "#2196F3",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
});

export default Map;
