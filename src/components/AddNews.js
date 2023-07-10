import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Video,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import * as Location from "expo-location";
import * as LocationGeocoding from "expo-location";

const firebaseConfig = {
  apiKey: "AIzaSyA4RQu33i_jcHvtzq50w9rrTSJ_ZncGE3Q",
  authDomain: "newsapp-32049.firebaseapp.com",
  projectId: "newsapp-32049",
  storageBucket: "newsapp-32049.appspot.com",
  messagingSenderId: "109848058571",
  appId: "1:109848058571:web:2e5322e2a1d8251017594e",
  measurementId: "G-KVL2B1SPCG",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

firebase.firestore();

const AddNews = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUri, setMediaUri] = useState(null);
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState("");
  const [source, setSource] = useState("");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      reverseGeocode(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const addressData = await LocationGeocoding.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      const address = addressData[0];
      const city = address.city || address.subregion || address.region || "";
      setCity(city);
    } catch (error) {
      console.log("Error reverse geocoding:", error);
    }
  };

  const handleSubmit = async () => {
    if (!location) {
      alert("Location not available.");
      return;
    }

    if (!source) {
      alert("Source is required.");
      return;
    }

    const currentUser = firebase.auth().currentUser;
    const usersRef = firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid);
    const doc = await usersRef.get();

    if (!doc.exists) {
      alert("User not found.");
      return;
    }

    const userRole = doc.data().role;
    let initialStatus = userRole === "journalist" ? "accepted" : "pending";

    const newsRef = firebase.firestore().collection("news");
    const newNews = {
      title: title,
      description: description,
      mediaUri: mediaUri,
      location: new firebase.firestore.GeoPoint(
        location.coords.latitude,
        location.coords.longitude
      ),
      city: city,
      status: initialStatus,
      date: new Date().toLocaleString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      source: source,
    };

    newsRef
      .add(newNews)
      .then(() => {
        setTitle("");
        setDescription("");
        setMediaUri(null);
        setSource("");
        alert("News added successfully!");
      })
      .catch((error) => {
        alert("Error adding news: ", error);
      });
  };

  const handleUploadMedia = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access media library is required!");
      return;
    }

    const mediaLibraryOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    };

    const result = await ImagePicker.launchImageLibraryAsync(
      mediaLibraryOptions
    );
    if (result.canceled) {
      return;
    }
    if (result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setMediaUri(selectedAsset.uri);
    }

    // If the city is not available, set it to an empty string
    if (!city) {
      setCity("");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      onPress={() => Keyboard.dismiss()}
    >
      <ScrollView>
        <Text style={styles.label}>Title:</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          value={description}
          onChangeText={(text) => setDescription(text)}
          multiline
          numberOfLines={4}
        />
        <Text style={styles.label}>Source:</Text>
        <TextInput
          style={styles.input}
          value={source}
          onChangeText={(text) => setSource(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleUploadMedia}>
          <Text style={styles.buttonText}>Upload Media</Text>
        </TouchableOpacity>
        {mediaUri ? (
          mediaUri.endsWith(".mov") ? (
            <Video
              source={{ uri: mediaUri }}
              style={styles.media}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={{ uri: mediaUri }}
              style={styles.media}
              resizeMode="contain"
            />
          )
        ) : null}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Add News</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  media: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
});

export default AddNews;
