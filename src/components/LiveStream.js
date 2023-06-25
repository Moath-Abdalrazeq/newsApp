import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as LocationGeocoding from 'expo-location';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA4RQu33i_jcHvtzq50w9rrTSJ_ZncGE3Q",
  authDomain: "newsapp-32049.firebaseapp.com",
  projectId: "newsapp-32049",
  storageBucket: "newsapp-32049.appspot.com",
  messagingSenderId: "109848058571",
  appId: "1:109848058571:web:2e5322e2a1d8251017594e",
  measurementId: "G-KVL2B1SPCG"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storage = firebase.storage().ref();

export default function Livestream() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isLivestreaming, setIsLivestreaming] = useState(false);
  const cameraRef = useRef(null);
  const streamUrlRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const startLivestream = async () => {
    if (isLivestreaming) return;

    setIsLivestreaming(true);

    const streamRef = await db.collection('streams').add({
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    const streamId = streamRef.id;
    streamUrlRef.current = streamId;

    // Generate a valid livestream URL using the stream ID
    const streamUrl = `https://newsapp.com./live/${streamId}`;

    await streamRef.update({
      streamUrl,
    });

    // Get user's location
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Location permission denied');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const city = await reverseGeocode(location.coords.latitude, location.coords.longitude);

    // Update the stream document with the city name
    await streamRef.update({
      city,
    });

    const stream = await cameraRef.current.recordAsync({
      quality: Camera.Constants.VideoQuality['480p'],
      maxDuration: 3600,
    });

    const videoRef = storage.child(`${streamRef.id}.mov`);
    const snapshot = await videoRef.put(stream.uri, {
      contentType: 'video/quicktime',
    });

    const videoUrl = await snapshot.ref.getDownloadURL();
    await streamRef.update({
      videoUrl,
    });

    setIsLivestreaming(false);
  };

  const stopLivestream = async () => {
    if (!isLivestreaming) return;

    setIsLivestreaming(false);

    await cameraRef.current.stopRecording();

    const streamId = streamUrlRef.current;
    const streamRef = db.collection('streams').doc(streamId);

    try {
      const streamDoc = await streamRef.get();
      if (!streamDoc.exists) {
        // Document does not exist, do nothing
        return;
      }

      await streamRef.update({
        // Update the document
      });
    } catch (error) {
      console.log('Error updating stream document:', error);
    }
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const addressData = await LocationGeocoding.reverseGeocodeAsync({ latitude, longitude });
      const address = addressData[0];
      const city = address.city || address.subregion || address.region || '';
      return city;
    } catch (error) {
      console.log('Error reverse geocoding:', error);
      return '';
    }
  };

  const openSettings = () => {
    Linking.openSettings();
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text>No access to camera and mic </Text>
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
            {cameraType === Camera.Constants.Type.back ? 'Front' : 'Back'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.streamButton,
            { backgroundColor: isLivestreaming ? 'red' : 'white' },
          ]}
          onPress={isLivestreaming ? stopLivestream : startLivestream}
        >
          <Text style={[styles.buttonText, { color: isLivestreaming ? 'white' : 'black' }]}>
            {isLivestreaming ? 'Stop Livestream' : 'Start Livestream'}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  flipButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white',
  },
  streamButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'red',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButton: {
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: 'blue',
  },
  settingsButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
