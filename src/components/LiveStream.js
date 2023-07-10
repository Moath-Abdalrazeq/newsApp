import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import { v4 as uuidv4 } from "uuid";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const SERVER_URL = "http://192.168.1.104:3000";  

 
const firebaseConfig = {
  apiKey: "AIzaSyA4RQu33i_jcHvtzq50w9rrTSJ_ZncGE3Q",
  authDomain: "newsapp-32049.firebaseapp.com",
  projectId: "newsapp-32049",
  storageBucket: "newsapp-32049.appspot.com",
  messagingSenderId: "109848058571",
  appId: "1:109848058571:web:2e5322e2a1d8251017594e",
  measurementId: "G-KVL2B1SPCG",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export default function Livestream() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isLivestreaming, setIsLivestreaming] = useState(false);
  const [location, setLocation] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      }
    })();
  }, []);

  const startLivestream = async () => {
    if (isLivestreaming) return;

    setIsLivestreaming(true);

    try {
      // Make a POST request to start the livestream
      const response = await fetch(`${SERVER_URL}/livestream/start`, {
        method: "POST",
      });
      if (response.ok) {
        console.log("Livestream started");
      } else {
        console.log("Failed to start livestream");
      }
    } catch (error) {
      console.log("Error starting livestream:", error);
    }
  };

  const stopLivestream = async () => {
    if (!isLivestreaming) return;

    setIsLivestreaming(false);

    try {
      // Make a POST request to stop the livestream
      const response = await fetch(`${SERVER_URL}/livestream/stop`, {
        method: "POST",
      });
      if (response.ok) {
        console.log("Livestream stopped");
      } else {
        console.log("Failed to stop livestream");
      }
    } catch (error) {
      console.log("Error stopping livestream:", error);
    }
  };

  const openSettings = () => {
    Linking.openSettings();
  };

  const saveLivestreamToFirestore = async (city, videoURL) => {
    try {
      const streamData = {
        city,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        videoURL,
      };

      const collectionRef = firebase.firestore().collection("streams");
      await collectionRef.add(streamData);

      console.log("Livestream saved to Firestore");
    } catch (error) {
      console.log("Error saving livestream to Firestore:", error);
    }
  };

  const uploadVideoToFirebaseStorage = async (fileUri) => {
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();

      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(`livestreams/${uuidv4()}.mp4`);

      const uploadTask = fileRef.put(blob, { contentType: "video/mp4" });

      // Wait for the upload to complete
      await new Promise((resolve, reject) => {
        uploadTask.on("state_changed", null, reject, () => {
          resolve();
        });
      });

      const downloadURL = await fileRef.getDownloadURL();

      console.log("Video uploaded to Firebase Storage");
      return downloadURL;
    } catch (error) {
      console.log("Error uploading video to Firebase Storage:", error);
      return null;
    }
  };

  const handleLivestream = async () => {
    if (isLivestreaming) {
      stopLivestream();
    } else {
      startLivestream();

      if (location) {
        const { coords } = location;
        const { latitude, longitude } = coords;

        try {
          const reverseGeocode = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });
          const city = reverseGeocode[0].city;

          const videoUri = `${SERVER_URL}/livestream/video.mp4`; // Replace with the actual video URI from the livestream server

          const videoURL = await uploadVideoToFirebaseStorage(videoUri);
          if (videoURL) {
            // Delay before saving the livestream to Firestore
            setTimeout(() => {
              saveLivestreamToFirestore(city, videoURL);
            }, 5000); // Adjust the delay time as needed (in milliseconds)
          }
        } catch (error) {
          console.log("Error retrieving city name:", error);
        }
      }
    }
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text>No access to camera and microphone</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={openSettings}>
          <Text style={styles.settingsButtonText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={cameraType}
        ratio="16:9"
        videoStabilizationMode="auto"
        whiteBalance="auto"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.flipButton}
          onPress={() =>
            setCameraType(
              cameraType === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            )
          }
        >
          <Text style={styles.buttonText}>
            {cameraType === Camera.Constants.Type.back ? "Front" : "Back"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.streamButton,
            { backgroundColor: isLivestreaming ? "red" : "white" },
          ]}
          onPress={handleLivestream}
        >
          <Text
            style={[
              styles.buttonText,
              { color: isLivestreaming ? "white" : "black" },
            ]}
          >
            {isLivestreaming ? "Stop Livestream" : "Start Livestream"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  flipButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "white",
  },
  streamButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "red",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsButton: {
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "blue",
  },
  settingsButtonText: {
    color: "blue",
    fontSize: 16,
    fontWeight: "bold",
  },
});
