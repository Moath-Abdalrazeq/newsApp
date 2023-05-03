import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyA4RQu33i_jcHvtzq50w9rrTSJ_ZncGE3Q",
  authDomain: "newsapp-32049.firebaseapp.com",
  projectId: "newsapp-32049",
  storageBucket: "newsapp-32049.appspot.com",
  messagingSenderId: "109848058571",
  appId: "1:109848058571:web:2e5322e2a1d8251017594e",
  measurementId: "G-KVL2B1SPCG"
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const Map = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [news, setNews] = useState([]);

  const jenin = {
    latitude: 32.4637,
    longitude: 35.2951,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const renderPopupCard = () => {
    if (!selectedMarker) {
      return null;
    }

    const newsItem = news.find((item) => item.id === selectedMarker.id);

    return (
      <View style={styles.popupCard}>
        <Text style={styles.popupCardTitle}>{newsItem.title}</Text>
        <Text style={styles.popupCardBody}>{newsItem.body}</Text>
        {newsItem.streamUrl && (
          <View style={styles.liveStreamContainer}>
            <Text style={styles.liveStreamTitle}>Live Stream</Text>
            <Image
              source={{ uri: newsItem.streamUrl }}
              style={styles.liveStreamPlayer}
            />
          </View>
        )}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setSelectedMarker(null)}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    const unsubscribe = db.collection("news").onSnapshot((snapshot) => {
      const fetchedNews = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNews(fetchedNews);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={jenin}>
        {news.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={() => setSelectedMarker(marker)}
          />
        ))}
      </MapView>
      {renderPopupCard()}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  marker: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 2,
    borderColor: "#000",
  },
  markerText: {
    fontWeight: "bold",
  },
  popupCard: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  popupCardTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  popupCardBody: {
    fontSize: 12,
  },
  liveStreamContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
  },
  liveStreamTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  liveStreamPlayer: {
    width: "100%",
    height: 200,
  },
  closeButton: {
    backgroundColor: "#ccc",
    padding: 5,
    borderRadius: 5,
    alignSelf: "flex-end",
    marginTop: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});


export default Map;