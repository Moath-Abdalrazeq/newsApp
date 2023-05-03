import React, { useState,useEffect  } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Video,
  StyleSheet,
  Keyboard 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import * as Location from 'expo-location';

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

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);


  const handleSubmit = async () => {
    if (!location) {
      alert("Location not available.");
      return;
    }

    const newsRef = firebase.firestore().collection("news");
    const newNews = {
      title: title,
      description: description,
      mediaUri: mediaUri,
      location: new firebase.firestore.GeoPoint(location.coords.latitude, location.coords.longitude)
    };
    newsRef
      .add(newNews)
      .then(() => {
        setTitle("");
        setDescription("");
        setMediaUri(null);
        alert("News added successfully!");
      })
      .catch((error) => {
        alert("Error adding news: ", error);
      });
  };
  

  
  const handleUploadMedia = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access media library is required!");
      return;
    }
    const mediaLibraryOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      videoExportPreset: ImagePicker.VideoExportPreset.MediumQuality,
       
      allowsEditing: true,
      quality: 1,
    };
    
    const result = await ImagePicker.launchImageLibraryAsync(mediaLibraryOptions);
    if (result.canceled) {
      return;
    }
    if (result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setMediaUri(selectedAsset.uri);
    }
  };
  
 
  return (
    <View style={styles.container} onPress={() => Keyboard.dismiss()}>
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
      <TouchableOpacity style={styles.button} onPress={handleUploadMedia}>
        <Text style={styles.buttonText}>Upload Media</Text>
      </TouchableOpacity>
      {mediaUri ? (
  mediaUri.endsWith(".mov") ? (
    <Video source={{ uri: mediaUri }} style={styles.media} resizeMode="contain" />
  ) : (
    <Image source={{ uri: mediaUri }} style={styles.media} resizeMode="contain" />
  )
) : null}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add News</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#007aff",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom:20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  media: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
  
});

export default AddNews;
